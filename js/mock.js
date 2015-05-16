(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

(function () {

    var rawVideos = _.id2ObjectMap(require('../../../dist/data/videos.json')),
        rawEvents = _.id2ObjectMap(require('../../../dist/data/events.json')),
        rawSpeakers = _.id2ObjectMap(require('../../../dist/data/speakers.json')),
        rawTags = require('../../../dist/data/tags.json');

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
                                        return Factory.canonical.speaker(rawSpeakers[speakerId]);
                                    })
                                };
                            })
                            .value();
                    res.videoCount = res.videos.length;
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
                    res.videoCount = res.videos.length;
                    return res;
                });
            },
            tags: function() {
                return _.map(rawTags, function (t) {
                    return {
                        name: t,
                        videoCount: _.filter(rawVideos, function(video){
                            return _.contains(video.tags, t);
                        }).length
                    };
                });
            }
        }
    };
    module.exports = Factory;
})();

},{"../../../dist/data/events.json":3,"../../../dist/data/speakers.json":4,"../../../dist/data/tags.json":5,"../../../dist/data/videos.json":6}],2:[function(require,module,exports){
'use strict';

var mockFactory = require('./factory'),
    videos = mockFactory.all.videos(),
    events = mockFactory.all.events(),
    speakers = mockFactory.all.speakers(),
    tags = mockFactory.all.tags();

// http://codevinsky.github.io/development/2013/09/12/lie-to-me/
myApp.run(function ($httpBackend, $log) {
    $httpBackend.whenGET(new RegExp('/videos$')).respond(function (method, url, data) {
        $log.debug('Getting videos', videos);
        return [200, videos, {}];
    });

    var videoByTag = new RegExp('/videos\\?tag=([a-z-]+)$');
    $httpBackend.whenGET(videoByTag).respond(function (method, url, data) {
        var tag = url.match(videoByTag)[1];
        var result = _.filter(videos, function(el){
            return _.contains(el.tags, tag);
        });
        $log.debug('Getting videos by tag:', tag, result);
        return [200, result, {}];
    });

    var videoById = new RegExp('/videos/(\\d+)$');
    $httpBackend.whenGET(videoById).respond(function (method, url, data) {
        var id = url.match(videoById)[1];
        var video = videos[id - 1];
        $log.debug('Getting video id:', id, video);
        return [200, video, {}];
    });

    $httpBackend.whenGET(new RegExp('/tags$')).respond(function (method, url, data) {
        $log.debug('Getting tags', tags);
        return [200, tags, {}];
    });

    $httpBackend.whenGET(new RegExp('/speakers$')).respond(function (method, url, data) {
        $log.debug('Getting speakers', speakers);
        return [200, speakers, {}];
    });

    var speakerBySlug = new RegExp('/speakers/([a-z-]+)$');
    $httpBackend.whenGET(speakerBySlug).respond(function (method, url, data) {
        var id = url.match(speakerBySlug)[1];
        var speaker = _.find(speakers, function(el){ return el.id === id; });
        $log.debug('Getting speaker id:', id, speaker);
        return [200, speaker, {}];
    });

    $httpBackend.whenGET(new RegExp('/events$')).respond(function (method, url, data) {
        $log.debug('Getting events', events);
        return [200, events, {}];
    });

    var eventBySlug = new RegExp('/events/([a-z0-9-]+)$');
    $httpBackend.whenGET(eventBySlug).respond(function (method, url, data) {
        var id = url.match(eventBySlug)[1];
        var event = _.find(events, function(el){ return el.id === id; });
        $log.debug('Getting event id:', id, event);
        return [200, event, {}];
    });

    $httpBackend.whenGET(/\.html$/).passThrough();
});

},{"./factory":1}],3:[function(require,module,exports){
module.exports=[{"id":"jsconf-eu-2011","name":"JSConf EU 2011","type":"conference","link":"http://jsconf.eu/2011/"},{"id":"jsconf-eu-2012","name":"JSConf EU 2012","type":"conference","link":"http://2012.jsconf.eu/"},{"id":"jsconf-eu-2013","name":"JSConf EU 2013","type":"conference","link":"http://2013.jsconf.eu/"},{"id":"jsconf-eu-2014","name":"JSConf EU 2014","type":"conference","link":"http://2014.jsconf.eu/"},{"id":"jsconf-us-2009","name":"JSConf US 2009","type":"conference","link":"http://2009.jsconf.us/"},{"id":"jsconf-us-2010","name":"JSConf US 2010","type":"conference","link":"http://2010.jsconf.us/"},{"id":"jsconf-us-2011","name":"JSConf US 2011","type":"conference","link":"http://2011.jsconf.us/"},{"id":"jsconf-us-2012","name":"JSConf US 2012","type":"conference","link":"http://2012.jsconf.us/"},{"id":"jsconf-us-2013","name":"JSConf US 2013","type":"conference","link":"http://2013.jsconf.us/"},{"id":"jsconf-us-2014","name":"JSConf US 2014","type":"conference","link":"http://2014.jsconf.us/"},{"id":"jsconf-au-2014","name":"JSConf AU 2014","type":"conference","link":"http://au.jsconf.com/"},{"id":"ng-conf-2014","name":"ng-conf 2014","type":"conference","link":"http://ng-conf.ng-learn.org/"},{"id":"ng-conf-2015","name":"ng-conf 2015","type":"conference","link":"http://www.ng-conf.org/"},{"id":"gdg-tel-aviv","name":"Google Developers Group Tel Aviv","type":"meetup","link":"http://www.meetup.com/GDG-Tel-Aviv/"},{"id":"devday-2012","name":"DevDay 2012","type":"conference","link":"http://devday.pl/archive/2012"}]
},{}],4:[function(require,module,exports){
module.exports=[{"id":"adam-brault","name":"Adam Brault"},{"id":"addy-osmani","name":"Addy Osmani","twitter":"addyosmani"},{"id":"adrian-perez-de-castro","name":"Adrian Perez de Castro"},{"id":"alex-feyerke","name":"Alex Feyerke"},{"id":"alex-sexton","name":"Alex Sexton"},{"id":"allen-pike","name":"Allen Pike"},{"id":"anant-narayanan","name":"Anant Narayanan"},{"id":"anders-heijlsberg","name":"Anders Heijlsberg"},{"id":"angelina-fabbro","name":"Angelina Fabbro","twitter":"hopefulcyborg"},{"id":"angus-croll","name":"Angus Croll"},{"id":"ari-lerner","name":"Ari Lerner"},{"id":"astrid-bin","name":"Astrid Bin"},{"id":"axel-rauschmayer","name":"Axel Rauschmayer"},{"id":"ben-clinkinbeard","name":"Ben Clinkinbeard"},{"id":"ben-teese","name":"Ben Teese"},{"id":"brad-green","name":"Brad Green","twitter":"bradlygreen"},{"id":"brendan-eich","name":"Brendan Eich","twitter":"BrendanEich"},{"id":"brennan-novak","name":"Brennan Novak"},{"id":"charlie-crane","name":"Charlie Crane"},{"id":"chrissy-welsh","name":"Chrissy Welsh"},{"id":"christian-kvalheim","name":"Christian Kvalheim"},{"id":"christian-lilley","name":"Christian Lilley"},{"id":"christoph-martens","name":"Christoph Martens"},{"id":"dan-mane","name":"Dan Mané"},{"id":"dan-wahlin","name":"Dan Wahlin"},{"id":"daniel-zen","name":"Daniel Zen"},{"id":"dave-smith","name":"Dave Smith"},{"id":"domenic-denicola","name":"Domenic Denicola"},{"id":"dominikus-baur","name":"Dominikus Baur"},{"id":"elise-huard","name":"Elise Huard"},{"id":"filip-maj","name":"Filip Maj"},{"id":"florian-loitsch","name":"Florian Loitsch"},{"id":"forbes-lindesay","name":"Forbes Lindesay"},{"id":"garann-means","name":"Garann Means"},{"id":"hunter-loftis","name":"Hunter Loftis"},{"id":"ido-sela","name":"Ido Sela"},{"id":"igor-minar","name":"Igor Minar"},{"id":"jake-archibald","name":"Jake Archibald","twitter":"jaffathecake"},{"id":"james-coglan","name":"James Coglan"},{"id":"james-halliday","name":"James Halliday"},{"id":"jan-monschke","name":"Jan Monschke"},{"id":"jaswanth-sreeram","name":"Jaswanth Sreeram"},{"id":"jed-schmidt","name":"Jed Schmidt"},{"id":"jeff-cross","name":"Jeff Cross"},{"id":"jeremy-elbourn","name":"Jeremy Elbourn"},{"id":"john-bender","name":"John Bender"},{"id":"john-david-dalton","name":"John David Dalton"},{"id":"john-papa","name":"John Papa"},{"id":"julian-viereck","name":"Julian Viereck"},{"id":"julie-ann-horvath","name":"Julie Ann Horvath"},{"id":"julie-ralph","name":"Julie Ralph"},{"id":"julien-genestoux","name":"Julien Genestoux"},{"id":"karl-seamon","name":"Karl Seamon"},{"id":"karolina-szczur","name":"Karolina Szczur"},{"id":"lena-reinhard","name":"Lena Reinhard"},{"id":"lucas-galfaso","name":"Lucas Galfaso"},{"id":"luke-hoban","name":"Luke Hoban"},{"id":"marcy-sutton","name":"Marcy Sutton"},{"id":"martha-girdler","name":"Martha Girdler"},{"id":"martin-bosslet","name":"Martin Boßlet"},{"id":"mary-rose-cook","name":"Mary Rose Cook"},{"id":"max-krohn","name":"Max Krohn"},{"id":"michael-brooks","name":"Michael Brooks"},{"id":"michael-starzinger","name":"Michael Starzinger"},{"id":"michal-biniek","name":"Michał Biniek"},{"id":"misko-hevery","name":"Miško Hevery","twitter":"mhevery"},{"id":"natalia-berdys","name":"Natalia Berdys"},{"id":"nic-da-costa","name":"Nic da Costa"},{"id":"pawel-kozlowski","name":"Paweł Kozłowski"},{"id":"pete-hunt","name":"Pete Hunt"},{"id":"peter-flynn","name":"Peter Flynn"},{"id":"philip-roberts","name":"Philip Roberts"},{"id":"rachel-dale","name":"Rachel Dale"},{"id":"rado-kirov","name":"Rado Kirov"},{"id":"ray-daly","name":"Ray Daly"},{"id":"remy-sharp","name":"Remy Sharp"},{"id":"rob-ashton","name":"Rob Ashton"},{"id":"sam-dutton","name":"Sam Dutton"},{"id":"sara-chipps","name":"Sara Chipps"},{"id":"sara-robinson","name":"Sara Robinson"},{"id":"sean-hess","name":"Sean Hess"},{"id":"shai-reznik","name":"Shai Reznik"},{"id":"simon-tennant","name":"Simon Tennant"},{"id":"stephan-seidt","name":"Stephan Seidt"},{"id":"stuart-memo","name":"Stuart Memo"},{"id":"thomas-burleson","name":"Thomas Burleson"},{"id":"thomas-kroeber","name":"Thomas Kroeber"},{"id":"tim-pietrusky","name":"Tim Pietrusky"},{"id":"vojta-jina","name":"Vojta Jina"}]
},{}],5:[function(require,module,exports){
module.exports=["jquery","css","typescript","hardware","WebRTC","real-time","exceptions","iframe","performance","browser-api","javascript","inheritance","community","coffeescript","assets","dart","compilation","i18n","design-patterns","modules","vanilla","audio","shadow-dom","functional","object-observe","ecmascript","promises","generators","regexp","mobile","api","keynote","mongoDB","react","streaming","algorithm","node.js","games","user-interface","html5","cryptography","service-worker","event-loop","automation","visualization","language","data-visualization","client-server","angular","directives","models","testing","protractor","firebase","require","browserify","documentation","yeoman","bower","grunt"]
},{}],6:[function(require,module,exports){
module.exports=[{"videoId":"3D1WeSCSkPQ","title":"To hell with jQuery","speakerIds":["karolina-szczur"],"tags":["jquery","css"],"eventId":"jsconf-eu-2012","id":1},{"videoId":"3UTIcQYQ8Rw","title":"Introducing TypeScript","speakerIds":["anders-heijlsberg","luke-hoban"],"tags":["typescript"],"eventId":"jsconf-eu-2012","id":2},{"videoId":"NBZCZ57mTUc","title":"JavaScript on the Raspberry Pi","speakerIds":["thomas-kroeber"],"tags":["hardware"],"eventId":"jsconf-eu-2012","id":3},{"videoId":"mYQNEaOfqGI","title":"WebRTC: Real-time communication without plugins","speakerIds":["sam-dutton"],"tags":["WebRTC","real-time"],"eventId":"jsconf-eu-2012","id":4},{"videoId":"qzJ0hn1mHOw","title":"Improvisational JavaScript","speakerIds":["garann-means"],"tags":["exceptions"],"eventId":"jsconfeu-2012","id":5},{"videoId":"y4lBEZTThvg","title":"iframes: A look in to the black heart of the browsers","speakerIds":["remy-sharp"],"tags":["iframe"],"eventId":"jsconfeu-2012","id":6},{"videoId":"ZhshEZIV2F4","title":"The Footprint of Performance","speakerIds":["michael-starzinger"],"tags":["performance"],"eventId":"jsconfeu-2012","id":7},{"videoId":"cT9f-04K6JI","title":"Don't dream - make the WebAPI of your dreams become real!","speakerIds":["julian-viereck"],"tags":["browser-api"],"eventId":"jsconfeu-2012","id":8},{"videoId":"NyClWddeO_A","title":"JavaScript inheritance: beyond the basics","speakerIds":["axel-rauschmayer"],"tags":["javascript","inheritance"],"eventId":"jsconfeu-2012","id":9},{"videoId":"qDZ5Ku6whi0","title":"A programming language for children","speakerIds":["mary-rose-cook"],"tags":["community"],"eventId":"jsconfeu-2012","id":10},{"videoId":"wwheL5TP_vE","title":"IcedCoffeeScript","speakerIds":["max-krohn"],"tags":["coffeescript"],"eventId":"jsconfeu-2012","id":11},{"videoId":"e7-ZnHMDZto","title":"Because F$%k Photoshop","speakerIds":["julie-ann-horvath"],"tags":["assets"],"eventId":"jsconfeu-2012","id":12},{"videoId":"d-xVOke3ync","title":"JavaScript as a compilation target - Making it fast","speakerIds":["florian-loitsch"],"tags":["dart","compilation","performance"],"eventId":"jsconfeu-2012","id":13},{"videoId":"PtD-WKSC6ak","title":"Faster JavaScript with Category Theory","speakerIds":["john-bender"],"tags":["jquery","performance"],"eventId":"jsconfeu-2012","id":14},{"videoId":"uXS_-JRsB8M","title":"Client Side Internationalization","speakerIds":["alex-sexton"],"tags":["i18n"],"eventId":"jsconfeu-2012","id":15},{"videoId":"zgt-jNqbxF8","title":"Code Collage","speakerIds":["james-halliday"],"tags":["design-patterns","modules"],"eventId":"jsconfeu-2012","id":16},{"videoId":"MFtijdklZDo","title":"Break all the rules","speakerIds":["angus-croll"],"tags":["vanilla"],"eventId":"jsconfeu-2012","id":17},{"videoId":"PN8Eg1K9xjE","title":"JavaScript is the new Punk Rock","speakerIds":["stuart-memo"],"tags":["audio"],"eventId":"jsconfeu-2012","id":18},{"videoId":"JNjnv-Gcpnw","title":"Inspector Web and the Mystery of the Shadow DOM","speakerIds":["angelina-fabbro"],"tags":["shadow-dom"],"eventId":"jsconfeu-2012","id":19},{"videoId":"3ujq55fCx6o","title":"Why functional is the new black","speakerIds":["elise-huard"],"tags":["functional"],"eventId":"jsconfeu-2012","id":20},{"videoId":"mfOh-J-9BY0","title":"Plight Of The Butterfly - Everything You Wanted To Know About Object.observe()","speakerIds":["addy-osmani"],"tags":["object-observe","ecmascript"],"eventId":"jsconf-eu-2013","id":21},{"videoId":"IXIkTrq3Rgg","title":"JS Responsibilities","speakerIds":["brendan-eich"],"tags":["javascript"],"eventId":"jsconf-eu-2013","id":22},{"videoId":"qbKWsbJ76-s","title":"Promises and Generators: control flow utopia","speakerIds":["forbes-lindesay"],"tags":["promises","generators","ecmascript"],"eventId":"jsconf-eu-2013","id":23},{"videoId":"R9deOzRwgow","title":"Reimplement RegExp in JavaScript","speakerIds":["julian-viereck"],"tags":["regexp"],"eventId":"jsconf-eu-2013","id":24},{"videoId":"x3zXlPkzhgw","title":"Hardware is Stupid Simple","speakerIds":["sara-chipps"],"tags":["hardware"],"eventId":"jsconf-eu-2013","id":25},{"videoId":"5LUkHss6CAw","title":"native.js: JavaScript in your native mobile apps","tags":["javascript","mobile"],"speakerIds":["allen-pike"],"eventId":"jsconf-eu-2013","id":26},{"videoId":"iSxNCYcPAFk","title":"The JavaScript Interpreter, Interpreted","tags":["javascript"],"speakerIds":["martha-girdler"],"eventId":"jsconf-eu-2013","id":27},{"videoId":"uwQsU0PwtaE","title":"The API is dead. Long live the protocol!","tags":["api"],"speakerIds":["simon-tennant"],"eventId":"jsconf-eu-2013","id":28},{"videoId":"1i7Q6_ZnhUc","title":"People First","tags":["keynote"],"speakerIds":["adam-brault"],"eventId":"jsconf-eu-2013","id":29},{"videoId":"F9EQ8p5Jw9Q","title":"Lessons from 4 Years of writing the driver for MongoDB","tags":["mongoDB"],"speakerIds":["christian-kvalheim"],"eventId":"jsconf-eu-2013","id":30},{"videoId":"x7cQ3mrcKaY","title":"React: Rethinking best practices","tags":["react"],"speakerIds":["pete-hunt"],"eventId":"jsconf-eu-2013","id":31},{"videoId":"e9httij2RG0","title":"Streaming Algorithms in Javascript and Node.js","tags":["streaming","algorithm","javascript","node.js"],"speakerIds":["julien-genestoux"],"eventId":"jsconf-eu-2013","id":32},{"videoId":"NpC1GbPw-fk","title":"Game server development in node.js","tags":["node.js","games"],"speakerIds":["charlie-crane"],"eventId":"jsconf-eu-2013","id":33},{"videoId":"ARophKqA4E0","title":"I have a Dreamcode: Build Apps, not Backends","tags":["javascript"],"speakerIds":["alex-feyerke"],"eventId":"jsconf-eu-2013","id":34},{"videoId":"9Q4L9XQ7qdo","title":"A Symphony Of Sound, Gone Mobile","tags":["audio","mobile"],"speakerIds":["nic-da-costa"],"eventId":"jsconf-eu-2013","id":35},{"videoId":"7nnAYB1mb9E","title":"The web experience in the autistic spectrum","tags":["community","user-interface"],"speakerIds":["natalia-berdys"],"eventId":"jsconf-eu-2013","id":36},{"videoId":"aIFaAkHFLxA","title":"The hitchhikers guide to UXing without a UXer","tags":["user-interface"],"speakerIds":["chrissy-welsh"],"eventId":"jsconf-eu-2013","id":37},{"videoId":"8skJbjEh9SY","title":"HTML5 audio sprites -- Holy Grail or Programmers Hell","tags":["audio","html5","performance"],"speakerIds":["michal-biniek"],"eventId":"jsconf-eu-2013","id":38},{"videoId":"NjMOSg5Pe44","title":"Javascript Crypto. Ugly duckling with good reason?","tags":["cryptography"],"speakerIds":["martin-bosslet"],"eventId":"jsconf-eu-2013","id":39},{"videoId":"k44lq8ImleE","title":"Sagascript - JS at the forefront of emerging storytelling","tags":["community"],"speakerIds":["astrid-bin"],"eventId":"jsconf-eu-2013","id":40},{"videoId":"04DOp1F9Od4","title":"JavaScript for Everybody","speakerIds":["marcy-sutton"],"tags":["javascript"],"eventId":"jsconf-eu-2014","id":41},{"videoId":"SmZ9XcTpMS4","title":"The ServiceWorker is coming, look busy","tags":["service-worker"],"speakerIds":["jake-archibald"],"eventId":"jsconf-eu-2014","id":42},{"videoId":"8aGhZQkoFbQ","title":"What the heck is the event loop anyway?","tags":["javascript","event-loop"],"speakerIds":["philip-roberts"],"eventId":"jsconf-eu-2014","id":43},{"videoId":"sS5EByZm1EI","title":"Got Make?","tags":["automation"],"speakerIds":["rob-ashton"],"eventId":"jsconf-eu-2014","id":44},{"videoId":"cqtBpCqgOgM","title":"Using the web for music production and for live performances","tags":["audio"],"speakerIds":["jan-monschke"],"eventId":"jsconf-eu-2014","id":45},{"videoId":"v34CEyqVEuM","title":"JavaScript Level 9000","tags":["javascript"],"speakerIds":["christoph-martens"],"eventId":"jsconf-eu-2014","id":46},{"videoId":"X2ZlDrx6dAw","title":"Web-based data visualization on mobile devices","tags":["mobile","html5","visualization"],"speakerIds":["dominikus-baur"],"eventId":"jsconf-eu-2014","id":47},{"videoId":"QX0eauXBKwc","title":"We Will All Be Game Programmers","tags":["games"],"speakerIds":["hunter-loftis"],"eventId":"jsconf-eu-2014","id":48},{"videoId":"d1HM-9reFAE","title":"The Meaning of Words","tags":["language"],"speakerIds":["stephan-seidt"],"eventId":"jsconf-eu-2014","id":49},{"videoId":"-thLNvxFUu4","title":"This is bigger than us: Building a future for Open Source","tags":["community"],"speakerIds":["lena-reinhard"],"eventId":"jsconf-eu-2014","id":50},{"videoId":"xSIt6h_yjH0","title":"Secure Crypto for Browser Based Apps","tags":["cryptography"],"speakerIds":["brennan-novak"],"eventId":"jsconf-eu-2014","id":51},{"videoId":"tia6iP85Zuk","title":"Nerd Disco","tags":["audio","node.js"],"speakerIds":["tim-pietrusky"],"eventId":"jsconf-eu-2014","id":52},{"videoId":"XcS-LdEBUkE","title":"Practical functional programming: pick two","tags":["functional"],"speakerIds":["james-coglan"],"eventId":"jsconf-eu-2014","id":53},{"videoId":"F2cL4EOAztk","title":"JavaScript in JavaScript: Inception","tags":["language"],"speakerIds":["adrian-perez-de-castro"],"eventId":"jsconf-eu-2014","id":54},{"videoId":"Ls27mCiYsQo","title":"Parallel JavaScript","tags":["hardware","language"],"speakerIds":["jaswanth-sreeram"],"eventId":"jsconf-eu-2014","id":55},{"videoId":"_A_FdbTkp9c","title":"Why are there so many Javascript charting libraries?!?","tags":["data-visualization"],"speakerIds":["dan-mane"],"eventId":"jsconf-eu-2014","id":56},{"videoId":"v0TFmdO4ZP0","title":"JavaScript Masterclass","speakerIds":["angelina-fabbro"],"tags":["javascript"],"eventId":"jsconf-us-2013","id":57},{"videoId":"u6cjYhKslD4","title":"Perf the web forward!","speakerIds":["john-david-dalton"],"tags":["performance"],"eventId":"jsconf-us-2013","id":58},{"videoId":"V2Q13hzTGmA","title":"Boom, Promises/A+ Was Born","speakerIds":["domenic-denicola"],"tags":["design-patterns"],"eventId":"jsconf-us-2013","id":59},{"videoId":"B6X83J2Dv8E","title":"Master the Command Line with Node.js","speakerIds":["filip-maj","michael-brooks"],"tags":["node.js"],"eventId":"jsconf-us-2013","id":60},{"videoId":"kdgrpc0Udlw","title":"JavaScript Journalism","speakerIds":["ray-daly"],"tags":["javascript"],"eventId":"jsconf-us-2013","id":61},{"videoId":"UJHOzE28pKg","title":"Mass Hysteria: Clients and Servers, Living Together","speakerIds":["jed-schmidt"],"tags":["language","client-server"],"eventId":"jsconf-us-2013","id":62},{"videoId":"r1A1VR0ibIQ","title":"NG-Conf 2014 Opening Keynote","speakerIds":["misko-hevery","brad-green"],"tags":["angular","keynote"],"eventId":"ng-conf-2014","id":63},{"videoId":"tnXO-i7944M","title":"AngularJS in 20ish Minutes","speakerIds":["dan-wahlin"],"tags":["angular"],"eventId":"ng-conf-2014","id":64},{"videoId":"62RvRQuMVyg","title":"Writing a Massive Angular App","speakerIds":["rachel-dale","ido-sela","jeremy-elbourn"],"tags":["angular"],"eventId":"ng-conf-2014","id":65},{"videoId":"XcRdO5QVlqE","title":"Going Postal with Angular in Promises","speakerIds":["christian-lilley"],"tags":["angular","promises","design-patterns"],"eventId":"ng-conf-2014","id":66},{"videoId":"UMkd0nYmLzY","title":"Deep Dive into Custom Directives","speakerIds":["dave-smith"],"tags":["angular","directives"],"eventId":"ng-conf-2014","id":67},{"videoId":"JLij19xbefI","title":"Progressive Saving","speakerIds":["john-papa"],"tags":["angular"],"eventId":"ng-conf-2014","id":68},{"videoId":"0V8fQoqQLLA","title":"Rapid Prototyping with Angular & Deployd","speakerIds":["jeff-cross"],"tags":["angular"],"eventId":"ng-conf-2014","id":69},{"videoId":"JfykD-0tpjI","title":"Rich Data Models & Angular","speakerIds":["ben-teese"],"tags":["angular","models"],"eventId":"ng-conf-2014","id":70},{"videoId":"YbyZdFA6Qt4","title":"Angular === Community","speakerIds":["igor-minar"],"tags":["angular","community"],"eventId":"ng-conf-2014","id":71},{"videoId":"_OGGsf1ZXMs","title":"Dependency Injection","speakerIds":["vojta-jina"],"tags":["angular","design-patterns"],"eventId":"ng-conf-2014","id":72},{"videoId":"aQipuiTcn3U","title":"End to End Angular Testing with Protractor","speakerIds":["julie-ralph"],"tags":["angular","testing","protractor"],"eventId":"ng-conf-2014","id":73},{"videoId":"u6TeBM_SC8w","title":"How to use Typescript on your Angular Application and Be Happy","speakerIds":["sean-hess"],"tags":["angular","typescript"],"eventId":"ng-conf-2014","id":74},{"videoId":"e4yUTkva_FM","title":"Building Realtime Apps With Firebase and Angular","speakerIds":["anant-narayanan"],"tags":["angular","firebase"],"eventId":"ng-conf-2014","id":75},{"videoId":"4yulGISBF8w","title":"Angular and RequireJS","speakerIds":["thomas-burleson"],"tags":["angular","require"],"eventId":"ng-conf-2014","id":76},{"videoId":"NTPutZ99XWY","title":"Angular with Browserify","speakerIds":["ben-clinkinbeard"],"tags":["angular","browserify"],"eventId":"ng-conf-2014","id":77},{"videoId":"wVntVkRLR3M","title":"Using AngularJS to create iPhone & Android applications with PhoneGap","speakerIds":["daniel-zen"],"tags":["angular","mobile"],"eventId":"ng-conf-2014","id":78},{"videoId":"MhVgGE-pgEY","title":"Robotics powering interfaces with AngularJS to the Arduino","speakerIds":["ari-lerner"],"tags":["angular","hardware"],"eventId":"ng-conf-2014","id":79},{"videoId":"zyYpHIOrk_Y","title":"Angular Performance","speakerIds":["karl-seamon"],"tags":["angular","performance"],"eventId":"ng-conf-2014","id":80},{"videoId":"QHulaj5ZxbI","title":"NG-Conf 2015 Keynote Day 1","speakerIds":["brad-green","igor-minar"],"tags":["angular","keynote"],"eventId":"ng-conf-2015","id":81},{"videoId":"-dMBcqwvYA0","title":"NG-Conf 2015 Keynote Day 2","speakerIds":["rado-kirov"],"tags":["angular","keynote"],"eventId":"ng-conf-2015","id":82},{"videoId":"ihAeffWJEIc","title":"State of Angular 1","speakerIds":["pawel-kozlowski","lucas-galfaso"],"tags":["angular"],"eventId":"ng-conf-2015","id":83},{"videoId":"M_Wp-2XA9ZU","title":"ng-wat","speakerIds":["shai-reznik"],"tags":["angular","documentation"],"eventId":"ng-conf-2015","id":84},{"videoId":"PV_cFx29Xz0","title":"Javascript sucks and it doesn't matter","speakerIds":["rob-ashton"],"tags":["javascript"],"eventId":"devday-2012","id":85},{"videoId":"kK--WKlng74","title":"Yeoman Bower and Grunt - Building Modern Webapps With Ease","speakerIds":["shai-reznik"],"tags":["yeoman","bower","grunt","node.js","automation"],"eventId":"gdg-tel-aviv","id":86}]
},{}]},{},[2]);
