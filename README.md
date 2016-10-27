# img-animate directive

Animates a sequence of images in a loop.

This module uses 2 services: 
preloader and imgAnimate

The preloader will preload all images before launching the animation. If one image fails to load the animation will be aborted.

## Getting started

### 1. Include the module dependency to your app

```js
app = angular.module('testApp', [
	'imgAnimation'
]);
```

### 2. Define the list of images
```js
$scope.images = [
	"images/0000.png",
	...
	"images/0024.png",
	"images/0025.png"
];
```

### 3. Use it in html

```html
<body ng-app="testApp">
	...
	<div ng-controller="MainCtrl">
		<div id="anim-container" img-animation images="images" start="startAnim" duration="2500">
			<img class="active" src="images/0000.png" alt=" "/> <!-- The first image to show when the animation is not started/aborted --> 
		</div>
	</div>
	...
</body>

```

### 4. CSS

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
		
		&.active { // active/visible frame
			display: block;
		}
	}
}
```

## Parameters
- **images**: {array} the list images paths
	- the name of files should be a number 0000 -> 0010 (or more)
- **startAnim**: {bool}, the animation will start if true, stop if false
- **duration**: {int} milliseconds, if you have 25 images and want the animation last 1 second set this parameter to 1000
	- default (2000)
- **loop**: {bool|string}
	- "reverse" (default) : will animate 0 -> 25 -> 0 -> 25 -> ... 
	- true: wille animate 0 -> 25, 0 -> 25, 0 -> 25, ...
	- false: not implemented yet