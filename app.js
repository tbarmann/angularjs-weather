var weatherApp = angular.module('weatherApp',['ngRoute','ngResource']);

weatherApp.config(function($routeProvider){
	$routeProvider
		.when('/',{
			templateUrl: 'pages/home.htm',
			controller: 'homeController'
		})
		.when('/forecast',{
			templateUrl: 'pages/forecast.htm',
			controller: 'forecastController'

		})
		.when('/forecast/:days',{
			templateUrl: 'pages/forecast.htm',
			controller: 'forecastController'

		})		
});

weatherApp.service('cityService',function(){
	this.city = "Providence, RI";

});

weatherApp.service('weatherService',['$resource' , function($resource){
	this.GetWeather = function(city,days) {
	var appId = '8ffcd4db8c3692fc149d2964ea96eae6';
	var weatherAPI = $resource("http://api.openweathermap.org/data/2.5/forecast/daily",{
		callback: "JSON_CALLBACK"
		},{
			get: {
				method: "JSONP"
			}
		});
	return weatherAPI.get({q:city, cnt:days, APPID:appId});
	};

}]);


weatherApp.controller('homeController',['$scope','$location','cityService', function($scope,$location,cityService){
	$scope.city = cityService.city;
	$scope.$watch('city',function(){
		cityService.city = $scope.city;
	});
	$scope.submit = function(){
		$location.path("/forecast");
	};

}]);

weatherApp.controller('forecastController',['$scope','$routeParams', 'cityService', 'weatherService', function($scope, $routeParams, cityService, weatherService){
	$scope.city = cityService.city;
	$scope.days = $routeParams.days || '2';
	
	$scope.weatherResult = weatherService.GetWeather($scope.city,$scope.days);


	$scope.convertToFahrenheit = function(degK) {
		return Math.round((1.8 * (degK - 273)) + 32);
	}	

	$scope.convertToDate = function(dt) {
		return new Date(dt * 1000);
	}

}]);

weatherApp.directive("forecastResult", function() {
	return {
		templateUrl: 'directives/forecast-result.htm',
		replace: true,
		scope: {
			wObject: "=",
			convertToFahrenheitFunction: "&",
			convertToDateFunction: "&"
		}
	}

});