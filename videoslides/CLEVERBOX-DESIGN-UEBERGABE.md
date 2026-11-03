# Cleverbox: Design- und Arbeitsrichtlinien (Übergabe für einen neuen Chat)

Diese Datei fasst alles zusammen, was in diesem Projekt entschieden und gebaut wurde.
Wer sie liest, soll ohne Rückfragen im selben Stil weiterarbeiten können.

Stand: 3. November 2026
Repository: `arminheske/claudecloud`, Branch `claude/gracious-planck-zbdygj`, Ordner `videoslides/`
Quellcode der Generatoren: `videoslides/_quellcode/` (siehe Abschnitt 11)

---

## 0. Kurzfassung: die zehn wichtigsten Regeln

1. **Sprache ist Deutsch.** Der Nutzer duzt, alle Texte (auch Folien und Arbeitsblätter) sind österreichisches Deutsch (z. B. „Jänner“, „Hausübung“, „rechtwinkelig“).
2. **Alles wird als bearbeitbare PPTX geliefert**, damit sie in Canva importiert werden kann. Der Nutzer wurde laut, als ich nur PNG geliefert habe („als pptx!!!!“). Bei Dokumenten (Arbeitsblätter) zusätzlich PDF zum Drucken. **Nie Word (.docx) für Gestaltetes.** Word nur für die Skripte mit Folienzuordnung.
3. **Format:** Folien und Videobilder 16:9. Dokumente, Arbeitsblätter, Angebote **A4 hochkant**. Das Format nie eigenmächtig ändern („Es soll trotzdem A4 bleiben!! war das nicht klar???“).
4. **Grundstil:** Poppins, helle getönte Fläche, große Überschriften mit Akzentwort (farbig markiert), runde Karten mit feiner Kontur, Nummernkreise, Chips, selbstgezeichnete Formen-Illustrationen statt Stockbilder.
5. **Jede Serie hat ihre eigene Palette** (Abschnitt 3). Mathematik ist **nur Blau**. Gelb ist bei Mathe abgelehnt, Neongrün auf Blau auch („wie kommst du auf so eine idee??“).
6. **Arbeitsblätter ohne Hintergrundfläche** (weiß, nur Konturen), kompakt (wenig Papier), mit Logo und QR-Code in der Kopfzeile.
7. **Thumbnails:** Titel riesig und prominent („es soll ja gut performen“), kurze Chips, einfache Grafik. Wenn der Nutzer „ohne Person“ sagt: keine KI-Figur, stattdessen eine nachgebaute Oberfläche (Fenster, Tabelle, Browser).
8. **Texte des Nutzers bleiben unverändert**, auch Tippfehler (sie werden nur benannt, nicht stillschweigend korrigiert). Offensichtliche Spracherkennungsfehler in SRT-Dateien („kleberbox“) nie übernehmen.
9. **Eindeutige Zuordnung per Name und Nummer** (z. B. Form 04 gehört zu Formel 04). Dateien und Ebenen tragen sprechende Namen.
10. **Immer prüfen, bevor geliefert wird:** PPTX validieren, mit LibreOffice rendern, das Ergebnis ansehen. Dann committen, pushen und die Dateien senden. Ehrlich melden, was nicht geprüft wurde.

---

## 1. Kontext

- **Kanal / Marke:** Cleverbox, YouTube-Kanal und Website für kostenlose Lernvideos. Claim im Logo: „modern. kostenlos. lehrreich.“
- **Inhaber:** Armin Heske (E-Mail des Nutzers: armin.heske@gmail.com, nur zur Identifikation).
- **Zielgruppe:** Lehrkräfte und Schüler:innen in Österreich.
- **Fächer / Serien:** Digitale Grundbildung (DBG), Betriebswirtschaft (BWL), Mathematik, Lingobox (Vokabeltool), Mathebox (Mathe-Übungen), Digibox (Programmieren).
- **Websites und Tools:**
  - Cleverbox: `www.cleverbox.co.at` (Lernmaterialien, Konto nötig, Quiz ohne Anmeldung für Schüler:innen)
  - Mathebox: `www.mathebox.at` (kostenlos, ohne Registrierung)
  - Lingobox: `www.lingobox.at` (Support: `support@lingobox.at`)
  - Digibox (Programmieren): im Skript als „www.dibibox.at“ geschrieben, in der Musterlösungs-PDF „Digibox“. **Schreibweise ungeklärt**, vor Verwendung nachfragen. Support laut Skript `support@dibibox.at`.
  - Kontakt für Themenwünsche auf cleverbox.co.at: laut Skript „info.kleberbox.co.at“ (Spracherkennungsfehler). Angenommen: `info@cleverbox.co.at`, **nicht bestätigt**.
- **Logo:** Kreis mit violett-blauem Verlauf und offener Kiste mit Schulsachen, daneben Schriftzug „cleverbox“ in Blau und die Tagline. Datei: `videoslides/cleverbox-logo.png` (transparent, 1844 × 684 px, Seitenverhältnis 0,371).
- **QR-Code:** `videoslides/qr-cleverbox-co-at.png` (führt zu `https://www.cleverbox.co.at`, getestet, dunkelblau auf weiß).

---

## 2. Arbeitsweise und Vorlieben des Nutzers (aus Rückmeldungen gelernt)

| Rückmeldung | Regel daraus |
|---|---|
| „du hättest noch ein wenig kreativer sein können … wirken ein wenig erzwungen“ | Eigene Grafiken aus einfachen Formen entwerfen statt Referenzgrafiken nachzubauen. Nicht erzwungen wirken. |
| „du hast mich falsch verstanden! die seiten bleiben so wie sie sind“ | Bei Änderungswünschen den bestehenden Stand nicht verändern, sondern zusätzlich liefern. Im Zweifel kurz zurückfragen, wenn die Deutung ernsthaft offen ist. |
| „warum plötzlich keine pptx“ / „als pptx!!!!“ | PPTX ist immer Hauptformat. Nie nur PNG. |
| „es soll trotzdem A4 bleiben!!“ | Format aus der ersten Anweisung beibehalten. |
| „Das gelb passt finde ich nicht“ / „auch nicht neongrün … ich möchte nur blau“ | Mathematik ausschließlich in Blautönen. Kein Gelb, kein Neongrün. Bei Farbwunsch nicht eigenmächtig Farben aus anderen Serien holen. |
| „Der Text … ist eine Anweisung“ | Hinweise wie „(verbunden A1:C1, Größe 24)“ sind Anweisungen an mich, nicht Inhalt. Umsetzen, nicht abdrucken. |
| „Das braucht zu viel Papier“ | Arbeitsblätter kompakt: zwei Spalten, wenig Leerraum, möglichst 2 Seiten. |
| „1 Formel zu einer Form. Per Namen eindeutig“ | Nummerierte Paare, gleiche Slugs, gleiche Ebenennamen. |
| „ohne Hintergrund weil es zum Drucken sonst unvorteilhaft ist“ | Druckmaterial: weiße Seite, nur Konturen, keine Flächenfüllungen außer winzigen Akzenten. |
| „So lernst du richtig programmieren soll viel prominenter sein“ | Der klickstärkste Titel wird groß über die ganze Breite gesetzt, Grafik wird kleiner. |
| „Statt :2 ein Bruchstrich mit 2“ | Mathematisch sauber setzen (echter Bruch, Hochstellung, Tiefstellung). |
| „die kleinen Quadrate … bitte entfernen“ | Dekoratives, das nicht verlangt wurde, weglassen (z. B. Rechtwinkel-Marken). |

Allgemein:
- Wenn der Nutzer nur eine Datei oder einen Text schickt, ohne Anweisung: nach dem etablierten Muster umsetzen (Skript → Folien + Skript mit Folienzuordnung; Arbeitsblatt-Datei → gestaltetes Arbeitsblatt + Lösungsblatt; SRT oder Skript + „Thumbnail“ → Thumbnail) und kurz sagen, was ich angenommen habe.
- Kurze, ehrliche Rückmeldung am Ende: was geliefert wurde, was geprüft wurde, was offen ist, plus ein konkretes Angebot für den nächsten Schritt.
- Keine Pull Requests ohne ausdrücklichen Wunsch. Commit-Nachrichten enden mit den Zeilen `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>` und `Claude-Session: https://claude.ai/code/session_0139kriXJ67p3UvpR2gsSR9G`.

---

## 3. Farbpaletten

Format: Hex ohne `#`. Alle Paletten haben dieselben Rollen.

| Rolle | Verwendung |
|---|---|
| BG | helle Seitenfläche |
| CARD | Karten |
| INK | Fließtext, dunkle Schrift |
| GREEN (Akzent) | Überschriften-Akzent, Kicker, Zahlen |
| NEON (Highlight) | Markierung hinter Akzentwörtern, Nummernkreise, Chips |
| DEEP | dunkle Flächen, Chips, Fensterköpfe |
| GRAY | Nebentext |
| LINE | Konturen |
| CHIP | helle Chips, abwechselnde Zellen |
| DEEP2 / DEEPLINE / DSUB | Karte, Kontur und Nebentext auf dunklem Hintergrund |

### 3.1 Grün (Digitale Grundbildung, Informatik, Programmieren, Excel, Access, Datentypen, Farben/Hex, TikTok, ChatGPT)
```
BG EFFBDC  CARD FBFFF4  INK 0E1F0C  GREEN 26720A  NEON B1FF37  DEEP 12301A
GRAY 5B6B50  LINE B8D98A  CHIP DDF3B8  TAB2 EAF8CF  DEEP2 1B4527  DEEPLINE 2F6B3E  DSUB A9C79A
```
Für Druck (Arbeitsblätter, Musterlösungen): `BG FFFFFF`, `CARD FFFFFF`, `NEON D4F77A` (hellere Markierung).

### 3.2 Teal (Betriebswirtschaft, Farbe vom Nutzer: #d8f2f2)
```
BG D8F2F2  CARD F3FCFC  INK 0B2326  GREEN 0A5C66  NEON 5FE0E6  DEEP 0F3A40
GRAY 4A6A6E  LINE 9FCFD2  CHIP BFE8EA  DEEP2 17525A  DEEPLINE 2F7C85  DSUB A9D7DB
```

### 3.3 Rosa (Lingobox, Farbe vom Nutzer: #ebcbe2)
```
BG EBCBE2  CARD FBF1F8  INK 2B1027  GREEN 7A1F6B  NEON F58AD2  DEEP 3D1636
GRAY 6B4A64  LINE D3A0C6  CHIP F3DDEC  TAB2 EFD5E7  DEEP2 55234C  DEEPLINE 8A4A7E  DSUB E2B8D6
```

### 3.4 Blau (Mathematik, Mathebox, Flächeninhalt, Textgleichungen, römische Zahlen) – **nur Blau**
```
BG DCEBFA (Folie/Zusammenfassung)  / FFFFFF (Arbeitsblatt)
CARD F4F9FF / FFFFFF   INK 0B1E3A   GREEN 14459A (Zusammenfassung 1F5FBF)
NEON 8DBBF2 (Folie) / BCD6F5 (Arbeitsblatt)   DEEP 0F2A52
GRAY 4A5F7A   LINE A9C6EA (Folie) / 8DBBF2 (Arbeitsblatt)   CHIP C9DDF5 / E3EEFB
DEEP2 1B3D75   DEEPLINE 3B66A8   DSUB B5CCEC
```
**Verboten bei Mathe:** Gelb (FFD84D), Neongrün (B1FF37), Orange als Akzent. Das Sponsoring-Angebot der Mathebox (`mathebox-sponsoring-a4.pptx`) hat noch das alte Gelb. Der Nutzer wurde gefragt, ob es auch auf Blau soll, Antwort steht aus.

### 3.5 Cleverbox-Markenfarben (aus dem Cleverbox-Farbprofil des Nutzers)
```
Cleverbox-Blau (Schriftzug, Buttons, Links) 475BA6   Blau dunkel (Hauptüberschriften) 36448A
Tiefblau 304890   Violett 6048A8   Violett hell 7860A8   Lavendel 9090C0
Stahlblau 6090C0   Himmelblau 48A8D8   Cyan (hellster Punkt im Kreis) 60C0F0
Blau hell (Hover, Chips) ECEEF8   Blau Rahmen D3D8EE   Karte FAFAFA   Menüleiste F5F5F5
Seitenhintergrund E5E5E5   Weiß FFFFFF   Text 333333   Text gedämpft 666666
Erfolg 4FA43C   Fehler C62828   Warnung F9A825
```
Verwendet für allgemeine Cleverbox-Themen (z. B. Excel-Tabelle Haushaltsplaner, Thumbnail „Unterrichtsmaterial“). Dort ist Cyan 60C0F0 der Akzent.

### 3.6 Zusatzfarben
- **Warnung / Fehler / „übersprungen“:** Orange `FF7A45` (in allen Serien).
- **RGB-Demos (Farben-Video):** reine Lichtfarben FF0000, 00FF00, 0000FF, Gelb FFFF00, Magenta FF00FF, Cyan 00FFFF. Beispielfarbe `#c0392b`.

---

## 4. Typografie

- **Hauptschrift: Poppins** (in PPTX immer `fontFace: 'Poppins'`). Überschriften normal oder fett, Akzentwörter farbig und markiert.
- **Mono für Code/Farbcodes:** `Courier New`, fett.
- **Poppins ist auf dem Rechner, auf dem gerendert wird, nicht installiert.** Vorschau-Renderings und PNGs nutzen **Inter** als Ersatz (Dateien `/usr/share/fonts/opentype/inter/…`). In Canva stimmen die Umbrüche dann leicht anders. Das jedes Mal als Hinweis nennen.
- **Umrechnung PNG ↔ PPTX:** Schriftgröße in PPTX (pt) = Pixelgröße im PNG × 0,75 × 0,9 (bei 96-dpi-Bezug). Bei 120-px/Inch-Canvas (Formen/Formeln, 1600 px breit) = px × 0,6 × 0,9. Bei 144-px/Inch-Canvas (Tabelle, 1920 px) = px × 0,5 × 0,9.
- **Thumbnail-Titel in PNG:** `InterDisplay-BlackItalic.otf`, in PPTX Poppins fett kursiv.
- **Größen Folien (16:9):** Kicker 18 pt fett; Überschrift 38–44 pt (Variante bis 54 pt für Titelfolien), Zeilenabstand 1,05; Untertext 18–20 pt; Karten-Text 15–17 pt; Chips 13–16 pt.
- **Größen Arbeitsblatt (A4):** Titel 24–30 pt, Aufgabentext 11,5–12,5 pt, Beschriftungen 9–10 pt.

---

## 5. Folien (16:9) – Aufbau und Regeln

**Maße:** `LAYOUT_WIDE` = 13,333 × 7,5 Zoll. Linker Textbereich x 0,7 bis 6,9, rechter Bildbereich x 7,2 bis 12,6, y 1,0 bis 6,5. Fußzeile links unten: „Cleverbox · Digitale Grundbildung“ (je Serie anpassen).

**Drei Folienmodi** (als Slide-Master definiert):
- `LIGHT`: Hintergrund BG, Standardfolie.
- `DARK`: Hintergrund DEEP, für Einstieg, Wechsel, Fragen.
- `NEON`: Hintergrund NEON, für Pointen, Ergebnisse, Merksätze.
Abwechslung der Modi wirkt als Rhythmus. Typischer Ablauf: Titel DARK, Erklärung LIGHT, Pointe NEON, Aufgaben LIGHT, Zusammenfassung LIGHT, Merksatz NEON, Abspann DARK.

**Aufbau einer typischen Folie:** Kicker (Abschnittsname, fett, Akzentfarbe) → Überschrift mit **einem** markierten Akzentwort (`highlight`-Option) → Untertext in GRAY → rechts die Grafik oder Karten.

**Bausteine (Helferfunktionen):** `mk(mode,label)`, `kicker`, `head(c,segs,x,y,w,h,size)` mit Segmenten `[text, istAkzent]`, `sub`, `card`, `badge`, `circleNum`, `tile`, `dot`, `arrow`, `bubble`, `check` (aus zwei gedrehten Balken), `xmark`, `table`, `codeWin`, `steps` (nummerierte Liste mit Hervorhebung), `grid`, `robot`. Siehe `_quellcode/build15.js` (Helfer-Kopf) und `build26.js`/`build27.js` (Beispiele).

**Grafikprinzipien:**
- Eigene Darstellung aus einfachen Formen: Fenster, Karten, Kacheln, Pfeile, Sprechblasen, Telefon, Tabellen, Rasterwelt mit Roboter.
- Schritte schrittweise sichtbar machen (Folie 2 zeigt alle, Folie 3 hebt Schritt 1–2 hervor, Folie 4 die restlichen).
- Rechnungen schrittweise aufbauen (kumulativ pro Folie).
- Warnendes in Orange, Positives mit Häkchen.

---

## 6. Folien-Skript mit exakter Zuordnung (docx)

Zu jedem Video-Skript gibt es ein Word-Dokument `skript-<thema>-mit-folien.docx`:
- Zweispaltige Tabelle: links Folien-Thumbnail (5,8 cm) und „FOLIE n · Titel“, rechts die Folien-Nummer als Neon-Balken, „Beginn: …“, der **unveränderte** Sprechertext, „Ende: …“. Hintergrund der rechten Zelle BG.
- **Folienwechsel nur an Satzenden.** Jede Folie genau einmal, in Reihenfolge.
- Tippfehler des Nutzers bleiben stehen und werden in der Einleitung des Dokuments genannt.
- Platzhalter-Notizen des Nutzers (z. B. „HIER EVENTUELL NOCH EINE ERKLÄRUNG FÜR SYNTAX“) werden als optionale Folie markiert.
- Nicht gesprochene Teile (Zwischenüberschriften, Aufnahmehinweise, Längenangaben) werden weggelassen und das in der Einleitung gesagt.
- Generator: `_quellcode/mkscript5.py` (Beispiel), Thumbnails per `pdftoppm -jpeg -r 50`.

---

## 7. Thumbnails (YouTube, 1280 × 720)

**Aufbau (Standard):**
- Linke Seite (x 60 bis ca. 640): kleiner **Tag** (Neon-Pille mit Thema), **Titel** in 2 bis 3 Zeilen, **letzte/wichtigste Zeile auf einem Neon-Balken** (abgerundet), darunter **Chips** (dunkle Pillen mit Neon-Schrift, 2 bis 4 Stück).
- Rechte Seite: eine Grafik (Person oder Oberfläche). Oben rechts oft eine kleine Mini-Grafik (Tabelle, Karte, Stellenanzeige).
- Hintergrund: Verlauf von hell nach der Palette-Farbe, darüber **unscharfe Fachbegriffe** (Gaußscher Weichzeichner Radius 7, Schriftdeckkraft ca. 50 bis 70).
- Schatten unter Fenstern und Figuren (Weichzeichner 14).

**Titelgröße:** automatisch so wählen, dass die längste Zeile in die vorgesehene Breite passt (`size -= 2` in einer Schleife). Faustregel: kürzere Titelwörter groß, lange Wörter ergeben kleine Schrift. Für Klickstärke große Zeilen bevorzugen.

**Varianten:**
- **Mit Person:** freigestellte KI-Figur (`figur-freigestellt.png`, mit GrabCut freigestellt) links, Text rechts. Nur verwenden, wenn der Nutzer nichts anderes sagt.
- **Ohne Person** (häufig verlangt): Text links, rechts eine nachgebaute Oberfläche: Tabellenfenster (Excel, „Mappe1.xlsx“, Formelleiste, Σ-Kreis), Browserfenster (cleverbox.co.at, Logo, drei Karten, Button „Kostenloses Konto erstellen“), PDF-Blatt → Lingobox-Fenster mit Pfeil, Programmierfenster mit Blockprogramm und Spielfeld.
- **Großer Titel** (Programmieren-Thumbnail): „SO LERNST DU RICHTIG“ / „PROGRAMMIEREN“ über die volle Breite, Unterzeile und Chips darunter, Grafik klein unten rechts.

**Lieferung:** immer **PNG + PPTX mit Ebenen** (Hintergrund, Tag, Titel pro Zeile, Balken, Chips, jedes Grafikelement einzeln benannt). Bei Alternativen mehrere nummerierte/benannte Dateien (`…-a`, `-b`, `-c`). Dateiname: `cleverbox-thumbnail-<thema>.png|pptx`.

**Technik:** Elementliste in Python (`rr` Rundrechteck, `el` Ellipse, `tx` Text, `tri` Dreieck, `img` Bild, `ar` Pfeil) → PNG per PIL und PPTX per generischem JS-Renderer. Beispiele: `_quellcode/mkcb.py`, `mkdbg.py`, `mklb2.py` (+ `build34.js`, `build36.js`).

**Textideen die funktioniert haben:** „Datingtipps“-Klang vermeiden (Personalbeschaffung: „PERSONAL SUCHEN & FINDEN“). Kurze Chips mit Stichwörtern. Keine erfundenen Versprechen; erfundene Chips im Antworttext benennen.

---

## 8. Dokumente und Arbeitsblätter (A4 hochkant)

**Seite:** 8,27 × 11,69 Zoll, Inhaltsbreite 7,07 Zoll, linker Rand 0,6, Fußzeile y = 11,3.

**Kopfzeile (alle Seiten):**
- Logo links: `cleverbox-logo.png`, Breite 2,55 Zoll, y = 0,22, Höhe = 2,55 × 0,371.
- QR-Code rechts: 0,95 × 0,95 Zoll, y = 0,25, Alt-Text „QR-Code zu www.cleverbox.co.at“.
- Links vom QR-Code klein „Mehr Material:“ und „www.cleverbox.co.at“ (10 pt, GRAY, rechtsbündig).
- Feine Linie bei y = 1,3 in LINE.
- Auf halben Blättern (zwei pro Seite): Logo 1,9 Zoll, QR 0,8 Zoll, Linie bei y0 + 0,9.

**Inhalt:**
- Seite 1: Kicker („Arbeitsblatt · Mathematik“, optional „· 4. Klasse“), Titel (24–30 pt, Akzentwort markiert), **Name** und **Datum** mit gepunkteten Linien, Hinweiszeile in GRAY.
- Aufgaben als **Karten mit feiner Kontur**, Nummernkreis in NEON, Aufgabentext, danach gepunktete Linien („Gleichung:“, „Lösung:“, bei längeren Aufgaben „Rechnung:“ und „Antwort:“).
- **Zwei Spalten** (je 3,45 Zoll, Abstand 0,17) für kurze Aufgaben, **eine Spalte** für lange Textaufgaben mit Rechenraum.
- **Zwei Exemplare pro A4-Seite** (Hausübung zum Schneiden) mit gestrichelter Trennlinie und „hier schneiden“.
- **Fußzeile:** „Cleverbox · Mathematik · Arbeitsblatt“, im Lösungsblatt „… · Lösungen“ (nicht „Arbeitsblatt“!).
- **Kein Seitenhintergrund, keine Flächenfüllungen** außer Nummernkreisen und kleinen Chips.

**Lösungsblatt:** eigene Datei, gleiche Kopfzeile. Zu jeder Aufgabe Ansatz/Gleichung und Antwort (Variante: links Umformungen, rechts „Antwort“). Alle Lösungen selbst nachrechnen und im Chat nennen.

**Musterlösungen mit Bildern** (Programmieren): zweispaltige Karten mit Titel, Block-Hinweis, Aufgabe, Lernziel und zugeschnittener Programm-Grafik; lange Programme verkleinern; Karten dürfen leicht umgeordnet werden, damit weniger Seiten nötig sind.

**Lieferung:** PPTX + PDF. Jeweils kontrollieren, dass der Text nicht auf die Linien läuft (Poppins ist breiter als Inter).

---

## 9. Mathematik-Grafiken (Formen und Formeln)

- **Formen:** 1600 × 900 Canvas, Fläche NEON 8DBBF2, Kontur DEEP 0F2A52 (Strichstärke 10 px), Hilfslinien gestrichelt in GREEN, **ohne** Rechtwinkel-Quadrate, Beschriftung a, b, c, h (mit Index), e, f in Inter bold 72 px, **eng zugeschnitten**, transparenter Hintergrund.
- **Formeln:** dunkelblaue Pille (DEEP) mit Text in NEON 8DBBF2, alle gleich hoch (340 px), Index tiefgestellt (`h_a`), **echter Bruchstrich statt „: 2“**.
- **Zuordnung:** 12 Paare, gleiche Nummer und gleicher Slug: `NN-slug-form.png` und `NN-slug-formel.png`. PPTX-Ebenen heißen „Form NN …“ und „Formel NN …“. Zusätzlich je ein ZIP mit allen PNGs.
- **Importierte Nutzer-Überarbeitung:** Wenn der Nutzer eine in Canva überarbeitete PPTX schickt, daraus exportieren per Differenz-Matting (Folie einmal auf Schwarz, einmal auf Weiß rendern, Alpha berechnen), zuschneiden mit 40 px Rand, gleiche Namen. Auffälligkeiten (z. B. beim Rückspeichern verlorene Konturstärken) melden, nicht eigenmächtig ändern.

---

## 10. Weitere Entscheidungen und Textvorlagen

- **Abo-Grafik „Wiedergabezeit von Abonnenten“:** Karte mit Balken nach dem YouTube-Studio-Vorbild, in der jeweiligen Serienfarbe (Grün, Teal). Werte 97,0 % und 3,0 %.
- **Excel-Tabelle Haushaltsplaner:** Cleverbox-Farbprofil; Spaltenköpfe Blau dunkel mit Cyan-Buchstaben, Zeilenzahlen in D3D8EE, Überschrift „Haushaltsplaner“ über A1:C1 verbunden und groß, Ergebniszellen (H3:H7, B8:H8) hellblau E3F4FD.
- **Sponsoring-Angebot (Mathebox):** A4, 4 Seiten, Aufbau: Titel, Über die Mathebox, Reichweite in Zahlen, Zielgruppe, Paket, Vorteile, Datenschutz, Konditionen (6.000 € für 12 Monate), nächste Schritte, Kontakt (Platzhalter für E-Mail und Telefon).
- **Titel und Beschreibung für YouTube:** Titel mit Hauptsuchbegriff am Anfang (um 70 Zeichen), Beschreibung mit Kurztext, Link, Aufzählung, **Kapitel mit Zeitmarken** (aus SRT abgeleitet, Versatz abziehen und prüfen lassen), E-Mail, Abo-Aufruf, Hashtags. Unsichere Angaben immer ausdrücklich zur Prüfung markieren.
- **Skriptfehler nie still ausbessern.** Erkennungsfehler in Untertiteln (kleberbox, tebrabox, Kerobox, Linkobox) benennen und richtig schreiben.

---

## 11. Technik und Werkzeuge

**Standardablauf für jede Lieferung:**
1. Inhalt aus der Nutzerdatei lesen (`.docx` mit python-docx, `.doc` zuerst per `soffice --headless --convert-to docx`, PDF mit `pdftotext`/`pdfimages`).
2. Generator-Skript (pptxgenjs oder PIL) schreiben und ausführen.
3. PPTX prüfen: `python3 /root/.claude/skills/synced/*/pptx/scripts/office/validate.py <datei>` muss „All validations PASSED!“ melden.
4. Rendern: `soffice --headless --convert-to pdf --outdir . <datei>` und `pdftoppm -jpeg -r 50 …`, dann Bild ansehen (Übersichtsmontage mit PIL).
5. Fehler beheben, erneut prüfen.
6. `git add videoslides && git commit` (Co-Authored-By-Zeilen) und `git push -u origin claude/gracious-planck-zbdygj`.
7. Dateien mit `SendUserFile` senden und im Chat knapp erklären: was, Farben, Besonderheiten, was geprüft wurde, was nicht, Angebot.

**Installation und Aufrufe:**
- pptxgenjs ist lokal in `node_modules` des Scratchpads. Skripte immer mit `NODE_PATH=$PWD/node_modules node build.js` starten (sonst findet `apply_theme.js` pptxgenjs/jszip nicht).
- `applyTheme(OUT, THEME)` aus dem pptx-Skill nach dem Schreiben aufrufen (Theme-Farben und Schriften setzen).
- Python: Pillow, numpy, python-docx, python-pptx, OpenCV (cv2), `qrcode` (`pip install qrcode[pil]`).
- LibreOffice (`soffice`), Poppler (`pdftoppm`, `pdftotext`, `pdfimages`).

**Bekannte Stolpersteine (alle schon gelöst):**
- **Linien mit negativer Richtung** (pptxgenjs): Linienform mit `flipV` korrigieren oder nur waagerecht/senkrecht zeichnen.
- **Häkchen-Zeichen „✓“** fehlt in der Vorschau-Schrift: Häkchen aus zwei gedrehten Rechtecken (rotate 49 und 311) bauen.
- **Hochstellung/Tiefstellung:** `superscript`/`subscript` in Text-Runs. Mehrzeilige Formeln mit Tiefstellung brechen in LibreOffice unschön um: jede Zeile als eigene Textbox setzen.
- **Zahlen/Brüche:** Bruch als Zähler-Textbox, Nenner-Textbox und Rechteck als Strich.
- **Polygone:** `custGeom` mit relativen Punkten (in Zoll) für Formen wie Parallelogramm, Deltoid.
- **Transparenz aus Canva-PPTX:** Differenz-Matting (siehe Abschnitt 9).
- **Webp/Alpha:** Hochgeladene Logos als RGBA behalten; nicht auf RGB konvertieren (wird sonst schwarz). Zuschnitt über den Alphakanal.
- **Wörter mit Umlauten und „ß“:** in Poppins/Inter unproblematisch.
- **Textumbrüche:** Zeilenanzahl für Kartenhöhen konservativ schätzen (ca. 32 bis 35 Zeichen pro Zeile bei 11,5 pt und 3 Zoll Breite). Poppins ist breiter.

**Canva:** Über das Canva-MCP sind nur `generate-image`, `remove-background`, `create-design`, `edit-design` nutzbar. Datei-Uploads und -Downloads sind blockiert. Der Weg ist daher: PPTX liefern, Nutzer importiert in Canva. Ein ungespeicherter Canva-Entwurf (DAHXcI351ok) liegt noch offen, Nutzer wurde nicht entschieden.

**Quellcode (`videoslides/_quellcode/`):**
- Folien-Helfer und Beispiele: `build15.js`, `build26.js`, `build27.js` (+ `farben_text.py`), `build2.js`, `build7.js`
- A4-Dokumente: `build18.js` (Sponsoring/Zusammenfassung), `build21.js`, `build28.js`, `build30.js`, `build32.js`
- Formen/Formeln: `mkforms.py`, `mkformeln.py`, `build22.js`, `build23.js`
- Tabelle: `mktab.py`, `build24.js`
- Thumbnails: `thumbs4.py`, `thumbs5.py`, `thumbs6.py`, `mklb2.py`, `mkcb.py`, `mkdbg.py`, `build25.js`, `build34.js`, `build36.js`
- Skript-Zuordnung: `mkscript5.py`
Die Skripte sind Arbeitsstände und verweisen teils auf Pfade im Scratchpad (`/tmp/claude-0/…/scratchpad`). Beim Weiterverwenden Pfade anpassen und Hilfsdateien (`cleverbox-logo.png`, `qr.png`, Hintergrundbilder, `el_*.json`) neu erzeugen.

---

## 12. Bestand (Ordner `videoslides/`)

**Folienpakete (16:9, PPTX):**
- `cleverbox-tiktok-slides.pptx` (16), `cleverbox-feed-grafiken.pptx` (Instagram-Feed)
- `cleverbox-chatgpt-slides.pptx` (18), `cleverbox-datentypen-slides.pptx` (23), `cleverbox-access-einstieg-slides.pptx` (12)
- `cleverbox-personalbeschaffung-slides.pptx` (21, Teal), `cleverbox-schluessel-slides.pptx` (40)
- `lingobox-erklaervideo-slides.pptx` (15, Rosa)
- `cleverbox-programmieren-denken-slides.pptx` (18, Grün)
- `cleverbox-farben-hex-slides.pptx` (50, Grün)

**Skripte mit Folienzuordnung (docx):** `skript-datentypen-…`, `skript-access-einstieg-…`, `skript-personalbeschaffung-…`, `skript-schluessel-…`, `skript-lingobox-…`, `skript-programmieren-denken-…`, `skript-farben-hex-…` (jeweils `-mit-folien.docx`).

**Thumbnails (PNG + PPTX):** `cleverbox-thumbnail.*` (TikTok), `-figur.*`, `-datentypen.*`, `-anlegen.*`, `-personalbeschaffung.*`, `-schluessel.*`, `-lingobox.*`, `-lingobox-pdf-import.*`, `-excel.*` und `-excel-a/b/c.*`, `-unterrichtsmaterial.*`, `-programmieren-denken.*`; Figur `figur-freigestellt.png`.

**Grafiken:** `grafik-wiedergabezeit-abonnenten.*` (Grün), `…-bw.*` (Teal), `excel-haushaltsplaner-tabelle.*`.

**Mathe-Material:** `flaecheninhalt-zusammenfassung-a4.pptx` (3 Seiten), `flaecheninhalt-formen.pptx`, `flaecheninhalt-formeln.pptx`, Ordner `flaecheninhalt-bilder/` (+ ZIP), `flaecheninhalt-bilder-ueberarbeitet/` (+ ZIP, aus der überarbeiteten Nutzer-PPTX).

**Arbeitsblätter (A4, PPTX + PDF):** `arbeitsblatt-textgleichungen-a4`, `-loesungen-a4`, `arbeitsblatt-textgleichungen-4kl-a4`, `-4kl-loesungen-a4`, `arbeitsblatt-roemische-zahlen-a4`, `-loesungen-a4`, `programmieren-musterloesungen-a4`.

**Sonstiges:** `mathebox-sponsoring-a4.pptx`, `cleverbox-logo.png`, `qr-cleverbox-co-at.png`, `thumbnail-vorschau.png`.

---

## 13. Offene Punkte

- Ob das Sponsoring-Angebot der Mathebox ebenfalls auf **nur Blau** umgestellt werden soll (aktuell Gelb).
- Schreibweise und Adresse von **Digibox/„dibibox“** klären; E-Mail für Themenwünsche (`info@cleverbox.co.at` angenommen).
- Titel und Beschreibung für die Videos **Access-Einstieg, Personalbeschaffung, Schlüssel, Lingobox, Programmieren/Denken vor Syntax, Farben im Computer** (nur „Unterrichtsmaterial“ ist erledigt).
- Thumbnails für weitere Videos (Farben im Computer, Flächeninhalt …) bei Bedarf.
- Mögliche Größe/Formen im Programmieren-Thumbnail: zweite Variante mit noch kürzerem Titel zum A/B-Test angeboten.
- Der ungespeicherte Canva-Entwurf `DAHXcI351ok`.
- Kontaktzeile im Sponsoring-Angebot enthält noch Platzhalter für E-Mail und Telefon.
- Das Logo-Seitenverhältnis (0,371) und die Position in der Kopfzeile sind festgelegt; wenn der Nutzer ein größeres Logo will, rückt die Kopfzeile nach oben.

---

## 14. Startanweisung für den neuen Chat (zum Einfügen)

> Du arbeitest für den YouTube-Kanal **Cleverbox** (Armin Heske, Österreich, Deutsch, Du-Form). Lies zuerst die Datei `CLEVERBOX-DESIGN-UEBERGABE.md`. Halte dich an die Paletten, das Poppins-Raster, die A4- und Thumbnail-Regeln. Liefere **immer bearbeitbare PPTX** (für Canva), bei Arbeitsblättern zusätzlich PDF. Prüfe jede Datei (validieren, rendern, ansehen), committe auf den Branch `claude/gracious-planck-zbdygj` und sende die Dateien. Wenn ich nur einen Text oder eine Datei schicke, setze es nach dem etablierten Muster um und sage kurz, was du angenommen hast.
