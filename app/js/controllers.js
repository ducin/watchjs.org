myApp.controller('MainCtrl', function ($scope, $http) {
    $http.get('/videos').success(function(data, status, headers, config){
        $scope.videos = data;
    });
});

myApp.controller('HomeController', function ($scope) {
    $scope.message = "Welcome to watch.js!";
});

myApp.controller('ContactController', function ($scope) {
    $scope.message = "Contact watch.js...";
});

myApp.controller('AboutController', function ($scope) {
    $scope.message = "About watch.js...";
});

myApp.controller('VideoController', function ($scope, $http, $log, $routeParams) {
    $http.get('/videos/' + $routeParams.videoId)
    .success(function(data, status, headers, config){
        $scope.video = data;
    }).error(function(data, status, headers, config){
        $log.error(arguments);
    });
});

myApp.controller('TagController', function ($scope, $http, $log, $routeParams) {
    $scope.tag = $routeParams.tag;
    $http.get('/videos?tag=' + $routeParams.tag)
    .success(function(data, status, headers, config){
        $scope.videos = data;
    }).error(function(data, status, headers, config){
        $log.error(arguments);
    });
});

myApp.controller('TagListController', function ($scope, $http, $log, $routeParams) {
    $http.get('/tags')
    .success(function(data, status, headers, config){
        $scope.tags = data;
    }).error(function(data, status, headers, config){
        $log.error(arguments);
    });
});

myApp.controller('EventController', function ($scope, $http, $log, $routeParams) {
    $http.get('/events/' + $routeParams.eventId)
    .success(function(data, status, headers, config){
        $scope.event = data;
    }).error(function(data, status, headers, config){
        $log.error(arguments);
    });
});

myApp.controller('EventListController', function ($scope, $http, $log, $routeParams) {
    $http.get('/events')
    .success(function(data, status, headers, config){
        $scope.events = data;
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

myApp.controller('SpeakerListController', function ($scope, $http, $log, $routeParams) {
    $http.get('/speakers')
    .success(function(data, status, headers, config){
        $scope.speakers = data;
    }).error(function(data, status, headers, config){
        $log.error(arguments);
    });
});
