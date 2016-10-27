'use strict';

/**
 * @ngdoc overview
 * @name befrApp
 * @description
 * # befrApp
 *
 * Main module of the application.
 */
var app;
(function (window, angular, undefined) {
	'use strict';

	app = angular.module('testApp', [
		'imgAnimator'
	]).run(function($rootScope){
		$rootScope.startAnim = true;
	});

})(window, window.angular);
