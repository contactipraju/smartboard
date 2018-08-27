/** String constants for event names used in broadcasts */
app.constant("EVENTS", (function () {
	
	var EVENTS = {
		SINGLE_PATH_EVENT_TYPE_INIT:        0,
		SINGLE_PATH_EVENT_TYPE_LOADED:      1,
		SINGLE_PATH_EVENT_TYPE_DATA_EDITED: 2,

		EMIT_DELETE_PANEL:            'delete:panel',
		SINGLE_PAGE_EVENT:       'data:event',
		NEWDASH_PROFILE_UPDATED: 'newdash:profile:updated',
		NEWDASH_LAYOUT_MODIFIED: 'newdash:layout:modified',

		WIDGETS_REFLOW:          'widgets:reflow',	// A dataset has been loaded - a signal for graphs to re-render with the latest dataset
		APP_REFRESH:             'app:refresh',		// An event signaling that everything should refresh. Please use with caution and minimise it's use!
		DIRECTORY_REDRAW:        'directory:redraw',
		SUSPEND_WATCHERS:        'watchers:suspend',
		RESUME_WATCHERS:         'watchers:resume',

		AUTH_REFRESHED:          'app:auth-refreshed', 
		AUTH_LOGIN:              'app:auth-log-in',
		AUTH_LOGOUT:             'app:auth-log-out',

		SPA_CONFIG_SAVE:         'spa:config:save',
		SPA_CONFIG_SAVED:        'spa:config:saved'
	}

	// mask typo
	EVENTS.ACTIVITY_UPDATED = EVENTS.ACTIVITY_UDPATED;

	return EVENTS;
})());