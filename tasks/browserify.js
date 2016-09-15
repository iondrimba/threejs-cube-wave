var gulp = require('gulp');
var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');
var stringify = require('stringify');
var browserify = require('browserify');
var babelify = require("babelify");


module.exports = function() {
    stringify.registerWithRequire({
        extensions: ['.txt', '.html'],
        minify: true,
        minifier: {
            extensions: ['.html']
        }
    });

    var bundleStream = browserify('./src/scripts/app.js')
        .transform(babelify, {
            'presets': ['es2015']
        })
        .transform(stringify(['.html']))
        .bundle();

    bundleStream
        .pipe(source('app.js'))
        .pipe(gulp.dest('./public/js'))
};