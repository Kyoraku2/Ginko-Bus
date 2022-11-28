const cacheName = 'ginkobus-sw-v1';

const contentToCache = [
    '/icons/favicon.ico',
    '/icons/icon-32.png',
    '/icons/icon-64.png',
    '/icons/icon-96.png',
    '/icons/icon-128.png',
    '/icons/icon-168.png',
    '/icons/icon-180.png',
    '/icons/icon-192.png',
    '/icons/icon-256.png',
    '/icons/icon-512.png',
    '/icons/maskable_icon.png',
    '/index.html',
    '/style.css'
]

self.addEventListener('install', (e) => {
    console.log('[Service Worker] Install');
    e.waitUntil((async () => {
        const cache = await caches.open(cacheName);
        console.log('[Service Worker] Caching all: app shell and content');
        await cache.addAll(contentToCache);
    })());
});

self.addEventListener('fetch', (e) => {
    // Cache only
    if(contentToCache.some(file => e.request.url.endsWith(file.substring(2)))) {
        console.log('[Service Worker] Loading from cache: '+e.request.url);
        e.respondWith(caches.match(e.request));
    }else{ // Net
        console.log('[Service Worker] Loading from network: '+e.request.url);
        e.respondWith(
            fetch(e.request).catch(function () {
              return caches.match(e.request);
            }),
        );
    }
    /*e.respondWith((async () => {
        const r = await caches.match(e.request);
        console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
        if (r) { return r; }
        const response = await fetch(e.request);
        const cache = await caches.open(cacheName);
        console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
        cache.put(e.request, response.clone());
        return response;
    })());*/
});


self.addEventListener('activate', (e) => {
    e.waitUntil(
        // cleaning previous caches
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if(cacheName.indexOf(key) === -1) {
                    console.log("[Service Worker] Cleaning old cache");
                    return caches.delete(key);
                }
          }));
        })
    );
  });