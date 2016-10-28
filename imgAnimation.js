'use strict';

/**
 * @ngdoc factory
 * @name img-animation
 * @description
 * # animation for a sequence of images
 */
(function (window, angular, undefined) {

	angular.module('imgAnimator', [])

		/**
		 * @ngdoc directive
		 * @name imgAnimation
		 * @description
		 * Main directive that prepares the animation
		 * when the page is completely loaded (images/css/...)
		 * it starts preloading the frames of the animation
		 * When all images are loaded it places the loaded int launcher the imgAnimationFactory
		 * If one of the frame (image) cant be loaded, the animation is aborted to avoid a missing
		 * frame make the animation blink.
		 */
		.directive('imgAnimation', ['$window', 'imgAnimationFactory', 'preloader', function ($window, imgAnimationFactory, preloader) {
			return {
				restrict: 'A',
				scope: {
					"duration": "=",
					"start": "=",
					"loop": "=",
					"mobile": "="
				},
				controller: function ($scope, $element, $attrs) {
					$scope.images = [];

					this.addImage = function (attrs) {
						$scope.images.push(attrs.src);
					};
				},

				link: function ($scope, $element, $attrs) {
					var animation;
					var init = function () {

						// if mobile="false" or not set 
						// we disable the animation on small screens
						// provide an explicit mobile="true" to make animation available on small screens
						if (!$scope.mobile) {
							if ($window.innerWidth < 768) {
								// we remove the frames
								$element.find('anim-frame').remove();
								// and prevent initialisation
								// so the images are not loaded
								return;
							}
						}

						// default animation settings if not provided
						var animationOptions = {
							loop: $scope.loop || "reverse",
							duration: $scope.duration || 2000
						};

						// preload all images before starting the animation
						// if one image fails to load, abort animation
						preloader.preloadImages($scope.images).then(
							function handleResolve() {
								// Loading was successful.
								/** Create animation instance **/
								animation = new imgAnimationFactory(angular.element($element), $scope.images, animationOptions);
								if ($scope.start) {
									animation.start();
								}
							},
							function handleReject(imageLocation) {
								// Loading failed on at least one image.
								throw imageLocation + ' could not be loaded. Animation Aborted.';
							}
						);
					};

					// we start the initialisation and loading of the images 
					// only when the content of the page is loaded 
					$window.onload = function () {
						init();
					};

					// watch the value of the start attribute to stop/start the animation
					$scope.$watch('start', function (value) {
						if (!animation)
							return;

						if (!value) {
							animation.stop();
						}
						else {
							animation.start();
						}
					});
				}
			}
		}])

		/**
		 * @ngdoc directive
		 * @name animFrame
		 * @description
		 * A frame element that provides images sources for the images to preload
		 * we don't use the img tag to avoid the browser to download images while
		 * the page is loading, so the user can see the content faster
		 */
		.directive('animFrame', ['$timeout', function ($timeout) {
			return {
				restrict: 'E',
				require: "^imgAnimation",
				link: function postLink(scope, element, attrs, imgAnimationCtrl) {
					imgAnimationCtrl.addImage(attrs);
				}
			}
		}])

		.filter('animFrames', function () {
			return function (input, range) {
				for (var i = 1; i <= parseInt(range, 10); i++) {
					input.push(("000" + i).slice(-4));
				}
				return input;
			};
		})

		/**
		 * @ngdoc factory
		 * @name imgAnimationFactory
		 * @description
		 * inserts all images in the container
		 * then animates it
		 */
		.factory('imgAnimationFactory', function () {

			return function (element, images, options) {
				var self = this,
					forward = true,
					current = 0,
					allImages = [],
					frames = images.length;

				if (!element) {
					throw 'Element to animate is not set';
				}
				if (!images) {
					throw 'No images to animate';
				}

				// remove the static image
				angular.element(angular.element(element).find('img')).remove();

				// add all frames images
				for (var i = 0; i < frames; i++) {
					var image = angular.element('<img ' + (i == 0 ? 'class="active"' : '') + ' src="' + images[i] + '" alt=" " />');
					allImages.push(image);
					element.append(image);
				}

				var start = function () {
					self.animation = setInterval(function () {
						animate();
					}, options.duration / frames);
				};

				var stop = function () {
					clearInterval(self.animation);
				};

				var animate = function () {
					var active = current;

					if (forward) {
						current++;
					}
					else if (options.loop == "reverse") {
						current--;
					}
					if (forward && current == frames - 1) {
						if (options.loop === "reverse") {
							forward = false;
						}
						if (options.loop === true) {
							current = 0;
						}
					}
					if (!forward && current == 0) {
						forward = true;
					}

					angular.element(allImages[active]).removeClass('active');
					angular.element(allImages[current]).addClass('active');
				};

				return {
					start: start,
					stop: stop
				}
			};
		});

	'use strict';

	/**
	 * @ngdoc factory
	 * @name images preloader
	 * @description
	 * # preloads a bunch of images with a promise
	 * we can know if one of images has failed to act in consequence
	 * @source https://www.bennadel.com/blog/2597-preloading-images-in-angularjs-with-promises.htm
	 */
	angular.module('imgAnimator')
		// I provide a utility class for preloading image objects.
		.factory("preloader", [
			"$q",
			"$rootScope",

			function ($q, $rootScope) {

				// I manage the preloading of image objects. Accepts an array of image URLs.
				function Preloader(imageLocations) {

					// I am the image SRC values to preload.
					this.imageLocations = imageLocations;

					// As the images load, we'll need to keep track of the load/error
					// counts when announing the progress on the loading.
					this.imageCount = this.imageLocations.length;
					this.loadCount = 0;
					this.errorCount = 0;

					// I am the possible states that the preloader can be in.
					this.states = {
						PENDING: 1,
						LOADING: 2,
						RESOLVED: 3,
						REJECTED: 4
					};

					// I keep track of the current state of the preloader.
					this.state = this.states.PENDING;

					// When loading the images, a promise will be returned to indicate
					// when the loading has completed (and / or progressed).
					this.deferred = $q.defer();
					this.promise = this.deferred.promise;

				}


				// ---
				// STATIC METHODS.
				// ---


				// I reload the given images [Array] and return a promise. The promise
				// will be resolved with the array of image locations.
				Preloader.preloadImages = function (imageLocations) {

					var preloader = new Preloader(imageLocations);

					return ( preloader.load() );

				};


				// ---
				// INSTANCE METHODS.
				// ---


				Preloader.prototype = {

					// Best practice for "instnceof" operator.
					constructor: Preloader,


					// ---
					// PUBLIC METHODS.
					// ---


					// I determine if the preloader has started loading images yet.
					isInitiated: function isInitiated() {

						return ( this.state !== this.states.PENDING );

					},


					// I determine if the preloader has failed to load all of the images.
					isRejected: function isRejected() {

						return ( this.state === this.states.REJECTED );

					},


					// I determine if the preloader has successfully loaded all of the images.
					isResolved: function isResolved() {

						return ( this.state === this.states.RESOLVED );

					},


					// I initiate the preload of the images. Returns a promise.
					load: function load() {

						// If the images are already loading, return the existing promise.
						if (this.isInitiated()) {

							return ( this.promise );

						}

						this.state = this.states.LOADING;

						for (var i = 0; i < this.imageCount; i++) {

							this.loadImageLocation(this.imageLocations[i]);

						}

						// Return the deferred promise for the load event.
						return ( this.promise );

					},


					// ---
					// PRIVATE METHODS.
					// ---


					// I handle the load-failure of the given image location.
					handleImageError: function handleImageError(imageLocation) {

						this.errorCount++;

						// If the preload action has already failed, ignore further action.
						if (this.isRejected()) {

							return;

						}

						this.state = this.states.REJECTED;

						this.deferred.reject(imageLocation);

					},


					// I handle the load-success of the given image location.
					handleImageLoad: function handleImageLoad(imageLocation) {

						this.loadCount++;

						// If the preload action has already failed, ignore further action.
						if (this.isRejected()) {

							return;

						}

						// Notify the progress of the overall deferred. This is different
						// than Resolving the deferred - you can call notify many times
						// before the ultimate resolution (or rejection) of the deferred.
						this.deferred.notify({
							percent: Math.ceil(this.loadCount / this.imageCount * 100),
							imageLocation: imageLocation
						});

						// If all of the images have loaded, we can resolve the deferred
						// value that we returned to the calling context.
						if (this.loadCount === this.imageCount) {

							this.state = this.states.RESOLVED;

							this.deferred.resolve(this.imageLocations);

						}

					},


					// I load the given image location and then wire the load / error
					// events back into the preloader instance.
					// --
					// NOTE: The load/error events trigger a $digest.
					loadImageLocation: function loadImageLocation(imageLocation) {

						var preloader = this;

						// When it comes to creating the image object, it is critical that
						// we bind the event handlers BEFORE we actually set the image
						// source. Failure to do so will prevent the events from proper
						// triggering in some browsers.
						var image = angular.element(new Image());

						image.on('load', function (event) {

								// Since the load event is asynchronous, we have to
								// tell AngularJS that something changed.
								$rootScope.$apply(
									function () {

										preloader.handleImageLoad(event.target.src);

										// Clean up object reference to help with the
										// garbage collection in the closure.
										preloader = image = event = null;

									}
								);

							})
							.on('error',
								function (event) {

									// Since the load event is asynchronous, we have to
									// tell AngularJS that something changed.
									$rootScope.$apply(
										function () {

											preloader.handleImageError(event.target.src);

											// Clean up object reference to help with the
											// garbage collection in the closure.
											preloader = image = event = null;

										}
									);

								}
							)
							.prop("src", imageLocation);

					}

				};


				// Return the factory instance.
				return ( Preloader );
			}]);

})(window, window.angular);