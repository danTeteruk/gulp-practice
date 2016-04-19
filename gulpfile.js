var gulp = require('gulp');
var gconcat = require('gulp-concat');
var cssmin = require('gulp-cssmin');
var htmlmin = require('gulp-htmlmin');
var mainBowerFiles = require('main-bower-files');
var uglify = require('gulp-uglify');
var filter = require('gulp-filter');
var imagemin = require('gulp-imagemin');
var browserSync = require('browser-sync').create();
var del = require('del');
var mainBowerFiles = require('main-bower-files');
var sass = require('gulp-sass');
var git = require('gulp-git');

var pth = {
   src: 'src',
   build: 'build'
};

gulp.task('add', function(){
  return gulp.src("*")
    .pipe(git.add());
});

gulp.task('commit', function(){
  return gulp.src('./*')
    .pipe(git.commit(undefined, {
      args: '-m "one of many commit"',
    disableMessageRequirement: true
  }));
});

gulp.task('push', function(){
  git.push('origin', 'master', function (err) {
    if (err) throw err;
  });
});


gulp.task('bower', function() {
    var cssFilter = filter('**/*.css');
    return gulp.src(mainBowerFiles())
        .pipe(cssFilter)
        .pipe(gconcat('vendor.css'))
        .pipe(cssmin())
        .pipe(gulp.dest(pth.build + '/css'))
});

gulp.task('sass', function () {
  return gulp.src(pth.src + '/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gconcat('main.css'))
    .pipe(cssmin())
    .pipe(gulp.dest(pth.build + '/css'))
});

gulp.task('html', function() {
   return gulp.src(pth.src + '/**/*.html')
       .pipe(htmlmin({collapseWhitespace: true}))
       .pipe(gulp.dest(pth.build))
});

gulp.task('images', function() {
   return gulp.src(pth.src + '/img/**/*')
       .pipe(imagemin({progressive: true}))
       .pipe(gulp.dest(pth.build + '/img'))
});

gulp.task('watch', ['browser-sync'], function(){
   gulp.watch(pth.src + '/scss/**/*', ['bsync:sass']);
   gulp.watch(pth.src + '/**/*.html', ['bsync:html']);
   gulp.watch(pth.src + '/js/**/*', ['bsync:scripts']);
});

gulp.task('bsync:sass', ['sass'], function(){
   browserSync.reload();
});

gulp.task('bsync:html', ['html'], function(){
   browserSync.reload();
});


gulp.task('browser-sync', ['sass', 'html', 'images'], function() {
   browserSync.init({
      server: {
         baseDir: "./build"
      }
   });
});

gulp.task('clean', function(){
   return del('build');
});

gulp.task('build', ['bower', 'sass', 'html', 'images']);

gulp.task('serve', ['browser-sync', 'watch']);

gulp.task('default', ['build', 'serve']);

gulp.task('pushToMaster', ['add', 'commit', 'push']);
