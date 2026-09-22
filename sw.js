/* Service Worker fuer die LED-Unikate-PWA.
   Strategie: Navigation network-first (damit ein Deploy ankommt),
   alles andere cache-first mit opportunistischem Nachcachen. */

var VERSION = 'v4';
var CACHE   = 'led-unikate-' + VERSION;

var ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-512-maskable.png',
  './apple-touch-icon.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE)
      .then(function (c) {
        /* Nicht c.addAll: das geht durch den HTTP-Cache und wuerde beim
           Nachinstallieren womoeglich genau die alten Dateien einfrieren,
           die dieser Deploy ersetzen soll. cache:'reload' holt sie frisch. */
        return Promise.all(ASSETS.map(function (u) {
          return fetch(u, { cache: 'reload' }).then(function (res) {
            if (!res.ok) throw new Error('Precache fehlgeschlagen: ' + u);
            return c.put(u, res);
          });
        }));
      })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(keys.filter(function (k) { return k !== CACHE; })
                               .map(function (k) { return caches.delete(k); }));
      })
      .then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;

  if (req.mode === 'navigate') {
    /* GitHub Pages liefert HTML mit Cache-Control: max-age=600 aus. Ein
       schlichtes fetch(req) geht durch den HTTP-Cache und geben damit zehn
       Minuten lang die alte Seite zurueck - network-first waere in Wahrheit
       cache-first. Deshalb no-store: die Seite selbst kommt immer frisch,
       offline faengt der Cache sie ab. */
    e.respondWith(
      fetch(req.url, { cache: 'no-store' })
        .then(function (res) {
          if (!res || !res.ok) throw new Error('kein brauchbares Dokument');
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put('./index.html', copy); });
          return res;
        })
        .catch(function () { return caches.match('./index.html'); })
    );
    return;
  }

  e.respondWith(
    caches.match(req).then(function (hit) {
      if (hit) return hit;
      return fetch(req).then(function (res) {
        /* Eigene Dateien und die Google-Schriften mitnehmen,
           damit es offline nicht nackt aussieht. */
        var sameOrigin = req.url.indexOf(self.location.origin) === 0;
        /* Das Stylesheet von fonts.googleapis.com kommt per @import als
           no-cors-Anfrage und damit opaque zurueck: status 0, res.ok false.
           Wer nur res.ok prueft, cacht die woff2-Dateien, aber nie die CSS,
           die sie einbindet - offline greift dann doch der Fallback-Font. */
        var brauchbar = res.ok || res.type === 'opaque';
        if (brauchbar && (sameOrigin || req.url.indexOf('fonts.g') !== -1)) {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copy); });
        }
        return res;
      }).catch(function () { return caches.match(req); });
    })
  );
});
