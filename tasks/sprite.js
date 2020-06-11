'use strict';

var _ = require('underscore');

_.gulp.task('sprite:dist', async function () {

	var timestamp = Date.now();

    function spriteScale(callback) {
        _.gulp.src(_.gulp.localSourcePath + '/assets/sprites/*.png')
            .pipe(_.imageResize({
                percentage: 200,
                imageMagick: true
            }))
            .pipe(_.rename(function (path) { path.basename += "@2x"; }))
            .pipe(_.gulp.dest(_.gulp.localSourcePath + '/assets/sprites@2x'))
            .on('end', callback)
    }

    function spriteConver() {
        var spriteData = _.gulp.src([
            _.gulp.localSourcePath + '/assets/sprites/*.png',
            _.gulp.localSourcePath + '/assets/sprites@2x/*.png'
        ])
            .pipe(_.spritesmith({
                imgName: 'sprite.png',
                cssName: 'sprite.styl',
                imgPath: '../assets/sprites/sprite.png?' + timestamp,
                padding: 2,
                algorithm: 'top-down',
                retinaSrcFilter: [_.gulp.localSourcePath + '/assets/sprites@2x/*.png'],
                retinaImgPath: '../assets/sprites/sprite@2x.png?' + timestamp,
                retinaImgName: 'sprite@2x.png'
            }));

        spriteData.img.pipe(_.gulp.dest( _.gulp.localDistributivePath + '/sprites'));
        spriteData.css.pipe(_.gulp.dest(_.gulp.localSourcePath + '/styles/sprite'));

        return spriteData;
    }

    return spriteScale(spriteConver);

});

_.gulp.task('sprite:dest', function () {

	return _.gulp.src(_.gulp.localDistributivePath + '/sprites/*.png' )
		.pipe(_.gulp.dest(_.gulp.destinationPath.sprites));
});
