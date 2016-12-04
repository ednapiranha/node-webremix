'use strict'

const remix = require('./lib/remix')

exports.generate = function (content, options, callback) {
  let contentArr = content.split(/\s/)
  var finalContent = []

  if (!callback) {
    callback = options
    options = {}
  }

  contentArr.forEach((content, idx) => {
    setTimeout(() => {
      remix.process(content, options, (err, resp) => {
        if (err) {
          callback(err)
        } else {
          finalContent.push({ id: idx, message: resp })
        }

        if (finalContent.length === contentArr.length) {
          var messageArr = []

          finalContent = finalContent.sort((a, b) => {
            return parseInt(a.id, 10) - parseInt(b.id, 10)
          })

          finalContent.forEach((m) => {
            messageArr.push(m.message)
          })

          callback(null, messageArr.join(' '))
        }
      })
    }, 0)
  })
}
