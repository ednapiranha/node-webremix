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
          'src="https://www.youtube.com/embed/5cazkHAHiPU?wmode=transparent" ' +
          'frameborder="0" allowfullscreen></iframe></div>')
        done()
      })
    })

    it('returns embed code for a youtube normal url', (done) => {
      let youtube = 'http://www.youtube.com/watch?v=5cazkHAHiPU'
      webRemix.generate(youtube, (_, subject) => {
        subject.should.equal('<div class="object-wrapper"><iframe width="525" height="295" ' +
          'src="https://www.youtube.com/embed/5cazkHAHiPU?wmode=transparent" ' +
          'frameborder="0" allowfullscreen></iframe></div>')
        done()
      })
    })
  })

  describe('vimeo', () => {
    it('returns embed code for a vimeo video url', (done) => {
      let vimeo = 'http://vimeo.com/37872583'
      webRemix.generate(vimeo, (_, subject) => {
        subject.should.equal('<div class="object-wrapper"><iframe src="https://player.vimeo.com/video/37872583" width="525" height="295" ' +
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

  describe('link', () => {
    it('returns an invalid link', (done) => {
      let link = 'shttp://spoop.com'
      let n = nock('spoop.com').get('shttp://spoop.com').reply(200,
        { html: 'shttp://spoop.com' })
      webRemix.generate(link, (_, subject) => {
        subject.should.equal('shttp://spoop.com')
        done()
      })
    })
  })

  let htmlInstaBlock = '<blockquote class="instagram-media" data-instgrm-version="7" ' +
    'style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 ' +
    'rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:658px; padding:0; ' +
    'width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"><div ' +
    'style="padding:8px;"> <div style=" background:#F8F8F8; line-height:0; margin-top:40px; ' +
    'padding:50.0% 0; text-align:center; width:100%;"> <div style=" ' +
    'background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAMAAAApWqozAAAABG' +
    'dBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAMUExURczMzPf399fX1+bm5mzY9AMAAADiSURBVDjLvZXbEsMgC' +
    'ES5/P8/t9FuRVCRmU73JWlzosgSIIZURCjo/ad+EQJJB4Hv8BFt+IDpQoCx1wjOSBFhh2XssxEIYn3ulI/6MNRe' +
    'E07UIWJEv8UEOWDS88LY97kqyTliJKKtuYBbruAyVh5wOHiXmpi5we58Ek028czwyuQdLKPG1Bkb4NnM+VeAnfH' +
    'qn1k4+GPT6uGQcvu2h2OVuIf/gWUFyy8OWEpdyZSa3aVCqpVoVvzZZ2VTnn2wU8qzVjDDetO90GSy9mVLqtgYSy2' +
    '31MxrY6I2gGqjrTY0L8fxCxfCBbhWrsYYAAAAAElFTkSuQmCC); display:block; height:44px; margin:0 ' +
    'auto -44px; position:relative; top:-22px; width:44px;"></div></div><p style=" ' +
    'color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; line-height:17px; ' +
    'margin-bottom:0; margin-top:8px; overflow:hidden; padding:8px 0 7px; text-align:center; ' +
    'text-overflow:ellipsis; white-space:nowrap;"><a href="https://www.instagram.com/p/BNm2WJhBpf2/"' +
    ' style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; font-style:normal; ' +
    'font-weight:normal; line-height:17px; text-decoration:none;" target="_blank">A video posted ' +
    'by Year Unknown (@yearunknown)</a> on <time style=" font-family:Arial,sans-serif; ' +
    'font-size:14px; line-height:17px;" datetime="2016-12-04T19:30:24+00:00">Dec 4, 2016 at 11:30am' +
    ' PST</time></p></div></blockquote>\n<script async defer src="//platform.instagram.com/en_US/' +
    'embeds.js"></script>'

  describe('instagram', () => {
    it('returns image embed for an instagram url', (done) => {
      let instagram = 'https://www.instagram.com/p/BNm2WJhBpf2/'
      let n = nock('http://api.instagram.com').get('/oembed?url=https%3A%2F%2Fwww.instagram.com%2Fp%2FBNm2WJhBpf2%2F')
                                              .reply(200, { html: htmlInstaBlock })
      webRemix.generate(instagram, (_, subject) => {
        subject.should.equal('<div class="object-wrapper">' + htmlInstaBlock + '</div>')
        done()
      })
    })
  })

  describe('variety mix', () => {
    it('returns a mix of text and links', (done) => {
      let instagram = 'https://www.instagram.com/p/BNm2WJhBpf2/'
      let n = nock('http://api.instagram.com').get('/oembed?url=https%3A%2F%2Fwww.instagram.com%2Fp%2FBNm2WJhBpf2%2F')
                                              .reply(200, { html: htmlInstaBlock })
      let mix = instagram + ' bunnies'
      webRemix.generate(mix, (_, subject) => {
        subject.should.equal('<div class="object-wrapper">' + htmlInstaBlock + '</div> bunnies')
        done()
      })
    })

    it('returns escaped text and links', (done) => {
      let mix = '<script>alert("omg");</script> bunnies'
      webRemix.generate(mix, (_, subject) => {
        subject.should.equal('&lt;script&gt;alert("omg");&lt;/script&gt; bunnies')
        done()
      })
    })
  })
})
