# Silberhochzeit · Britta & Lutz

Website zur Silberhochzeit von **Britta und Lutz Barmbold** aus Drentwede.
25 Jahre gemeinsam – erzählt als digitale Festschrift.

Eine One-Page-Website mit Zeitstrahl, Fotogalerie, Gästequiz, digitaler
Fotowand und allen Informationen zur Feier.

> **Status:** Die Website ist technisch fertig. Viele persönliche Inhalte sind
> noch begründete Entwürfe und müssen von der Familie bestätigt werden.
> Was genau, steht in **[INHALTE-BEARBEITEN.md](./INHALTE-BEARBEITEN.md)**.

---

## Dokumentation

| Datei | Inhalt |
| --- | --- |
| **[KONZEPT.md](./KONZEPT.md)** | Gestaltungskonzept: Zielgruppe, Farben, Schriften, Dramaturgie, offene Fragen |
| **[INHALTE-BEARBEITEN.md](./INHALTE-BEARBEITEN.md)** | Texte und Bilder ändern – ohne Programmierkenntnisse |
| **[DEPLOYMENT.md](./DEPLOYMENT.md)** | Automatische Veröffentlichung auf dem Webspace einrichten |

---

## Technik

| Bereich | Verwendet |
| --- | --- |
| Framework | React 19 + TypeScript |
| Build | Vite 8 |
| Styling | Tailwind CSS 4 |
| Animation | Framer Motion 12 |
| Icons | Lucide React |
| Schriften | Cormorant Garamond & Inter – **selbst gehostet** |
| Backend | keins – rein statische Website |
| Deployment | GitHub Actions → SFTP / FTPS / FTP |

**Bewusst nicht enthalten:** Tracking, Analytics, Cookies, externe
Schrift-Dienste, Cookie-Banner, kostenpflichtige Dienste.

---

## Installation

Voraussetzung: [Node.js](https://nodejs.org) ab Version 20.19.

```bash
npm install
```

## Lokaler Start

```bash
npm run dev
```

Die Website läuft dann unter **http://localhost:5173**. Änderungen an Dateien
erscheinen sofort im Browser.

> Im Entwicklungsmodus erscheinen neben allen noch nicht bestätigten Inhalten
> kleine gelbe **„Entwurf“**-Hinweise. In der veröffentlichten Website sind
> diese nicht sichtbar.

## Produktions-Build

```bash
npm run build
```

Das Ergebnis liegt im Ordner **`dist/`**. Dessen Inhalt wird auf den Webspace
übertragen.

Vorschau des fertigen Builds:

```bash
npm run preview     # http://localhost:4173
```

## Alle Skripte

| Befehl | Wirkung |
| --- | --- |
| `npm run dev` | Entwicklungsserver mit Live-Aktualisierung |
| `npm run build` | Typprüfung + Produktions-Build nach `dist/` |
| `npm run preview` | Fertigen Build lokal ansehen |
| `npm run lint` | Code prüfen |
| `npm run lint:fix` | Behebbare Code-Probleme automatisch beheben |
| `npm run typecheck` | Nur die TypeScript-Typen prüfen |
| `npm run check` | Alles zusammen – vor dem Push empfehlenswert |

---

## Projektstruktur

```
silberhochzeit/
├── .github/workflows/
│   └── deploy.yml              Automatisches Deployment
├── public/
│   ├── images/                 ► Hier kommen die Fotos hinein
│   ├── fonts/                  Selbst gehostete Schriften
│   ├── favicon.svg
│   └── robots.txt
├── src/
│   ├── data/
│   │   └── content.ts          ► ALLE TEXTE DER WEBSITE
│   ├── components/
│   │   ├── Navbar.tsx              Navigation mit Hamburger-Menü
│   │   ├── ScrollProgress.tsx      Fortschrittsbalken oben
│   │   ├── BackToTopButton.tsx     Zurück nach oben
│   │   ├── HeroSection.tsx         Titelbereich
│   │   ├── IntroSection.tsx        Begrüßung und Zitat
│   │   ├── TimelineSection.tsx     Zeitstrahl
│   │   ├── StatsSection.tsx        25 Jahre in Zahlen
│   │   ├── GallerySection.tsx      Fotogalerie
│   │   ├── ImageLightbox.tsx       Großansicht der Bilder
│   │   ├── BeforeAfterSection.tsx  Damals & heute
│   │   ├── FactsSection.tsx        25 Dinge
│   │   ├── QuizSection.tsx         Gästequiz
│   │   ├── MessagesSection.tsx     Grüße
│   │   ├── EventInfoSection.tsx    Feierinformationen
│   │   ├── PhotoUploadSection.tsx  Digitale Fotowand
│   │   ├── ClosingSection.tsx      Abschluss
│   │   ├── Footer.tsx              Fußzeile
│   │   └── ui/                     Bausteine (Bild, Einblenden, …)
│   ├── hooks/                  Wiederverwendbare Logik
│   ├── lib/                    Hilfsfunktionen
│   ├── index.css               Farben, Schriften, Grundlayout
│   ├── App.tsx                 Reihenfolge der Abschnitte
│   └── main.tsx                Einstiegspunkt
├── index.html
└── vite.config.ts
```

**Grundprinzip:** Die Komponenten enthalten keine persönlichen Texte. Sie sind
reine Darstellungslogik und holen sich alles aus `src/data/content.ts`.

---

## Texte ändern

Alle Texte stehen in **`src/data/content.ts`**.

```ts
hero: {
  eyebrow: 'Silberhochzeit',
  namen: 'Britta & Lutz',
  untertitel: '25 Jahre gemeinsam',
  ort: 'Drentwede',
  …
}
```

Nur den Text **zwischen den Anführungszeichen** ändern, Kommas stehen lassen.

Ausführliche Anleitung mit allen Stolperfallen:
**[INHALTE-BEARBEITEN.md](./INHALTE-BEARBEITEN.md)**

---

## Bilder austauschen

Alle Fotos gehören nach **`public/images/`**:

| Datei | Wofür |
| --- | --- |
| `hero.jpg` | Großes Titelbild |
| `damals.jpg` / `heute.jpg` | Vergleich – **gleicher Bildausschnitt!** |
| `gallery-01.jpg` … `gallery-12.jpg` | Galerie |
| `qr-fotowand.png` | QR-Code zur Fotowand |
| `og-image.jpg` | Vorschaubild für WhatsApp (1200 × 630 px) |

Einfach die eigenen Fotos genau so benennen und hineinlegen – in `content.ts`
muss nichts geändert werden.

Empfohlene Größe: längste Kante ca. 1600 px, unter 300 KB pro Bild.

**Fehlt ein Bild**, zeigt die Website automatisch eine gestaltete
Platzhalterfläche statt eines kaputten Bildsymbols. Die Seite lässt sich also
schon vor dem Einpflegen der Fotos vollständig ansehen.

---

## Feierdaten anpassen

In `src/data/content.ts` im Abschnitt `feier:`:

```ts
{
  id: 'datum',
  icon: 'kalender',
  label: 'Datum',
  zeilen: ['Samstag, 12. September 2026', 'Beginn um 15 Uhr'],
},
```

Die erste Zeile wird groß dargestellt, weitere klein darunter.
Verfügbare Icons: `kalender`, `uhr`, `ort`, `auto`, `kleidung`, `kontakt`,
`geschenk`.

---

## Maps-Link konfigurieren

Ort in Google Maps suchen → „Teilen“ → „Link kopieren“ → in `content.ts`
einsetzen:

```ts
feier: {
  karte: {
    label: 'In Google Maps öffnen',
    url: 'https://maps.app.goo.gl/beispiel',
  },
}
```

Solange `url` leer ist, erscheint statt des Buttons ein Hinweistext.

---

## Foto-Upload-Link konfigurieren

```ts
fotowand: {
  uploadUrl: 'https://cloud.beispiel.de/upload/abc',
}
```

Solange das Feld leer ist, ist der Button ausgegraut und es steht dort
„Der Foto-Upload wird zur Feier freigeschaltet.“

Geeignet sind Ordner-Links mit Upload-Recht (Nextcloud, Google Drive, Dropbox,
WeTransfer). Passenden QR-Code erzeugen und als
`public/images/qr-fotowand.png` ablegen.

Ein eigener Upload-Server ist **bewusst nicht** enthalten – dafür bräuchte es
ein Backend, das eine statische Website nicht hat.

---

## Deployment auf GitHub

Nach jedem Push auf den Branch **`main`** baut GitHub Actions die Website und
überträgt **nur den Inhalt von `dist/`** auf den Webspace.

```bash
git add .
git commit -m "Feierdaten ergänzt"
git push
```

Schlägt der Build fehl, wird nichts hochgeladen – eine kaputte Seite kann
nicht online gehen.

Vollständige Einrichtung: **[DEPLOYMENT.md](./DEPLOYMENT.md)**

### Hinweis zu GitHub Secrets

Zugangsdaten gehören **ausschließlich** in GitHub Repository Secrets, niemals
in den Quellcode.

Anzulegen unter: Repository → Settings → Secrets and variables → Actions

Es werden genau **drei** Secrets benötigt:

| Secret | Beispiel |
| --- | --- |
| `FTP_SERVER` | `w021c706.kasserver.com` – nur der Hostname, **ohne** `ftp://` |
| `FTP_USERNAME` | der FTP-Benutzer |
| `FTP_PASSWORD` | das FTP-Passwort |

Protokoll (explizites FTPS), Port (21) und Zielverzeichnis (`/`) stehen fest
im Workflow und brauchen keine Secrets.

> Das Zielverzeichnis ist `/`, weil der FTP-Benutzer bei ALL-INKL bereits auf
> das Webverzeichnis der Seite eingeschränkt ist. Die Wurzel der
> FTP-Verbindung **ist** damit schon das Webverzeichnis.

**Seite in einem Unterordner?** Dann zusätzlich eine *Variable* (kein Secret)
namens `VITE_BASE_PATH` mit z. B. `/silberhochzeit/` anlegen und im Workflow
beim Build-Schritt durchreichen. Für den Betrieb direkt unter einer (Sub-)Domain
ist nichts zu tun – der Standardwert `/` ist bereits richtig.

---

## Barrierefreiheit

Ein spürbarer Teil der Gäste ist über 60 und öffnet die Seite auf dem
Smartphone. Deshalb:

- vollständig mit der Tastatur bedienbar, sichtbarer Fokusring
- Lightbox und Menü fangen den Fokus und schließen mit `Escape`
- Textkontraste erfüllen WCAG AA
- Grundschrift ab 17 px, Touch-Ziele mindestens 44 px
- `prefers-reduced-motion` wird durchgängig berücksichtigt
- semantisches HTML, beschreibende Alternativtexte
- keine Bedienung, die nur per Hover funktioniert

---

## Datenschutz

- Keine Cookies, kein Tracking, keine Analytics.
- Schriften werden selbst gehostet – **keine** Verbindung zu Google Fonts.
- Keine Einbindung externer Dienste.
- Voreingestellt ist `noindex`: Die Seite erscheint **nicht** in
  Suchmaschinen. Aufheben lässt sich das in `index.html` und
  `public/robots.txt`.

Vor der Veröffentlichung sollte die Familie bewusst entscheiden, welche Namen,
Adressen und Fotos öffentlich stehen sollen.

---

## Lizenz und Verwendung

Privates Familienprojekt. Bilder und Texte sind persönliches Eigentum der
Familie Barmbold.

Die verwendeten Schriften stehen unter der SIL Open Font License 1.1
(siehe `public/fonts/README.md`).
