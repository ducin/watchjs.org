var videos = require('../dist/videos.json');
var events = require('../dist/events.json');
var speakers = require('../dist/speakers.json');

// replacing event hash with event nested object
videos = _.map(videos, function(v){
  v.event = _.find(events, function(el){ return el.id === v.eventId });
  if (_.isArray(v.speakerId)) {
    v.speaker = _.map(v.speakerId, function(speakerId){
      return _.find(speakers, function(el){ return el.id === speakerId });
    });
  } else {
    v.speaker = _.find(speakers, function(el){ return el.id === v.speakerId });
  }
  return v;
});

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
    var speakerBySlug = new RegExp('/speakers/([a-z-]+)$');
    $httpBackend.whenGET(speakerBySlug).respond(function (method, url, data) {
        var id = url.match(speakerBySlug)[1];
        var speaker = _.find(speakers, function(el){ return el.id === id });
        $log.debug("Getting speaker id:", id, speaker);
        return [200, speaker, {}];
    });
    var eventBySlug = new RegExp('/events/([a-z0-9-]+)$');
    $httpBackend.whenGET(eventBySlug).respond(function (method, url, data) {
        var id = url.match(eventBySlug)[1];
        var event = _.find(events, function(el){ return el.id === id });
        $log.debug("Getting event id:", id, event);
        return [200, event, {}];
    });
    $httpBackend.whenGET(new RegExp('/events$')).respond(function (method, url, data) {
        $log.debug("Getting events", events);
        return [200, events, {}];
    });
    $httpBackend.whenGET(/\.html$/).passThrough();
});

myApp.filter('speaker', function () {
  return function (input) {
    return angular.isArray(input) ? _.map(input, function(el){ return el.name }).join(', ') : input.name;
  };
});

myApp.controller('MainCtrl', function ($scope, $http) {
//    $http.get('/events').success(function(data, status, headers, config){
//        $scope.events = events;
//    });
    $http.get('/videos').success(function(data, status, headers, config){
        $scope.videos = videos;
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
