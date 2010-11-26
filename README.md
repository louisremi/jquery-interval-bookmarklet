What can it do?
===============

-   Manipulate [jQuery interval property](http://api.jquery.com/jQuery.fx.interval/) and see the effects in realtime.
-   See how the interval affects the smoothness of animations.
-   Open your system monitor and see how it affects CPU usage.
Mozilla only:
-   Switch from setInterval() based animation *ticks* to [MozRequestAnimationFrame](http://hacks.mozilla.org/2010/08/more-efficient-javascript-animations-with-mozrequestanimationframe/) based animation.
-   See the difference between "how often can js run" and "how often can a frame be painted"

What will I learn?
==================

-   That decreasing the interval value doesn't really make animations smoother, especially for complex animations.
-   That your browser is always doing its best and increasing the interval is not helpful when fps is low.
-   That increasing the interval can significantly reduce CPU usage for simple to moderatly complex animations.
-   That a MozRequestAnimationFrame based animation logic is currently slower than the traditionnal setInterval based one.

Where can I get it?
==================

There's a [live demo](http://lrbabe.github.com/jquery-interval-bookmarklet/) where you can grab the bookmarklet.

There's also a [video introduction](http://www.youtube.com/watch?v=mGIl8bTN0HE) to this demo.

How do you create such animation?
=================================

Using a special branch of the [path plugin](https://github.com/lrbabe/jquery.path/tree/rotateHookDependency), combined with the [rotate cssHook](https://github.com/lrbabe/jquery.rotate.js).