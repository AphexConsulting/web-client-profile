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

## Ready handlers

The ready handlers are called (in priority order) when the environment is ready for action.

When registering a handler, it is possible to give the handler a priority number, and the handlers will be
called in priority order. The smaller the priority, the earlier the handler will be called.

A handler can also be asynchronous. This will be detected by the library from the amount of arguments the function
takes. To make an asynchronous handler, you should make your handler take two arguments, first the `clientProfile` and
then the `next` handler, which you should call when your asynchronous handler is done. **Note!** If you forget to call
the `next` handler, none of the following handlers will ever be called, so be careful and make sure it is called even in
error conditions.

If you want to make an environment specific ready-handler that makes sure that your code will be run only after a specific
asynchronous thing has happened, you should give it a priority of `-Infinity` and make it asynchronous. This way all the
code on your web page will start running only after your handler has called it's `next` argument.

Here's an example with three handlers that will be called in order, one of which is an asynchronous handler:
```JavaScript
$ready(function(profile) {
  console.log('handler 1');
});
$ready(function(profile, next) {
  $('#data').text(JSON.stringify(profile))
  console.log('profile', profile)
  setTimeout(function() {
    console.log('Calling next now...');
    next();
  }, 1000);
})
$ready(function(profile) {
  console.log('handler 2');
});
```

Here is an example that waits for [lawnchair](http://brian.io/lawnchair/)'s database to become ready before running the rest of the app code:
```JavaScript
var store;
$ready(-Infinity, function(profile, next) {
  store = new lawnchair({name:'testing'}, function(store) {
    next();
  });
});
```

# License

The library is licensed under the MIT-license:

> Copyright (C) 2012 Aphex Consulting Oy

> Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

> The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

