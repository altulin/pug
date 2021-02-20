const projectFolder = `dist`;
const sourceFolder = `src`;

const path = {
  build: {
    html: `${projectFolder}/`,
    css: `${projectFolder}/css`,
    js: `${projectFolder}/js`,
    img: `${projectFolder}/img/dest`,
    fonts: `${projectFolder}/fonts`
  },
  src: {
    html: `${sourceFolder}/**/*.html`, //
    css: `${sourceFolder}/css/app.min.css`, //
    min_js: `${sourceFolder}/js/script.min.js`, //
    js: `${sourceFolder}/js/script.js`, //
    img: `${sourceFolder}/img/dest/**/*`, //
    fonts: `${sourceFolder}/fonts/**/*`, //
    pug: `${sourceFolder}/pug/pages/*.pug`,//
    sass: `${sourceFolder}/sass/style.sass`,
    libs_js: `${sourceFolder}/js/libs/**/*.js`//
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
}

function scripts() {
  return src([ // Берём файлы из источников
    'node_modules/jquery/dist/jquery.min.js', // Пример подключения библиотеки
    // 'node_modules/mmenu-light/dist/mmenu-light.js', // Пример подключения библиотеки
    // 'src/js/libs/*',
    path.src.libs_js,
    `${sourceFolder}/js/app.js`, // Пользовательские скрипты, использующие библиотеку, должны быть подключены в конце
  ])
    .pipe(sourcemaps.init())
    .pipe(concat('script.js')) // Конкатенируем в один файл
    .pipe(dest(`${sourceFolder}/js`))
    .pipe(concat('script.min.js'))
    .pipe(uglify()) // Сжимаем JavaScript
    // .pipe(sourcemaps.write()) //добавляем карту
    .pipe(dest(`${sourceFolder}/js`)) // Выгружаем готовый файл в папку назначения
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
  return del(`${projectFolder}/**/*`, { force: true }) // Удаляем всё содержимое папки "dist/"
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
  // Выбираем все файлы JS в проекте, а затем исключим с суффиксом .min.js
  watch(['src/js/*.js', '!src/js/*.min.js'], scripts);
  watch(['src/sass/**/*.sass', '!src/sass/style.sass'], styles);
  // watch('src/*.html').on('change', browserSync.reload);
  // watch('src/pug/**/*.pug').on('change', browserSync.reload);
  watch(['src/pug/**/*.pug'], transformPug);
  watch('src/img/src/**/*', images);
}

function transformPug() {
  return src(path.src.pug)
    .pipe(pug({ pretty: true })) // Преобразуем в html без минификации
    .pipe(dest(`${sourceFolder}`))
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
