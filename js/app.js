var myApp = angular.module('myApp', ['ngRoute', 'ngMockE2E', 'slugifier', 'youtube-embed']);

/*
myApp.config(['$locationProvider',
    function($locationProvider) {
        return $locationProvider.html5Mode({
            enabled: true
        });
    }
]);
*/

myApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
                when('/', {
                    templateUrl: 'templates/home.html',
                    controller: 'HomeController'
                }).
                when('/about', {
                    templateUrl: 'templates/about.html',
                    controller: 'AboutController'
                }).
                when('/contact', {
                    templateUrl: 'templates/contact.html',
                    controller: 'ContactController'
                }).
                when('/event/:eventId', {
                    templateUrl: 'templates/event.html',
                    controller: 'EventController'
                }).
                when('/speaker/:speakerId', {
                    templateUrl: 'templates/speaker.html',
                    controller: 'SpeakerController'
                }).
                when('/video/:videoId', {
                    templateUrl: 'templates/video.html',
                    controller: 'VideoController'
                }).
                otherwise({
                    redirectTo: '/'
                });
    }]);

myApp.filter('speaker', function () {
  return function (input) {
    return angular.isArray(input) ? _.map(input, function(el){ return el.name }).join(', ') : input.name;
  };
});

myApp.controller('MainCtrl', function ($scope, $http) {
    $http.get('/videos').success(function(data, status, headers, config){
        $scope.videos = data;
    });
});

myApp.controller('VideoController', function ($scope, $http, $log, $routeParams) {
    $http.get('/videos/' + $routeParams.videoId)
    .success(function(data, status, headers, config){
        $scope.video = data;
    }).error(function(data, status, headers, config){
        $log.error(arguments);
    });
});

myApp.controller('HomeController', function ($scope) {
    $scope.message = "Welcome to watch.js!";
});

myApp.controller('EventController', function ($scope, $http, $log, $routeParams) {
    $http.get('/events/' + $routeParams.eventId)
    .success(function(data, status, headers, config){
        $scope.event = data;
    }).error(function(data, status, headers, config){
        $log.error(arguments);
    });
});

myApp.controller('SpeakerController', function ($scope, $http, $log, $routeParams) {
    $http.get('/speakers/' + $routeParams.speakerId)
    .success(function(data, status, headers, config){
        $scope.speaker = data;
    }).error(function(data, status, headers, config){
        $log.error(arguments);
    });
});

myApp.controller('ContactController', function ($scope) {
    $scope.message = "About watch.js...";
});

myApp.controller('AboutController', function ($scope) {
    $scope.message = "About watch.js...";
});
