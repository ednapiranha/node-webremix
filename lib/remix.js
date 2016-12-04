'use strict';

const matchYoutube = require('./remixes/youtube')
const matchVimeo = require('./remixes/vimeo')
const matchSoundCloud = require('./remixes/soundcloud')
const matchImage = require('./remixes/image')
const matchInstagram = require('./remixes/instagram')
const matchLink = require('./remixes/link')

const DEFAULT_VIDEO_HEIGHT = 295
const DEFAULT_VIDEO_WIDTH = 525

const escapeHtml = function (text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

/* Pattern match for the embedded media
 * Requires: media string
 * Returns: embedded media or the original string if nothing matches
 */
const checkRemixes = function (media, remix, options, callback) {
  remix = matchYoutube.process(media, remix,
          { width: options.width || DEFAULT_VIDEO_WIDTH, height: options.height || DEFAULT_VIDEO_HEIGHT })
  remix = matchVimeo.process(media, remix,
          { width: options.width || DEFAULT_VIDEO_WIDTH, height: options.height || DEFAULT_VIDEO_HEIGHT })
  remix = matchImage.process(media, remix)
  remix = matchInstagram.process(media, remix)

  if (!remix.isMatched) {
    matchLink.process(media, remix, (err, result) => {
      if (err) {
        callback(err)
      } else {
        callback(null, result)
      }
    })
  } else {
    callback(null, remix.result)
  }
}

/* Embed media if it matches any of the following:
 * 1. Is a Youtube link
 * 2. Is a Vimeo link
 * 3. Is an Instagram link
 * 5. Is a url with a jpg|jpeg|png|gif extension
 * 6. Is a regular link
 *
 * Requires: media string, callback
 * Returns: embedded media or the original string if nothing matches
 */
exports.process = function (media, options, callback) {
  if (!media) {
    callback(null, '')
  } else {
    media = escapeHtml(media)

    setImmediate(function () {
      let remix = {
        isMatched: false,
        result: media
      }

      matchSoundCloud.process(media, remix, (errSndCld, remix) => {
        if (errSndCld) {
          callback(errSndCld)
        } else {
          if (!remix.isMatched) {
            checkRemixes(media, remix, options, callback)
          } else {
            callback(null, remix.result)
          }
        }
      })
    })
  }
}
