'use strict';

/**
 * Routes
 */
app.config(function ($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'src/views/controllers/dash.view.html',
			controller: 'DashCtrl'
		})
		.otherwise({
			redirectTo: '/'
		});
});
