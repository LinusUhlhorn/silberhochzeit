# Silberhochzeit · Britta & Lutz

Website zur Silberhochzeit von **Britta und Lutz Barmbold** aus Drentwede.
25 Jahre gemeinsam – erzählt als digitale Festschrift.

Eine One-Page-Website mit Zeitstrahl, „Damals & heute“-Vergleich, Gästequiz
und einer Gästewand, auf der Gäste Grüße und Fotos hinterlassen.

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
| Backend | schlankes PHP für Gästewand und Admin (`public/api/`) |
| Deployment | GitHub Actions → FTPS (ALL-INKL) |

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
├── public/                     ► wird 1:1 auf den Webspace kopiert
│   ├── api/                    ► PHP-Backend der Gästewand
│   │   ├── lib.php                 Konfiguration, Verzeichnisse, Ratenbegrenzung
│   │   ├── bild.php                Bildprüfung und Neuberechnung
│   │   ├── upload.php              Beitrag entgegennehmen
│   │   ├── entries.php             Sichtbare Beiträge ausliefern
│   │   ├── admin.php               Anmeldung, Archivieren, Löschen
│   │   └── setup.php               Einmalige Passwortvergabe
│   ├── images/                 ► Hier kommen die Fotos hinein
│   ├── fonts/                  Selbst gehostete Schriften
│   ├── .htaccess               Sicherheits-Header, Sperren, Caching
│   ├── favicon.svg
│   └── robots.txt
├── src/
│   ├── data/
│   │   └── content.ts          ► ALLE TEXTE DER WEBSITE
│   ├── lib/
│   │   ├── api.ts              Zugriff auf das PHP-Backend
│   │   ├── assets.ts           Pfade mit Basis-URL
│   │   └── scrollen.ts
│   ├── components/
│   │   ├── Navbar.tsx              Navigation mit Hamburger-Menü
│   │   ├── ScrollProgress.tsx      Fortschrittsbalken oben
│   │   ├── BackToTopButton.tsx     Zurück nach oben
│   │   ├── HeroSection.tsx         Titelbereich
│   │   ├── IntroSection.tsx        Begrüßung und Zitat
│   │   ├── TimelineSection.tsx     Zeitstrahl
│   │   ├── StatsSection.tsx        25 Jahre in Zahlen
│   │   ├── BeforeAfterSection.tsx  Damals & heute
│   │   ├── FactsSection.tsx        25 Dinge
│   │   ├── QuizSection.tsx         Gästequiz
│   │   ├── GuestWallSection.tsx    Gästewand: Formular und Beiträge
│   │   ├── ImageLightbox.tsx       Großansicht der Bilder
│   │   ├── ClosingSection.tsx      Abschluss
│   │   ├── Footer.tsx              Fußzeile
│   │   └── ui/                     Bausteine (Bild, Einblenden, …)
│   ├── admin/                  Verwaltung unter /admin.html
│   │   ├── AdminApp.tsx
│   │   ├── adminApi.ts
│   │   └── main.tsx
│   ├── hooks/                  Wiederverwendbare Logik
│   ├── index.css               Farben, Schriften, Grundlayout
│   ├── App.tsx                 Reihenfolge der Abschnitte
│   └── main.tsx                Einstiegspunkt
├── index.html                  Die Website
├── admin.html                  Die Verwaltung
└── vite.config.ts
```

Auf dem Webspace entstehen zusätzlich zwei Ordner, die **nicht** im
Repository liegen und von keinem Deployment überschrieben werden:

| Ordner | Inhalt | Von außen erreichbar |
| --- | --- | --- |
| `daten/` | Beiträge als JSON, Konfiguration, Sperrlisten | nein, mehrfach gesperrt |
| `uploads/bilder/` | die fertig verarbeiteten Fotos | ja, aber nur Bilddateien |

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
| `qr-gaestewand.png` | QR-Code zur Gästewand |
| `og-image.jpg` | Vorschaubild für WhatsApp (1200 × 630 px) |

Fotos der Gäste landen **nicht** hier, sondern auf dem Webspace in
`uploads/bilder/`.

Einfach die eigenen Fotos genau so benennen und hineinlegen – in `content.ts`
muss nichts geändert werden.

Empfohlene Größe: längste Kante ca. 1600 px, unter 300 KB pro Bild.

**Fehlt ein Bild**, zeigt die Website automatisch eine gestaltete
Platzhalterfläche statt eines kaputten Bildsymbols. Die Seite lässt sich also
schon vor dem Einpflegen der Fotos vollständig ansehen.

---

## Gästewand und Admin-Bereich

Gäste hinterlassen auf der Seite einen Gruß und bis zu fünf Fotos. Beides
erscheint sofort auf der Gästewand.

### Einmalig einrichten

Nach dem ersten Deployment muss ein Admin-Passwort vergeben werden:

1. Im ALL-INKL-Dateimanager (KAS) oder per FTP im Ordner `daten/` eine leere
   Datei namens **`SETUP-ERLAUBT`** anlegen (ohne Endung).
2. `https://DEINE-ADRESSE/api/setup.php` aufrufen.
3. Passwort vergeben (mindestens 10 Zeichen).

Die Markerdatei wird danach automatisch gelöscht, `setup.php` ist damit
wieder gesperrt.

> **Warum dieser Umweg?** `setup.php` liegt öffentlich im Netz. Ohne Nachweis
> könnte der Erste, der die Adresse errät, das Passwort setzen. Die Markerdatei
> kann nur anlegen, wer Zugriff auf den Webspace hat.

Passwort später ändern: Schritte 1 bis 3 einfach wiederholen.

### Beiträge verwalten

Unter **`https://DEINE-ADRESSE/admin.html`** anmelden. Dort lässt sich jeder
Beitrag:

- **archivieren** – verschwindet von der Website, bleibt aber erhalten
- **wieder anzeigen** – macht das Archivieren rückgängig
- **endgültig löschen** – entfernt Beitrag und Bilder unwiderruflich

### Einstellungen ändern

Die Datei `daten/config.php` auf dem Webspace (wird bei der Einrichtung
angelegt und von keinem Deployment überschrieben):

```php
return [
  'admin_hash'    => '…',      // nicht anfassen
  'vorabfreigabe' => false,    // true = Beiträge erst nach Freigabe sichtbar
  'zugangscode'   => '',       // z. B. 'BRITTA25' – leer = kein Code nötig
];
```

**`vorabfreigabe`** auf `true` setzen, wenn Beiträge erst nach deiner Freigabe
erscheinen sollen. Sie tauchen dann im Admin unter „Wartet" auf.

**`zugangscode`** füllen, wenn nur Gäste mit einem Code aus der Einladung
hochladen dürfen sollen. Die Website blendet das Codefeld automatisch ein,
sobald der Server einen Code verlangt.

### Wie die Sicherheit funktioniert

| Risiko | Gegenmaßnahme |
| --- | --- |
| Skript als Bild getarnt | Typ wird am Dateiinhalt geprüft, nicht an der Endung |
| Code in einem echten Bild versteckt | Jedes Bild wird **serverseitig neu berechnet**; übrig bleiben nur Pixel |
| Ausführung im Upload-Ordner | Mehrfach gesperrt; gespeichert wird nur `.jpg` mit selbst erzeugtem Namen |
| Doppelter Beitrag bei langsamem Netz | Einmalige Vorgangskennung je Absendevorgang, serverseitig atomar gesperrt |
| Gleichzeitige Uploads | Ein JSON je Beitrag, atomar geschrieben – keine gemeinsame Datei, die zerreißen kann |
| Massenhaftes Hochladen | Ratenbegrenzung je IP |
| Fremde Seite löst Aktionen aus | Herkunftsprüfung, CSRF-Token im Admin |
| Passwort raten | Ratenbegrenzung der Anmeldung, Hash statt Klartext |

---

## Deployment auf GitHub

Nach jedem Push auf den Branch **`main`** baut GitHub Actions die Website und
überträgt **nur den Inhalt von `dist/`** auf den Webspace.

```bash
git add .
git commit -m "Texte überarbeitet"
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
