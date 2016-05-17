var gulp = require('gulp');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var jscs = require('gulp-jscs');
var nano = require('gulp-cssnano');
var config = require('./gulp.config.js')();

// gulp build the whole frontend
gulp.task('build', ['init-env', 'js-sanitize', 'uglify-js-files', 'minify-css', 'copy-image-assets', 'wiredep'], function() {
});

// initialization of the build environment
gulp.task('init-env', function() {
	var rimraf = require('gulp-rimraf');

	return gulp.src(config.buildDest, { read: false })
		.pipe(rimraf({ force: true }));
});

// sanitization and format check on JavaScript files
gulp.task('js-sanitize', ['init-env'], function() {
	return gulp.src(config.allJS)
		.pipe(jscs())
		.pipe(jscs.reporter())
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'))
		.pipe(jshint.reporter('fail'));
});

// task is fixing javascript syntax (presumable used only by developers)
// need a JSCS resource file (.jscsrc) in the root directory
gulp.task('fix-js-syntax', function() {
	return gulp.src(config.allJS)
		.pipe(jscs({fix: true}))
        .pipe(gulp.dest(config.jsFolder));
});

// uglification of JavaScript files
gulp.task('uglify-js-files', ['init-env'], function() {
	return gulp.src(config.allJS)
		.pipe(uglify())
		.pipe(gulp.dest(config.jsBuildDest));
});

// minification of CSS
gulp.task('minify-css', ['init-env'], function() {
	return gulp.src(config.allCSS)
		.pipe(nano())
        .pipe(gulp.dest(config.cssBuildDest));
});

gulp.task('copy-image-assets', ['init-env'], function() {
	return gulp.src(config.imgFilter)
		.pipe(gulp.dest(config.imgDestFolder));
});

// install bower components
gulp.task('bower', ['init-env'], function() {
	var bower = require('gulp-bower');

	return bower(config.bower.directory)
		.pipe(gulp.dest(config.bower.directory))
		.pipe(gulp.dest(config.buildDest + config.bower.directory));
});

// wiredep injection
gulp.task('wiredep', ['bower', 'init-env'], function() {
    var options = config.getWiredepDefaultOptions(),
        wiredep = require('wiredep').stream,
        inject = require('gulp-inject');

    return gulp.src(config.index)
        .pipe(wiredep(options))
		.pipe(inject(gulp.src(config.customJSFileFilter)))
		.pipe(inject(gulp.src(config.customCSSFileFilter)))
		.pipe(gulp.dest(config.buildDest));
});

// wiredep injection with bundling and revision
gulp.task('wiredep-rev', ['bower', 'init-env'], function() {
    var options = config.getWiredepDefaultOptions(),
        wiredep = require('wiredep').stream,
        inject = require('gulp-inject'),
        rev = require('gulp-rev'),
        revReplace = require('gulp-rev-replace'),
        useref = require('gulp-useref'),
        gulpif = require('gulp-if');

    return gulp.src(config.index)
		.pipe(wiredep(options))
		.pipe(inject(gulp.src(config.customJSFileFilter)))
		.pipe(inject(gulp.src(config.customCSSFileFilter)))
		.pipe(useref())
		.pipe(gulpif('*.js', rev()))
		.pipe(gulpif('*.js', uglify()))
		.pipe(gulpif('*.css', rev()))
		.pipe(gulpif('*.css', nano()))
		.pipe(revReplace())		
		.pipe(gulp.dest(config.buildDest));
});


