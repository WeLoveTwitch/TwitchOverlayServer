var gulp = require('gulp');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var inject = require('gulp-inject');
var runSequence = require('gulp-run-sequence');
var rimraf = require('gulp-rimraf');

var paths = {
    sass: ['./frontend/sass/**/*.scss'],
    cssLibs: [
        './bower_components/bootstrap/dist/css/bootstrap.css',
        './bower_components/fontawesome/css/font-awesome.css'
    ],
    jsLibs: [
        './bower_components/jquery/dist/jquery.js',
        './bower_components/angular/angular.js',
        './bower_components/ui-router/release/angular-ui-router.min.js',
        './bower_components/angular-animate/angular-animate.min.js'
    ],
    js: [
        './frontend/js/app.js',
        './frontend/js/**/*.js'
    ]
};

gulp.task('default', function (done) {
    runSequence('clean', 'sass', 'inject', done);
});

gulp.task('clean', function () {
    return gulp.src('./css/**/**', {read: false}) // much faster
        .pipe(rimraf());
});

gulp.task('sass', function (done) {
    gulp.src(paths.sass)
        .pipe(sass())
        .pipe(gulp.dest('./frontend/css/'))
        .pipe(rename({ extname: '.css' }))
        .pipe(gulp.dest('./frontend/css/'))
        .on('end', done);
});

gulp.task('inject', function () {
    var target = gulp.src('./index-template.html');
    var sources = gulp.src(paths.jsLibs.concat(paths.js, paths.cssLibs, './frontend/css/*.css'), {read: false});
    return target.pipe(inject(sources, {addRootSlash: false}))
        .pipe(rename({ basename: 'index' }))
        .pipe(gulp.dest('./'));
});

gulp.task('watch', function () {
    gulp.start(['sass']);
    gulp.watch(paths.sass, ['sass']);
});
