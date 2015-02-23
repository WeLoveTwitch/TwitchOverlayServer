var gulp = require('gulp');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var inject = require('gulp-inject');
var runSequence = require('gulp-run-sequence');
var rimraf = require('gulp-rimraf');
var notify = require('gulp-notify');

var config = {
    production: false,
    assets: './assets',
    bowerDir: './bower_components',
    frontend: './frontend'
};

var includes = {
    sass: [
        config.assets + '/sass/**/*',
        config.bowerDir + '/bootstrap-sass-official/assets/stylesheets',
        config.bowerDir + '/fontawesome/scss',
        config.bowerDir + '/lato/scss'
    ],
    fonts: [
        config.bowerDir + '/lato/font',
        config.bowerDir + '/fontawesome/fonts'
    ],
    cssLibs: [
        config.bowerDir + '/colpick/css/colpick.css'
    ],
    jsLibs: [
        config.bowerDir + '/jquery/dist/jquery.js',
        config.bowerDir + '/bootstrap-sass-official/assets/javascripts/bootstrap.js',
        config.bowerDir + '/angular/angular.js',
        config.bowerDir + '/ui-router/release/angular-ui-router.min.js',
        config.bowerDir + '/angular-animate/angular-animate.min.js',
        config.bowerDir + '/jquery-nicescroll/jquery.nicescroll.min.js',
        config.bowerDir + '/colpick/js/colpick.js'
    ],
    js: [
        config.frontend + '/js/app.js',
        config.frontend + '/js/**/*.js'
    ]
};

gulp.task('default', function (done) {
    runSequence('clean', ['sass', 'fonts'], 'inject', done);
});

gulp.task('clean', function () {
    return gulp.src('./frontend/css/**/**', {read: false})
        .pipe(rimraf());
});

gulp.task('fonts', function () {
    var paths = includes.fonts.map(function (item) {
        return item + '/**/*';
    });

    return gulp.src(paths)
        .pipe(gulp.dest(config.frontend + '/fonts'));
});

gulp.task('sass', function () {
    return gulp.src(config.assets + '/sass/app.scss')
        .pipe(
        sass({
            sourceComments: !config.production,
            outputStyle: config.production ? 'compressed' : 'nested',
            includePaths: includes.sass,
            onError: function (error) {
                notify.onError({
                    title: 'Twitch Overlay',
                    message: 'SASS Compilation Failed',
                    sound: true
                })(error);

                console.log(
                    '[gulp-sass] ERROR: ' + error.message + ' on line ' + error.line + ' in ' + error.file
                );
            }
        })
    )
        .pipe(gulp.dest(config.frontend + '/css')
    );
});

gulp.task('inject', function () {
    var target = gulp.src(config.frontend + '/templates/index-template.html');
    var sources = gulp.src(
        includes.jsLibs.concat(
            includes.js,
            includes.cssLibs,
            config.frontend + '/css/*.css'
        ),
        {read: false}
    );

    return target.pipe(inject(sources, {addRootSlash: false}))
        .pipe(rename({basename: 'index'}))
        .pipe(gulp.dest('./'));
});

gulp.task('watch', function () {
    gulp.start(['sass', 'fonts']);
    gulp.watch(includes.sass, ['sass', 'fonts']);
});
