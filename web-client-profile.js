// Copyright (C) 2012 Aphex Consulting Oy
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy of this
// software and associated documentation files (the "Software"), to deal in the Software
// without restriction, including without limitation the rights to use, copy, modify, merge,
// publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons
// to whom the Software is furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all copies or
// substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
// INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
// PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
// FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
// DEALINGS IN THE SOFTWARE.

/*
TODO:
  - different browsers and browser versions
  - screen resolution, bpp, etc.
  - has physical keyboard? has mouse?
  - laptop/desktop? pad? phone?
  - dpi: implement this: http://stackoverflow.com/questions/1713771/how-to-detect-page-zoom-level-in-all-modern-browsers
    also: http://stackoverflow.com/questions/7702759/how-to-detect-page-zoom-level-in-ie-8
  - booleans: xhdpi, hdpi, mdpi, ldpi (follow the Android spec)
  - Also something similar to Android screen sizes (xlarge, large, normal, small)
  - Add classes to the <html> tag, if requested, to allow using css to change how the page displays in different environments (this could be a plugin)
*/

function $ready(priority, handler) {
  if (typeof priority == 'function') {
    handler = priority;
    priority = 0;
  }
  if ($ready.isReady) {
    handler($ready.clientProfile);
  } else {
    $ready.handlers.push({priority:priority, handler:handler});
  }
}

if (!!$) $.webClientReady = $ready; 

function Version(str) {
  this.value = str;
  
  var arr = str.split('.');
  for(var i = 0; i < arr.length; i++) arr[i] = parseInt(arr[i]);
  this.getArray = function() { return arr; }
  
  var fl = parseFloat(str);
  this.getFloat = function() { return fl; }
  
  // Python has sys.hexversion that is 0x02040300 for Python 2.4.3, let's imitate that.
  // It makes checks like v1.hex > v2.hex possible.
  // TODO: make new Version(0x02040300) work
  var hex = (arr.length>0?arr[0]:0) * 0x01000000 +
             (arr.length>1?arr[1]:0) * 0x010000 +
             (arr.length>2?arr[2]:0) * 0x0100 +
             (arr.length>3?arr[3]:0);
  this.getHex = function() { return hex; }
}
function compareVersions(_v1, _v2) {
  var v1 = _v1.split('.');
  var v2 = _v2.split('.');
  for(var i = 0; i < v1.length && i < v2.length; i++) {
    if (v1[i] > v2[i]) return 1;
    else if (v1[i] < v2[i]) return -1;
  }
  
  // equal!
  if (v1.length == v2.length) return 0;
  
  // 2.1.1 is considered newer than 2.1
  if (v1.length > v2.length) return 1;
  else return -1;
}

Version.prototype.sameOrNewer = function(other) {
  return compareVersions(this.value, other) >= 0;
}
Version.prototype.sameOrOlder = function(other) {
  return compareVersions(this.value, other) <= 0;
}
Version.prototype.newerThan = function(other) {
  return compareVersions(this.value, other) > 0;
}
Version.prototype.olderThan = function(other) {
  return compareVersions(this.value, other) < 0;
}

var ua = navigator.userAgent;
var ualc = ua.toLowerCase();

// Initialize the clientProfile
$ready.handlers = []
$ready.isReady = false;
$ready.clientProfile = {};

// PhoneGap
if (Object.prototype.hasOwnProperty.call(window, '_cordovaExec')) $ready.clientProfile.isPhoneGap = true;
if ($ready.clientProfile.isPhoneGap) {
  $ready.clientProfile.phoneGap = device;
  $ready.clientProfile.platform = device.platform;
}

// Android
if ($ready.clientProfile.isPhoneGap) {
  if (device.platform == 'Android') {
    $ready.clientProfile.isAndroid = true; 
    $ready.clientProfile.androidVersion = new Version(device.version);
  }
} else {
  if (ualc.match(/android/)) {
    $ready.clientProfile.isAndroid = true; 
    $ready.clientProfile.androidVersion = new Version(/Android ([^;]+)/.exec(ua)[1]);
  }
}

// iOS (iPhone, iPad, iPod)
if (ualc.match(/iphone/)) $ready.clientProfile.isIphone = true;
if (ualc.match(/ipad/)) $ready.clientProfile.isIpad = true;
if (ualc.match(/ipod/)) $ready.clientProfile.isIpod = true; // not tested

if ($ready.clientProfile.isPhoneGap) {
  if (device.platform == 'iPhone') {
    $ready.clientProfile.isIOS = true;
    $ready.clientProfile.iOSVersion = new Version(device.version);
  }
} else {
  if ($ready.clientProfile.isIphone || $ready.clientProfile.isIpad || $ready.clientProfile.isIpod) $ready.clientProfile.isIOS = true;  
}

// Mobile features
if ($ready.clientProfile.isAndroid || $ready.clientProfile.isIOS) $ready.clientProfile.isMobile = true; // TODO: Nokia, RIM, etc.
else $ready.clientProfile.isUnknown = true;

$ready.clientProfile.screen = {
  width: screen.width,
  height: screen.height,
  aspectRatio: screen.width / screen.height,
  dpi: parseInt(getComputedStyle(document.documentElement,null).width) / document.documentElement.clientWidth
}
$ready.clientProfile.input = {
  // source for the following: http://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript
  touch: !!('ontouchstart' in window) // works on most browsers 
        || !!('onmsgesturechange' in window), // works on ie10
};

// Handle different ready-events correctly
$ready.readyEvent = function(source) {
  
  if ($ready.clientProfile.isPhoneGap && source === 'device') $ready.ready();
  else if (!$ready.isReady) $ready.ready();
}

// Call all handlers and mark the device as ready
$ready.ready = function() {
  $ready.handlers.sort(function(a,b) { return b.priority - a.priority; });
  for(var i = 0; i < $ready.handlers.length; i++) $ready.handlers[i].handler($ready.clientProfile);
  $ready.handlers = [];
  $ready.isReady = true;
}

document.addEventListener("deviceready", function() { $ready.readyEvent('device'); }, false);
document.addEventListener("DOMContentLoaded", function() { $ready.readyEvent('dom'); }, false);
