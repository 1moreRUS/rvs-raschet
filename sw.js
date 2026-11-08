/* Работа без интернета: программа и её файлы кэшируются при первом открытии. */
const CACHE = 'rvs-2.0.0-3';
const FILES = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png',
  'g-f3.jpg', 'g-t3.jpg', 'g-f4.jpg', 'g-f56.jpg', 'g-f7.jpg', 'g-f8.jpg', 'g-t4.jpg', 'g-t5.jpg', 'g-f9.jpg', 'g-f1011.jpg', 'km2-II.jpg', 'km2-III.jpg', 'km3-VI.jpg', 'km4-view.jpg', 'km4-mass.jpg', 'km5-AA.jpg', 'km5-notes.jpg'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  // страница: сначала сеть (чтобы получать обновления), без сети — из кэша
  if (r.mode === 'navigate') { e.respondWith(fetch(r).then(res => { const c = res.clone(); caches.open(CACHE).then(x => x.put('index.html', c)); return res; }).catch(() => caches.match('index.html'))); return; }
  e.respondWith(caches.match(r).then(m => m || fetch(r).then(res => { if (res.ok) { const c = res.clone(); caches.open(CACHE).then(x => x.put(r, c)); } return res; })));
});
