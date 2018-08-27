app.directive("msTicker", function () {
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
				$scope.link_url_base = "https://www.asx.com.au/asx/share-price-research/company/";

				$scope.quotes = [
					{name: "AGL ENERGY", tick: "AGL", price: "$20.60", deltaamount: "-$0.76", deltapercent: "-3.56%"},
					{name: "ARISTOCRAT", tick: "ALL", price: "$30.91", deltaamount: "-$0.07", deltapercent: "-0.23%"},
					{name: "AMCOR",      tick: "AMC", price: "$14.00", deltaamount: "$0.24",  deltapercent: "1.17%"},
					{name: "AMP",        tick: "AMP", price: "$3.38",  deltaamount: "-$0.08", deltapercent: "-2.17%"},
					{name: "ANZ BANK",   tick: "ANZ", price: "$29.10", deltaamount: "-$0.41", deltapercent: "-1.39%"},
					{name: "APA GROUP",  tick: "APA", price: "$10.16", deltaamount: "$0.08",  deltapercent: "-0.79%"}
				];
			}

			init();
		}],
		templateUrl: "src/views/directives/widgets/ticker.html"
	}
});
