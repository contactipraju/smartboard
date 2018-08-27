app.directive("msShortcuts", function () {
	return {
		restrict: "E",
		replace: true,
		scope: {
			data: "=data"
		},
		link: function (scope, element, attrs, controllers) {
		},
		controller: ["$scope", "$timeout", function ($scope, $timeout) {
			
			function init() {
			}

			init();
		}],
		templateUrl: "src/views/directives/widgets/shortcuts.html"
	}
})