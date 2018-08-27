'use strict';

app.controller('DashCtrl', function ($scope, $timeout, EVENTS, STRINGS, LANGUAGE, DefaultsService, ConfigService) {
	$scope.STRINGS = STRINGS;
	$scope.LANGUAGE = LANGUAGE;
	$scope.editing = false;

	$scope.widgets = angular.copy(DefaultsService.get(STRINGS.DASHBOARD_DEFAULT_WIDGETS));

	$scope.gridOptions = {
		cellHeight: 80,
		verticalMargin: 10
	};

	function init () {
		$(function () {
			$('.grid-stack').gridstack($scope.gridOptions);
			$scope.setEditMode(false);
		});
	}

	$scope.$on(EVENTS.EMIT_DELETE_PANEL, function (evt, w) {
		var index = $scope.widgets.indexOf(w);
		$scope.widgets.splice(index, 1);
	});

	$scope.addWidget = function() {
		console.log("Adding new Widget..");

		var newWidget = angular.copy(DefaultsService.get(STRINGS.DASHBOARD_DEFAULT_WIDGET));
		$scope.widgets.push(newWidget);
	};

	$scope.setEditMode = function(mode) {
		$scope.editing = mode;
	    var grid = $(".grid-stack").data('gridstack');

		if(mode) {
			grid.enableMove(true, true);
			grid.enableResize(true, true);
		}
		else {
			grid.enableMove(false, true);
			grid.enableResize(false, true);
		}
	};

	$scope.editDash = function() {
		$scope.setEditMode(true);
	};

	$scope.saveDash = function() {
		$scope.exportProfile();
		$scope.setEditMode(false);
	};

	$scope.exportProfile = function () {
		console.clear();

		var copy = angular.copy($scope.widgets);

		function stripOutFunctions (obj, depth = 0) {
			_.forOwn(obj, function (val, key) {
				if (typeof val == "function") {
					// strip out functions
					delete obj[key];
				} else if (key == "id") {
					// expand widget ids and inject their config into this
					if (depth > 0 && obj[key].startsWith("db-widget")) {
						ConfigService.getAsPromise(obj[key])
							.then(function (data) {
								if (!data) return;

								delete data.name;

								stripOutFunctions(data);

								obj.config = data;
							})
					}
					if (obj[key].startsWith("db-")) {
						delete obj[key];
					}
				} else if (depth == 2 && key == "name") {
					// remove panel name (which is unused)
					delete obj[key];
				} else if (key.startsWith("$") || ["userIds", "muted", "tz", "locale"].indexOf(key) !== -1) {
					// strip out certain fields that we don't want
					delete obj[key];
				} else if (typeof val == "object") {
					if ( _.isEmpty(obj[key])) {
						// remove empty objects
						delete obj[key];
					} else {
						// recurse through sub-objects
						stripOutFunctions(val, depth+1);
					}
				}
			})
		}

		stripOutFunctions(copy);

		$timeout(function () {
			console.log(JSON.stringify(copy, null, "\t"));
		}, 100);
	};

	init();
});
