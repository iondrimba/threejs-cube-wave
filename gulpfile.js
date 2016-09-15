'use strict';
var Promise = require('es6-promise')
	.Promise;
var gulp = require('gulp');
var gulpsync = require('gulp-sync')(gulp);
var bump = require('gulp-bump');
var semver = require('semver');
var renameMe = require('rename-me');
var pckg = require('./package.json');

var patch = semver.inc(pckg.version, 'patch');
var minor = semver.inc(pckg.version, 'minor');
var major = semver.inc(pckg.version, 'major');

// bump versions on package
gulp.task('minor', function () {
	return bumpPackageJson(minor);
});
gulp.task('patch', function () {
	return bumpPackageJson(patch);
});
gulp.task('major', function () {
	return bumpPackageJson(major);
});

function bumpPackageJson(type) {
	return gulp.src(['./package.json'])
		.pipe(bump({
			version: type
		}))
		.pipe(gulp.dest('./'));
}

function bumpAppFiles(version) {
	var options = {};
	options.version = version;
	options.indexFile = './public/index.html';

	options.filePath = ['./public/js/app.js', './public/css/app.css'];
	options.outputfolder = ['./public/js/', './public/css/'];

	renameMe(options);
}

//copies index.html file to public folder
gulp.task('copy', require('./tasks/copy.js'));

// using vinyl-source-stream: 
gulp.task('browserify', require('./tasks/browserify.js'));

//eslint task
gulp.task('eslint', require('./tasks/eslint.js'));

//scss lint task
gulp.task('scsslint', require('./tasks/scss-lint.js'));

//uglify task
gulp.task('uglify', require('./tasks/uglify.js'));

//imagemmin task
gulp.task('imagemin', require('./tasks/imagemin.js'));

//sass - scss task
gulp.task('sass', require('./tasks/sass.js'));

//watch js/scss/teplate files
gulp.task('watch', require('./tasks/watch.js'));

//html min 
gulp.task('html-min', require('./tasks/html-min.js'));

//css min 
gulp.task('minify-css', require('./tasks/minify-css.js'));

//post css
gulp.task('post-css', require('./tasks/post-css.js'));

//coveralls
gulp.task('coveralls', require('./tasks/coveralls.js'));

//local server
gulp.task('browser-sync', require('./tasks/browser-sync.js'));

// bump package versions
gulp.task('bump-patch', gulpsync.sync(['patch']), function renamePatch() {
	bumpAppFiles(patch);
});

gulp.task('bump-minor', gulpsync.sync(['minor']), function renameMinor() {
	bumpAppFiles(minor);
});

gulp.task('bump-major', gulpsync.sync(['major']), function renameMajor() {
	bumpAppFiles(major);
});


// Default Task
gulp.task('default', gulpsync.sync(['copy', 'scsslint', 'sass', 'eslint', 'browserify', 'browser-sync', 'watch']));

//publish Task
gulp.task('deploy', gulpsync.sync(['copy', 'scsslint', 'sass', 'eslint', 'imagemin', 'browserify']));

//optimization task isolated because of the asynchronous problems gulp has
gulp.task('optimize', gulpsync.sync(['copy', 'minify-css', 'html-min', 'uglify', 'imagemin']));