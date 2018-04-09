const gulp = require("gulp");
const vulcanize = require("gulp-vulcanize");
// const uglify = require("gulp-uglify");
const del = require('del');
const swPrecache = require("sw-precache");
const replace = require("gulp-replace");
const crisper = require("gulp-crisper");
const shell = require("gulp-shell")
const htmlmin = require("gulp-htmlmin");
// const removeHtmlComments = require("gulp-remove-html-comments");

const removeComments = require('gulp-strip-comments');
const srcPath = "src/";

const srcIndexFile = "index.html";
const publicFolder = "public";
const sw_WorkerFile = "service-worker.js";


gulp.task("build:clean", () => {
    return del([
        publicFolder + "/**/*"
    ]);
});

gulp.task("build:copyToPublic", ["build:clean"], (callback) => {
    gulp.src("icons/*").pipe(gulp.dest(publicFolder + "/icons"));
    gulp.src("manifest.json").pipe(gulp.dest(publicFolder));
    gulp.src("src/style/Roboto/*").pipe(gulp.dest(publicFolder + "/Roboto"));
    callback();
});

gulp.task("build:generateSW", ["build:remove-comments"], (callback) => {
    swPrecache.write(`${publicFolder}/${sw_WorkerFile}`, {
        staticFileGlobs: [
            `${publicFolder}/${srcIndexFile}`,
            `${publicFolder}/index.js`,
            `${publicFolder}/manifest.json`,
            `${publicFolder}/icons/*.*`,
            `${publicFolder}/Roboto/*.ttf`
        ],
        path: publicFolder,
        verbose: true,
        runtimeCaching: [{
            urlPattern: /ws.inf.fh-dortmund.de/,
            handler: "cacheFirst",
            options: {
                name: "api-cache"
            }
        }]
    }, callback);
});

gulp.task("build:remove-comments", ["build:vulcanize"], (callback) => {
    return gulp.src(`${publicFolder}/${srcIndexFile}`)
        .pipe(removeComments())
        .pipe(gulp.dest(publicFolder));
});

gulp.task("build:copySafariJS", ["build:remove-comments"], () => {
    return gulp.src("safari-js/*.map").pipe(gulp.dest("public"));
});


gulp.task("build:vulcanize", ["build:copyToPublic"], () => {
    return gulp.src(srcIndexFile)
        .pipe(vulcanize({
            inlineScripts: true,
            inlineCss: true,
            stripComments: true
        }))
        .pipe(crisper())
        .pipe(replace('src/style/Roboto/Roboto', 'Roboto/Roboto'))
        .pipe(gulp.dest(publicFolder));
});

gulp.task("build:minify-html", ["build:generateSW"], () =>{
    return gulp.src(`${publicFolder}/${srcIndexFile}`)
            .pipe(htmlmin({collapseWhitespace: true, minifyCSS:true}))
            .pipe(gulp.dest(publicFolder));
});

gulp.task("build:minify-index-js", ["build:generateSW"], shell.task(`./node_modules/.bin/uglifyjs --compress --mangle -o ${publicFolder}/index.js --warnings false -- ${publicFolder}/index.js`));
gulp.task("build:minify-sw-worker-js", ["build:generateSW"], shell.task(`./node_modules/.bin/uglifyjs --compress --mangle -o ${publicFolder}/${sw_WorkerFile} --warnings false -- ${publicFolder}/${sw_WorkerFile}`));


gulp.task("build:remove-string-sw-worker", ["build:minify-sw-worker-js"], () => {
    gulp.src(`${publicFolder}/${sw_WorkerFile}`)
            .pipe(replace(publicFolder, ""))
            .pipe(gulp.dest(publicFolder));
});

gulp.task("default", ["watch"]);
gulp.task("build", ["build:clean", "build:copyToPublic", "build:vulcanize", "build:remove-comments", 
                    "build:copySafariJS", "build:generateSW","build:minify-index-js", "build:minify-sw-worker-js", "build:remove-string-sw-worker", "build:minify-html"]);
