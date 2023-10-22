const browserSync = require('browser-sync').create();
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const svgstore = require('gulp-svgstore');
const terser = require('gulp-terser');
const { parallel, watch, src, dest } = require('gulp');

//  Css

const css = () => {
  return src('src/sass/style.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write(''))
    .pipe(dest('src/css'))
    .pipe(browserSync.stream());
};

exports.css = css;

// Img

const img = () => {
  return src('src/img/**/*.{jpg,png}')
    .pipe(
      imagemin([
        imagemin.mozjpeg({ progressive: true }), // quality
        imagemin.optipng({ optimizationLevel: 3 }),
      ])
    )
    .pipe(webp({ quality: 90 }))
    .pipe(dest('src/img'));
};

exports.img = img;

// Sprite

const svg = () => {
  return src('src/img/**/*.svg')
    .pipe(imagemin([imagemin.svgo({ plugins: [{ removeViewBox: false }] })]))
    .pipe(svgstore({ inlineSvg: true }))
    .pipe(dest('src/icon'));
};

exports.svg = svg;

// Js

const js = () => {
  return src('src/sass/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(concat('script.js'))
    .pipe(terser())
    .pipe(sourcemaps.write(''))
    .pipe(dest('src/js'));
};

exports.js = js;

// Live

const live = () => {
  browserSync.init({
    server: { baseDir: './' },
    notify: false,
    online: true,
  });
  watch('src/sass/**/*.scss', css);
  watch('src/img/**/*.{jpg,png}', img).on('change', browserSync.reload);
  //watch('src/img/**/*.svg', svg).on('change', browserSync.reload);
  //watch('src/sass/**/*.js', js).on('change', browserSync.reload);
  watch('*.html').on('change', browserSync.reload);
};

exports.live = live;
exports.default = parallel(css, live);
