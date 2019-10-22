/**
 * Secure random string generator with custom alphabet.
 *
 * Alphabet must contain 256 symbols or less. Otherwise, the generator
 * will not be secure.
 *
 * @param {asyncGenerator} random The random bytes generator.
 * @param {string} alphabet Symbols to be used in new random string.
 * @param {size} size The number of symbols in new random string.
 *
 * @return {Promise} Promise with random string.
 *
 * @example
 * const formatAsync = require('nanoid/async/format')
 *
 * function random (size) {
 *   const result = []
 *   for (let i = 0; i < size; i++) {
 *     result.push(randomByte())
 *   }
 *   return Promise.resolve(result)
 * }
 *
 * formatAsync(random, "abcdef", 5).then(id => {
 *   model.id = id //=> "fbaef"
 * })
 *
 * @name formatAsync
 * @function
 */
module.exports = function (random, alphabet, size) {
  var mask = (2 << 31 - Math.clz32((alphabet.length - 1) | 1)) - 1
  var step = Math.ceil(1.6 * mask * size / alphabet.length)

  function tick (id) {
    return random(step).then(function (bytes) {
      var i = step
      while (i--) {
        var alpha = alphabet[bytes[i] & mask]
        if (alpha) {
          id += alpha
          if (id.length === +size) return id
        }
      }
      return tick(id)
    })
  }

  return tick('')
}

/**
 * @callback asyncGenerator
 * @param {number} bytes The number of bytes to generate.
 * @return {Promise} Promise with array of random bytes.
 */
