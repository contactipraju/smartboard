app.service("ConfigService", function ($http, $q, $rootScope, DefaultsService, CacheService, EVENTS) {
	// TODO needs to be a least frequently used cache
	var cache = {};
	var NULL = "null";

	var configCache = CacheService.get("config");

	var server = "http://localhost"; // TODO:
	var baseUrl = server + "/rest/users/config/";

	function load (key, postLoad, userId) {
		var promise = $q.all(null);
		promise = promise.then(loadAsPromise(key, postLoad, userId));
	}

	function loadAsPromise (key, postLoad=null, userId) {
		var loadKey = key;
		var cacheKey = key;

		if (!_.isNil(userId)) {
			// if userId is defined, stick this on the cache key
			cacheKey += "-" + userId;
		}

		var val = angular.copy(cache[cacheKey]);

		if (!_.isNil(val)) {
			val = val === NULL ? null: val;

			if (postLoad) postLoad(val);
			return $q.when(val);
		}
		else {
			let url = baseUrl + "get/" + loadKey;

			if (!_.isNil(userId)) {
				url += "/" + userId;
			}

			return $http({url:url, cache:configCache})
				.then(tp.extract_response_data)
					.then(data => {
						if (data && data.value) {
							try {
								cache[cacheKey] = angular.fromJson(data.value);
							} catch (e) {
								// cache[cacheKey] = data.value;
								console.log('ERROR DESERIALIZING', key, e, data);
							}
						}
						if (_.isNil(cache[cacheKey])) {
							cache[cacheKey] = DefaultsService.get(key);
						}

						let val = angular.copy(cache[cacheKey]);
						val = val === NULL ? null: val;

						if (postLoad) postLoad(val);

						return val;
					})
		}
	}

	function save (key, group, value, userId) {
		var saveKey = key;

		var data = {
			key: saveKey, 
			grp: group,
			value: value != null && value != undefined ? angular.toJson(value) : ""
		}

		if (!_.isNil(userId)) {
			data.user = {id:userId};
		}

		return $http({method:"post", data:data, url:baseUrl + "set"});
	}

	function del (key) {
		var deleteKey = key;

		configCache.remove(baseUrl + "get/" + key); // remove just the key that has been deleted

		delete cache[key];
		return $http({method:"post", data:{key:deleteKey}, url:baseUrl + "rem"});
	}

	function delBulk (keys) {
		for (var i=0; i<keys.length; i++) {
			configCache.remove(baseUrl + "get/" + keys[i]); // remove just the key that has been deleted
			delete cache[keys[i]];
		}

		return $http({method:"post", data:keys, url:baseUrl + "rem/bulk"});
	}

	function invalidate () {
		cache = {};
		configCache.removeAll();
	}

	$rootScope.$on(EVENTS.APP_REFRESH, function () {
		invalidate();
	});
	
	var ConfigService = {
		invalidate: function () {
			invalidate();
		},

		get: function (key, postLoad, userId) {
			load(key, postLoad, userId);
		},

		getInt: function (key, migrate) {
			var deferred = $q.defer();

			if (_.isNil(cache[key])) {
				$http({url:baseUrl + "getint/" + key, cache:configCache})
					.then(function (response) {
						if (migrate && response.status === 204) {
							// migrate values from json into int field
							ConfigService.getAsPromise(key)
								.then(function (value) {
									if (typeof value == "boolean") {
										value = value | 0; // convert bool into int
									} else if (typeof value != "number") {
										deferred.reject("can't migrate " + key + " value into an int");
										return;
									}

									// save value to int
									ConfigService.setInt(key, value);

									deferred.resolve(value);
								})
						} else {
							if (response && _.isNumber(response.data)) {
								cache[key] = response.data
							} else {
								cache[key] = DefaultsService.get(key);
							}

							deferred.resolve(cache[key]);
						}
					}, function (error) {
						deferred.reject(error);
					})
			} else {
				// we already have a cached value
				deferred.resolve(cache[key]);
			}

			return deferred.promise;
		},

		getAsPromise: function (key, postLoad, userId) {
			return loadAsPromise(key, postLoad, userId);
		},

		getList: function (keys, postLoad) {
			var queue = [];
			var vals = {};

			for (var i=0; i<keys.length; i++) {
				(function(key) {
					queue.push(loadAsPromise(key, function (val) {
						vals[key] = val;
					}));
				})(keys[i]);
			}

			$q.all(queue).then(function () {
				if (postLoad) postLoad(vals);
			});
		},

		set: function (key, value, group, nocache, userId) {
			var valueCopy = angular.copy(value);

			// remove functions from value so we don't cache/store that
			stripOutFunctions(valueCopy);

			let cacheKey = key;
			if (!_.isNil(userId)) {
				// if userId is defined, stick this on the cache key
				cacheKey += "-" + userId;
			}

			if (angular.equals(cache[cacheKey], valueCopy)) {
				//console.warn("Cached value hasn't changed, skip saving for key: " + cacheKey, cache[cacheKey], valueCopy);
				return;
			} else {
				// uncomment below to see what we're saving out
				// console.error("saving", cache[cacheKey], valueCopy)
			}

			if (nocache) {
				// don't cache this entry
			} else {
				cache[cacheKey] = angular.copy(valueCopy);
			}

			return save(key, group, valueCopy, userId);
		},

		setInt: function (key, value = 0, nocache = false) {
			var deferred = $q.defer();

			if (!Number.isInteger(value)) {
				console.error("ConfigService.setInt() expects an int");
				deferred.reject("ConfigService.setInt() expects an int");
			}

			if (angular.equals(cache[key], value)) {
				//console.warn("Cached value hasn't changed, skip saving for key: " + key, cache[key], valueCopy);
				deferred.reject("Cached value hasn't changed, skip saving for key");
			}

			if (!nocache) {
				cache[key] = value;
			}

			var saveKey = key;

			$http({url:baseUrl + "setint/" + saveKey + "/" + value})
				.then(function (response) {
					deferred.resolve(response.data);
				}, function (error) {
					deferred.reject(error);
				});

			return deferred.promise;
		},

		delete: function (key) {
			return del(key);
		},

		deleteBulk: function (keys) {
			return delBulk(keys);
		},

		reset: function (key) {
			cache[key] = DefaultsService.get(key);

			save(key, cache[key]);
		}
	};

	function stripOutFunctions (obj) {
		// remove functions from value so we don't trigger unneccesary config save to db
		_.forOwn(obj, function (val, key) {
			if (typeof val == "function") {
				delete obj[key];
			} else if (typeof val == "object") {
				// recurse through sub-objects
				stripOutFunctions(val);
			} else if (key.substr(0, 1) == "$") {
				// strip out "$" prefixed vars
				delete obj[key];
			}
		})
	}

	return ConfigService;
});
