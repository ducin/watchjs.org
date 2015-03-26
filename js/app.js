var videos = require('../dist/videos.json');
var events = require('../dist/events.json');

var myApp = angular.module('myApp', ['ngRoute', 'ngMockE2E', 'youtube-embed']);

myApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
                when('/', {
                    templateUrl: 'templates/home.html',
                    controller: 'HomeController'
                }).
                when('/video/:videoId', {
                    templateUrl: 'templates/video.html',
                    controller: 'VideoController'
                }).
                otherwise({
                    redirectTo: '/'
                });
    }]);

myApp.run(function ($httpBackend, $log) {
    $httpBackend.whenGET('/videos').respond(function (method, url, data) {
        $log.debug("Getting videos", videos);
        return [200, videos, {}];
    });
    $httpBackend.whenGET('/events').respond(function (method, url, data) {
        $log.debug("Getting events", events);
        return [200, events, {}];
    });
    $httpBackend.whenGET(/\.html$/).passThrough();
});

myApp.controller('MainCtrl', function ($scope, $http) {
    $scope.actual = 'i9MHigUZKEM';
    $http.get('/events').success(function(data, status, headers, config){
        $scope.events = events;
    });
    $http.get('/videos').success(function(data, status, headers, config){
        $scope.videos = videos;
    });
    $scope.chooseVideo = function (id) {
        $scope.actual = $scope.videos[id].videoId;
    };
});

myApp.controller('VideoController', function ($scope, $routeParams) {
    $scope.video = $scope.videos[$routeParams.videoId - 1];
});

myApp.controller('HomeController', function ($scope) {
    $scope.message = "Welcome to watch.js!";
});
