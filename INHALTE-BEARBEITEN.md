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
| Gästewand | Erklärtext, Beschriftungen des Formulars |
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
| 25 Dinge | **alle 25 Antworten** |
| Quiz | 6 von 9 Fragen (die persönlichen) |

### 🔴 Muss unbedingt ersetzt werden

Ohne diese Angaben sollte die Seite nicht an Gäste verschickt werden:

- [ ] Das echte Hochzeitsjahr (aktuell ist **2001** angenommen)
- [ ] Die echten Antworten bei „25 Dinge“ und im Quiz
- [ ] Die Fotos für „Damals & heute“ und das Titelbild
- [ ] Das Admin-Passwort für die Gästewand muss eingerichtet sein
      (siehe Abschnitt 9)

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

### Beschriftungen der Gästewand ändern

Im Abschnitt `gaestewand:`. Die Beiträge selbst stehen **nicht** in dieser
Datei – sie kommen von den Gästen und liegen auf dem Webspace.

```ts
gaestewand: {
  ueberschrift: 'Schreibt uns etwas',
  formular: {
    absendenLabel: 'Beitrag senden',
    dankeTitel: 'Vielen Dank!',
    …
  },
}
```

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

### Einen ganzen Abschnitt entfernen

In `src/App.tsx` die entsprechende Zeile löschen, z. B. `<StatsSection />`,
und in `content.ts` im Block `navigation` den passenden Eintrag entfernen,
falls der Abschnitt im Menü stand.

---

## 5. Bilder austauschen

Alle Bilder liegen im Ordner `public/images/`.

| Datei | Wofür | Format |
| --- | --- | --- |
| `hero.jpg` | großes Titelbild | quer, ca. 2400 px breit |
| `damals.jpg` | Foto von damals | 4:3 |
| `heute.jpg` | aktuelles Foto | 4:3, **gleicher Bildausschnitt wie `damals.jpg`** |
| `qr-gaestewand.png` | QR-Code zur Gästewand | quadratisch |
| `og-image.jpg` | Vorschaubild für WhatsApp | 1200 × 630 px |

Fotos, die Gäste hochladen, landen **nicht** hier, sondern auf dem Webspace
im Ordner `uploads/bilder/`. Sie brauchen keine Pflege.

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

### Hoch- oder Querformat?

| Stelle | Passendes Format | Warum |
| --- | --- | --- |
| `hero.jpg` | **quer**, unteres Drittel ruhig | Dort liegen Überschrift und Farbverlauf |
| `damals.jpg` / `heute.jpg` | egal, aber **beide gleich** | Der Vergleich lebt vom gleichen Ausschnitt |

Ein Hochformat-Foto im Titelbereich wird oben und unten stark beschnitten –
bei einem 2:3-Foto auf dem Desktop je etwa 600 Pixel. Ohne Korrektur landen
die Köpfe genau auf der Oberkante, halb unter der Navigation.

**Dafür gibt es den Bildfokus.** In `content.ts`:

```ts
hero: {
  bild: 'images/hero.jpg',
  bildPosition: '50% 30%',   // ← 30 statt 50 holt den Ausschnitt nach oben
}
```

Der zweite Wert bestimmt, welcher Teil des Fotos erhalten bleibt:
`50%` = Mitte, kleinere Werte = weiter oben, größere = weiter unten.
Einfach ausprobieren, `npm run dev` zeigt es sofort.

Dasselbe gibt es bei `damals` und `heute`:

```ts
heute: {
  bild: 'images/heute.jpg',
  bildPosition: '50% 40%',
},
```

---

## 6. Nach dem Ändern

```bash
npm run dev     # Vorschau im Browser unter http://localhost:5173
```

Sieht alles gut aus:

```bash
git add .
git commit -m "Texte überarbeitet"
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
| Bild erscheint nicht | Dateiname stimmt nicht (Groß-/Kleinschreibung!) | `hero.jpg`, nicht `Hero.JPG` |
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
- [ ] Alle Jahreszahlen im Zeitstrahl stimmen
- [ ] Die Antworten bei „25 Dinge“ und im Quiz stimmen
- [ ] Fotos sind eingepflegt und verkleinert
- [ ] Admin-Passwort der Gästewand ist eingerichtet (Abschnitt 9)
- [ ] Ein Testbeitrag wurde hochgeladen und wieder gelöscht
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

---

## 9. Gästewand verwalten

Auf der Gästewand hinterlassen Gäste einen Gruß und bis zu fünf Fotos. Beides
erscheint sofort auf der Seite.

### Einmalig: Admin-Passwort vergeben

Ohne diesen Schritt kannst du keine Beiträge ausblenden.

1. Im ALL-INKL-Dateimanager (KAS) oder per FTP in den Ordner **`daten/`**
   wechseln. *(Existiert er noch nicht, einfach die Website einmal aufrufen –
   dann legt er sich selbst an.)*
2. Dort eine **leere Datei** namens `SETUP-ERLAUBT` anlegen, ohne Endung.
3. Im Browser `https://DEINE-ADRESSE/api/setup.php` aufrufen.
4. Passwort vergeben – mindestens 10 Zeichen. **Gut notieren, es lässt sich
   nicht auslesen.**

Die Datei `SETUP-ERLAUBT` verschwindet danach automatisch.

> **Warum so umständlich?** Die Setup-Seite liegt öffentlich im Netz. Ohne
> diesen Nachweis könnte der Erste, der die Adresse errät, das Passwort setzen.
> Die Datei anlegen kann nur, wer Zugriff auf den Webspace hat.

Passwort vergessen? Schritte 1 bis 4 einfach wiederholen.

### Beiträge ausblenden oder löschen

`https://DEINE-ADRESSE/admin.html` aufrufen und anmelden.

| Knopf | Wirkung |
| --- | --- |
| **Archivieren** | Beitrag verschwindet von der Website, bleibt aber gespeichert |
| **Wieder anzeigen** | macht das Archivieren rückgängig |
| **Endgültig löschen** | Beitrag und Fotos werden unwiderruflich entfernt |

Im Zweifel lieber archivieren als löschen – archivierte Beiträge lassen sich
jederzeit zurückholen.

### Zwei Einstellungen zum Umschalten

In der Datei **`daten/config.php`** auf dem Webspace (per FTP oder KAS
bearbeiten). Diese Datei wird von keinem Deployment überschrieben.

```php
return [
  'admin_hash'    => '…',      // nicht anfassen
  'vorabfreigabe' => false,
  'zugangscode'   => '',
];
```

**Beiträge erst nach Freigabe zeigen:**
`'vorabfreigabe' => true`
Beiträge landen dann im Admin unter „Wartet" und erscheinen erst, wenn du sie
freigibst. Sicherer – aber du musst während der Feier mitlesen, sonst bleibt
die Wand leer.

**Nur Gäste mit Code zulassen:**
`'zugangscode' => 'BRITTA25'`
Gäste geben den Code einmal ein. Das Feld erscheint automatisch. Sinnvoll, weil
die Seite öffentlich erreichbar ist – ohne Code kann theoretisch jeder
hochladen, der die Adresse kennt.

### Was passiert mit hochgeladenen Bildern?

Jedes Bild wird auf dem Server **neu berechnet** und als frisches JPEG
gespeichert. Das hat zwei Gründe:

1. **Sicherheit.** Eine Datei, die sich als Bild ausgibt, aber Schadcode
   enthält, überlebt das Neuberechnen nicht – übrig bleiben nur Pixel.
2. **Ladezeit.** Aus einem 8-MB-Handyfoto wird ein paar hundert Kilobyte,
   dazu eine kleine Vorschau für die Übersicht.

Die Originaldateien werden nicht aufbewahrt. Wer die Fotos in voller Auflösung
haben möchte, sollte die Gäste zusätzlich darum bitten.

### Sicherungskopie

Die Beiträge liegen **nur auf dem Webspace**, nicht im Repository. Vor
größeren Änderungen lohnt es sich, diese beiden Ordner per FTP
herunterzuladen:

- `daten/` – die Beiträge und die Konfiguration
- `uploads/` – die Fotos
