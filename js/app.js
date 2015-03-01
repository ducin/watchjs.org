var myApp = angular.module('myApp', ['ngRoute', 'youtube-embed']);

myApp.controller('MainCtrl', function ($scope) {
    // have a video id
    $scope.actual = 'i9MHigUZKEM';
    $scope.events = [
        // js conf us
        {
            "id": "jsconf-us-2009",
            "name": "JSConf US 2009",
            "link": "http://2009.jsconf.us/"
        },
        {
            "id": "jsconf-us-2010",
            "name": "JSConf US 2010",
            "link": "http://2010.jsconf.us/"
        },
        {
            "id": "jsconf-us-2011",
            "name": "JSConf US 2011",
            "link": "http://2011.jsconf.us/"
        },
        {
            "id": "jsconf-us-2012",
            "name": "JSConf US 2012",
            "link": "http://2012.jsconf.us/"
        },
        {
            "id": "jsconf-us-2013",
            "name": "JSConf US 2013",
            "link": "http://2013.jsconf.us/"
        },
        {
            "id": "jsconf-us-2014",
            "name": "JSConf US 2014",
            "link": "http://2014.jsconf.us/"
        },
        // js conf eu
        {
            "id": "jsconf-eu-2011",
            "name": "JSConf EU 2011",
            "link": "http://jsconf.eu/2011/"
        },
        {
            "id": "jsconf-eu-2012",
            "name": "JSConf EU 2012",
            "link": "http://2012.jsconf.eu/"
        },
        {
            "id": "jsconf-eu-2013",
            "name": "JSConf EU 2013",
            "link": "http://2013.jsconf.eu/"
        },
        {
            "id": "jsconf-eu-2014",
            "name": "JSConf EU 2014",
            "link": "http://2014.jsconf.eu/"
        },
        // js conf au
        {
            "id": "jsconf-au-2014",
            "name": "JSConf AU 2014",
            "link": "http://au.jsconf.com/"
        },
        // others
        {
            "id": "ng-conf-2014",
            "name": "ng-conf 2014"
        },
        {
            "id": "gdg-tel-aviv",
            "name": "Google Developers Group Tel Aviv",
            "link": "http://www.meetup.com/GDG-Tel-Aviv/"
        },
        {
            "id": "devday-2012",
            "name": "DevDay 2012",
            "link": "http://devday.pl/archive/2012"
        }
    ];
    // http://ng-conf.ng-learn.org/
    // http://velocityconf.com/
    var videos = [
        {
            "id": 4,
            "videoId": "YbyZdFA6Qt4",
            "title": "Angular === Community",
            "author": "Igor Minar",
            "keywords": ["angular"],
            "event": "ng-conf-2014"
        },
        {
            "id": 5,
            "videoId": "_OGGsf1ZXMs",
            "title": "Dependency Injection",
            "author": "Vojta Jina",
            "keywords": ["angular"],
            "event": "ng-conf-2014"
        },
        {
            "id": 6,
            "videoId": "aQipuiTcn3U",
            "title": "End to End Angular Testing with Protractor",
            "author": "Julie Ralph",
            "keywords": ["angular"],
            "event": "ng-conf-2014"
        },
        {
            "id": 7,
            "videoId": "UMkd0nYmLzY",
            "title": "Deep Dive into Custom Directives",
            "author": "Dave Smith",
            "keywords": ["angular"],
            "event": "ng-conf-2014"
        },
        {
            "id": 8,
            "videoId": "u6TeBM_SC8w",
            "title": "How to use Typescript on your Angular Application and Be Happy",
            "author": "Sean Hess",
            "keywords": ["angular"],
            "event": "ng-conf-2014"
        },
        {
            "id": 9,
            "videoId": "e4yUTkva_FM",
            "title": "Building Realtime Apps With Firebase and Angular",
            "author": "Anant Narayanan",
            "keywords": ["angular"],
            "event": "ng-conf-2014"
        },
        {
            "id": 10,
            "videoId": "4yulGISBF8w",
            "title": "Angular and RequireJS",
            "author": "Thomas Burleson",
            "keywords": ["angular"],
            "event": "ng-conf-2014"
        },
        {
            "id": 11,
            "videoId": "NTPutZ99XWY",
            "title": "Angular with Browserify",
            "author": "Ben Clinkinbeard",
            "keywords": ["angular"],
            "event": "ng-conf-2014"
        },
        {
            "id": 12,
            "videoId": "wVntVkRLR3M",
            "title": "Using AngularJS to create iPhone & Android applications with PhoneGap",
            "author": "Daniel Zen",
            "keywords": ["angular"],
            "event": "ng-conf-2014"
        },
        {
            "id": 13,
            "videoId": "MhVgGE-pgEY",
            "title": "Robotics powering interfaces with AngularJS to the Arduino",
            "author": "Ari Lerner",
            "keywords": ["angular"],
            "event": "ng-conf-2014"
        },
        {
            "id": 14,
            "videoId": "XcRdO5QVlqE",
            "title": "Going Postal with Angular in Promises",
            "author": "Christian Lilley",
            "keywords": ["angular"],
            "event": "ng-conf-2014"
        },
        {
            "id": 15,
            "videoId": "zyYpHIOrk_Y",
            "title": "Angular Performance",
            "author": "Karl Seamon",
            "keywords": ["angular"],
            "event": "ng-conf-2014"
        },
        {
            "id": 20,
            "videoId": "04DOp1F9Od4",
            "title": "JavaScript for Everybody",
            "author": "Marcy Sutton",
            "keywords": ["javascript"],
            "event": "jsconf-eu-2014"
        },
        {
            "id": 21,
            "videoId": "mfOh-J-9BY0",
            "title": "Plight Of The Butterfly - Everything You Wanted To Know About Object.observe()",
            "author": "Addy Osmani",
            "keywords": ["ecmascript"],
            "event": "jsconf-eu-2014"
        },
        {
            "id": 22,
            "videoId": "v0TFmdO4ZP0",
            "title": "JavaScript Masterclass",
            "author": "Angelina Fabbro",
            "keywords": ["javascript"],
            "event": "jsconf-us-2013"
        },
        {
            "id": 23,
            "videoId": "PV_cFx29Xz0",
            "title": "Javascript sucks and it doesn't matter",
            "author": "Rob Ashton",
            "keywords": ["javascript"],
            "event": "devday-2012"
        },
        {
            "id": 24,
            "videoId": "kK--WKlng74",
            "title": "Yeoman Bower and Grunt - Building Modern Webapps With Ease",
            "author": "Shai Reznik",
            "keywords": ["yeoman", "bower", "grunt"],
            "event": "gdg-tel-aviv"
        },
        {
            "id": 25,
            "videoId": "3D1WeSCSkPQ",
            "title": "To hell with jQuery",
            "author": "Karolina Szczur",
            "keywords": ["jquery"],
            "event": "jsconf-eu-2012"
        },
//                {
//                    "id": ,
//                    "videoId": "",
//                    "title": "",
//                    "author": "",
//                    "keywords": [""],
//                    "event": ""
//                }
    ];
    $scope.videos = {};
    angular.forEach(videos, function(value, key) {
        $scope.videos[value.id] = value;
    });
    $scope.chooseVideo = function (id) {
        debugger;
        $scope.actual = $scope.videos[id].videoId;
    };
});

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

myApp.controller('VideoController', function ($scope, $routeParams) {
    $scope.video = $scope.videos[$routeParams.videoId];
});

myApp.controller('HomeController', function ($scope) {
    $scope.message = "Welcome to watch.js!";
});
