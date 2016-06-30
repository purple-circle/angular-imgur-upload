gulp = require('gulp')
plumber = require('gulp-plumber')

gutil = require('gulp-util')
coffee = require('gulp-coffee')

# Angular
ngAnnotate = require('gulp-ng-annotate')

# Code linting
coffeelint = require('gulp-coffeelint')

# Code minification
uglify = require('gulp-uglify')

# Notifications for OSX
notify = require('gulp-notify')

# Renaming the minified file
rename = require('gulp-rename')

errorHandler = notify.onError('Error: <%= error.message %>')

coffeeFiles = 'src/angular-imgur-upload.coffee'

gulp.task 'coffee', ->
  gulp
    .src(coffeeFiles)
    .pipe(plumber({errorHandler}))
    .pipe(coffee())
    .pipe(ngAnnotate())
    .on('error', gutil.log)
    .pipe(gulp.dest('./dist'))

gulp.task 'coffeelint', ->
  gulp
    .src(coffeeFiles)
    .pipe(plumber({errorHandler}))
    .pipe(coffeelint())
    .pipe(coffeelint.reporter())
    .on('error', gutil.log)

gulp.task 'build', ['coffeelint', 'coffee'], ->

  gulp
    .src('dist/angular-imgur-upload.js')
    .pipe(uglify())
    .pipe rename
      extname: '.min.js'
    .pipe(gulp.dest('dist/'))


gulp.task 'watch', ->
  gulp.watch coffeeFiles, ['build']

