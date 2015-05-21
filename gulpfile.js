"use strict";

var gulp = require("gulp");
var mocha = require("gulp-mocha");
var gutil = require("gulp-util");
var browserify = require("gulp-browserify");
var uglify = require("gulp-uglify");
var stubcell = require("gulp-stubcell");

gulp.task("stub.start", function(){
  return stubcell.start({
    entry: "test/mbaas.yml",
    basepath: "test/stub",
    looseCompare: true,
    port: 18000,
    debug: !!process.env.DEBUG
  });
});

gulp.task("stub.stop", ["test"], function(done){
  return stubcell.stop(done);
});

gulp.task("stubtest", ["stub.start", "stub.stop"]);

gulp.task("test", function(){
  return gulp.src(["test/*_test.js"], {read: false})
    .pipe(mocha({
      reporter: "spec",
      timeout: 5000
    }))
    .on("error", gutil.log);
});

gulp.task("build", function(){
  gulp.src("lib/ncmb.js")
    .pipe(browserify({}))
    .pipe(uglify())
    .pipe(gulp.dest("../ncmb.js"))
    .on("error", gutil.log);
});

gulp.task("watch-mocha", function(){
  gulp.watch(["lib/**", "test/**"], ["mocha"]);
});
