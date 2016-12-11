const gulp = require('gulp');
const mocha = require('gulp-mocha');
const nodemon = require('gulp-nodemon')

gulp.task('mocha-tests', () => {
  return gulp.src('tests/**/*Test.js')
    .pipe(mocha({reporter: 'spec', bail: true}))
    .once('error', (err) => {
      console.log(err);
      process.exit(1);
    })
    .once('end', () => {
      process.exit();
    })
});

gulp.task('dev-mode', () => {
  nodemon({script: './api/app.js'})
});

gulp.task('default', ['dev-mode'])
gulp.task('tests', ['mocha-tests']);
