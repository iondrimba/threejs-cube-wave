var gulp = require('gulp');
var postcss = require('gulp-postcss');

module.exports = function() {
    return gulp.src('./public/css/app.css')
        .pipe(postcss([require('autoprefixer')]))
        .pipe(gulp.dest('./public/css/'));
};