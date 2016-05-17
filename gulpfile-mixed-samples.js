var gulp = require('gulp');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var jscs = require('gulp-jscs');
var nano = require('gulp-cssnano');
var config = require('./gulp.config.js')();

// task is mangling the JS files so that they become compressed and mangled
// uglified source file is put under the 'temp' directory for further use 
gulp.task('uglify-js-file', function() {
	return gulp.src("window-settings.js")
		.pipe(uglify())
		.pipe(gulp.dest("temp"));
});

// task is including a JS file's content into an HTML file.
// HTML file is to have a MAGIC string like '//=include temp/window-settings.js'
// inside the pipeline processor replaces MAGIC string with the JS content
// below demo includes the JS file inside HTML and puts the result into 'output' directory 
gulp.task('include-js-file-from-html', ['uglify-js-file'], function() {

	var include = require("gulp-include");

	return gulp.src("windows-settings-page.html")
		.pipe(include())
		.pipe(gulp.dest("output"));

});

// task is replacing the magic strings in the source file with
// the dynamically resolved strings. One use case is to create
// white-labeled products (rebranding)
// below example searches for '@@CUSTOMER_NAME' in the source file
// and replaces it with the actual name resolved dynamically
// task puts the result into 'output' directory 
gulp.task('replace-magic-string-with-resolution', function() {
	var replace = require('gulp-replace-task');

	function resolveCustomer(initials) {
		if (initials == 'TST') {
			return 'TEST';
		}

		return 'DEFAULT_PRODUCT';
	};

	return gulp.src(config.index)
			.pipe(replace({
				patterns: [
			    {
			      match: 'CUSTOMER_NAME',
			      replacement: resolveCustomer('TST')
			    }
			  ]
			}))
			.pipe(gulp.dest('output'));
});

// task is watching the file given in config.index variable,
// every change in the file triggers 'replace-magic-string-with-resolution'
// task whose definition is given above. So with the change into the
// original file, the output is produced automatically
gulp.task('watch-for-whitelabeling', function() {
	var watch = require('gulp-watch');
	
	return gulp.watch(config.index , ['replace-magic-string-with-resolution']);
});

// task is wrapping a file with a template, adding a copyright
// notice to the top of the page, image that this could be applied
// to each and every one of source files dynamically
gulp.task('wrap-with-copyright', function() {
    var wrap = require('gulp-wrap');
    
	var bottomCopyrightNotice = '&copy; Copyright 1982<script>new Date().getFullYear()>2010&&document.write("-"+new Date().getFullYear());</script>, X Company.'
	
    return gulp.src(config.index)
            .pipe(wrap('<%= contents %>' + bottomCopyrightNotice))
            .pipe(gulp.dest('output'));
});
