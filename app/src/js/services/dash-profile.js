app.service("DashProfileService", function ($rootScope, $http, $q, ConfigService, DefaultsService, EVENTS, STRINGS) {

	var configKey = STRINGS.CONFIG_KEY_DASHBOARD_PROFILES;

	// this is a shallow collection of profiles - ie just id and names
	var profiles = null;

	// this is the shallow selected profile
	var selected = null;

	// this is a map by id to a fill dashboard-profile object
	var profileMap = { };

	function save() {
		var data = {
			s: profiles.indexOf(selected),
			p: profiles
		}

		//console.log('dashprofile save', data);
		ConfigService.set(STRINGS.CONFIG_KEY_DASHBOARD_PROFILES, data);
	}

	var DashProfileService = {
		init: function() {
			var q = $q.defer();
			ConfigService.get(STRINGS.CONFIG_KEY_DASHBOARD_PROFILES, function(data) {
				profiles = [];
				profileMap = {};

				if (data && data.p && data.p.length) {
					for (var i=0; i<data.p.length; i++) {
						var p = new DashboardProfile();
						p.initAsShallow(data.p[i].id, data.p[i].name);
						profiles.push({ id: data.p[i].id, name: data.p[i].name });
						profileMap[p.getId()] = p;
					}

					if (data.s != null && data.s != undefined && data.s >= 0 && data.s < profiles.length) {
						selected = profiles[data.s];
					} else {
						selected = profiles[0];
					}

					q.resolve();
				}
				else {
					console.log('creating default dash-profile');

					q.resolve();
				}
			});

			return q.promise;
		},

		/** Add a new profile - returning this as the selected profile */
		add: function(src, sports = []) {
			var p = new DashboardProfile();

			if (src != undefined) {
				p.initAsDefault({profile:src});
			}
			else {
				p.initAsNew();
			}

			profiles.push({ id: p.getId(), name: p.getName() });
			profileMap[p.getId()] = p;
			selected = profiles[profiles.length-1];

			if (sports.length) {
				let sportIds = [];
				for (var i=0; i<sports.length; i++) {
					sportIds.push(MultiSportService.getSportOrdinal(sports[i]));
				}
				p.setSportIds(sportIds);
			}

			console.log("added", p, sports);
			save();
			return selected;
		},

		/** Delete a profile - return the new selected profile */
		/** use force to remove the last profile even if selected */
		rem: function(id, force) {
			if (!force && profiles.length <= 1) {
				return selected;
			}

			for(var i=0; i<profiles.length; i++) {
				if (profiles[i].id === id) {
					profiles.splice(i,1);

					if (selected.id == id) {
						selected = profiles[i>0?i-1:0];
					}

					var p = profileMap[id];
					if (p) {
						p.delete();
						delete profileMap[id];
					}
					save();
					break;
				}
			}
			return selected;
		},

		/** Duplicate a profile - return the new selected profile */
		dup: function(id) {
			var q = $q.defer();

			var existing = profileMap[id];
			if (existing) {
				var p = new DashboardProfile();
				p.initAsClone(existing).then(function () {
					profiles.push({ id: p.getId(), name: p.getName() });
					profileMap[p.getId()] = p;
					selected = profiles[profiles.length-1];
					save();

					console.log("Profile duplicated: " + selected);
					q.resolve(selected);
				});
			}
			return q.promise;
		},

		/** Reset to default dashboard profiles */
		reset: function() {
			var q = $q.defer();
			var profilesCopy = angular.copy(profiles);
			var profilesMapCopy = angular.copy(profileMap);

			ConfigService.delete(STRINGS.CONFIG_KEY_DASHBOARD_PROFILES)
				.then(function () {
					DashProfileService.init()
						.then(function () {
							q.resolve();

							setTimeout(function () {
								// clean up old config data
								for (var i=0; i<profilesCopy.length; i++) {
									profilesMapCopy[profilesCopy[i].id].getCfg()
										.then(function (profile) {
											var keys = [];

											for (var j=0; j<profile.panels.length; j++) {
												for (var k=0; k<profile.panels[j].slides.length; k++) {
													//console.log("nuke slide", profile.panels[j].slides[k].id);
													keys.push(profile.panels[j].slides[k].id);
												}
											}

											//console.log("nuke profile", profile.id);
											keys.push(profile.id);

											ConfigService.deleteBulk(keys);
										})
								}
							}, 2000); // delayed for two seconds to allow the reset dashboard to load and init before we cleanup
						})
				});

			return q.promise;
		},

		rename: function(id, name) {
			if (!name) {
				return;
			}

			if (selected.id == id) {
				selected.name = name;
			}
			
			for(var i=0;i<profiles.length;i++) {
				if (profiles[i].id == id) {
					profiles[i].name = name;
					break;
				}
			}
			
			profileMap[id].setName(name);
			save();
		},

		saveFullProfile: function() {
			profileMap[selected.id].saveCfg();
		},

		select: function(id) {
			if (selected.id == id) {
				return selected;
			}

			for(var i=0; i<profiles.length; i++) {
				if (profiles[i].id == id) {
					selected = profiles[i];
					save();
					break;
				}
			}

			return selected;
		},

		getDefaultProfiles: function () {
			var deferred = $q.defer();
			var id = AuthService.user().user.company && AuthService.user().user.company.id ? AuthService.user().user.company.id : 1;
			var isCoachingComany = id !== 1 && id !== 4; // not Today's Plan and not Stages
			var profiles = [];
			let queue = [];

			// for local env use the files in the App/src/profiles directory
			queue.push(CompanyService.getDashProfiles(id)
				.then(function (data) {
					if (data) {
						profiles[0] = data;
					} else if (!isCoachingComany) {
						profiles[0] = DefaultsService.get(STRINGS.COMPONENT_DASHBOARD_DEFAULT_PROFILES);
					}
				}, function (error) {
					if (!isCoachingComany) {
						profiles[0] = DefaultsService.get(STRINGS.COMPONENT_DASHBOARD_DEFAULT_PROFILES);
					}
				}));

			if (isCoachingComany) {
				queue.push(CompanyService.getDashProfiles(1) //get today's plan profiles
					.then(function (data) {
						if (data) {
							profiles[1] = data;
						} else {
							// shouldn't happen
							profiles[1] = DefaultsService.get(STRINGS.COMPONENT_DASHBOARD_DEFAULT_PROFILES);
						}
					}, function (error) {
						// shouldn't happen
						profiles[1] = DefaultsService.get(STRINGS.COMPONENT_DASHBOARD_DEFAULT_PROFILES);
					}));
			}

			$q.all(queue)
				.then(function () {
					console.log("profiles", profiles);

					let merged;

					if (isCoachingComany && profiles.length === 2 && !angular.equals(profiles[0], profiles[1])) {
						for (var i=0; i<profiles.length; i++) {
							let companyId = i === 0 ? id : 1;

							_.each(profiles[i].bundles, function (bundle) {
								bundle.companyId = companyId;
							});

							_.each(profiles[i].profiles, function (profile) {
								profile.companyId = companyId;
							});
						}
						merged = angular.merge(profiles[1], profiles[0]);
						console.log("merged", merged);
					} else {
						merged = profiles[0];
					}

					deferred.resolve(merged);
				})

			return deferred.promise;
		},

		/** Get a shallow collection of profiles. ie id and name only */
		getShallowProfiles: function () {
			return profiles;
		},

		getLastSelected: function () {
			return selected;
		},

		/** Load the full profile configuration */
		getFullProfilePromise: function(id) {
			var profile = profileMap[id];

			if (profile) {
				return profile.getCfg();
			}
		},

		onPanelChange: function(panels) {
			var profile = profileMap[selected.id];

			if (profile) {
				profile.setPanelLayout(panels);
			}

			save();
		},

		onUserIdsChange: function(userIds) {
			var profile = profileMap[selected.id];

			if (profile) {
				profile.setUserIds(userIds)
			}

			save();
			$rootScope.$broadcast(EVENTS.NEWDASH_PROFILE_UPDATED, { field: 'userIds', value: userIds });
		},

		/** An array of ActivityType ordinals */
		onSportChange: function(sportIds) {
			var profile = profileMap[selected.id];

			if (profile)
				profile.setSportIds(sportIds)

			save();
			$rootScope.$broadcast(EVENTS.NEWDASH_PROFILE_UPDATED, { field: 'sportIds', value: sportIds });
		},

		onPeriodChange: function(period) {
			var profile = profileMap[selected.id];

			if (profile) {
				profile.setPeriod(period.value);
			}

			save();
			$rootScope.$broadcast(EVENTS.NEWDASH_PROFILE_UPDATED, { field: 'period', value: period.value });
		},

		// params is the result of the PeriodSelect modal
		onPeriodSelect: function(params) {
			if (params && params.periods && params.periods.length) {
				var profile = profileMap[selected.id];

				if (profile) {
					profile.onPeriodSelect(params);
				}
				
				save();
				$rootScope.$broadcast(EVENTS.NEWDASH_PROFILE_UPDATED, { field: 'ranges', value: params.periods });
			}
		},

		/** Given a slide / widget config and a profile, return the best userIds set - taking into account overrides */
		getUserIds: function(config, profile) {
			var userIds = config.overrides && config.overrides.userIds && config.overrides.userIds.length ? config.overrides.userIds : profile.userIds;

			if (!userIds || userIds.length === 0) {
				userIds = [ AuthService.user().user.id ];
			}

			return userIds;
		},

		/** Given a slide / widget config and a profile, return the best single date range for a period/custom period */
		getAsRange: function(config, profile, allowMultipleRanges) {

			var period = config.overrides && config.overrides.period ? config.overrides.period : config.period ? config.period : profile.period ? profile.period : 'last6m';
			var ranges = config.overrides && config.overrides.ranges ? config.overrides.ranges : config.ranges ? config.ranges : profile.ranges ? profile.ranges : null;

			if (ranges)
				ranges = angular.copy(ranges);

			if (!period || (period === 'custom' && (!ranges || !ranges.length))) {
				period = 'last6m';
				ranges = null;
			}

			if (ranges) {
				for(var i=0;i<ranges.length;i++) {
					if (ranges[i].id && (ranges[i].id.indexOf('stage_') == 0 || ranges[i].id.indexOf('activity_') == 0)) {
						ranges[i].uid = ranges[i].id;
						// ranges[i].teamActivityId = ranges[i].id.indexOf('stage_') == 0 ? Number(ranges[i].id.substring('stage_'.length)) : Number(ranges[i].id.substring('activity_'.length));
					}
					delete ranges[i].id;
				}
			}

			if (period == 'custom' && ranges) {
				return allowMultipleRanges ? ranges : [ PeriodsService.getAsRange(ranges) ];
			}
			else {
				return [ PeriodsService.getAsRange(period) ];
			}
		}
	};

	return DashProfileService;
});