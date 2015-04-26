(function () {

    var rawVideos = _.id2ObjectMap(require('../dist/videos.json')),
        rawEvents = _.id2ObjectMap(require('../dist/events.json')),
        rawSpeakers = _.id2ObjectMap(require('../dist/speakers.json'));

    var Factory = {
        canonical: {
            event: function (event) {
                return _.pick(event, 'id', 'name');
            },
            speaker: function (speaker) {
                return _.pick(speaker, 'id', 'name');
            },
            video: function (video) {
                return _.pick(video, 'id', 'title');
            }
        },
        all: {
            videos: function () {
                return _.map(rawVideos, function (v) {
                    var res = _.pick(v, 'id', 'videoId', 'title', 'tags');
                    // replacing event hash-id with event nested object
                    res.event = _.find(rawEvents, function (el) {
                        return el.id === v.eventId;
                    });
                    // replacing speaker hash-id with speaker nested object
                    res.speakers = _.map(v.speakerIds, function (speakerId) {
                        return _.find(rawSpeakers, function (el) {
                            return el.id === speakerId;
                        });
                    });
                    return res;
                });
            },
            events: function () {
                return _.map(rawEvents, function (e) {
                    var res = _.clone(e);
                    // attaching videos list to each event
                    res.videos = _.chain(rawVideos)
                            .filter(function (video) {
                                return video.eventId === res.id;
                            })
                            .map(function (video) {
                                return {
                                    video: Factory.canonical.video(video),
                                    speakers: _.map(video.speakerIds, function(speakerId){
                                        return Factory.canonical.speaker(rawSpeakers[speakerId])
                                    })
                                };
                            })
                            .value();
                    return res;
                });
            },
            speakers: function () {
                return _.map(rawSpeakers, function (s) {
                    var res = _.clone(s);
                    // attaching videos list to each speaker
                    res.videos = _.chain(rawVideos)
                            .filter(function (video) {
                                return _.contains(video.speakerIds, res.id);
                            })
                            .map(function (video) {
                                return {
                                    video: Factory.canonical.video(video),
                                    event: Factory.canonical.event(rawEvents[video.eventId])
                                };
                            })
                            .value();
                    return res;
                });
            }
        }
    };
    module.exports = Factory;
})();
