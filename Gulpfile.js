/*
 * jt
 * https://github.com/parroit/jt
 *
 * Copyright (c) 2014 Andrea Parodi
 * Licensed under the MIT license.
 */

'use strict';

var gulp = require('gulp');
var mocha = require('gulp-mocha');
var traceur = require('gulp-traceur');
var tests = './test/**/*.js';
var srcs = './lib/**/*.js';
var distTests = './dist/test/**/*.js';

gulp.task('build', function () {
    return gulp.src([srcs,tests],{base: __dirname})
        .pipe(traceur({
            annotations: true,
            typeAssertionModule: 'rtts-assert',
            typeAssertions: true,
            types: true,
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('test',['build'], function () {
  return gulp.src(distTests)
    .pipe(mocha({}));
});

gulp.task('watch', function () {
  gulp.watch([srcs, tests], ['test']);
});

gulp.task('default', ['test', 'watch']);
