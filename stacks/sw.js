/* Stacks service worker — offline app shell */
const CACHE = "stacks-v2";
const SHELL = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png", "icon-512-mask.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  // Never cache API calls (Discogs etc.) — always go to network
  if (req.url.includes("api.discogs.com") || req.url.includes("ebay.com") || req.url.includes("discogs.com/search")) return;
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      // runtime-cache fonts & same-origin assets
      if (res.ok && (req.url.includes("fonts.g") || new URL(req.url).origin === location.origin)) {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
      }
      return res;
    }).catch(() => caches.match("index.html")))
  );
});
