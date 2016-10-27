# img-animate directive

Animates a sequence of images in a loop.

This module uses 2 services: 
preloader and imgAnimate

The preloader will preload all images before launching the animation. If one image fails to load the animation will be aborted.
The preloading starts on `window.onload` so the animation will not impact the page loading/rendering.

Note: does not support multiple instances

## Getting started

```
bower install https://github.com/Dcode-Evo/img-animation.git --save-dev
```

Simple as 1, 2, 3

### 1. Include the module dependency to your app

```js
app = angular.module('testApp', [
	'imgAnimation'
]);
```

### 2. Use it in html

```html
<body ng-app="testApp">
	...
	<div class="anim" img-animation duration="2500" start="startAnim">
		<img class="static" src="images/0001.png" alt=" "/>
		<anim-frame ng-repeat="n in [] | animFrames:32" src="{{ 'images/' + n + '.png'}}"></anim-frame>
	</div>
	...
</body>

```

### 3. CSS

This is written in SCSS (SASS) 

```scss
$img-width: 200px;
$img-height: 200px;

#anim-container {
	position: relative;
	width: $img-width; // the size of the image:
	height: $img-height; // you have to set it to avoid the browser to recalculate all on each frame
	
	img {
		display: none; // this is hidden cause the frame is not active
		position: absolute;
		top: 0;
		left: 0;
		width: $img-width; // the size of the image:
		height: $img-height; // you have to set it to avoid the browser to recalculate all on each frame
		
		&.active, &.static { // active/visible frame
			display: block;
		}
	}
}
```

## Attributes (Parameters)
- **startAnim**: {bool}, the animation will start if true, stop if false
- **duration**: {int} milliseconds, if you have 25 images and want the animation last 1 second set this parameter to 1000
	- default (2000)
- **mobile**: false (default), disables the animation on screens smaller than 786px of width
	- true: enables the animation on mobiles
- **loop**: {bool|string}
	- "reverse" (default) : will animate 0 -> 25 -> 0 -> 25 -> ... 
	- true: wille animate 0 -> 25, 0 -> 25, 0 -> 25, ...
	- false: not implemented yet