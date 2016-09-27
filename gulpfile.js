var gulp = require('gulp');
var sass = require('gulp-sass');
var pug = require('gulp-pug');
var plumber = require('gulp-plumber');
var data = require('gulp-data');
var imagemin = require('gulp-imagemin');
var del = require('del');
var babel = require('gulp-babel');
var cache = require('gulp-cached');
var browsersync = require('browser-sync').create();
var reload = browsersync.reload;

var __basedir = "./app/";
var __baseDist = "dist/"

var path = {
   build: {
      html: __baseDist,
      scripts: __baseDist + 'js',
      styles: __baseDist + 'styles',
      images: __baseDist + 'img',
      fonts: __baseDist + 'fonts',
      media: __baseDist + 'media'
   },
   src: {
      html: [
			__basedir + 'html/*.html'
		],
      pug: [
			'./html-source/app/pages/*.pug',
         './html-source/web/pages/*.pug',
         '!./html-source/**/_*.pug'
		],
      scripts: [
			__basedir + 'js/**/*.js',
         './node_modules/bootstrap-sass/assets/javascripts/bootstrap.min.js',
			'./node_modules/jquery/dist/jquery.min.js'
		],
      styles: [
			'./node_modules/font-awesome/scss/font-awesome.scss',
			__basedir + 'sass/**/*.scss'
		],
      images: [
			__basedir + 'images/**/*.{png,jpg,jpeg}'
		],
      fonts: [
			__basedir + 'fonts/**/*.{ttf,otf,woff}',
			"./node_modules/font-awesome/fonts/*.*"
		],
      media: [
			__basedir + 'media/**/*.mp4'
		]
   },
   data: './app/data.json',
   clean: __baseDist
}

function getDataForFile() {
   return require(path.data);
}
// para templates html
gulp.task('html', function () {
   return gulp
      .src(path.src.html)
      .pipe(plumber())
      .pipe(gulp.dest(path.build.html))
      .pipe(reload({
         stream: true
      }))
});
gulp.task('pug', function () {
   return gulp
      .src(path.src.pug)
      .pipe(plumber())
      .pipe(data(getDataForFile))
      .pipe(pug({
         pretty: true
      }))
      .pipe(gulp.dest(path.build.html))
      .pipe(reload({
         stream: true
      }))
});
gulp.task('partials', function () {
   return gulp
      .src('./html-source/**/*.{pug}')
      .pipe(reload({
         stream: true
      }))
})
gulp.task('media', function () {
   return gulp
      .src(path.src.media)
      .pipe(gulp.dest(path.build.media))
      .pipe(reload({
         stream: true
      }))
})
gulp.task('scripts', function () {
   return gulp
      .src(path.src.scripts)
      .pipe(plumber())
      .pipe(babel({
         presets: ['es2015']
      }))
      .pipe(gulp.dest(path.build.scripts))
      .pipe(reload({
         stream: true
      }))
});
gulp.task('styles', function () {
   return gulp
      .src(path.src.styles)
      .pipe(plumber())
      .pipe(sass({
         outputStyle: 'compressed',
         sourceMap: true
      })).on('error', handleError)
      .pipe(gulp.dest(path.build.styles))
      .pipe(reload({
         stream: true
      }))
});

gulp.task('images', function () {
   return gulp
      .src(path.src.images)
      .pipe(imagemin())
      .pipe(gulp.dest(path.build.images))
      .pipe(reload({
         stream: true
      }))
});
gulp.task('fonts', function () {
   return gulp
      .src(path.src.fonts)
      .pipe(gulp.dest(path.build.fonts))
      .pipe(reload({
         stream: true
      }));
});

gulp.task('server', function () {
   browsersync.init({
      server: {
         baseDir: [__baseDist]
      },
      browser: 'google-chrome'
   });
});

gulp.task('watch', function () {
   gulp.watch(path.src.pug, ['pug']);
   gulp.watch(path.src.styles, ['styles']);
   gulp.watch(path.src.images, ['images']);
   gulp.watch(path.src.fonts, ['fonts']);
   gulp.watch(path.src.scripts, ['scripts']);
   gulp.watch(path.src.html, ['html']);
   gulp.watch('./html-source/**/*.{pug,jade}', ['pug', 'partials']);
});

gulp.task('clean', function (cb) {
   del(path.clean, cb);
});

gulp.task('build', ['pug', 'styles', 'images', 'fonts', 'scripts', 'media', 'html']);
gulp.task('default', ['build', 'server', 'watch']);

function handleError(error) {
   console.log(error.toString());
   this.emit('end');
}
