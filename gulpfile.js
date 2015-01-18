var gulp = require('gulp');
var del = require('del');  
var source = require('vinyl-source-stream');
var browserify = require('browserify');

var paths = {
    main_js: ['./src/js/main.js'],
    js: ['./src/js/*.js']
};

gulp.task('clean', function(done) {
    del(['build'], done);
});

gulp.task('js', ['clean'], function() {
  browserify(paths.main_js)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./build/'));
});

gulp.task('watch', function() {
  gulp.watch(paths.js, ['js']);
  
});

gulp.task('default', ['watch', 'js']);
 
