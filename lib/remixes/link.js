'use strict';

var request = require('request');

// See if this url exists
exports.process = function (media, remix, callback) {
  setTimeout(function () {
    request({
      method: 'HEAD',
      url: media,
      followAllRedirects: false }, function (err, resp) {
        if (err) {
          callback(null, media);

        } else {
          callback(null, '<a href="' + media + '" target="_blank">' + media + '</a>');
        }
    });
  }, 0);
};
