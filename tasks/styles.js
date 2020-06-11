'use strict';

var _ = require('underscore');

// css библиотек, не участвуют в watch
_.gulp.task('styles:core', function () {
	return _.gulp.src([
		'bower_components/slick-carousel/slick/slick.css',
		'bower_components/tooltipster/dist/css/tooltipster.bundle.min.css',
		'bower_components/fancybox/source/jquery.fancybox.css'
	])
		.pipe(_.$.concat('core.css'))
		.pipe(_.gulp.dest(_.gulp.localDistributivePath + '/styles'));
});

_.gulp.task('styles:dist', function () {

	return _.gulp.src([
		_.gulp.localSourcePath + '/styles/main.styl',
	])
		.pipe(_.concat.header('@import "jeet"\n'))
		.pipe(_.concat.header('@import "kouto-swiss"\n'))
		.pipe(_.stylus({
			use: [_.koutoSwiss(), _.jeet()]
		}))
		.pipe(_.$.concat('base.css'))
		.pipe(_.gulp.dest(_.gulp.localDistributivePath + '/styles'));

});

_.gulp.task('styles:dest', function () {

	return _.gulp.src([
		_.gulp.localDistributivePath + '/styles/*.css'
	])
		.pipe(_.cleanCSS())
		.pipe(_.$.concat('main.min.css'))
		.pipe(_.gulp.dest(_.gulp.destinationPath.styles));

});
