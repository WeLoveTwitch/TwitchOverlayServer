var gulp = require('gulp');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var inject = require('gulp-inject');

var paths = {
    sass: ['./frontend/sass/**/*.scss'],
    cssLibs: [
        './bower_components/bootstrap/dist/css/bootstrap.css',
        './bower_components/fontawesome/css/font-awesome.css'
    ],
    jsLibs: [
        './bower_components/jquery/dist/jquery.js',
        './bower_components/angular/angular.js',
        './bower_components/ui-router/release/angular-ui-router.min.js'
    ],
    js: [
        './frontend/js/app.js',
        './frontend/js/**/*.js'
    ]
};

gulp.task('default', ['sass', 'inject']);

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
    gulp.start(['sass'])
    gulp.watch(paths.sass, ['sass']);
});
