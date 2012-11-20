/*
TODO:
  - support jQuery, like $.ready() oslt, but only if jQuery has been loaded already
  - screen resolution, bpp, etc.
  - has physical keyboard? has mouse?
  - laptop/desktop? pad? phone?
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

function Version(str) {
  this.arr = str.split('.');
  this.float = parseFloat(str);
  this.value = str;
  // Python has sys.hexversion that is 0x02040300 for Python 2.4.3, let's imitate that.
  // It makes checks like v1.hex > v2.hex possible.
  // TODO: make new Version(0x02040300) work
  this.hex = (this.arr.length>0?this.arr[0]:0) * 0x01000000 +
             (this.arr.length>1?this.arr[1]:0) * 0x010000 +
             (this.arr.length>2?this.arr[2]:0) * 0x0100 +
             (this.arr.length>3?this.arr[3]:0);
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

// Detect the clientProfile
$ready.handlers = []
$ready.isReady = false;
$ready.clientProfile = {
  isPhoneGap: Object.prototype.hasOwnProperty.call(window, '_cordovaExec'),
  isAndroid: ualc.match(/android/),
  isIphone: ualc.match(/iphone/),
  isIpad: ualc.match(/ipad/)
}
if ($ready.clientProfile.isAndroid) {
  $ready.clientProfile.androidVersion = new Version(/Android ([^;]+)/.exec(ua)[1]);
}
$ready.clientProfile.isIOS = $ready.clientProfile.isIphone || $ready.clientProfile.isIpad;
$ready.clientProfile.isMobile = $ready.clientProfile.isAndroid || $ready.clientProfile.isIOS; // TODO: Nokia, RIM, etc.
$ready.screen = {
  touch: $ready.isMobile,
}

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
