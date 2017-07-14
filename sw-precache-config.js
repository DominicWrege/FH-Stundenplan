module.exports = {
    staticFileGlobs: [
        'index.html',
        'manifest.json',
        'icons/*.*'
    ],
    path: 'public',
    verbose: true,
    runtimeCaching: [{
        urlPattern: /ws.inf.fh-dortmund.de/,
        handler: 'cacheFirst',
        options: {
            name: 'api-cache'
        }
    }]
};