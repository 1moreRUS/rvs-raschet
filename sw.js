/* Работа без интернета: программа и её файлы кэшируются при первом открытии. */
const CACHE = 'rvs-2.0.0-2';
const FILES = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png',
  'frags/g-f3.jpg', 'frags/g-t3.jpg', 'frags/g-f4.jpg', 'frags/g-f56.jpg', 'frags/g-f7.jpg', 'frags/g-f8.jpg', 'frags/g-t4.jpg', 'frags/g-t5.jpg', 'frags/g-f9.jpg', 'frags/g-f1011.jpg', 'frags/km2-II.jpg', 'frags/km2-III.jpg', 'frags/km3-VI.jpg', 'frags/km4-view.jpg', 'frags/km4-mass.jpg', 'frags/km5-AA.jpg', 'frags/km5-notes.jpg'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  // страница: сначала сеть (чтобы получать обновления), без сети — из кэша
  if (r.mode === 'navigate') { e.respondWith(fetch(r).then(res => { const c = res.clone(); caches.open(CACHE).then(x => x.put('index.html', c)); return res; }).catch(() => caches.match('index.html'))); return; }
  e.respondWith(caches.match(r).then(m => m || fetch(r).then(res => { if (res.ok) { const c = res.clone(); caches.open(CACHE).then(x => x.put(r, c)); } return res; })));
});
