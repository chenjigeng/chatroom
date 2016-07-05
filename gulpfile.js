var gulp = require('gulp');
//var browserSync = require('browser-sync').create();
var gutil = require('gulp-util');
//var sort = require('gulp-sort');
var wiredep = require('wiredep').stream;
var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'del']
});

var _ = require('lodash');

gulp.task('inject', function () {
    var injectFiles = gulp.src(['/**/*.js', '/**/*.css'], {read: false});
    return gulp.src(['./public/index.html'])
        .pipe($.inject(injectFiles))
        .pipe(wiredep(_.extend({}, 'bower_components')))
        .pipe(gulp.dest("/public/test"));
});


