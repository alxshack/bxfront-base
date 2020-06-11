'use strict';

var _ = require('underscore');

_.gulp.task('sprite:svg:dist', function () {
	return _.gulp.src(_.gulp.localSourcePath + '/assets/sprites-svg/*.svg')
        .pipe(_.svgmin(function (file) {
          return {
            plugins: [{
              cleanupIDs: {
                minify: true
              }
            }]
          }
        }))
        .pipe(_.svgstore({ inlineSvg: true }))
        .pipe(_.gulp.dest(_.gulp.localDistributivePath + '/sprites-svg/'));

});

_.gulp.task('sprite:svg:dest', function () {

	return _.gulp.src(_.gulp.localDistributivePath + '/sprites-svg/*svg')
		.pipe(_.gulp.dest(_.gulp.destinationPath.sprites));

});
