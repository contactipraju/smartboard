'use strict';

app.directive("msPanel", function () {
	return {
		restrict: "E",
		replace: true,
		scope: {
			w: "="
		},
		link: function (scope, element, attrs, controllers) {
		},
		controller: ["$scope", "$timeout", "EVENTS", "STRINGS", "LANGUAGE", "DefaultsService", "ConfigService", 
			function ($scope, $timeout, EVENTS, STRINGS, LANGUAGE, DefaultsService, ConfigService) {
			
			function dataReady(newVal, oldVal) {
				if (angular.equals(newVal, oldVal) || _.isNil($scope.data))
					return false;
				else
					return true;
			}
			
			$scope.$watch("data", function (newVal, oldVal) {
				if(dataReady(newVal, oldVal))
					init();
			});

			$scope.STRINGS = STRINGS;
			$scope.LANGUAGE = LANGUAGE;

			$scope.widgetTypes = DefaultsService.get(STRINGS.DASHBOARD_WIDGET_TYPES);

			$scope.selectWidgetType = function(wType) {
				console.log("selectWidgetType", wType);

				$scope.selectedWidget = wType;
			}

			$scope.removeWidget = function(w) {
				console.log("Removing Widget..", w);
				$scope.$emit(EVENTS.EMIT_DELETE_PANEL, w);
			};

			$scope.selectHelp = function() {
				$scope.selectedWidget = getWidgetForId(STRINGS.WIDGET_TYPE_HELP);
			};

			function getWidgetForId(id) {
				for(var i=0; i<$scope.widgetTypes.length; i++) {
					if(id == $scope.widgetTypes[i].id)
						return $scope.widgetTypes[i];
				}

				return $scope.widgetTypes[0];
			}

			function init() {
				$scope.selectedWidget = getWidgetForId($scope.w.widgetTypeId);
			}

			init();
		}],
		templateUrl: "src/views/directives/panel.html"
	}
});