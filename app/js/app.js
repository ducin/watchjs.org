/* global angular: false */

var myApp = angular.module('myApp', [
    'ngRoute',
    'ngMockE2E',
    'slugifier',
    'youtube-embed'
]).config(function($logProvider){
    $logProvider.debugEnabled(true);
}).config(['$routeProvider',
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
                when('/video/:videoId', {
                    templateUrl: 'templates/video.html',
                    controller: 'VideoController'
                }).
                when('/tags', {
                    templateUrl: 'templates/tag-list.html',
                    controller: 'TagListController'
                }).
                when('/tag/:tag', {
                    templateUrl: 'templates/tag.html',
                    controller: 'TagController'
                }).
                when('/events', {
                    templateUrl: 'templates/event-list.html',
                    controller: 'EventListController'
                }).
                when('/event/:eventId', {
                    templateUrl: 'templates/event.html',
                    controller: 'EventController'
                }).
                when('/speakers', {
                    templateUrl: 'templates/speaker-list.html',
                    controller: 'SpeakerListController'
                }).
                when('/speaker/:speakerId', {
                    templateUrl: 'templates/speaker.html',
                    controller: 'SpeakerController'
                }).
                otherwise({
                    redirectTo: '/'
                });
    }]);

/*
myApp.config(['$locationProvider',
    function($locationProvider) {
        return $locationProvider.html5Mode({
            enabled: true
        });
    }
]);
*/
