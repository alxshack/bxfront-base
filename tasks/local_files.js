'use strict';

var _ = require('underscore');

_.gulp.task('assets:copy', function (callback) {
	_.runSequence(['assets:fonts:copy', 'assets:backgrounds:copy', 'assets:images:copy']
	);
	callback();
});

_.gulp.task('assets:fonts:copy', function () {
	return _.gulp.src([
		_.gulp.localAssetsPath + '/fonts/**/*'
	])
		.pipe(_.gulp.dest(_.gulp.destinationPath.assets + '/fonts'));
});

_.gulp.task('assets:backgrounds:copy', function () {
	return _.gulp.src([
		_.gulp.localAssetsPath + '/backgrounds/**/*'
	])
		.pipe(_.gulp.dest(_.gulp.destinationPath.assets + '/backgrounds'));
});

_.gulp.task('assets:images:copy', function () {
	return _.gulp.src([
		_.gulp.localAssetsPath + '/images/**/*'
	])
		.pipe(_.gulp.dest(_.gulp.destinationPath.assets + '/images'));
});