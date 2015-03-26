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

myApp.run(function ($httpBackend) {
    $httpBackend.whenGET('/videos').respond(function (method, url, data) {
        console.log("Getting videos");
        return [200, videos, {}];
    });
    $httpBackend.whenGET('/events').respond(function (method, url, data) {
        console.log("Getting events");
        return [200, events, {}];
    });
    $httpBackend.whenGET(/\.html$/).passThrough();
});

myApp.controller('MainCtrl', function ($scope, $http) {
    $scope.actual = 'i9MHigUZKEM';
    $scope.events = events;
    $scope.videos = videos;
    $scope.chooseVideo = function (id) {
        $scope.actual = $scope.videos[id].videoId;
    };
});

myApp.controller('VideoController', function ($scope, $routeParams) {
    $scope.video = $scope.videos[$routeParams.videoId];
});

myApp.controller('HomeController', function ($scope) {
    $scope.message = "Welcome to watch.js!";
});
