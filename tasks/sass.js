var gulp = require('gulp');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');

module.exports = function() {
    gulp.src('./src/scss/app.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([require('autoprefixer')]))
        .pipe(gulp.dest('./public/css'));
};