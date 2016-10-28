# img-animate directive

Animates a sequence of images in a loop.

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
	'imgAnimator'
]);
```

### 2. Use it in html

```html
<body ng-app="testApp">
	...
	<div class="anim" img-animation duration="2500" start="startAnim">
		<img class="static" src="images/0001.png" alt=" "/>
		<anim-frame ng-repeat="n in [] | animFrames:42" src="{{ 'images/' + n + '.png'}}"></anim-frame>
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
	
## Directives

### img-animation

Has to be placed on the animation container.
 
The container has to contain the first frame of the animation as an `img` tag with class `static`. 
This image will be loaded with the document and will be displayed until the animation is ready to run. If the animation 
fails to load, this image will remain in place to not break your design.

### anim-frame
This directive allows to list all frames of the animation without writing it in a JS. 
It is used to parse the image path without being loaded when you open the page.

It can be added within ng-repeat using the `animFrames` filter: 
`ng-repeat="n in [] | animFrames:42"` where: 
- `42` is the exact number of animation frames
- `n` is the postfix on the image name `0001`, `0002`, ..., `0042`

In case of the ng-repeat use your images has to be named with the following pattern:  
- _whatever_0001.png (for the first frame)
- ...
- _whatever_0042.png