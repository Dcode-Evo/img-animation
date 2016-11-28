## 1.1.3
- rename attribute `src` of the anim-frame in `frame-src` 
to avoid issues with $sce.insecure when using external images.

## 1.1.2
- add class animation-play when the animation starts 
- remove anim-frame elements on img insert

## 1.1.1
- remove all `console.log` usage
- use `throw` on blocking events/errors

## 1.1.0
- refactor the module
- add mobile attribute that aborts the animation on small devices 
- add a directive for frames , no more controller needed 
- possibility to use ng-repeat to add frames 
- improve preloading of images start after all the page content was loaded, so the user see the page faster 
- some HTML refactor + css
- frame images now start from 0001 instead of 0000 so the number of frames matches the number of images

## 1.0.1
- added document.body.onload, to start preloading when the page is loaded

## 1.0.0
- initial version
- converted to a directive from the old code