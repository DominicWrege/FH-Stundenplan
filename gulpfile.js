const gulp = require("gulp")
const vulcanize = require("gulp-vulcanize");
const uglify = require("gulp-uglify");
const del = require('del');
const swPrecache = require("sw-precache");
const replace = require("gulp-replace");
// const removeHtmlComments = require("gulp-remove-html-comments");

const removeComments = require('gulp-strip-comments');
const srcPath = "src/";

const srcIndexFile = "index.html";
const publicFolder = "public";


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
    swPrecache.write("public/service-worker.js", {
        staticFileGlobs: [
            publicFolder + "/index.html",
            publicFolder + "/manifest.json",
            publicFolder + "/icons/*.*",
            publicFolder + "/Roboto/*.ttf"
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
    }, callback).then(() => {
        gulp.src(publicFolder + "/service-worker.js")
            .pipe(uglify())
            .pipe(replace(publicFolder, ""))
            .pipe(gulp.dest(publicFolder));
    });
});

gulp.task("build:remove-comments", ["build:vulcanize"], (callback) => {
    console.log("djasb");
    return gulp.src("public/index.html")
        .pipe(removeComments())
        .pipe(gulp.dest("public"));
});


gulp.task("build:vulcanize", ["build:copyToPublic"], () => {
    return gulp.src(srcIndexFile)
        .pipe(vulcanize({
            inlineScripts: true,
            inlineCss: true,
            stripComments: true
        }))
        .pipe(replace('src/style/Roboto/Roboto', 'Roboto/Roboto'))
        .pipe(gulp.dest(publicFolder));
});


gulp.task("default", ["watch"]);
gulp.task("build", ["build:clean", "build:copyToPublic", "build:vulcanize","build:remove-comments", "build:generateSW"]);

//  "build:copyToPublic", "build:generateSW"
// gulp.task("watch", () => {
//     //gulp.watch(["index.html", "src/**/*.html", "src/**/*.js", "src/style.css"], ["vulcanize"]);
//     // gulp.watch("public/index.html", ["generateSW"]);
// });