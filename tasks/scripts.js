'use strict';

var _ = require('underscore');

_.gulp.task('scripts:core:dist', function () {

	return _.gulp.src([
		'node_modules/jquery/dist/jquery.min.js',
		'node_modules/underscore/underscore-min.js',
		'node_modules/backbone/backbone-min.js',
		'bower_components/slick-carousel/slick/slick.min.js',
		'bower_components/select2/dist/js/select2.min.js',
		'bower_components/tooltipster/dist/js/tooltipster.bundle.min.js',
		'bower_components/fancybox/source/jquery.fancybox.pack.js',
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
