/** A place to start storing config groups and keys */
app.constant("STRINGS", (function () {

	var STRINGS = {
		WIDGET_TYPE_SELECT_WIDGET:             0,
		WIDGET_TYPE_TOP_STORIES:               1,
		WIDGET_TYPE_BAROMETER:                 2,
		WIDGET_TYPE_DAILY_REPORTS:             3,
		WIDGET_TYPE_NEWS:                      4,
		WIDGET_TYPE_VIDEOS:                    5,
		WIDGET_TYPE_TUTORIALS:                 6,
		WIDGET_TYPE_SHORTCUTS:                 7,
		WIDGET_TYPE_TICKER:                    8,
		WIDGET_TYPE_CHATBOT:                   9,
		WIDGET_TYPE_EC_COMPONENTS:             10,
		WIDGET_TYPE_ASX300_NEWS:               11,
		WIDGET_TYPE_ASX300_GAINERS_AND_LOSERS: 12,
		WIDGET_TYPE_STOCK_STORIES:             13,
		WIDGET_TYPE_FUND_STORIES:              14,
		WIDGET_TYPE_ETF_STORIES:               15,
		WIDGET_TYPE_SMSF_STORIES:              16,
		WIDGET_TYPE_HELP:                      17,

		DASHBOARD_WIDGET_TYPES:                'dashboard-widget-types',
		DASHBOARD_DEFAULT_WIDGET:              'dashboard-default-widget',
		DASHBOARD_DEFAULT_WIDGETS:             'dashboard-default-widgets',

		CONFIG_KEY_USE_NEW_DASH:               'use-new-dash',
		CONFIG_KEY_DASHBOARD_PROFILES:         'dashboard-profiles', 
		CONFIG_KEY_GROUP_DASHBOARD_PROFILES:   'group-dashboard-profiles'
	}

	return STRINGS;
})());