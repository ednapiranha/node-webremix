'use strict'

// Generate Soundcloud iframe
const SERVICE_SOUNDCLOUD = /soundcloud\.com\/[A-Z0-9-_]+\/[A-Z0-9-_]+/gi
const request = require('request')
const qs = require('querystring')

exports.process = function (media, remix, callback) {
  setImmediate(() => {
    if (!remix.isMatched && media.match(SERVICE_SOUNDCLOUD)) {
      let params = {
        format: 'json',
        url: media
      }

      request.get('http://soundcloud.com/oembed?' + qs.stringify(params), (err, resp, body) => {
        if (err) {
          callback(null, remix)
        } else {
          try {
            let jsonResp = JSON.parse(body)
            if (jsonResp.html) {
              remix.isMatched = true
              jsonResp.html = jsonResp.html.replace(/src="http:/, 'src="')
              remix.result = '<div class="object-wrapper">' + jsonResp.html + '</div>'
              callback(null, remix)
            } else {
              callback(null, remix)
            }
          } catch (error) {
            callback(null, remix)
          }
        }
      })
    } else {
      callback(null, remix)
    }
  })
}
