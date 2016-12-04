/* global describe it */
'use strict'

process.env.NODE_ENV = 'test'

const nock = require('nock')
const should = require('should')
const webRemix = require('../index')

describe('webremix', () => {
  describe('youtube', () => {
    it('returns embed code for a youtu.be short url', (done) => {
      let youtube = 'http://youtu.be/5cazkHAHiPU'
      webRemix.generate(youtube, (_, subject) => {
        subject.should.equal('<div class="object-wrapper"><iframe width="525" height="295" ' +
          'src="http://www.youtube.com/embed/5cazkHAHiPU?wmode=transparent" ' +
          'frameborder="0" allowfullscreen></iframe></div>')
        done()
      })
    })

    it('returns embed code for a youtube normal url', (done) => {
      let youtube = 'http://www.youtube.com/watch?v=5cazkHAHiPU'
      webRemix.generate(youtube, (_, subject) => {
        subject.should.equal('<div class="object-wrapper"><iframe width="525" height="295" ' +
          'src="http://www.youtube.com/embed/5cazkHAHiPU?wmode=transparent" ' +
          'frameborder="0" allowfullscreen></iframe></div>')
        done()
      })
    })
  })

  describe('vimeo', () => {
    it('returns embed code for a vimeo video url', (done) => {
      let vimeo = 'http://vimeo.com/37872583'
      webRemix.generate(vimeo, (_, subject) => {
        subject.should.equal('<div class="object-wrapper"><iframe src="//player.vimeo.com/video/37872583" width="525" height="295" ' +
          'frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe></div>')
        done()
      })
    })
  })

  describe('soundcloud', () => {
    it('returns oembed code for a soundcloud url', (done) => {
      let soundcloud = 'http://soundcloud.com/skeptical/sets/tracks-576/'
      let htmlBlock = '<iframe src="//w.soundcloud.com/player/' +
          '?url=http%3A%2F%2Fapi.soundcloud.com%2Fplaylists%2F723408&amp;show_artwork=true" frameborder="no" ' +
          'height="450" scrolling="no" width="100%"></iframe><a class="media-link" target="_blank" ' +
          'href="http://soundcloud.com/skeptical/sets/tracks-576/">http://soundcloud.com/skeptical/sets/' +
          'tracks-576/</a><a href="http://soundcloud.com/skeptical/sets/tracks-576/" target="_blank" ' +
          'class="media-off" >http://soundcloud.com/skeptical/sets/tracks-576/</a>'
      nock('http://soundcloud.com').get('/oembed?format=json&url=http%3A%2F%2Fsoundcloud.com%2Fskeptical%2Fsets%2Ftracks-576%2F')
                                   .reply(200, { html: htmlBlock })
      webRemix.generate(soundcloud, (_, subject) => {
        subject.should.equal('<div class="object-wrapper">' + htmlBlock + '</div>')
        done()
      })
    })
  })

  describe('link', () => {
    it('returns a regular link', (done) => {
      let link = 'http://spoop.com'
      let n = nock('spoop.com').get('http://spoop.com').reply(200,
        { html: '<a href="http://spoop.com" target="_blank">http://spoop.com</a>' })
      webRemix.generate(link, (_, subject) => {
        subject.should.equal('<a href="http://spoop.com" target="_blank">http://spoop.com</a>')
        done()
      })
    })
  })

  describe('instagram', () => {
    it('returns image code for an instagr.am url', (done) => {
      let instagram = 'http://instagram.com/p/QFJJzTw8yS/'
      webRemix.generate(instagram, (_, subject) => {
        subject.should.equal('<div class="image-wrapper"><a href="http://instagram.com/p/QFJJzTw8yS/" target="_blank">' +
          '<img src="http://instagr.am/p/QFJJzTw8yS/media/"/></a></div>')
        done()
      })
    })
  })

  describe('variety mix', () => {
    it('returns a mix of text and links', (done) => {
      var mix = 'http://instagram.com/p/QFJJzTw8yS/ bunnies'
      webRemix.generate(mix, (_, subject) => {
        subject.should.equal('<div class="image-wrapper"><a href="http://instagram.com/p/QFJJzTw8yS/" target="_blank">' +
          '<img src="http://instagr.am/p/QFJJzTw8yS/media/"/></a></div> bunnies')
        done()
      })
    })

    it('returns escaped text and links', (done) => {
      let mix = '<script>alert("omg");</script> http://instagram.com/p/QFJJzTw8yS/ bunnies'
      webRemix.generate(mix, (_, subject) => {
        subject.should.equal('&lt;script&gt;alert("omg");&lt;/script&gt; <div class="image-wrapper">' +
          '<a href="http://instagram.com/p/QFJJzTw8yS/" target="_blank">' +
          '<img src="http://instagr.am/p/QFJJzTw8yS/media/"/></a></div> bunnies')
        done()
      })
    })
  })
})
