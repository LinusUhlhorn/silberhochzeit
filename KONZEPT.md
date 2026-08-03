# Konzept – Silberhochzeit Britta & Lutz Barmbold

> Stand: Entwurf. Alle persönlichen Angaben in diesem Dokument sind begründete
> Platzhalter und müssen von der Familie bestätigt werden.
> Siehe dazu `INHALTE-BEARBEITEN.md`.

---

## 1. Grundidee

Eine digitale Einladungs- und Erinnerungsseite zur Silberhochzeit von Britta und
Lutz Barmbold aus Drentwede. Die Seite ist kein Event-Portal und kein
Baukasten-Template, sondern eine kleine, sorgfältig gestaltete **digitale
Festschrift**: Sie erzählt 25 gemeinsame Jahre, liefert alle organisatorischen
Informationen zur Feier und lädt die Gäste zum Mitmachen ein.

Drei Aufgaben erfüllt die Seite gleichzeitig:

1. **Erzählen** – Geschichte, Bilder, Zahlen, Anekdoten.
2. **Informieren** – Datum, Ort, Anfahrt, Dresscode, Ansprechpartner.
3. **Einbinden** – Quiz, Grüße, digitale Fotowand.

Die Seite ist eine One-Page-Website. Alles liegt auf einer Ebene, die Gäste
scrollen durch die Geschichte – das ist bewusst gewählt: kein Verirren in
Untermenüs, funktioniert auf jedem Webspace ohne SPA-Fallback-Regeln, und die
Dramaturgie von „Kennenlernen" bis „Auf die nächsten Jahre" bleibt erhalten.

### Dramaturgie

Die Reihenfolge der Abschnitte folgt einer bewussten Kurve:

```
Emotion  ▁▂▄▆█  Hero, Begrüßung
Erzählen ▆▆▆▆▆  Timeline, Zahlen, Galerie, Damals & heute
Spielen  ▄▅▆▅▄  25 Dinge, Quiz, Grüße
Handeln  ▂▂▂▂▂  Feierinfos, Fotowand
Emotion  ▄▆█▆▄  Abschluss, Footer
```

Erst das Gefühl, dann die Geschichte, dann das Spiel, dann die Organisation –
und zum Schluss wieder das Gefühl. Die nüchternen Feierinformationen stehen
bewusst weit unten, aber die Navigation springt mit einem Klick dorthin, damit
niemand für die Adresse durch die ganze Geschichte scrollen muss.

---

## 2. Zielgruppe

| Gruppe | Anteil | Bedürfnis | Konsequenz fürs Design |
|---|---|---|---|
| Familie, enge Freunde | groß | Erinnerungen, Bilder, Emotion | Galerie, Timeline, große Bilder |
| Geladene Gäste | groß | Wann? Wo? Was anziehen? Geschenk? | Feierinfos schnell erreichbar, Maps-Button |
| Ältere Gäste (60+) | relevant | Lesbarkeit, keine Überraschungen | große Schrift, hoher Kontrast, keine versteckten Gesten |
| Kinder/Jugendliche | klein | Spaß, Mitmachen | Quiz, Fotowand |

**Wichtigste Einschränkung:** Ein spürbarer Teil der Gäste ist über 60 und
öffnet die Seite auf dem Smartphone über einen WhatsApp-Link. Daraus folgt:
Grundschriftgröße nicht unter 17 px, Touch-Ziele mindestens 44 px, keine
Interaktion, die nur per Hover funktioniert, keine wichtige Information hinter
einer Animation.

---

## 3. Gewünschte Wirkung

**Soll wirken:** warm, persönlich, hochwertig, ruhig, ein bisschen humorvoll,
zeitlos, „da hat sich jemand Mühe gegeben".

**Soll nicht wirken:** kitschig, esoterisch, überladen, laut, generisch,
Standard-Hochzeits-Template, Firmen-Landingpage.

Der Ton ist der eines gut geschriebenen Familienbriefs: liebevoll, aber nicht
rührselig; humorvoll, aber nie auf Kosten von Britta und Lutz.

### Leitsatz für Gestaltungsentscheidungen

> Im Zweifel: weniger, größer, ruhiger.

Wenn ein Element diskutabel ist, fliegt es raus. Weißraum ist bei diesem
Projekt ein Gestaltungsmittel, kein ungenutzter Platz.

---

## 4. Visueller Stil

**Editorial statt Event.** Die Referenz sind hochwertige Magazin-Layouts und
Fotobücher, nicht Hochzeitsportale.

Konkrete Merkmale:

- große, ruhige Flächen; viel Weißraum
- Bilder dürfen groß sein und atmen, oft randabfallend
- klare vertikale Rhythmik, Abschnitte durch Abstand statt durch Rahmen getrennt
- feine Silberlinien (1 px, `#E7E7E7`) als einzige Trennelemente
- Karten mit leicht abgerundeten Ecken (12–16 px) und sehr dezentem Schatten
- Typografie trägt die Gestaltung, nicht Dekoration
- kleine Serifen-Ziffern als Abschnittsnummerierung (01, 02, 03 …) – gibt der
  Seite den Festschrift-Charakter

**Bewusst weggelassen:** Herzchen, Ringe-Icons, Schnörkelrahmen, Glitzer,
Partikeleffekte, Parallax-Overkill, Hintergrundmusik, Countdown mit
blinkenden Zahlen, Pop-ups.

---

## 5. Farbkonzept

| Rolle | Name | Hex | Einsatz |
|---|---|---|---|
| Grundfläche | Cremeweiß | `#F8F7F3` | Seitenhintergrund |
| Flächenkontrast | Weiß | `#FFFFFF` | Karten, abwechselnde Sektionen |
| Text | Dunkelgrau | `#292929` | Fließtext, Überschriften |
| Sekundärtext | Silber | `#B8B8B8` | Bildunterschriften, Labels, Meta |
| Linien | Helles Grau | `#E7E7E7` | Trenner, Rahmen, Timeline-Achse |
| Akzent | Champagner | `#D8CBB8` | Zahlen, aktive Zustände, Hover |

**Regel:** Champagner und Silber tragen nie große Flächen. Der Akzent taucht
punktuell auf – als Linie, als Ziffer, als aktiver Navigationszustand. Über die
gesamte Seite gerechnet liegt der Champagner-Anteil unter etwa 5 % der Fläche.

**Kontraste (WCAG AA):**

- `#292929` auf `#F8F7F3` → ca. 13,5:1 ✔ (Fließtext)
- `#292929` auf `#FFFFFF` → ca. 14,6:1 ✔
- `#B8B8B8` auf `#F8F7F3` → ca. 2,0:1 ✘ → **nur für rein dekorative Elemente**,
  niemals für lesbaren Text. Für Sekundärtext wird stattdessen ein abgedunkeltes
  Grau (`#6B6B6B`, ca. 5,3:1) verwendet.
- Champagner `#D8CBB8` ist ebenfalls **kein Textfarbwert** auf hellem Grund,
  sondern nur Flächen-/Linienakzent.

Das ist die wichtigste Kontrast-Entscheidung des Projekts: Die Palette gibt
Silber und Champagner vor, beide sind auf Creme nicht lesbar. Sie werden daher
konsequent als Nicht-Text-Farben behandelt.

**Kein Dark Mode.** Die Seite hat einen definierten, warmen Look. Ein
Dark-Mode-Gegenstück wäre bei diesem Projekt zusätzlicher Wartungsaufwand ohne
Nutzen.

---

## 6. Schriftkonzept

| Ebene | Schrift | Schnitt | Größe (mobil → desktop) |
|---|---|---|---|
| Display (Namen im Hero) | Cormorant Garamond | 300/400 | 3,25 rem → 8 rem |
| Überschrift H2 | Cormorant Garamond | 400 | 2 rem → 3,25 rem |
| Überschrift H3 | Cormorant Garamond | 500 | 1,4 rem → 1,75 rem |
| Fließtext | Inter | 400 | 1,0625 rem → 1,125 rem |
| Label / Eyebrow | Inter | 500, `letter-spacing: .18em`, Versalien | 0,75 rem |
| Bildunterschrift | Inter | 400, kursiv | 0,875 rem |

**Cormorant Garamond** ist bewusst gewählt: eine sehr elegante, kontrastreiche
Renaissance-Antiqua, die in großen Graden wunderschön wirkt – aber in kleinen
Graden dünn und schlecht lesbar wird. Deshalb die harte Regel:

> Cormorant nur ab 1,4 rem aufwärts. Alles darunter ist Inter.

Fließtext läuft mit `line-height: 1.7` und einer maximalen Zeilenlänge von
etwa 68 Zeichen (`max-width: 65ch`).

**Einbindung:** Die Schriften werden **selbst gehostet** (WOFF2 im Projekt,
`@font-face` mit `font-display: swap`), nicht von Google Fonts geladen. Grund:
keine Verbindung zu Drittservern, damit keine IP-Übertragung an Google und
keine DSGVO-Fragen – und nebenbei schnellere Ladezeit ohne zusätzlichen
DNS-Roundtrip.

*Umsetzungshinweis:* Falls die WOFF2-Dateien beim ersten Build noch nicht im
Projekt liegen, greift eine Fallback-Kette (`Georgia, 'Times New Roman', serif`
bzw. `system-ui, -apple-system, 'Segoe UI', sans-serif`). Die Seite bleibt dann
funktionsfähig und ordentlich, nur nicht final typografiert. Siehe
`INHALTE-BEARBEITEN.md`.

---

## 7. Seitenstruktur

One-Page mit 13 Abschnitten. Nummerierung sichtbar als Eyebrow-Ziffer.

| # | Sektion | Anker | In Navigation | Zweck |
|---|---|---|---|---|
| — | Navbar | — | — | Orientierung, Sprung zu Abschnitten |
| 00 | Hero | `#start` | Logo-Klick | Emotionaler Einstieg |
| 01 | Begrüßung | `#begruessung` | — | Ankommen, Zitat |
| 02 | Unsere Geschichte (Timeline) | `#geschichte` | ✔ Geschichte | Erzählkern |
| 03 | 25 Jahre in Zahlen | `#zahlen` | — | Auflockerung, Humor |
| 04 | Fotogalerie | `#galerie` | ✔ Galerie | Emotion, Bilder |
| 05 | Damals & heute | `#damals-heute` | ✔ Damals & heute | Vergleich, Schmunzeln |
| 06 | 25 Dinge über Britta & Lutz | `#fakten` | — | Persönlichkeit, Humor |
| 07 | Gästequiz | `#quiz` | ✔ Quiz | Interaktion |
| 08 | Grüße | `#gruesse` | ✔ Grüße | Gemeinschaft |
| 09 | Feierinformationen | `#feier` | ✔ Feier | Organisation |
| 10 | Digitale Fotowand | `#fotowand` | — | Mitmachen am Festtag |
| 11 | Abschluss | `#abschluss` | — | Emotionaler Ausklang |
| — | Footer | — | — | Abbinder |

Die Navigation zeigt bewusst **nur 6 von 12 Ankern**. Eine Navigationsleiste
mit zwölf Einträgen wäre auf dem Desktop gedrängt und auf dem Smartphone
unbrauchbar. Die sechs gezeigten sind die, nach denen tatsächlich gesucht wird;
die übrigen Abschnitte werden beim Scrollen ohnehin durchlaufen.

Zusätzliche globale Elemente: `ScrollProgress` (Fortschrittsbalken oben),
`BackToTopButton` (erscheint ab ca. 800 px Scrolltiefe).

---

## 8. Geplante Animationen

**Grundprinzip:** Animationen begleiten das Scrollen, sie inszenieren sich
nicht selbst. Nichts blinkt, nichts springt, nichts bewegt sich dauerhaft.

| Element | Animation | Dauer | Easing |
|---|---|---|---|
| Sektions-Einblendung | `opacity 0→1`, `y 24px→0` | 600 ms | `[0.22, 1, 0.36, 1]` |
| Gestaffelte Listen | wie oben, `stagger 70 ms` | 600 ms | dito |
| Hero-Inhalt | gestaffelt beim Laden, `y 20px→0` | 800 ms | dito |
| Hero-Bild | sehr langsamer Scale `1.06→1.0` | 1600 ms | `easeOut` |
| Statistik-Zahlen | Count-up beim Sichtbarwerden | 1600 ms | `easeOut` |
| Timeline-Achse | Linie wächst mit Scroll-Fortschritt | scrollgebunden | linear |
| Lightbox | Fade + `scale .96→1` | 250 ms | `easeOut` |
| Navbar-Hintergrund | Fade zu semi-transparent + Blur | 300 ms | `ease` |
| Karten-Hover | `y -2px`, Schatten leicht stärker | 200 ms | `ease` |
| Fortschrittsbalken | scrollgebunden | — | — |

**Alle Einblendungen laufen nur einmal** (`viewport={{ once: true }}`). Beim
Zurückscrollen passiert nichts – wiederholtes Ein- und Ausblenden wirkt
unruhig und macht die Seite auf langen Scrollstrecken anstrengend.

### `prefers-reduced-motion`

Kein Nachgedanke, sondern Teil der Architektur. Ein zentraler Hook
(`useReducedMotion`) liefert das Flag an alle Komponenten:

- Einblendungen: nur `opacity`, kein Versatz, 200 ms
- Count-up: Zielzahl wird sofort gesetzt
- Hero-Scale und scrollgebundene Effekte: deaktiviert
- Smooth Scrolling: fällt auf `behavior: 'auto'` zurück
- zusätzlich global via CSS `@media (prefers-reduced-motion: reduce)` als
  zweites Sicherheitsnetz

Die Seite bleibt in diesem Modus vollständig nutzbar und verliert keine
Information.

---

## 9. Geplante interaktive Elemente

| Element | Interaktion | Tastatur | Fallback |
|---|---|---|---|
| Navigation | Anker + Smooth Scroll, aktive Sektion via IntersectionObserver | Tab, Enter | Anker funktionieren ohne JS-Logik |
| Hamburger-Menü | Öffnen/Schließen, Fokus-Falle, Escape schließt | vollständig | — |
| Galerie-Lightbox | Klick öffnet, Pfeile/Wischen navigieren, Escape/Klick außen schließt | ←/→/Esc, Fokus-Rückgabe | Bild bleibt im Grid sichtbar |
| Damals & heute | Ziehbarer Vergleichs-Slider | ←/→ steuern den Slider | zwei Bilder nebeneinander bei fehlendem Pointer-Support |
| 25 Dinge | Karten aufklappen (Antwort erscheint) | Enter/Space | Antwort ist im DOM, per `aria-expanded` gesteuert |
| Quiz | Antwort wählen → Feedback → weiter → Ergebnis → Neustart | vollständig | — |
| Statistik-Karten | Count-up beim Scrollen | — | Zielzahl steht sofort |
| Fotowand | Upload-Button, deaktiviert solange kein Link gesetzt | vollständig | freundlicher Hinweistext |
| Back-to-Top | Klick scrollt nach oben | Tab, Enter | — |

**Barrierefreiheits-Regeln, die für alle gelten:**

- sichtbarer Fokusring (2 px, `#292929`, 2 px Offset) – nie `outline: none`
  ohne Ersatz
- Lightbox und Mobilmenü sind modal: Fokus-Falle, `aria-modal`,
  Body-Scroll-Sperre, Fokus kehrt beim Schließen zum Auslöser zurück
- alle Bedienelemente sind echte `<button>`/`<a>`-Elemente, keine Divs
- Quiz-Feedback und Lightbox-Bildwechsel werden über `aria-live` angesagt
- Bilder haben beschreibende `alt`-Texte; rein dekorative bekommen `alt=""`

---

## 10. Bildkonzept

**Bildsprache:** echte Fotos, keine Stockbilder. Lieber ein leicht unscharfes
Familienfoto von 2003 als ein perfektes Symbolbild. Warme, natürliche Töne;
keine starken Filter; keine schwarz-weiß/farbig gemischte Galerie (entweder
durchgehend oder gar nicht).

**Technisch:**

- Format: JPG (breite Kompatibilität), Qualität ca. 80
- Galerie: längste Kante ca. 1600 px, Ziel < 300 KB pro Bild
- Hero: ca. 2400 px breit, Ziel < 500 KB
- `loading="lazy"` und `decoding="async"` für alles außer dem Hero-Bild
- der Hero bekommt `fetchpriority="high"` und kein Lazy Loading
- `width`/`height` bzw. feste Seitenverhältnisse gegen Layout-Sprünge (CLS)
- Ablage in `public/images/`, dadurch stabile Pfade und keine Bundler-Importe

**Fallback:** Fehlt eine Bilddatei, zeigt die Seite keinen kaputten
Bild-Platzhalter des Browsers, sondern eine gestaltete Fläche in Creme mit
feiner Silberlinie, dezentem Icon und der Bildunterschrift. Die Seite sieht
also auch **vor** dem Einpflegen der echten Fotos vollständig aus – das ist
für die Abnahme durch die Familie wichtig.

### Benötigte Bilder (Übersicht)

| Datei | Motiv | Format | Priorität |
|---|---|---|---|
| `hero.jpg` | Britta & Lutz, aktuell, querformat, Platz für Text | 16:9 quer | hoch |
| `damals.jpg` | Paarfoto aus der Zeit um die Hochzeit (2001) | 4:3 | hoch |
| `heute.jpg` | aktuelles Paarfoto, **gleicher Bildausschnitt wie „damals"** | 4:3 | hoch |
| `gallery-01…12.jpg` | Querschnitt durch 25 Jahre | gemischt | hoch |
| `qr-fotowand.png` | QR-Code zur Fotowand | quadratisch | mittel |
| `og-image.jpg` | Vorschaubild für WhatsApp/Social | 1200×630 | mittel |

Für „Damals & heute" ist der gleiche Bildausschnitt der entscheidende Punkt –
der Effekt entsteht durch die Gegenüberstellung, nicht durch die Bilder selbst.

---

## 11. Benötigte echte Informationen

Diese Liste ist die Arbeitsgrundlage für das Gespräch mit der Familie. Alles
hier Genannte liegt aktuell als markierter Platzhalter oder plausibler Entwurf
im Projekt vor.

### Unbedingt nötig (Seite ist ohne diese Angaben nicht versendbar)

- [ ] Datum der Feier
- [ ] Uhrzeit (Beginn, ggf. Empfang/Essen)
- [ ] Veranstaltungsort inkl. vollständiger Adresse
- [ ] Google-Maps-Link zum Ort
- [ ] Ansprechpartner mit Telefonnummer/E-Mail (für Zu- und Absagen)
- [ ] Rückmeldefrist
- [ ] tatsächliches Hochzeitsdatum (Jahr/Datum 2001?)
- [ ] Hero-Foto, `damals.jpg`, `heute.jpg`
- [ ] Impressumsangaben, falls die Seite öffentlich erreichbar ist

### Wichtig für die Wirkung

- [ ] 10–12 Galeriefotos mit Jahr und kurzer Bildunterschrift
- [ ] echte Timeline-Stationen (Kennenlernen: wann, wo, wie?)
- [ ] Namen und Alter der Kinder – **oder** die Entscheidung, sie nicht zu nennen
- [ ] echte Antworten zu den „25 Dingen"
- [ ] echte Quizfragen und -antworten
- [ ] echte Grußtexte statt der Beispielgrüße
- [ ] Dresscode
- [ ] Geschenkhinweis (Formulierung durch die Familie)
- [ ] Parkmöglichkeiten am Veranstaltungsort

### Optional

- [ ] Upload-Link für die Fotowand + zugehöriger QR-Code
- [ ] Ablauf/Programm des Festes
- [ ] Übernachtungsmöglichkeiten für Gäste von weiter weg
- [ ] Hinweis zu Kindern auf der Feier

---

## 12. Was die Familie bestätigen muss

Diese Punkte sind bewusst **erfunden, aber plausibel** und dürfen so nicht
veröffentlicht werden. Sie stehen im Projekt, damit die Seite vollständig
aussieht und die Familie am fertigen Layout entscheiden kann, statt sich Texte
in einem leeren Formular auszudenken.

1. **Alle Jahreszahlen der Timeline.** Angenommen wurde Hochzeit 2001,
   Kennenlernen 1997. Beides ist geraten.
2. **Die Kennenlerngeschichte.** Der Entwurf (Dorffest, gemeinsamer
   Freundeskreis) ist typisch für die Region, aber frei erfunden.
3. **Alle Angaben zu Kindern.** Im Entwurf bewusst ohne Namen und Anzahl
   formuliert. Hier ist eine bewusste Familienentscheidung nötig – auch die,
   ob Kinder überhaupt auf einer öffentlich erreichbaren Seite auftauchen.
4. **Sämtliche Antworten der „25 Dinge".** Diese Rubrik lebt davon, dass sie
   stimmt. Falsche Antworten sind hier nicht neutral, sondern peinlich.
5. **Alle Quiz-Antworten.** Gleiches Argument.
6. **Alle Grüße und deren Absender.** Namen unter einem erfundenen Text sind
   heikel – niemand sollte einen Gruß zugeschrieben bekommen, den er nicht
   geschrieben hat. Vor dem Versenden der Seite: entweder echte Grüße
   einsammeln oder den Abschnitt entfernen.
7. **Der Geschenkhinweis.** Formulierungen zu Geld sind Geschmackssache und
   gehören der Familie.
8. **Reisen und besondere Erlebnisse** in der Timeline.

### Datenschutz-Hinweis

Die Seite liegt öffentlich im Netz und ist damit prinzipiell für Suchmaschinen
und Fremde erreichbar. Vor der Veröffentlichung sollte die Familie bewusst
entscheiden:

- Sollen Nachnamen, Adressen oder Telefonnummern öffentlich stehen?
- Sollen Kinder mit Namen und Bild gezeigt werden?
- Soll die Seite über `robots.txt` und `<meta name="robots" content="noindex">`
  aus Suchmaschinen herausgehalten werden? *(Im Projekt ist `noindex`
  standardmäßig gesetzt – das ist die datensparsame Voreinstellung. Sie lässt
  sich in `index.html` mit einer Zeile aufheben.)*
- Wird zusätzlich ein Passwortschutz gewünscht? (Über den Webspace per
  `.htaccess` möglich, nicht über diese Website.)

Für Gruppenfotos in der Galerie gilt: Abgebildete Personen sollten der
Veröffentlichung zustimmen.

---

## 13. Technische Eckpunkte

| Bereich | Entscheidung | Begründung |
|---|---|---|
| Framework | React 19 + TypeScript | Anforderung; Typsicherheit für `content.ts` |
| Build | Vite 7 | schnell, Standard-Output nach `dist` |
| Styling | Tailwind CSS 4 | konsistente Abstände, kein CSS-Wildwuchs |
| Animation | Framer Motion | deklarativ, `useReducedMotion` eingebaut |
| Icons | Lucide React | dezent, strichbasiert, passt zum Stil |
| Routing | keins | One-Page, nur Anker – kein SPA-Fallback nötig |
| Backend | keins | statischer Webspace genügt |
| Tracking | keins | keine Cookies, kein Consent-Banner nötig |
| Fonts | selbst gehostet | keine Drittanbieter-Verbindung |
| Base-Path | `VITE_BASE_PATH`, Default `/` | Unterordner-Betrieb möglich |
| Deployment | GitHub Actions → SFTP/FTPS | automatisch bei Push auf `main` |

### Inhaltsarchitektur

**Sämtliche** austauschbaren Inhalte liegen in `src/data/content.ts`, typisiert.
Die Komponenten enthalten keine persönlichen Texte – sie sind reine
Darstellungslogik. Das ist die zentrale Entwurfsentscheidung des Projekts: Die
Familie soll Texte ändern können, ohne React zu verstehen, und ohne dass eine
Textänderung das Layout kaputt machen kann.

### Performance-Ziele

- Lighthouse Performance ≥ 90 (mobil)
- Lighthouse Accessibility ≥ 95
- JS-Bundle (gzip) unter 200 KB
- kein horizontales Scrollen bei 320 px Viewport-Breite
- keine Layout-Sprünge durch nachladende Bilder

---

## 14. Bewusste Nicht-Ziele

Damit klar ist, was die Seite **nicht** wird – und warum:

- **kein Login / kein Gästebereich** – Aufwand und Hürde stehen in keinem
  Verhältnis zum Nutzen bei einer Familienfeier
- **kein RSVP-Formular** – bräuchte ein Backend oder einen Drittanbieter;
  Zu- und Absagen laufen über den genannten Ansprechpartner
- **kein eigener Foto-Upload-Server** – bewusst ausgelagert an einen
  Cloud-Ordner, der zur Feier verlinkt wird
- **kein Countdown-Timer** – wirkt bei einer Silberhochzeit nach Marketing
- **kein Musik-Autoplay** – überrascht Gäste in der Öffentlichkeit unangenehm
- **keine Mehrsprachigkeit** – die Gästeliste ist deutschsprachig
- **kein CMS** – eine TypeScript-Datei plus Deployment-Automatik ist für den
  Zweck einfacher und dauerhaft wartbar
