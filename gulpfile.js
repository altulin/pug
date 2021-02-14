const { src, dest, parallel, watch, series } = require('gulp');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleancss = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');
const del = require('del');
const sourcemaps = require('gulp-sourcemaps');
const pug = require('gulp-pug');


function browsersync() {
  browserSync.init({ // Инициализация Browsersync
    server: { baseDir: 'src/' }, // Указываем папку сервера
    notify: false, // Отключаем уведомления
    online: true, // Режим работы: true или false
    open: false
  })
}

function scripts() {
  return src([ // Берём файлы из источников
    'node_modules/jquery/dist/jquery.min.js', // Пример подключения библиотеки
    // 'node_modules/mmenu-light/dist/mmenu-light.js', // Пример подключения библиотеки
    'src/js/libs/*',
    'src/js/app.js', // Пользовательские скрипты, использующие библиотеку, должны быть подключены в конце
  ])
    .pipe(sourcemaps.init())
    .pipe(concat('app.min.js')) // Конкатенируем в один файл
    .pipe(uglify()) // Сжимаем JavaScript
    // .pipe(sourcemaps.write()) //добавляем карту
    .pipe(dest('src/js')) // Выгружаем готовый файл в папку назначения
    .pipe(browserSync.stream()) // Триггерим Browsersync для обновления страницы
}

function styles() {
  return src([
    'node_modules/normalize.css/normalize.css',
    // 'node_modules/mmenu-light/dist/mmenu-light.css',
    'src/css/libs/*',
    'src/sass/style.sass'

  ]) // Выбираем источник: "app/sass/main.sass" или "app/less/main.less"
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(concat('app.min.css')) // Конкатенируем в файл app.min.js
    .pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true })) // Создадим префиксы с помощью Autoprefixer
    .pipe(cleancss({ level: { 1: { specialComments: 0 } }/* , format: 'beautify' */ })) // Минифицируем стили
    .pipe(sourcemaps.write(".")) //добавляем карту
    .pipe(dest('src/css/')) // Выгрузим результат в папку "app/css/"
    .pipe(browserSync.stream()) // Сделаем инъекцию в браузер
}

function images() {
  return src('src/img/src/**/*') // Берём все изображения из папки источника
    .pipe(newer('src/img/dest/')) // Проверяем, было ли изменено (сжато) изображение ранее
    .pipe(imagemin([
      imagemin.optipng({ optimizationLevel: 3 }),
      imagemin.mozjpeg({ quality: 75, progressive: true }),
      imagemin.svgo()
    ])) // Сжимаем и оптимизируем изображеня
    .pipe(dest('src/img/dest/')) // Выгружаем оптимизированные изображения в папку назначения
}

function cleanimg() {
  return del('src/images/dest/**/*', { force: true }) // Удаляем всё содержимое папки "app/images/dest/"
}

function cleandist() {
  return del('dist/**/*', { force: true }) // Удаляем всё содержимое папки "dist/"
}

function buildcopy() {
  return src([ // Выбираем нужные файлы
    'src/css/**/*.min.css',
    'src/fonts/**/*',
    'src/js/**/*.min.js',
    'src/img/dest/**/*',
    'src/**/*.html',
  ], { base: 'src' }) // Параметр "base" сохраняет структуру проекта при копировании
    .pipe(dest('dist')) // Выгружаем в папку с финальной сборкой
}


function startwatch() {
  // Выбираем все файлы JS в проекте, а затем исключим с суффиксом .min.js
  watch(['src/js/*.js', '!src/js/*.min.js'], scripts);
  watch(['src/sass/**/*.sass', '!src/sass/style.sass'], styles);
  // watch('src/*.html').on('change', browserSync.reload);
  // watch('src/pug/**/*.pug').on('change', browserSync.reload);
  watch(['src/pug/**/*.pug'], transformPug);
  watch('src/img/src/**/*', images);
}

function transformPug() {
  return src('src/pug/pages/*.pug')
    .pipe(pug({pretty: true})) // Преобразуем в html без минификации
    .pipe(dest('src'))
    .pipe(browserSync.stream()) // Сделаем инъекцию в браузер
}

exports.browsersync = browsersync;
exports.scripts = scripts;
exports.styles = styles;
exports.images = images;
exports.cleanimg = cleanimg;
exports.transformPug = transformPug;


exports.default = parallel(styles, scripts, browsersync, startwatch);
exports.build = series(cleandist, styles, scripts, images, buildcopy);
