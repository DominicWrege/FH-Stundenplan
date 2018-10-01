module.exports = {
    staticFileGlobs: [
        "src/**/*.{js,html,css,ttf}",
        "icons/*.{png,svg,ico}",
        "bower_components/**",
        "manifest.json",
        "index.html",
        "index.js",
        "service-worker.js"
    ],
    runtimeCaching: [{
        urlPattern: /ws.inf.fh-dortmund.de/,
        handler: "cacheFirst",
        options: {
            name: "api-cache"
        }
    }]
};