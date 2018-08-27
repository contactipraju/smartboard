/**
* A service to abstract/contain default configurations per featureset
*/
app.service("DefaultsService", function (LANGUAGE, STRINGS) {

	var cfg = {}, overrides = {}, overriden;

	cfg[STRINGS.DASHBOARD_WIDGET_TYPES] = [
		{
			id: STRINGS.WIDGET_TYPE_SELECT_WIDGET, enabled: false, premium: false, icon: "table", help: "new-dash-recent", category: "general",
			name: LANGUAGE.string['app.dashboard.widgets.selectwidget.title'], desc: LANGUAGE.string['app.dashboard.widgets.selectwidget.desc']
		},
		{
			id: STRINGS.WIDGET_TYPE_TOP_STORIES, enabled: true, premium: false, icon: "table", help: "new-dash-recent", category: "general",
			name: LANGUAGE.string['app.dashboard.widgets.topstories.title'], desc: LANGUAGE.string['app.dashboard.widgets.topstories.desc']
		},
		{
			id: STRINGS.WIDGET_TYPE_DAILY_REPORTS, enabled: true, premium: false, icon: "graph-line", help: "peak-heart-rate-curve", category: "general",
			name: LANGUAGE.string['app.dashboard.widgets.dailyreports.title'], desc: LANGUAGE.string['app.dashboard.widgets.dailyreports.title.desc']
		},
		{
			id: STRINGS.WIDGET_TYPE_NEWS, enabled: true, premium: true, icon: "graph-line", help: "peak-pace-curve", category: "general",
			name: LANGUAGE.string['app.dashboard.widgets.news.title'], desc: LANGUAGE.string['app.dashboard.widgets.news.title.desc'],
		},
		{
			id: STRINGS.WIDGET_TYPE_VIDEOS, enabled: true, premium: false, icon: "graph-line", help: "peak-heart-rate-curve", category: "general",
			name: LANGUAGE.string['app.dashboard.widgets.videos.title'], desc: LANGUAGE.string['app.dashboard.widgets.videos.title.desc']
		},
		{
			id: STRINGS.WIDGET_TYPE_TUTORIALS, enabled: true, premium: false, icon: "graph-line", help: "peak-heart-rate-curve", category: "general",
			name: LANGUAGE.string['app.dashboard.widgets.tutorials.title'], desc: LANGUAGE.string['app.dashboard.widgets.tutorials.title.desc']
		},
		{
			id: STRINGS.WIDGET_TYPE_SHORTCUTS, enabled: true, premium: false, icon: "graph-line", help: "peak-heart-rate-curve", category: "general",
			name: LANGUAGE.string['app.dashboard.widgets.shortcuts.title'], desc: LANGUAGE.string['app.dashboard.widgets.shortcuts.title.desc']
		},
		{
			id: STRINGS.WIDGET_TYPE_TICKER, enabled: true, premium: true, icon: "graph-line", help: "peak-heart-rate-curve", category: "misc",
			name: LANGUAGE.string['app.dashboard.widgets.ticker.title'], desc: LANGUAGE.string['app.dashboard.widgets.ticker.title.desc']
		},
		{
			id: STRINGS.WIDGET_TYPE_CHATBOT, enabled: true, premium: true, icon: "graph-line", help: "peak-heart-rate-curve", category: "misc",
			name: LANGUAGE.string['app.dashboard.widgets.chatbot.title'], desc: LANGUAGE.string['app.dashboard.widgets.chatbot.title.desc']
		},
		{
			id: STRINGS.WIDGET_TYPE_EC_COMPONENTS, enabled: true, premium: true, icon: "graph-line", help: "peak-heart-rate-curve", category: "misc",
			name: LANGUAGE.string['app.dashboard.widgets.eccomponents.title'], desc: LANGUAGE.string['app.dashboard.widgets.eccomponents.title.desc']
		},
		{
			id: STRINGS.WIDGET_TYPE_BAROMETER, enabled: true, premium: true, icon: "graph-line", help: "new-dash-mmp", category: "misc",
			name: LANGUAGE.string['app.dashboard.widgets.barometer.title'], desc: LANGUAGE.string['app.dashboard.widgets.barometer.desc']
		},
		{
			id: STRINGS.WIDGET_TYPE_ASX300_NEWS, enabled: true, premium: true, icon: "graph-line", help: "peak-heart-rate-curve", category: "misc",
			name: LANGUAGE.string['app.dashboard.widgets.asx300news.title'], desc: LANGUAGE.string['app.dashboard.widgets.asx300news.title.desc']
		},
		{
			id: STRINGS.WIDGET_TYPE_ASX300_GAINERS_AND_LOSERS, enabled: true, premium: true, icon: "graph-line", help: "peak-heart-rate-curve", category: "misc",
			name: LANGUAGE.string['app.dashboard.widgets.asx300gainersandlosers.title'], desc: LANGUAGE.string['app.dashboard.widgets.asx300gainersandlosers.title.desc']
		},
		{
			id: STRINGS.WIDGET_TYPE_HELP, enabled: true, premium: false, icon: "graph-line", help: "peak-heart-rate-curve", category: "none",
			name: LANGUAGE.string['app.dashboard.widgets.help.title'], desc: LANGUAGE.string['app.dashboard.widgets.help.title.desc']
		}
	];

	cfg[STRINGS.DASHBOARD_DEFAULT_WIDGETS] = [
		{ "x": 7, "y": 4, "width": 5, "height": 4, "minWidth": 1, "minHeight": 1, widgetTypeId: STRINGS.WIDGET_TYPE_SHORTCUTS },
		{ "x": 4, "y": 3, "width": 3, "height": 3, "minWidth": 1, "minHeight": 1, widgetTypeId: STRINGS.WIDGET_TYPE_DAILY_REPORTS },
		{ "x": 7, "y": 0, "width": 5, "height": 4, "minWidth": 1, "minHeight": 1, widgetTypeId: STRINGS.WIDGET_TYPE_TUTORIALS },
		{ "x": 0, "y": 0, "width": 4, "height": 4, "minWidth": 1, "minHeight": 1, widgetTypeId: STRINGS.WIDGET_TYPE_TOP_STORIES },
		{ "x": 4, "y": 0, "width": 3, "height": 3, "minWidth": 1, "minHeight": 1, widgetTypeId: STRINGS.WIDGET_TYPE_BAROMETER },
		{ "x": 0, "y": 4, "width": 4, "height": 2, "minWidth": 1, "minHeight": 1, widgetTypeId: STRINGS.WIDGET_TYPE_VIDEOS }
	];

		// { "x": 7, "y": 0, "width": 2, "height": 6, "minWidth": 1, "minHeight": 1, widgetTypeId: STRINGS.WIDGET_TYPE_NEWS },

	// Default panel added to a new dashboard and when we add a new panel
	cfg[STRINGS.DASHBOARD_DEFAULT_WIDGET] = { x:0, y:0, width:12, height:5, minWidth: 1, minHeight: 1, widgetTypeId: STRINGS.WIDGET_TYPE_SELECT_WIDGET };

	cfg[STRINGS.CONFIG_KEY_USE_NEW_DASH] = true;

	var DefaultsService = {
		/** Get default configuration for a given component */
		get: function (component, copy) {
			var defaultConfig = cfg[component];

			if (!_.isNil(defaultConfig)) {
				return copy ? angular.copy(defaultConfig) : defaultConfig;
			}
		},

		/** Override default configuration for a given component */
		set: function (component, val, force = false) {
			// if already overriden using the applyOverrides function then skip (unless explicity forced)
			if (!force && overrides && overrides.defaults && overrides.defaults[component]) return;

			cfg[component] = val;
		},

		/** Merge overrides onto an existing configuration key */
		merge: function (component, val) {
			angular.merge(cfg[component], val);
		}
	};

	return DefaultsService;
});