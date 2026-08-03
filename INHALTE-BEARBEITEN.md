# Inhalte bearbeiten

Diese Anleitung richtet sich an alle, die Texte, Bilder oder Termine der
Website ändern möchten – **ohne Programmierkenntnisse**.

---

## Das Wichtigste in einem Satz

> Alle Texte der Website stehen in **einer einzigen Datei**:
> `src/data/content.ts`

Die Seite selbst (die Dateien im Ordner `src/components/`) enthält bewusst
keine persönlichen Texte. Man kann also an `content.ts` nichts kaputt machen,
was das Layout zerstört.

---

## 1. Was ist schon fertig – und was nicht?

Die Inhalte lassen sich in drei Gruppen einteilen.

### 🟢 Fertig – kann so bleiben

Diese Texte sind allgemein formuliert und passen unabhängig von den echten
Details. Sie dürfen natürlich trotzdem geändert werden.

| Wo | Was |
| --- | --- |
| Titelbereich | „Silberhochzeit“, „25 Jahre gemeinsam“, „Drentwede“, Hero-Botschaft |
| Begrüßung | Einleitungstext und Zitat |
| Alle Abschnitte | Überschriften, Zwischentexte, Einleitungen |
| Zahlen | „25 Jahre“, „~9.125 Tage“, „~1.300 Sonntage“, „unzählige Erinnerungen“ |
| Damals & heute | Begleittext |
| Quiz | Einleitung, Ergebnistexte, Bedienelemente |
| Fotowand | Erklärtext, Hinweis „Der Foto-Upload wird zur Feier freigeschaltet.“ |
| Abschluss | Schlusstext und Botschaft an Britta & Lutz |
| Fußzeile | „Silberhochzeit von Britta & Lutz“, „Drentwede · 2026“, „Mit Liebe erstellt“ |

### 🟡 Vorschlag – bitte prüfen und ersetzen

Diese Texte sind **frei erfunden**. Sie klingen plausibel, stimmen aber
höchstwahrscheinlich nicht. In `content.ts` sind sie mit `entwurf: true`
markiert.

| Wo | Was genau |
| --- | --- |
| Zeitstrahl | **alle acht Stationen** samt Jahreszahlen (1997, 1998, 2001, 2002, 2004, 2011, 2018) |
| Zahlen | „30+ Reisen“, „100+ Familienfeste“ |
| Galerie | alle Bildunterschriften und Jahreszahlen |
| 25 Dinge | **alle 25 Antworten** |
| Quiz | 6 von 9 Fragen (die persönlichen) |
| Grüße | **alle 6 Grüße samt Absendern** |
| Feier | **alle Angaben** (Datum, Uhrzeit, Ort, Parken, Dresscode, Kontakt, Geschenke) |

### 🔴 Muss unbedingt ersetzt werden

Ohne diese Angaben sollte die Seite nicht an Gäste verschickt werden:

- [ ] Datum und Uhrzeit der Feier
- [ ] Veranstaltungsort mit vollständiger Adresse
- [ ] Ansprechpartner für Zu- und Absagen (Name + Telefon oder E-Mail)
- [ ] Rückmeldefrist
- [ ] Google-Maps-Link
- [ ] Das echte Hochzeitsjahr (aktuell ist **2001** angenommen)
- [ ] Die Grüße – erfundene Grüße mit echten Namen sollten **niemals** online
      gehen. Entweder echte Grüße einsammeln oder den Abschnitt entfernen.

---

## 2. Die Entwurfs-Markierung

Alle unsicheren Inhalte sind in `content.ts` so markiert:

```ts
{
  id: 'f01',
  frage: 'Wer steht früher auf?',
  antwort: 'Lutz. Und zwar deutlich. …',
  entwurf: true,        // ← Diese Zeile bedeutet: noch nicht bestätigt
},
```

**Was diese Zeile bewirkt:**

- Beim Entwickeln (`npm run dev`) erscheint neben dem Inhalt ein kleiner
  gelber Hinweis „Entwurf“.
- In der veröffentlichten Website (`npm run build`) ist davon **nichts** zu
  sehen. Gäste bekommen diese Hinweise also nie zu Gesicht.

**Was tun, wenn ein Inhalt stimmt?**
Einfach die Zeile `entwurf: true,` löschen. Fertig.

> **Tipp für das Gespräch mit der Familie:** Startet die Seite mit
> `npm run dev` und geht sie gemeinsam durch. Alles, was gelb markiert ist,
> muss besprochen werden. Ist die Seite frei von gelben Hinweisen, sind alle
> Inhalte bestätigt.

Zusätzlich stehen in manchen Texten Hinweise in eckigen Klammern:

```
[Bitte anpassen: Wo und wie habt ihr euch wirklich kennengelernt?]
```

Diese sind **auch für Gäste sichtbar** und müssen vor der Veröffentlichung
unbedingt ersetzt werden.

---

## 3. Texte ändern – Schritt für Schritt

1. Datei `src/data/content.ts` in einem Texteditor öffnen
   (z. B. Visual Studio Code, Notepad++ oder TextEdit).
2. Den gewünschten Abschnitt suchen. Die Datei ist mit großen Kommentarblöcken
   gegliedert, z. B.:
   ```
   /* ---------- 10 · FEIER ---------- */
   ```
3. Den Text **zwischen den Anführungszeichen** ändern.
4. Speichern.

### Die drei Regeln

**Regel 1 – Nur zwischen den Anführungszeichen ändern.**

```ts
ueberschrift: 'Schön, dass ihr da seid',
              ↑                        ↑
              nur hier drin schreiben
```

Kommas, Klammern und die Namen links vom Doppelpunkt bleiben stehen.

**Regel 2 – Apostrophe im Text maskieren.**

Ein einfaches Anführungszeichen im Text beendet sonst den Text zu früh:

```ts
❌ text: 'Lutz' Werkstatt',        // kaputt
✅ text: 'Lutz’ Werkstatt',        // typografischer Apostroph – am schönsten
✅ text: "Lutz' Werkstatt",        // doppelte Anführungszeichen außen
```

**Regel 3 – Kommas am Zeilenende stehen lassen.**

```ts
titel: 'Silberhochzeit',    ← das Komma gehört dazu
```

### Umlaute und Sonderzeichen

Ä, Ö, Ü, ß, „deutsche Anführungszeichen“, – Gedankenstriche und … alles das
funktioniert problemlos. Die Datei ist UTF-8-kodiert.

---

## 4. Häufige Änderungen im Überblick

### Feierdaten eintragen

Im Abschnitt `feier:` → `details:`. Jede Karte hat `zeilen` – die erste Zeile
wird groß dargestellt, die weiteren klein darunter.

```ts
{
  id: 'datum',
  icon: 'kalender',
  label: 'Datum',
  zeilen: ['Samstag, 12. September 2026', 'Beginn um 15 Uhr'],
  // entwurf: true,   ← nach dem Eintragen löschen
},
```

Eine Karte ganz entfernen? Den kompletten Block von `{` bis `},` löschen.

### Google-Maps-Link setzen

1. Ort in Google Maps suchen.
2. Auf „Teilen“ → „Link kopieren“.
3. In `content.ts` einsetzen:

```ts
karte: {
  label: 'In Google Maps öffnen',
  url: 'https://maps.app.goo.gl/beispiel',   // ← hier
  hinweisOhneLink: '…',
},
```

Solange `url: ''` leer ist, erscheint statt des Buttons ein Hinweistext.

### Foto-Upload freischalten

```ts
fotowand: {
  …
  uploadUrl: 'https://cloud.beispiel.de/upload/abc',   // ← hier
}
```

Solange das Feld leer ist, ist der Button ausgegraut und es steht dort
„Der Foto-Upload wird zur Feier freigeschaltet.“

Geeignet sind Ordner-Links mit Upload-Recht, z. B. bei Nextcloud, Google Drive,
Dropbox oder WeTransfer. Passend dazu einen QR-Code erzeugen und als
`public/images/qr-fotowand.png` ablegen.

### Quizfrage ändern

Pro Frage muss **genau eine** Antwort `richtig: true` haben:

```ts
{
  id: 'q03',
  frage: 'Wer steht morgens zuerst auf?',
  antworten: [
    { text: 'Britta', richtig: false },
    { text: 'Lutz', richtig: true },      // ← genau eine
    { text: 'Beide gleichzeitig', richtig: false },
    { text: 'Kommt auf den Wochentag an', richtig: false },
  ],
  aufloesung: 'Lutz – meistens vor dem Wecker.',
},
```

Fragen dürfen hinzugefügt oder gelöscht werden; die Fortschrittsanzeige
rechnet automatisch mit.

### Einen Gruß hinzufügen

Einen vorhandenen Block kopieren und anpassen. Wichtig: die `id` muss
eindeutig sein.

```ts
{
  id: 'm07',                    // ← noch nicht vergeben
  text: 'Herzlichen Glückwunsch euch beiden!',
  absender: 'Familie Meier',
  zusatz: 'aus Barnstorf',      // optional – Zeile darf auch weg
},
```

### Einen ganzen Abschnitt entfernen

Zum Beispiel die Grüße, falls keine echten zusammenkommen:
In `src/App.tsx` die Zeile `<MessagesSection />` löschen und in `content.ts`
im Block `navigation` den passenden Eintrag entfernen.

---

## 5. Bilder austauschen

Alle Bilder liegen im Ordner `public/images/`.

| Datei | Wofür | Format |
| --- | --- | --- |
| `hero.jpg` | großes Titelbild | quer, ca. 2400 px breit |
| `damals.jpg` | Foto von damals | 4:3 |
| `heute.jpg` | aktuelles Foto | 4:3, **gleicher Bildausschnitt wie `damals.jpg`** |
| `gallery-01.jpg` … `gallery-12.jpg` | Galerie | gemischt |
| `qr-fotowand.png` | QR-Code | quadratisch |
| `og-image.jpg` | Vorschaubild für WhatsApp | 1200 × 630 px |

**Vorgehen:** Die eigenen Fotos genau so benennen und in den Ordner legen –
fertig. In `content.ts` muss nichts geändert werden.

**Größe:** Längste Kante etwa 1600 px, unter 300 KB pro Bild. Fotos direkt aus
der Handykamera sind meist 4–8 MB groß und machen die Seite auf dem
Mobilfunknetz spürbar langsam. Verkleinern lohnt sich.

**Solange ein Bild fehlt**, zeigt die Website automatisch eine gestaltete
Platzhalterfläche – kein kaputtes Bildsymbol. Die Seite lässt sich also schon
vor dem Einpflegen der Fotos in Ruhe ansehen.

**Beim Vergleich „Damals & heute“** kommt es auf den gleichen Bildausschnitt
an. Der Effekt entsteht durch die Gegenüberstellung, nicht durch die Bilder
selbst.

---

## 6. Nach dem Ändern

```bash
npm run dev     # Vorschau im Browser unter http://localhost:5173
```

Sieht alles gut aus:

```bash
git add .
git commit -m "Feierdaten eingetragen"
git push
```

Der Rest passiert automatisch – etwa zwei Minuten später ist die Änderung
online. Siehe `DEPLOYMENT.md`.

---

## 7. Wenn etwas nicht funktioniert

| Meldung / Symptom | Ursache | Lösung |
| --- | --- | --- |
| `Unterminated string literal` | Ein Anführungszeichen fehlt oder ein Apostroph im Text ist nicht maskiert | Regel 2 oben |
| `',' expected` | Ein Komma am Zeilenende fehlt | Regel 3 oben |
| Weiße Seite im Browser | Tippfehler in `content.ts` | Terminal zeigt Datei und Zeilennummer |
| Bild erscheint nicht | Dateiname stimmt nicht (Groß-/Kleinschreibung!) | `gallery-01.jpg`, nicht `Gallery-01.JPG` |
| Änderung nicht online | Push fehlgeschlagen oder Workflow rot | Reiter „Actions“ auf GitHub prüfen |

**Notausgang:** Die letzte Änderung rückgängig machen:

```bash
git checkout src/data/content.ts
```

Damit ist die Datei wieder auf dem Stand des letzten Commits. Alles seitdem
Geänderte ist dann allerdings weg.

---

## 8. Vor dem Verschicken an die Gäste

- [ ] Keine `[Bitte anpassen: …]`-Hinweise mehr im Text
- [ ] Keine `[Name eintragen]`-Platzhalter bei den Grüßen
- [ ] Datum, Uhrzeit, Adresse und Ansprechpartner sind echt
- [ ] Maps-Link führt zum richtigen Ort
- [ ] Alle Jahreszahlen im Zeitstrahl stimmen
- [ ] Die Antworten bei „25 Dinge“ und im Quiz stimmen
- [ ] Alle Grüße sind echt – oder der Abschnitt ist entfernt
- [ ] Fotos sind eingepflegt und verkleinert
- [ ] Beim Entwickeln (`npm run dev`) sind keine gelben „Entwurf“-Hinweise mehr zu sehen
- [ ] Die Seite auf einem echten Smartphone angeschaut
- [ ] Familie ist einverstanden, welche Namen und Fotos öffentlich stehen

### Zum Datenschutz

Die Seite ist öffentlich im Internet erreichbar. Vorab bewusst entscheiden:

- Sollen Nachnamen, Adressen oder Telefonnummern öffentlich stehen?
- Sollen Kinder mit Namen und Bild gezeigt werden?
- Sollen Suchmaschinen die Seite finden dürfen?
  **Voreingestellt ist: nein.** Wer das ändern möchte, entfernt in
  `index.html` die Zeile mit `noindex, nofollow` und in `public/robots.txt`
  die Zeile `Disallow: /`.
- Wird zusätzlich ein Passwortschutz gewünscht? Das lässt sich beim Webhoster
  über eine `.htaccess`-Datei einrichten, nicht über diese Website.

Bei Gruppenfotos gilt: Die abgebildeten Personen sollten mit der
Veröffentlichung einverstanden sein.
