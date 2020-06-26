'use strict';

var _ = require('underscore');

_.gulp.task('scripts:core:dist', function () {

	return _.gulp.src([
		// 'node_modules/jquery/dist/jquery.min.js',
		'bower_components/jquery/dist/jquery.js',
		'bower_components/jquery-migrate/jquery-migrate.js',
		'node_modules/underscore/underscore-min.js',
		'bower_components/CanJS/can.jquery.min.js',
		'bower_components/CanJS/can.construct.super.js',
		'bower_components/CanJS/can.construct.proxy.js',
		'bower_components/CanJS/can.control.plugin.js',
		'bower_components/slick-carousel/slick/slick.min.js',
		'bower_components/select2/dist/js/select2.min.js',
		'bower_components/tooltipster/dist/js/tooltipster.bundle.min.js',
		'bower_components/fancybox/source/jquery.fancybox.pack.js',
		'bower_components/uri.js/src/URI.js',
		'bower_components/uri.js/src/URI.fragmentQuery.js',
		'bower_components/js-cookie/src/js.cookie.js',
		'bower_components/owl.carousel/dist/owl.carousel.js',
		'bower_components/iCheck/icheck.js',
		'bower_components/jquery.maskedinput/dist/jquery.maskedinput.js',
		'bower_components/modernizr/modernizr.js',
		'bower_components/magnific-popup/dist/jquery.magnific-popup.js',

		_.gulp.localSourcePath + '/js_core/*.js'
	])
		.pipe(_.$.concat('core.min.js'))
		.pipe(_.uglify())
		.pipe(_.gulp.dest(_.gulp.localDistributivePath + '/js/'))

});

_.gulp.task('scripts:main:dist', function () {

	return _.gulp.src([
		_.gulp.localSourcePath + '/js/**/*.js'
	])
		.pipe(_.$.concat('main.min.js'))
		.pipe(_.uglify())
		.pipe(_.gulp.dest(_.gulp.localDistributivePath + '/js/'));

});

_.gulp.task('scripts:dest', function () {

	return _.gulp.src([
		_.gulp.localDistributivePath + '/js/*.js'
	])
		.pipe(_.gulp.dest(_.gulp.destinationPath.scripts));

});
