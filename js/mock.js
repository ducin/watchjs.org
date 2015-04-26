var mockFactory = require('./mockFactory'),
    videos = mockFactory.all.videos(),
    events = mockFactory.all.events(),
    speakers = mockFactory.all.speakers();

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
        var speaker = _.find(speakers, function(el){ return el.id === id; });
        $log.debug("Getting speaker id:", id, speaker);
        return [200, speaker, {}];
    });
    var eventBySlug = new RegExp('/events/([a-z0-9-]+)$');
    $httpBackend.whenGET(eventBySlug).respond(function (method, url, data) {
        var id = url.match(eventBySlug)[1];
        var event = _.find(events, function(el){ return el.id === id; });
        $log.debug("Getting event id:", id, event);
        return [200, event, {}];
    });
    $httpBackend.whenGET(new RegExp('/events$')).respond(function (method, url, data) {
        $log.debug("Getting events", events);
        return [200, events, {}];
    });
    $httpBackend.whenGET(/\.html$/).passThrough();
});
