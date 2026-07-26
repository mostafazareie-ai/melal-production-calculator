const CACHE = 'mellalchem-v13';
const FILES = ['./', './index.html', './manifest.json', './assets/icon.png', './assets/icon-192.png', './assets/icon-512.png', './assets/splash.jpg', './assets/dev-photo.jpg', './assets/B-NAZANIN.TTF', './assets/B_Titr_Bold_0.ttf'];

self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));
  self.skipWaiting();
});
self.addEventListener('activate', e=>{ self.clients.claim(); });
self.addEventListener('fetch', e=>{
  e.respondWith(
    caches.match(e.request).then(res=> res || fetch(e.request).then(fresp=>{
      return caches.open(CACHE).then(c=>{ c.put(e.request, fresp.clone()); return fresp; });
    }).catch(()=> caches.match('./index.html')))
  );
});
