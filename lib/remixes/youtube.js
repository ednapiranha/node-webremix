'use strict'

// Generate Youtube iframe
const SERVICE_YOUTUBE = /(youtube.com(?:\/#)?\/watch\?)|(youtu\.be\/[A-Z0-9-_]+)/i

exports.process = function (media, remix, options) {
  if (!remix.isMatched && media.match(SERVICE_YOUTUBE)) {
    let youtubeId = ''
    let url = media.split('/')

    try {
      remix.isMatched = true
      if (media.indexOf('youtu.be') > -1) {
        youtubeId = url[url.length - 1]
      } else {
        youtubeId = url[url.length - 1].split('v=')[1].split('&')[0]
      }

      remix.result = '<div class="object-wrapper"><iframe width="' + options.width + '" height="' +
        options.height + '" src="https://www.youtube.com/embed/' + youtubeId +
        '?wmode=transparent" frameborder="0" allowfullscreen></iframe></div>'

      return remix
    } catch (err) {
      return remix
    }
  }

  return remix
}
