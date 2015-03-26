var videos = require('../dist/videos.json');
var events = require('../dist/events.json');

videos = _.map(videos, function(v){
  v.event = _.find(events, function(el){ return el.id == v.event });
  return v;
});

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

// http://codevinsky.github.io/development/2013/09/12/lie-to-me/
myApp.run(function ($httpBackend, $log) {
    $httpBackend.whenGET(new RegExp('/videos$')).respond(function (method, url, data) {
        $log.debug("Getting videos", videos);
        return [200, videos, {}];
    });
    var videoById = new RegExp('/videos/(\\d+)$');
    $httpBackend.whenGET(videoById).respond(function (method, url, data) {
        var id = url.match(videoById)[1];
        var video = videos[id - 1];
        $log.debug("Getting video id:", id, video);
        return [200, video, {}];
    });
    $httpBackend.whenGET(new RegExp('/events$')).respond(function (method, url, data) {
        $log.debug("Getting events", events);
        return [200, events, {}];
    });
    $httpBackend.whenGET(/\.html$/).passThrough();
});

myApp.controller('MainCtrl', function ($scope, $http) {
    $scope.actual = 'i9MHigUZKEM';
//    $http.get('/events').success(function(data, status, headers, config){
//        $scope.events = events;
//    });
    $http.get('/videos').success(function(data, status, headers, config){
        $scope.videos = videos;
    });
});

myApp.controller('VideoController', function ($scope, $http, $routeParams) {
    $http.get('/videos/' + $routeParams.videoId)
    .success(function(data, status, headers, config){
        $scope.video = data;
    }).error(function(data, status, headers, config){
        $log.error(arguments);
    });;
//    $scope.video = $scope.videos[$routeParams.videoId - 1];
});

myApp.controller('HomeController', function ($scope) {
    $scope.message = "Welcome to watch.js!";
});
