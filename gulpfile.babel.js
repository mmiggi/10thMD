import gulp from 'gulp';
import sass from 'gulp-sass';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import rename from 'gulp-rename';
import cleanCSS from 'gulp-clean-css';
import gulpif from 'gulp-if';

import del from 'del';
import path from 'path';
import browserify from 'browserify';
import babelify from 'babelify';
import stream from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';

import config from './config.json';


export function themeStyles() {
  return gulp.src(config.styles.src)
    .pipe(sass())
    .pipe(cleanCSS())
    .pipe(rename({
      basename: 'client',
      suffix: '.min'
    }))
    .pipe(gulp.dest(config.styles.dest));
}

export function themeScripts() {

  let bundler = browserify({
    entries: config.scripts.src,
    debug: true
  });

  return bundler
    .on('error', function (err) {
      console.error(err);
    })
    .transform(babelify, { presets: ["env"] })
    .bundle()
    .pipe(stream('client.min.js'))
    .pipe(buffer())
    .pipe(gulp.dest(config.scripts.dest));

}

export function themeAssets() {
  return gulp.src(config.assets.src)
    .pipe(gulp.dest(config.assets.dest));
}


export const buildTheme = gulp.parallel(themeStyles, themeScripts, themeAssets);
export const clean = () => del(['build']);

export const build = gulp.series(clean, buildTheme);

export default build;