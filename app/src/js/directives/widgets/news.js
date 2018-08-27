app.directive("msNews", function () {
	return {
		restrict: "E",
		replace: true,
		scope: {
			data: "=data"
		},
		link: function (scope, element, attrs, controllers) {
		},
		controller: ["$scope", "$timeout", function ($scope, $timeout) {
			
			function initiatePull() {
				// Set app status to spinning
				$scope.isSpinning = true;

				// Call the Lambda function to collect the spin results
				$scope.lambda.invoke($scope.params, function(err, data) {
					$scope.isSpinning = false;

					if (err) {
						console.log(err);
					}
					else {
						var response = JSON.parse(data.Payload);
						$scope.result = JSON.parse(response);

						$timeout(function () {
							displayPull();
						}, 10);
					}
				});	
			}

			function displayPull() {
				if ($scope.result) {
					console.log($scope.result);
				}
			}

			function init() {
				$scope.isSpinning = false;

				// Configure AWS SDK for JavaScript
				AWS.config.update({region: 'us-east-1'});
				AWS.config.credentials = new AWS.CognitoIdentityCredentials({IdentityPoolId: 'us-east-1:61f71b7d-9a9e-4f9a-8ae6-a78c416b49bc'});

				// Prepare to call Lambda function
				$scope.lambda = new AWS.Lambda({region: 'us-east-1', apiVersion: '2015-03-31'});

				//$scope.pullParams = {url: "http://content.morningstar.com.au/contentservice/lineups/252"};
				$scope.params = {
					FunctionName : 'SpecialReportsBuilder',
					InvocationType : 'RequestResponse',
					LogType : 'None'
				};

				initiatePull();
			}

			init();
		}],
		templateUrl: "src/views/directives/widgets/news.html"
	}
});
