var gulp = require('gulp');
var clean = require('gulp-clean');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var buffer = require('gulp-buffer');
var uglify = require('gulp-uglify');
var gulpif = require('gulp-if');
var exorcist = require('exorcist');
var babelify = require('babelify');
var browserify = require('browserify');
var browserSync = require('browser-sync');

/**
 * Using different folders/file names? Change these constants:
 */
var PHASER_PATH = './node_modules/phaser/build/';
var BUILD_PATH = './build';
var SCRIPTS_PATH = BUILD_PATH + '/scripts';
var SOURCE_PATH = './src';
var STATIC_PATH = './static';
var ENTRY_FILE = SOURCE_PATH + '/index.js';
var OUTPUT_FILE = 'game.js';

function isProduction() {
    return (process.env.NODE_ENV === 'production') ? true : false;
}

/**
 * Deletes all content inside the './build' folder.
 */
gulp.task('cleanBuild', function() {
    return gulp.src(BUILD_PATH, {read: false})
        .pipe(clean());
});

/**
 * Copies the content of the './static' folder into the '/build' folder.
 * Check out README.md for more info on the '/static' folder.
 */
gulp.task('copyStatic', ['cleanBuild'], function() {
    return gulp.src(STATIC_PATH + '/**/*')
        .pipe(gulp.dest(BUILD_PATH));
});

/**
 * Copies required Phaser files from the './node_modules/Phaser' folder into the './build/scripts' folder.
 * This way you can call 'npm update', get the lastest Phaser version and use it on your project with ease.
 */
gulp.task('copyPhaser', ['copyStatic'], function() {
    
    var srcList = ['phaser.min.js'];
    
    if (!isProduction()) {
        srcList.push('phaser.map', 'phaser.js');
    }
    
    srcList = srcList.map(function(file) {
        return PHASER_PATH + file;
    });
        
    return gulp.src(srcList)
        .pipe(gulp.dest(SCRIPTS_PATH));

});

/**
 * Transforms ES2015 code into ES5 code.
 * Optionally: Creates a sourcemap file 'game.js.map' for debugging.
 */
gulp.task('build', ['copyPhaser'], function () {
    
    var sourcemapPath = SCRIPTS_PATH + '/' + OUTPUT_FILE + '.map';

    return browserify({
        entries: ENTRY_FILE,
        debug: true
    })
    .transform(babelify)
    .bundle().on('error', function(error){
          gutil.log(gutil.colors.red('[Build Error]', error.message));
          this.emit('end');
    })
    .pipe(gulpif(!isProduction(), exorcist(sourcemapPath)))
    .pipe(source(OUTPUT_FILE))
    .pipe(buffer())
    .pipe(gulpif(isProduction(), uglify()))
    .pipe(gulp.dest(SCRIPTS_PATH));

});

/**
 * Starts the Browsersync server.
 * Watches for file changes in the 'src' folder.
 */
gulp.task('serve', ['build'], function() {

    browserSync({
        server: {
            baseDir: BUILD_PATH
        },
        open: false
    });

    gulp.watch(SOURCE_PATH + '/**/*.js', ['watch-js']);

});

/**
 * Rebuilds and reloads the project when executed.
 */
gulp.task('watch-js', ['build'], browserSync.reload);

/**
 * The tasks are executed in the following order:
 * 'cleanBuild' -> 'copyStatic' -> 'copyPhaser' -> 'build' -> 'serve'
 * 
 * Read more about task dependencies in Gulp: 
 * https://medium.com/@dave_lunny/task-dependencies-in-gulp-b885c1ab48f0
 */
gulp.task('default', ['serve']);