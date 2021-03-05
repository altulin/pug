const projectFolder = `dist`; //Папка продакшн
const sourceFolder = `_src`;  // Папка разработки

// js
const sourceJs = `${sourceFolder}/js/main.js`; // файл для разработки Пользовательские скрипты
const projectJs = `script.js`; // файл в продакшн
const projectJsMin = `script.min.js`; // файл в продакшн минифицированный

// установленные библиотеки js
const jquery_js = `node_modules/jquery/dist/jquery.min.js`;
const mmenu_js = `node_modules/mmenu-light/dist/mmenu-light.js`;
const jquery_formstyler_js = `node_modules/jquery-form-styler/dist/jquery.formstyler.min.js`;
// const slick_js = `node_modules/slick-carousel/slick/slick.min.js`;

// css
const sourceCss = `${sourceFolder}/sass/style.sass` // файл для разработки Пользовательские стили
// const projectCss = `style.css`; // файл в продакшн
const projectCssMin = `style.min.css`; // файл в продакшн минифицированный

// установленные библиотеки css
const normalize_css = `node_modules/normalize.css/normalize.css`;
const mmenu_css = `node_modules/mmenu-light/dist/mmenu-light.css`;
const jquery_formstyler_css = `node_modules/jquery-form-styler/dist/jquery.formstyler.css`;
const jquery_formstyler_theme_css = `node_modules/jquery-form-styler/dist/jquery.formstyler.theme.css`;

// const slick_css = `node_modules/slick-carousel/slick/slick.css`;
// const slick_theme_css = `node_modules/slick-carousel/slick/slick-theme.css`;

// img
// const sourceImg = `${sourceFolder}/_img/**/*`;//папка для разработки
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
    libs_css: `${sourceFolder}/css/libs/**/*`,//
    ico: `${sourceFolder}/*.ico`,
    files: `${sourceFolder}/files/**/*`
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
  pug = require('gulp-pug'),
  // sprite = require('gulp-svg-sprite'),
  svgmin = require('gulp-svgmin'),
  cheerio = require('gulp-cheerio'),
  replace = require('gulp-replace'),
  svgstore = require('gulp-svgstore'),
  rename = require("gulp-rename"),
  webp = require('gulp-webp')



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
    mmenu_js,
    jquery_formstyler_js,
    // slick_js,
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
    mmenu_css,
    jquery_formstyler_css,
    jquery_formstyler_theme_css,
    // slick_css,
    // slick_theme_css,
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
  return src(`${sourceFolder}/_img/*.{png,jpg}`) // Берём все изображения из папки источника
    .pipe(newer(projectImg)) // Проверяем, было ли изменено (сжато) изображение ранее
    .pipe(imagemin([
      imagemin.optipng({ optimizationLevel: 3 }),
      imagemin.mozjpeg({ quality: 75, progressive: true }),

    ])) // Сжимаем и оптимизируем изображеня
    .pipe(dest(`${sourceFolder}/img`)) // Выгружаем оптимизированные изображения в папку назначения
};

function imagesSvg() {
  del(`${sourceFolder}/img/svg/*.svg`, { force: true });
  return src(`${sourceFolder}/_img/svg/*.svg`) // Берём все изображения из папки источника

    // .pipe(newer(`${sourceFolder}/img/svg`)) // Проверяем, было ли изменено (сжато) изображение ранее
    .pipe(imagemin([
      imagemin.svgo({
        plugins: [
          { removeViewBox: true },
          { cleanupIDs: false }
        ]
      })
    ]))
    .pipe(dest(`${sourceFolder}/img/svg`)) // Выгружаем оптимизированные изображения в папку назначения
};

function clean() {
  return del(projectFolder, { force: true }); // Удаляем всю папку продакшн
};

function cleanImg() {
  return del(projectImg, { force: true }); // Удаляем всё содержимое папки "img/"
};

function createSprite() {
  del(`${sourceFolder}/img/sprite.svg`, { force: true });
  return src(`${sourceFolder}/_img/sprite/*.svg`)
    .pipe(imagemin([
      imagemin.svgo()
    ]))

    // minify svg
    .pipe(svgmin({
      js2svg: {
        // pretty: true
      }
    }))

    .pipe(cheerio({
      run: function ($) {
        $('[fill]').removeAttr('fill');
        $('[stroke]').removeAttr('stroke');
        $('[style]').removeAttr('style');
      },
      parserOptions: { xmlMode: true }
    }))

    .pipe(replace('&gt;', '>'))



    .pipe(svgstore({
      inlineSvg: true
    }))

    .pipe(rename("sprite.svg"))


    .pipe(dest(`${sourceFolder}/img`))
};


function buildcopy() {
  return src([ // Выбираем нужные файлы
    path.src.css,
    path.src.fonts,
    path.src.min_js,
    path.src.js,
    path.src.img,
    path.src.html,
    path.src.ico,
    path.src.files
  ], { base: `${sourceFolder}` }) // Параметр "base" сохраняет структуру проекта при копировании
    .pipe(dest(`${projectFolder}/`)) // Выгружаем в папку с финальной сборкой
};

function createWebp() {
  return src(`${sourceFolder}/_img/*.{png,jpg}`)
    .pipe(newer(`${sourceFolder}/img/webp`))
    .pipe(webp())
    .pipe(dest(`${sourceFolder}/img/webp`))
}


function startwatch() {
  watch([
    `${sourceFolder}/js/**/*.js`,
    `!${sourceFolder}/js/${projectJs}`,
    `!${sourceFolder}/js/${projectJsMin}`
  ], scripts);// Выбираем все файлы JS в проекте, а затем исключим

  watch([`${sourceFolder}/sass/**/*.sass`, `!${sourceCss}`], styles);
  watch([`${sourceFolder}/pug/**/*.pug`], transformPug);
  watch(`${sourceFolder}/_img/*`, images);
  watch(`${sourceFolder}/_img/*`, createWebp);
  watch(`${sourceFolder}/_img/svg`, imagesSvg);
  watch(`${sourceFolder}/_img/sprite`, createSprite);
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
// exports.imagesSvg = imagesSvg;
// exports.sprite = sprite;
exports.cleanImg = cleanImg;
exports.transformPug = transformPug;
exports.createSprite = createSprite;
exports.svgmin = svgmin;
exports.cheerio = cheerio;
exports.replace = replace;
exports.svgstore = svgstore;
exports.rename = rename;
exports.createWebp = createWebp;


exports.default = parallel(cleanImg, styles, scripts, images, imagesSvg, createSprite, createWebp, transformPug, browsersync, startwatch);
// exports.build = series(clean, styles, scripts, images, buildcopy);
exports.build = series(cleanImg, styles, scripts, images, imagesSvg, createSprite, createWebp, transformPug, buildcopy);
