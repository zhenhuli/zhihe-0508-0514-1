const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const postcss = require('gulp-postcss');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();
const fs = require('fs');
const path = require('path');

const paths = {
  js: {
    src: 'src/js/**/*.js',
    dest: 'dist/js/'
  },
  css: {
    src: 'src/css/**/*.css',
    dest: 'dist/css/'
  },
  html: {
    src: 'index.html',
    dest: './'
  }
};

const cssModulesMap = {};

function processCSSModules() {
  return gulp.src(paths.css.src)
    .pipe(postcss([
      require('postcss-modules')({
        getJSON: function(cssFileName, json, outputFileName) {
          const fileName = path.basename(cssFileName, '.css');
          cssModulesMap[fileName] = json;
        },
        generateScopedName: '[local]'
      })
    ]))
    .pipe(concat('styles.css'))
    .pipe(gulp.dest(paths.css.dest))
    .pipe(cleanCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.css.dest))
    .pipe(browserSync.stream());
}

function saveCSSModulesMap(cb) {
  fs.writeFileSync(
    path.join(__dirname, 'dist/css', 'class-map.json'),
    JSON.stringify(cssModulesMap, null, 2)
  );
  cb();
}

function scripts() {
  return gulp.src(paths.js.src)
    .pipe(concat('app.js'))
    .pipe(gulp.dest(paths.js.dest))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.js.dest))
    .pipe(browserSync.stream());
}

function html() {
  return gulp.src(paths.html.src)
    .pipe(browserSync.stream());
}

function watch() {
  browserSync.init({
    server: {
      baseDir: './'
    },
    port: 3000
  });
  gulp.watch(paths.js.src, scripts);
  gulp.watch(paths.css.src, gulp.series(processCSSModules, saveCSSModulesMap));
  gulp.watch(paths.html.src, html);
}

exports.scripts = scripts;
exports.css = gulp.series(processCSSModules, saveCSSModulesMap);
exports.watch = watch;
exports.build = gulp.parallel(scripts, gulp.series(processCSSModules, saveCSSModulesMap));
exports.serve = gulp.series(exports.build, watch);
exports.dev = gulp.series(exports.build, watch);
exports.default = exports.build;
