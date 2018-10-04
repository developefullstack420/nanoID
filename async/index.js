var crypto = require('crypto')

var url = require('../url')

var random
if (crypto.randomFill) {
  random = function (bytes, callback) {
    return crypto.randomFill(Buffer.allocUnsafe(bytes), callback)
  }
} else {
  random = crypto.randomBytes
}

/**
 * Generate secure URL-friendly unique ID. Non-blocking version.
 *
 * By default, ID will have 21 symbols to have a collision probability similar
 * to UUID v4.
 *
 * @param {number} [size=21] The number of symbols in ID.
 * @param {function} [callback] for environments without `Promise`.
 *
 * @return {Promise} Promise with random string.
 *
 * @example
 * const nanoidAsync = require('nanoid/async')
 * nanoidAsync.then(id => {
 *   model.id = id
 * })
 *
 * @name async
 * @function
 */
module.exports = function (size, callback) {
  size = size || 21

  if (!callback) {
    return new Promise(function (resolve, reject) {
      module.exports(size, function (error, id) {
        if (error) {
          reject(error)
        } else {
          resolve(id)
        }
      })
    })
  }

  random(size, function (error, bytes) {
    if (error) {
      return callback(error)
    }

    var id = ''
    while (0 < size--) {
      id += url[bytes[size] & 63]
    }

    callback(null, id)
  })
}
