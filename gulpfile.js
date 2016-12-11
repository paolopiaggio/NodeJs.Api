const gulp = require('gulp');
const mocha = require('gulp-mocha');

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

gulp.task('default', ['mocha-tests']);
