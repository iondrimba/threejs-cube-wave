var gulp = require('gulp');
var coveralls = require('gulp-coveralls');

module.exports = function() {
    return gulp.src('test/reports/coverage/**/lcov.info')
        .pipe(coveralls());
};
