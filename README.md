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

Laeuft auf GitHub Pages, Quelle `main` / root:

**https://dayune1979.github.io/led_visualizer/**

Am Handy ueber "Zum Startbildschirm hinzufuegen" installierbar.

Nach einem Deploy die Version in `sw.js` hochzaehlen (`var VERSION`),
sonst haelt ein bereits installierter Client seinen alten Cache.

## Vorfuehren

Die Knopfleiste am rechten Rand des Canvas:

| | |
|---|---|
| ▶ | Vorfuehrmodus - wechselt alle 18 Sekunden die Form, nach einer vollen Runde den Effekt |
| Kette | Link zur aktuellen Ansicht in die Zwischenablage |
| Rahmen | Vollbild (nur wo der Browser es unterstuetzt; iOS hat es nicht) |

Der Zustand steht im Hash und laesst sich teilen:

```
https://dayune1979.github.io/led_visualizer/#shape=cube&fx=cPride2015&pal=cubePal&mode=parallel&spd=9
```

Schluessel: `shape`, `fx`, `pal`, `mode` (Helix P/M, Cube linear/parallel,
Fussball-Verdrahtung), `spd`, `bri`. Unbekannte Effekte oder Paletten werden
ignoriert statt angewendet. Lab-Effekte und Solid-Farben traegt der Hash
nicht - die haengen an Einstellungen, die dort nicht hineinpassen.

Waehrend der Vorfuehrung haelt ein Wake Lock den Bildschirm wach, sofern das
Geraet ihn gewaehrt.

## Offen

- echte WLED-Steuerung per JSON-API (Achtung: HTTPS-Seite kann kein
  `http://`-Geraet im LAN ansprechen — Mixed Content)
- Lab-Effekte lassen sich nicht per Link teilen
