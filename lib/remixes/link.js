'use strict'

const request = require('request')

// See if this url exists
exports.process = function (media, remix, callback) {
  setTimeout(() => {
    request({
      method: 'HEAD',
      url: media,
      followAllRedirects: false
    }, (err, resp) => {
      if (err && !media.match(/^http/)) {
        callback(null, media)
      } else {
        callback(null, '<a href="' + media + '" target="_blank">' + media + '</a>')
      }
    })
  }, 0)
}
