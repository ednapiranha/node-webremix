'use strict'

const SERVICE_INSTAGRAM = /^http(s?):\/\/(www\.?)((instagr\.am)|(instagram\.com))\/\w\/\w+/i
const request = require('request')
const qs = require('querystring')

exports.process = function (media, remix, callback) {
  setTimeout(() => {
    if (!remix.isMatched && media.match(SERVICE_INSTAGRAM)) {
      let params = {
        url: media
      }

      request.get('http://api.instagram.com/oembed?' + qs.stringify(params), (err, resp, body) => {
        if (err) {
          callback(null, remix)
        } else {
          try {
            let jsonResp = JSON.parse(body)
            if (jsonResp.html) {
              remix.isMatched = true
              remix.result = '<div class="object-wrapper">' + jsonResp.html + '</div>'
            }
            callback(null, remix)
          } catch (error) {
            callback(null, remix)
          }
        }
      })
    } else {
      callback(null, remix)
    }
  }, 0)
}
