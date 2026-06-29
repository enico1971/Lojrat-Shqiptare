/* Lojërat Shqiptare — Service Worker (SELBST-ABMELDUNG / Cache-Killer)
   Dieser Worker cacht NICHTS und meldet sich selbst ab. Er existiert nur, um
   alte, festhängende Service Worker + deren Caches auf Geräten zu entfernen.
   Danach lädt die App immer direkt vom Server (Netlify) = immer aktuell. */
self.addEventListener('install', function (e) {
  self.skipWaiting();
});

self.addEventListener('activate', function (e) {
  e.waitUntil((async function () {
    // 1) Alle Caches löschen
    try {
      var keys = await caches.keys();
      await Promise.all(keys.map(function (k) { return caches.delete(k); }));
    } catch (err) {}
    // 2) Diesen Service Worker komplett abmelden
    try { await self.registration.unregister(); } catch (err) {}
    // 3) Offene Fenster neu laden -> holen jetzt die frische Version vom Netz
    try {
      var cs = await self.clients.matchAll({ type: 'window' });
      cs.forEach(function (c) { c.navigate(c.url); });
    } catch (err) {}
  })());
});
/* Kein fetch-Handler: nichts wird abgefangen, alles kommt frisch vom Server. */
