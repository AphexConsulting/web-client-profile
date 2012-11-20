# web-client-profile

Detect web client features, like browser kind and version, operating system type, screen size, dpi, etc. Also support environment specific ready events (mainly PhoneGap's deviceready).

## Installing

1. Clone the repository
1. Place `web-client-profile.js` to your project's JavaScript folder
1. Use a `<script type="text/javascript" src="js/web-client-profile.js"></script>` to your HTML
1. Add a script that registers your handler function with $ready (or `$.webClientReady` if you prefer to use jQuery). It will get called when the client device is ready and will be given the profile as a parameter so you can do your conditional functionality there. For example:

```JavaScript
$ready(function(profile) {
  alert(JSON.stringify(profile))
})
```

## Versions

It's possible to compare versions in different ways. The module exports a class called `Version()` which in turn exposes the following methods:
```JavaScript
var v = new Version('1.2.3');

console.log(v.value) // -> "1.2.3"
console.log(v.getArray()) // -> [1, 2, 3]
console.log(v.getFloat()) // -> 1.2
console.log(v.getHex()) // -> 0x01020300, comparable directly with <, >, ==, <= and >=

console.log(v.sameOrNewer(new Version('1.2'))) // -> true
console.log(v.sameOrNewer(new Version('1.2.3'))) // -> true
console.log(v.sameOrNewer(new Version('1.3'))) // -> false

console.log(v.sameOrOlder(new Version('1.2'))) // -> false
console.log(v.sameOrOlder(new Version('1.2.3'))) // -> true
console.log(v.sameOrOlder(new Version('1.3'))) // -> true

console.log(v.newerThan(new Version('1.2'))) // -> true
console.log(v.newerThan(new Version('1.2.3'))) // -> false
console.log(v.newerThan(new Version('1.3'))) // -> false

console.log(v.olderThan(new Version('1.2'))) // -> false
console.log(v.olderThan(new Version('1.2.3'))) // -> false
console.log(v.olderThan(new Version('1.3'))) // -> true
```

So for example to run a piece of code in an Android browser version 2.4.1 or older, do this:
```JavaScript
$ready(function(profile) {
  if (profile.isAndroid && profile.androidVersion.sameOrOlder(new Version('2.4.1'))) {
    alert('Your Android version is too old and is not supported. Please update it if possible.');
  }
})
```


# License

The library is licensed under the MIT-license:

> Copyright (C) 2012 Aphex Consulting Oy

> Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

> The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

