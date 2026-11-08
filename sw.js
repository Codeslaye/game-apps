// Keeps the family apps working with no internet after the first visit.
const CACHE = "family-apps-v7-2026-11-08";
const FILES = ["./", "index.html", "icon-180.png", "brain-games/", "brain-games/index.html", "brain-games/manifest.webmanifest", "brain-games/icon-180.png", "brain-games/icon-512.png", "recipes/", "recipes/index.html", "recipes/manifest.webmanifest", "recipes/icon-180.png", "recipes/icon-512.png", "family-tree/", "family-tree/index.html", "family-tree/manifest.webmanifest", "family-tree/icon-180.png", "family-tree/icon-512.png", "bible/", "bible/index.html", "bible/manifest.webmanifest", "bible/icon-180.png", "bible/icon-512.png", "cards/", "cards/index.html", "cards/manifest.webmanifest", "cards/icon-180.png", "cards/icon-512.png"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(f => new URL(f, self.registration.scope).href))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.indexOf("family-apps-") === 0 && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(caches.open(CACHE).then(async c => {
    const hit = await c.match(e.request, { ignoreSearch: true });
    const net = fetch(e.request).then(r => { if (r && r.ok && new URL(e.request.url).origin === location.origin) c.put(e.request, r.clone()); return r; }).catch(() => null);
    if (hit) { e.waitUntil(net); return hit; }
    const r = await net;
    return r || new Response("Offline", { status: 503 });
  }));
});
