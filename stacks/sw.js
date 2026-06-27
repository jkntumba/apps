/* Stacks service worker — network-first app shell + runtime cover-image cache (offline-friendly) */
const CACHE = "stacks-v10", IMG_CACHE = "stacks-img-v1", IMG_CAP = 600;
const SHELL = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png", "icon-512-mask.png"];
const IMG_HOSTS = ["i.discogs.com", "mzstatic.com", "coverartarchive.org"]; // album-cover CDNs (Discogs + iTunes + MusicBrainz/Cover Art Archive)

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE && k !== IMG_CACHE).map(k => caches.delete(k)))
  ).then(() => self.clients.claim()));
});

async function trimCache(name, cap) {
  const c = await caches.open(name); const keys = await c.keys();
  for (let i = 0; i < keys.length - cap; i++) await c.delete(keys[i]); // simple FIFO cap
}

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  let url; try { url = new URL(req.url); } catch (_) { return; }

  // never cache live API calls — always hit the network
  if (url.hostname === "api.discogs.com" || url.hostname.includes("ebay.com") || url.hostname.includes("itunes.apple.com") || url.hostname.endsWith("musicbrainz.org")) return;

  // cover images (cross-origin CDNs) — cache-first so they survive offline; size-capped
  if (req.destination === "image" && IMG_HOSTS.some(h => url.hostname.endsWith(h))) {
    e.respondWith(caches.open(IMG_CACHE).then(c => c.match(req).then(hit =>
      hit || fetch(req).then(res => {
        if (res && (res.ok || res.type === "opaque")) { c.put(req, res.clone()); trimCache(IMG_CACHE, IMG_CAP); }
        return res;
      })
    )));
    return;
  }

  // navigations / HTML — network-first so deploys reach installed users; fall back to cache offline
  if (req.mode === "navigate" || req.destination === "document") {
    e.respondWith(
      fetch(req).then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put("index.html", copy)); return res; })
        .catch(() => caches.match(req).then(h => h || caches.match("index.html")))
    );
    return;
  }

  // everything else (fonts, icons, same-origin assets) — cache-first with runtime fill
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (res.ok && (url.href.includes("fonts.g") || url.origin === location.origin)) {
        const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy));
      }
      return res;
    }).catch(() => caches.match("index.html")))
  );
});
