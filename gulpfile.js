const projectFolder = `name_project`; //Папка продакшн
const sourceFolder = `_src`;  // Папка разработки

// js 
const sourceJs = `${sourceFolder}/js/app.js`; // файл для разработки Пользовательские скрипты
const projectJs = `script.js`; // файл в продакшн
const projectJsMin = `script.min.js`; // файл в продакшн минифицированный

// установленные библиотеки js
const jquery_js = `node_modules/jquery/dist/jquery.min.js`;

// css
const sourceCss = `${sourceFolder}/sass/style.sass` // файл для разработки Пользовательские стили
const projectCss = `style.css`; // файл в продакшн
const projectCssMin = `style.min.css`; // файл в продакшн минифицированный

// установленные библиотеки css
const normalize_css = `node_modules/normalize.css/normalize.css`;

// img
const sourceImg = `${sourceFolder}/_img/**/*`;//папка для разработки
const projectImg = `${sourceFolder}/img/**/*`;// папка в продакшн


const path = {
  build: {
    html: `${projectFolder}/`,
    css: `${projectFolder}/css`,
    js: `${projectFolder}/js`,
    img: `${projectFolder}/img/dest`,
    fonts: `${projectFolder}/fonts`
  },
  src: {
    html: `${sourceFolder}/*.html`, //
    css: `${sourceFolder}/css/style.min.css`, //
    min_js: `${sourceFolder}/js/script.min.js`, //
    js: `${sourceFolder}/js/script.js`, //
    img: `${sourceFolder}/img/**/*`, //
    fonts: `${sourceFolder}/fonts/**/*`, //
    pug: `${sourceFolder}/pug/pages/*.pug`,//
    libs_js: `${sourceFolder}/js/libs/**/*.js`,//
    libs_css: `${sourceFolder}/css/libs/**/*`//
  },
  watch: {
    // html: `${sourceFolder}/**/*.html`,
    css: `${sourceFolder}/sass/**/*.sass`,
    js: `${sourceFolder}/js/**/*.js`,
    img: `${sourceFolder}/img/src/**/*.{jpg, png, webp, svg}`,
    pug: `${sourceFolder}/pug/**/*.pug`
  },
  clean: `./${projectFolder}/`
}

const { src, dest, parallel, watch, series } = require('gulp'),
  browserSync = require('browser-sync').create(),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify-es').default,
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  cleancss = require('gulp-clean-css'),
  imagemin = require('gulp-imagemin'),
  newer = require('gulp-newer'),
  del = require('del'),
  sourcemaps = require('gulp-sourcemaps'),
  pug = require('gulp-pug')


function browsersync() {
  browserSync.init({ // Инициализация Browsersync
    server: { baseDir: `${sourceFolder}/` }, // Указываем папку сервера
    notify: false, // Отключаем уведомления
    online: true, // Режим работы: true или false
    open: false,
    port: 3000
  })
};

function scripts() {
  return src([ // Берём файлы из источников
    jquery_js,
    path.src.libs_js, // библиотеки из папки libs
    sourceJs, // Пользовательские скрипты, использующие библиотеку, должны быть подключены в конце
  ])
    .pipe(sourcemaps.init())
    .pipe(concat(projectJs)) // Конкатенируем в один файл
    // .pipe(sourcemaps.write()) //добавляем карту
    .pipe(dest(`${sourceFolder}/js`)) // Выгружаем готовый файл не мин в папку назначения
    .pipe(concat(projectJsMin))
    .pipe(uglify()) // Сжимаем JavaScript
    // .pipe(sourcemaps.write()) //добавляем карту
    .pipe(dest(`${sourceFolder}/js`)) // Выгружаем готовый файл мин в папку назначения
    .pipe(browserSync.stream()) // Триггерим Browsersync для обновления страницы
};

function styles() {
  return src([// Выбираем источникИ
    normalize_css,
    path.src.libs_css,
    sourceCss

  ])
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(concat(projectCssMin)) // Конкатенируем в файл 
    .pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true })) // Создадим префиксы с помощью Autoprefixer
    .pipe(cleancss({ level: { 1: { specialComments: 0 } }/* , format: 'beautify' */ })) // Минифицируем стили
    .pipe(sourcemaps.write(".")) //добавляем карту
    .pipe(dest(`${sourceFolder}/css/`)) // Выгрузим результат в папку 
    .pipe(browserSync.stream()) // Сделаем инъекцию в браузер
}

function images() {
  return src(sourceImg) // Берём все изображения из папки источника
    .pipe(newer(projectImg)) // Проверяем, было ли изменено (сжато) изображение ранее
    .pipe(imagemin([
      imagemin.optipng({ optimizationLevel: 3 }),
      imagemin.mozjpeg({ quality: 75, progressive: true }),
      imagemin.svgo({
        plugins: [
          { removeViewBox: true },
          { cleanupIDs: false }
        ]
      })
    ])) // Сжимаем и оптимизируем изображеня
    .pipe(dest(`${sourceFolder}/img`)) // Выгружаем оптимизированные изображения в папку назначения

    .pipe(imagemin([
      imagemin.svgo({
        plugins: [
          { removeViewBox: true },
          { cleanupIDs: false }
        ]
      })
    ])) // оптимизируем svg
    .pipe(dest(`${sourceFolder}/img/svg`)) // Выгружаем оптимизированные изображения в папку назначения
}

// function cleanimg() {
//   return del('src/images/dest/**/*', { force: true }) // Удаляем всё содержимое папки "app/images/dest/"
// }

function cleanImg() {
  return del(`projectImg`, { force: true }) // Удаляем всё содержимое папки "dist/"
}

function buildcopy() {
  return src([ // Выбираем нужные файлы
    path.src.css,
    path.src.fonts,
    path.src.min_js,
    path.src.js,
    path.src.img,
    path.src.html
  ], { base: `${sourceFolder}` }) // Параметр "base" сохраняет структуру проекта при копировании
    .pipe(dest(`${projectFolder}/`)) // Выгружаем в папку с финальной сборкой
}


function startwatch() {

  watch([
    `${sourceFolder}/js/*.js`,
    `!${sourceFolder}/js/${projectJs}`,
    `!${sourceFolder}/js/${projectJsMin}`
  ], scripts);// Выбираем все файлы JS в проекте, а затем исключим 

  watch([`${sourceFolder}/sass/**/*.sass`, `!${sourceCss}`], styles);

  watch([`${sourceFolder}/pug/**/*.pug`], transformPug);

  watch(`${sourceFolder}/_img**/*`, images);
}

function transformPug() {
  return src(path.src.pug)
    .pipe(pug({ pretty: true })) // Преобразуем в html без минификации
    .pipe(dest(`${sourceFolder}`)) // Выгружаем в папку с ф
    .pipe(browserSync.stream()) // Сделаем инъекцию в браузер
}

exports.browsersync = browsersync;
exports.scripts = scripts;
exports.styles = styles;
exports.images = images;
exports.cleanImg = cleanImg;
exports.transformPug = transformPug;


exports.default = parallel(cleanImg, styles, scripts, images, browsersync, startwatch);
exports.build = series(cleanImg, styles, scripts, images, buildcopy);
