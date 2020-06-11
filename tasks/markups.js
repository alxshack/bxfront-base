'use strict';

var _ = require('underscore');

_.gulp.task('markup', function () {

	return _.gulp.src(_.gulp.localSourcePath + '/pages/**/*.pug')
		//.pipe(_.cache('local:markup:dist'))
		//.pipe(_.cached('local:markup:dist'))
		//.pipe(_.gulpif(global.watch, _.emitty.stream()))
		//.pipe(_.gulpif(global.watch, _.emitty.stream(global.emittyChangedFile)))

		// .pipe(_.cached('markup'))
		// .pipe(_.progeny())

		//.pipe(_.pugInheritance({basedir: 'local/src/'}))

		.pipe(_.pug({
			pretty: true,
			//compileDebug: true
		}))
		.pipe(_.gulp.dest(_.gulp.markupPath))
		.pipe(_.browserSync.reload({stream: true}));;
		// .pipe(_.browserSync.stream());

});
