# Nano ID

It's a very small and secure a URL-friendly unique ID generator.

```js
var nanoid = require('nanoid')
model.id = nanoid() //=> "Uakgb_J5m9g~0JDMbcJqLJ"
```

**Safe.** It uses cryptographically-strong random APIs
and tests symbols distribution.

**Small.** Only 258 bytes (minified and gzipped). Zero-dependency.

**Compact.** It uses more symbols than UUID (`A-Za-z0-9_~`) 
and has the same number of unique options in just 22 symbols instead of 36.

The generator supports Node.js and [all browsers] starting from IE 11.

[all browsers]: http://caniuse.com/#feat=getrandomvalues

<a href="https://evilmartians.com/?utm_source=nanoid">
  <img src="https://evilmartians.com/badges/sponsored-by-evil-martians.svg"
       alt="Sponsored by Evil Martians" width="236" height="54">
</a>

## Security

*See a good article about random generators theory:
[Secure random values (in Node.js)]*

### Unpredictability

Instead of unsafe `Math.random()` Nano ID uses `crypto` module in Node.js 
and Web Crypto API in browsers.

### Uniformity

`random % alphabet` is a popular mistake in ID generator. Change to get some
symbols will be lower and it will reduce amount of guesses in bruteforcing.

Nano ID uses a [better algorithm] and tests uniformity:

<img src="distribution.png" alt="Nano ID uniformity" width="340" height="135">

[Secure random values (in Node.js)]: https://gist.github.com/joepie91/7105003c3b26e65efcea63f3db82dfba
[better algorithm]: https://github.com/ai/nanoid/blob/master/format.js

## Usage

### Normal

The main module uses URL-friendly symbols (`A-Za-z0-9_~`) and returns an ID
with 22 characters (which matches uniqueness of UUID).

```js
var nanoid = require('nanoid')
model.id = nanoid() //=> "Uakgb_J5m9g~0JDMbcJqLJ"
```

Symbols such as `-,.()` aren't encoded in URL, but in the end of a link
they could be identified as a punctuation symbol.

### Custom Alphabet or Length

If you want to change the ID alphabet or the length you can use low-level `generate`
module.

```js
var generate = require('nanoid/generate')
model.id = generate('1234567890abcdef', 10) //=> "4f90d13a42"
```

If you want to use the same URL-friendly symbols pool and just change the length, 
you can use the default alphabet from `url` module:

```js
var url = require('nanoid/url')
model.id = generate(url, 10) //=> "Uakgb_J5m9"
```

### Custom Random Bytes Generator

You can replace the default safe random generator using the `format` module.
It could be useful if you need a seed-based generator.

```js
var format = require('nanoid/format')

function random (size) {
  var result = []
  for (var i = 0; i < size; i++) result.push(randomByte())
  return result
}

format(random, "abcdef", 10) //=> "fbaefaadeb"
```

`random` callback must accept an array size and return an array with random numbers.
