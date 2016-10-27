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