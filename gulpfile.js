'use strict';

/**
 * @todo: adjust URL to relative css and js files
 * @todo: remove comments from dest codes
 * @todo: Add bem shortcuts to pug - https://www.npmjs.com/package/pug-bem-lexer
 * @todo: Localserver autostart
 * @todo: Browsersync: https://github.com/BrowserSync/gulp-browser-sync
 *
 * Reserve:
 *
 * Pug -->
 * https://www.npmjs.com/package/stylinpug - Check Stylus against Pug, and vice versa, for unused and blacklisted
 *     classes https://www.npmjs.com/package/gulp-html2pug - Gulp plugin to convert html files to pug
 *     https://www.npmjs.com/package/pug-php-filter - A php filter for pug https://www.npmjs.com/package/pug-load - The
 *     Pug loader is responsible for loading the depenendencies of a given Pug file
 *     https://www.npmjs.com/package/pug-parser - may be useful for dump: The pug parser (takes an array of tokens and
 *     converts it to an abstract syntax tree) https://www.npmjs.com/package/pug-error - Standard error objects for pug
 *
 *
 * Stylus -->
 * https://www.npmjs.com/package/gulp-stylint - Gulp plugin for stylus stylint linter
 * https://www.npmjs.com/package/gulp-csscomb - form distr version: CSScomb is a coding style formatter for CSS
 * https://www.npmjs.com/package/autoprefixer - Parse CSS and add vendor prefixes to CSS rules using values from the
 *     Can I Use website
 *
 *
 * HTML -->
 * https://www.npmjs.com/package/gulp-htmlhint - htmlhint wrapper for gulp to validate your HTML
 *
 *
 * CSS -->
 * https://www.npmjs.com/package/gulp-csslint - CSSLint plugin for gulp
 * https://www.npmjs.com/package/gulp-csso - Minify CSS with CSSO
 * https://www.npmjs.com/package/gulp-group-css-media-queries - CSS postprocessing: group media queries. Useful for
 *     postprocessing preprocessed CSS files
 *
 *
 * JS -->
 * https://www.npmjs.com/package/gulp-autopolyfiller - Autopolyfiller plugin for Gulp
 * https://www.npmjs.com/package/gulp-babel - Use next generation JavaScript, today
 * https://www.npmjs.com/package/gulp-jsbeautifier - jsbeautifier.org for Gulp
 * https://www.npmjs.com/package/gulp-jscs - Check JavaScript code style with jscs
 * https://www.npmjs.com/package/gulp-uglify - Minify files with UglifyJS
 * https://www.npmjs.com/package/gulp-eslint - A gulp plugin for processing files with ESLint
 *
 *
 */

//const $$ = require('auto-require')();
var _ = require('underscore');
_.gulp = require('gulp');
_.uglify = require('gulp-uglify');
_.trycatch = require('trycatch');
_.requireDir = require('require-dir');
_.runSequence = require('gulp4-run-sequence');
_.appVer = '0.0.1';
_.concat = require('gulp-concat-util');
_.rename = require('gulp-rename');
_.config = {};
_.pug = require('gulp-pug');
_.stylus = require('gulp-stylus');
_.koutoSwiss = require('kouto-swiss');
_.jeet = require('jeet');
_.insert = require('gulp-insert');
_.urlAdjuster = require('gulp-css-url-adjuster');
_.gulpif = require('gulp-if');
_.colors = require('colors');
_.buffer = require('vinyl-buffer');
_.merge = require('merge-stream');
_.imageResize = require('gulp-image-resize');
_.pixelsmith = require('pixelsmith');
_.spritesmith = require('gulp.spritesmith');
_.sprity = require('sprity');
_.$ = require('gulp-load-plugins')();
_.svgstore = require('gulp-svgstore');
_.svgmin = require('gulp-svgmin');
//_.cache = require('gulp-cache');
_.cached = require('gulp-cached');
//_.remember = require('gulp-remember');
_.progeny = require('gulp-progeny');
_.cleanCSS = require('gulp-clean-css');
_.gzip = require('gulp-gzip');
_.browserSync = require('browser-sync').create();

//_.pugInheritance = require('gulp-pug-inheritance');

_.trycatch(function() {
    _.config = require('./config');
}, function(err) {
    console.error('Can\'t locate "config.json" file! Exit now.'.red);
    process.exit(1);
});

console.info('BX-Front-Builder '.zebra + "\n" + 'ver. ' + _.appVer + "\n" + 'Start...');

if(_.config.path.source) {
    _.gulp.localSourcePath = './' + _.config.path.source;
} else {
    console.error('Source directory path is not specified in "config.json"! Exit now.');
    process.exit(1);
}

//_.emitty = require('emitty').setup(_.gulp.localSourcePath, 'pug');

if(_.config.path.distributive) {
    _.gulp.localDistributivePath = './' + _.config.path.distributive;
} else {
    console.error('Distributive directory path is not specified in "config.json"! Exit now.');
    process.exit(1);
}

if(_.config.path.markup) {
    _.gulp.markupPath = _.config.path.markup;
} else {
    console.error('Markup directory path is not specified in "config.json"! Exit now.');
    process.exit(1);
}

if(_.config.path.markupInclude) {
    _.gulp.markupInclude = _.config.path.markupInclude;
} else {
    console.error('Markup includes directories path is not specified in "config.json"! Exit now.');
    process.exit(1);
}

if(_.config.path.destination) {
    _.gulp.destinationPath = _.config.path.destination;
} else {
    console.error('destination directory path is not specified in "config.json"! Exit now.');
    process.exit(1);
}

if(_.config.path.assets) {
    _.gulp.localAssetsPath = './' + _.config.path.assets;
} else {
    _.gulp.localAssetsPath = './src/assets';
    /*
     console.error('Distributive directory path is not specified in "config.json"! Exit now.');
     process.exit(1);
     */
}

_.requireDir('tasks', { recurse: true });

_.gulp.task('default', function (done) {

    console.info('Have no default actions.'.magenta + "\n");
    console.info('List of available actions:'.magenta + "\n");
    console.info('1. build'.green + "\n");
    console.info('2. watch'.green + "\n");
    done();
});

_.gulp.task('build', function (callback) {
    _.runSequence(
        ['scripts:core:dist'],
        ['scripts:main:dist'],
        ['sprite:dist'],
        ['sprite:svg:dist'],
        ['styles:core'],
        ['styles:dist'],
        ['scripts:dest'],
        ['sprite:dest'],
        ['sprite:svg:dest'],
        ['styles:dest'],
        ['markup'],
        ['assets:copy'],
        callback
    );
});

_.gulp.task('watch', function() {

    _.runSequence('build');

    global.watch = true;

    _.gulp.watch(_.gulp.localSourcePath + '/js/**/*.js', function(callback) {
        _.runSequence(
            ['scripts:main:dist'],
            ['scripts:dest']
        );
        callback();
    }).on('change', _.browserSync.reload);

    _.gulp.watch(_.gulp.localSourcePath + '/assets/sprites/*.png', function(callback) {
        _.runSequence(
            ['sprite:dist'],
            ['sprite:dest']
        );
        callback();
    }).on('change', _.browserSync.reload);

    _.gulp.watch(_.gulp.localSourcePath + '/assets/sprites-svg/*.svg', function(callback) {
        _.runSequence(
            ['sprite:svg:dist'],
            ['sprite:svg:dest']
        );
        callback();
    }).on('change', _.browserSync.reload);

    _.gulp.watch(_.gulp.localAssetsPath + '/backgrounds/**/*', function(callback) {
        _.runSequence(
            ['assets:backgrounds:copy']
        );
        callback();
    }).on('change', _.browserSync.reload);

    _.gulp.watch(_.gulp.localAssetsPath + '/images/**/*', function(callback) {
        _.runSequence(
            ['assets:images:copy']
        );
        callback();
    }).on('change', _.browserSync.reload);

    _.gulp.watch([
        _.gulp.localSourcePath + '/pages/**/*.pug',
        _.gulp.localSourcePath + '/global/**/*.pug',
        _.gulp.localSourcePath + '/templates/**/*.pug',
        _.gulp.localSourcePath + '/blocks/**/*.pug',
        _.gulp.localSourcePath + '/_mixins/**/*.pug',
        ], function(callback) {
            _.runSequence(
                ['markup']
            );
        callback();
    }).on('change', _.browserSync.reload);

    _.gulp.watch([
        _.gulp.localSourcePath + '/styles/**/*.styl',
        _.gulp.localSourcePath + '/global/**/*.styl',
        _.gulp.localSourcePath + '/blocks/**/*.styl',
        ], function(callback) {
        _.runSequence(
            ['styles:dist'],
            ['styles:dest']
        );
        callback();
    }).on('change', _.browserSync.reload);
});

_.gulp.task('browserSync', () => {
    _.browserSync.init({
        // injectChanges: true,
        // proxy: "http://localhost:3000",
        // files: ['./../markup/about-us/'],
        server: {
            baseDir: 'markup'
        },
        port: 3000,
        notify: false,
        // browser: "firefox",
        reloadDelay: 1000
    });
});

_.gulp.task('sync', _.gulp.parallel(
    'watch',
    'browserSync'
));
