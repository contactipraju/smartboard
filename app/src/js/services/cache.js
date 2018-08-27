app.service("CacheService", function (CacheFactory) {
	var caches = {
		default: CacheFactory("default", {
			maxAge: 15 * 60 * 1000, //15 min
			cacheFlushInterval: 15 * 60 * 1000,
			deleteOnExpire: "aggressive"
		}),
		config: CacheFactory("config", {
			maxAge: 15 * 60 * 1000, //15 min
			cacheFlushInterval: 15 * 60 * 1000,
			deleteOnExpire: "aggressive"
		}),
		dashboard: CacheFactory("dashboard", {
			maxAge: 15 * 60 * 1000, //15 min
			cacheFlushInterval: 15 * 60 * 1000,
			deleteOnExpire: "aggressive"
		})
	};

	var CacheService = {
		get: function (name) {
			if (caches[name]) {
				return caches[name]
			}
			else {
				return caches.default;
			}
		}
	}

	return CacheService;
});