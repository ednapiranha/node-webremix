'use strict';

// Generate image link
var SERVICE_VINE = /((vine\.co)\/\w\/)/i;

exports.process = function (media, remix, options) {
  if (!remix.isMatched && media.match(SERVICE_VINE)) {
    var parts = media.split('/');
    var shortcode = parts[parts.length - 1];

    remix.isMatched = true;

    remix.result = '<div class="object-wrapper"><iframe class="vine-embed" src="https://vine.co/v/' + shortcode + '/embed/simple" ' +
      'width="' + options.width + '" height="'  + options.height + '" frameborder="0">' +
      '</iframe><script async src="//platform.vine.co/static/scripts/embed.js" charset="utf-8"></script></div>';
  }

  return remix;
};
