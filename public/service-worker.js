let doCache = true;
let CACHE_NAME = 'simple-pwa-todo-cache-v1';

// updating cache
self.addEventListener("activate", event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys()
            .then(keyList =>
                Promise.all(keyList.map(key => {
                    if (!cacheWhitelist.includes(key)) {
                        console.log('Deleting cache: ' + key)
                        return caches.delete(key);
                    }
                }))
            )
    );
});

// install trigger for first start
self.addEventListener('install', function (event) {
    if (doCache) {
        event.waitUntil(
            caches.open(CACHE_NAME)
                .then(function (cache) {
                    fetch("asset-manifest.json")
                        .then(response => {
                            response.json()
                        })
                        .then(assets => {
                            // open a cache and cache our files
                            // caches the page and the main.js generated by webpack
                            const urlsToCache = [
                                "/",
                                assets["main.js"]
                            ]
                            cache.addAll(urlsToCache)
                            console.log('cached');
                        })
                })
        );
    }
});

// intercept fetching and serve matching files
self.addEventListener('fetch', function (event) {
    if (doCache) {
        event.respondWith(
            caches.match(event.request).then(function (response) {
                return response || fetch(event.request);
            })
        );
    }
});