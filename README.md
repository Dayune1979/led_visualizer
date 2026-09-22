# LED Unikate — WLED Visualizer

Canvas-2D-Visualisierung fuer selbstgebaute LED-Objekte und WLED-Effekte,
als installierbare PWA. Zehn Formen (Ananas, Weihnachtsbaum, Erdbeere, Pilz,
Fussball, Donut, Kugel, Infinity Cube, LED-Matrix, Helix), frei drehbar,
dazu das Custom Effects Lab zum Zusammenbauen eigener Muster.

Die Anzeige ist eine Simulation. Eine echte Verbindung zu einem WLED-Geraet
gibt es (noch) nicht — das `CONNECTED`-Pill in der Topbar ist Kulisse.

## Herkunft

Basis ist `pineapple-led-wled-lab_10.html` vom 10.05.2026 aus dem
Visualizer-Projektordner. Der erste Commit hier ist diese Datei unveraendert,
damit der PWA-Umbau als Diff lesbar bleibt.

## Aufbau

| Datei | Zweck |
|---|---|
| `index.html` | die komplette App, eine Datei, kein Build |
| `manifest.webmanifest` | Name, Icons, Standalone-Anzeige |
| `sw.js` | Service Worker: Navigation network-first, Rest cache-first |
| `icon-*.png` | App-Icons, `-maskable` mit Sicherheitsrand fuer Android |

## Lokal starten

Ein Service Worker braucht `http://localhost` oder HTTPS — ueber `file://`
laeuft die App zwar, installierbar ist sie dann aber nicht.

```
npx --yes serve .
```

## Deployment

GitHub Pages, Quelle `main` / root. Danach ist die Seite unter
`https://<user>.github.io/<repo>/` erreichbar und laesst sich am Handy
ueber "Zum Startbildschirm hinzufuegen" installieren.

Nach einem Deploy die Version in `sw.js` hochzaehlen (`var VERSION`),
sonst haelt ein bereits installierter Client seinen alten Cache.

## Offen

- Demo-Modus: Presets ueber URL-Hash, Attract-Modus, Wake Lock, Vollbild
- Schriften liegen bei Google Fonts; offline greift der Fallback-Font
- echte WLED-Steuerung per JSON-API (Achtung: HTTPS-Seite kann kein
  `http://`-Geraet im LAN ansprechen — Mixed Content)
