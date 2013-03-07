'use strict';

var nock = require('nock');
var should = require('should');
var webRemix = require('../index');

describe('webremix', function() {
  describe('.generate',  function() {
    it('returns embed code for a youtu.be short url', function(done) {
      var youtube = 'http://youtu.be/5cazkHAHiPU';
      webRemix.generate(youtube, function(err, subject) {
        subject.should.equal('<div class="object-wrapper"><iframe width="525" height="295" ' +
          'src="//www.youtube.com/embed/5cazkHAHiPU?wmode=transparent" ' +
          'frameborder="0" allowfullscreen></iframe></div>');
        done();
      });
    });

    it('returns embed code for a youtube normal url', function(done) {
      var youtube = 'http://www.youtube.com/watch?v=5cazkHAHiPU';
      webRemix.generate(youtube, function(err, subject) {
        subject.should.equal('<div class="object-wrapper"><iframe width="525" height="295" ' +
          'src="//www.youtube.com/embed/5cazkHAHiPU?wmode=transparent" ' +
          'frameborder="0" allowfullscreen></iframe></div>');
        done();
      });
    });

    it('returns embed code for a vimeo video url', function(done) {
      var vimeo = 'http://vimeo.com/37872583';
      webRemix.generate(vimeo, function(err, subject) {
        subject.should.equal('<div class="object-wrapper"><iframe src="//player.vimeo.com/video/37872583" width="525" height="295" ' +
          'frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe></div>');
        done();
      });
    });

    it('returns oembed code for a soundcloud url', function() {
      var soundcloud = 'http://soundcloud.com/skeptical/sets/tracks-576/';
      var scope = nock('soundcloud.com').get('/oembed?format=json&url=http//soundcloud.com/track').reply(200,
          { html: '<iframe src="//w.soundcloud.com/player/?url=http%3A' +
          '%2F%2Fapi.soundcloud.com%2Fplaylists%2F723408&amp;show_artwork=true" frameborder="no" height="450" ' +
          'scrolling="no" width="100%"></iframe><a class="media-link" target="_blank"' +
          'href="http://soundcloud.com/skeptical/sets/tracks-576/">http://soundcloud.com/skeptical/sets' +
          '/tracks-576/</a><a href="http://soundcloud.com/skeptical/sets/tracks-576/" target="_blank" class="media-off" ' +
          '>http://soundcloud.com/skeptical/sets/tracks-576/</a>' });
      webRemix.generate(soundcloud, function(err, subject) {
        subject.should.equal('<div class="object-wrapper"><iframe width="100%" height="450" scrolling="no" frameborder="no" ' +
          'src="//w.soundcloud.com/player/?url=http%3A%2F%2Fapi.soundcloud.com%2Fplaylists%2F723408&show_artwork=true">' +
          '</iframe></div>');
        done();
      });
    });

    it('returns embed code for a rd.io short url', function(done) {
      var rdio = 'http://rd.io/i/QVME9DdeW1GL';
      webRemix.generate(rdio, function(err, subject) {
        subject.should.equal('<div class="object-wrapper"><iframe class="rdio" width="525" height="295" ' +
          'src="//rd.io/i/QVME9DdeW1GL" frameborder="0"></iframe></div>');
        done();
      });
    });

    it('returns embed code for a rdio normal url', function(done) {
      var rdio = 'http://rdio.com/x/QVME9DdeW1GL';
      webRemix.generate(rdio, function(err, subject) {
        subject.should.equal('<div class="object-wrapper"><iframe class="rdio" width="525" height="295" ' +
          'src="//rd.io/i/QVME9DdeW1GL" frameborder="0"></iframe></div>');
        done();
      });
    });

    it('returns embed code for a rdio normal url with a custom width and height', function(done) {
      var rdio = 'http://rdio.com/x/QVME9DdeW1GL';
      webRemix.generate(rdio, { width: 600, height: 100 }, function(err, subject) {
        subject.should.equal('<div class="object-wrapper"><iframe class="rdio" width="600" height="100" ' +
          'src="//rd.io/i/QVME9DdeW1GL" frameborder="0"></iframe></div>');
        done();
      });
    });

    it('returns a regular link', function(done) {
      var link = 'http://poop.com';
      var scope = nock('poop.com').get('http://poop.com').reply(200,
          { html: '<a href="http://poop.com">http://poop.com</a>' });
      webRemix.generate(link, function(err, subject) {
        subject.should.equal('<a href="http://poop.com">http://poop.com</a>');
        done();
      });
    });

    it('returns image code for an instagr.am url', function(done) {
      var instagram = 'http://instagram.com/p/QFJJzTw8yS/';
      webRemix.generate(instagram, function(err, subject) {
        subject.should.equal('<div class="image-wrapper"><a href="http://instagram.com/p/QFJJzTw8yS/">' +
          '<img src="http://instagr.am/p/QFJJzTw8yS/media/"/></a></div>');
        done();
      });
    });

    it('returns a mix of text and links', function(done) {
      var mix = 'http://instagram.com/p/QFJJzTw8yS/ bunnies';
      webRemix.generate(mix, function(err, subject) {
        subject.should.equal('<div class="image-wrapper"><a href="http://instagram.com/p/QFJJzTw8yS/">' +
          '<img src="http://instagr.am/p/QFJJzTw8yS/media/"/></a></div> bunnies');
        done();
      });
    });

    it('returns escaped text and links', function(done) {
      var mix = '<script>alert("omg");</script> http://instagram.com/p/QFJJzTw8yS/ bunnies';
      webRemix.generate(mix, function(err, subject) {
        subject.should.equal('&lt;script&gt;alert("omg");&lt;/script&gt; <div class="image-wrapper">' +
          '<a href="http://instagram.com/p/QFJJzTw8yS/">' +
          '<img src="http://instagr.am/p/QFJJzTw8yS/media/"/></a></div> bunnies');
        done();
      });
    });
  });
});
