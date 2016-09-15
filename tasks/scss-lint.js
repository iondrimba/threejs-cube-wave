var gulp = require('gulp');
var scsslint = require('gulp-scss-lint');

module.exports = function() {
    return gulp.src('./src/scss/**/*.scss')
        .pipe(scsslint({
            'config': './lint.yml',
        }));
};