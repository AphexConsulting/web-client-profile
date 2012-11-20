# web-client-profile

Detect web client features, like browser kind and version, operating system type, screen size, dpi, etc. Also support environment specific ready events (mainly PhoneGap's deviceready).

## Installing

1. Clone the repository
1. Place `web-client-profile.js` to your project's JavaScript folder
1. Use a `<script type="text/javascript" src="js/web-client-profile.js"></script>` to your HTML
1. Add a script that registers your handler function with $ready (or $.ready if you use jQuery). It will get called when the client device is ready and will be given the profile as a parameter so you can do your conditional functionality there.

