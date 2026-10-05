# 🏎️ Word Race – Vokabelrennen für die Klasse

Die Lehrkraft zeigt ihre Ansicht am Beamer, bis zu **35 SchülerInnen** treten per **Code** bei und
tippen die Übersetzung der angezeigten Wörter. Richtig = schneller, falsch = langsamer.

## Starten

```bash
npm install
npm start          # http://localhost:3000   (anderer Port: PORT=8080 npm start)
```

- **Lehrkraft:** `/teacher.html` – Set einfügen (`Wort ; Übersetzung`, eine Zeile pro Vokabel), Raum öffnen,
  der 5-stellige Code erscheint groß auf dem Bildschirm.
- **SchülerInnen:** `/student.html` – Code + Name eingeben (Handy, Tablet oder Laptop, nur ein Browser nötig).

Der Server muss für alle erreichbar sein (gleiches WLAN oder im Internet gehostet). Für `https`
funktioniert `wss://` automatisch, wenn ein Reverse-Proxy (z. B. nginx) davor sitzt.

## Spielregeln

| | |
|---|---|
| 🚗 Richtig | Du wirst schneller. |
| 🔥 Schweres Wort | Stärkerer Schub und 2 Sekunden Boost. |
| 🐌 Falsch | Tempo weg, kurze Verlangsamung, kleiner Rückschritt (bei schweren Wörtern größer). Die richtige Lösung wird angezeigt. |
| 🌀 / 🛢️ / 🛡️ | Nach je 3 richtigen Antworten in Folge: Abkürzung, Ölspur (bremst die/den Führende/n) oder Schild. |

Die Runde endet, wenn alle im Ziel sind oder die Zeit abgelaufen ist (oder die Lehrkraft beendet).

### Schwierigkeit der Wörter
Sie ist in den Sets nicht eingetragen und wird geschätzt: Start nach Länge der gesuchten Antwort
(relativ zum Set, je ein Drittel leicht/mittel/schwer), danach Anpassung an die echten Antworten.
Die Lehrkraft-Seite speichert diesen Verlauf pro Set im Browser (`localStorage`) und gibt ihn
beim nächsten Raum wieder mit.

### Was als richtig zählt
Groß-/Kleinschreibung, Satzzeichen und Akzente sind egal (`muede` = `müde`, aber `schon` ≠ `schön`).
Artikel und „to“ dürfen fehlen, falsche Artikel sind falsch. Mehrere Lösungen mit Komma trennen
(`house ; Haus, Gebäude`). Bei Wörtern ab 8 Buchstaben wird ein Tippfehler verziehen (abschaltbar).

## Aufbau

- `server.js` – HTTP + WebSocket, Räume, Codes (alle Prüfungen laufen serverseitig, Lösungen verlassen den Server nur nach einem Fehler)
- `src/engine.js` – Spiellogik ohne Netzwerk/DOM
- `public/` – `teacher.html`, `student.html`, `index.html`, `style.css`
- `test/` – `npm test`
