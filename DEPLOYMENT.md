# Deployment – Website automatisch veröffentlichen

Diese Anleitung beschreibt Schritt für Schritt, wie die Website nach jedem
Push automatisch auf den Webspace übertragen wird.

**Ziel:** Änderung machen → `git push` → zwei Minuten später ist sie online.

---

## Vorab: Was „WebFTP“ eigentlich ist

Viele Webhoster bieten im Kundenmenü etwas an, das **WebFTP**, „Datei-Manager“
oder „Online-Dateiverwaltung“ heißt. Das ist eine **Weboberfläche zum
Hochladen von Hand** – man klickt sich im Browser durch Ordner und lädt
Dateien einzeln hoch.

> **Ein automatisches Deployment kann WebFTP nicht.**
> GitHub Actions kann sich nicht in eine Weboberfläche einloggen.

Dafür werden **echte Zugangsdaten** für eines dieser Protokolle gebraucht:

| Protokoll | Verschlüsselt | Üblicher Port | Empfehlung |
| --- | --- | --- | --- |
| **SFTP** (über SSH) | ✅ vollständig | 22 | 🥇 erste Wahl |
| **FTPS** (FTP über TLS) | ✅ vollständig | 21 | 🥈 gute Alternative |
| **FTP** (unverschlüsselt) | ❌ nein | 21 | 🥉 nur als Notlösung |

Diese Daten stehen im Kundenmenü des Hosters meist unter „FTP-Zugang“,
„FTP-Konten“ oder „SSH-Zugang“. Findet man sie nicht: beim Support nachfragen,
ob **SFTP** verfügbar ist.

Bei unverschlüsseltem FTP wird das Passwort im Klartext übertragen. Wenn der
Hoster es anbietet, immer SFTP oder mindestens FTPS wählen.

---

## Schritt 1 – GitHub-Repository anlegen

1. Auf [github.com](https://github.com) einloggen.
2. Oben rechts auf **+** → **New repository**.
3. Ausfüllen:
   - **Repository name:** `silberhochzeit`
   - **Private** auswählen (empfohlen – die Seite enthält persönliche Inhalte)
   - **Keine** Häkchen bei „Add a README“, „.gitignore“ oder „license“
4. **Create repository**.

---

## Schritt 2 – Projekt mit dem Repository verbinden

Im Projektordner im Terminal:

```bash
git init
git branch -M main
git add .
git commit -m "Website zur Silberhochzeit"
git remote add origin https://github.com/BENUTZERNAME/silberhochzeit.git
```

`BENUTZERNAME` durch den eigenen GitHub-Namen ersetzen.

> Ist das Projekt bereits ein Git-Repository (üblich, wenn es geklont wurde),
> entfallen `git init` und `git remote add`.

---

## Schritt 3 – Erster Push

```bash
git push -u origin main
```

GitHub fragt nach Zugangsdaten. Statt des Passworts wird ein **Personal Access
Token** benötigt: GitHub → Settings → Developer settings →
Personal access tokens → Tokens (classic) → *Generate new token* mit dem
Recht `repo`.

Danach ist der Code auf GitHub. Der Workflow startet bereits – und schlägt
beim Upload fehl, weil noch keine Zugangsdaten hinterlegt sind. Das ist an
dieser Stelle normal.

---

## Schritt 4 – Zugangsdaten des Webspace ermitteln

Im Kundenmenü des Hosters folgende fünf Angaben heraussuchen:

| Angabe | Beispiel | Wo zu finden |
| --- | --- | --- |
| Server | `ftp.meinedomain.de` oder `123.45.67.89` | „FTP-Zugang“ |
| Benutzername | `ftp1234567-web` | ebenda |
| Passwort | selbst vergeben | ebenda (ggf. neu setzen) |
| Port | `22` (SFTP) bzw. `21` (FTP/FTPS) | Doku des Hosters |
| Zielordner | `/httpdocs/` oder `/html/` | siehe unten |

### Den richtigen Zielordner finden

Das ist die häufigste Fehlerquelle. Der Zielordner ist das Verzeichnis, dessen
Inhalt unter der Domain ausgeliefert wird. Je nach Hoster heißt es anders:

| Hoster / System | Typischer Zielordner |
| --- | --- |
| Strato | `/` oder `/html/` |
| IONOS (1&1) | `/` |
| All-Inkl | `/www/htdocs/wNNNNNNN/` |
| Hetzner | `/public_html/` |
| Plesk allgemein | `/httpdocs/` |
| cPanel allgemein | `/public_html/` |
| Netcup | `/httpdocs/` |

**So findet man es sicher heraus:**

1. Mit einem FTP-Programm verbinden (z. B. [FileZilla](https://filezilla-project.org),
   kostenlos) oder über WebFTP im Browser.
2. Nach einer vorhandenen `index.html` oder `index.php` suchen – der Ordner,
   in dem sie liegt, ist der richtige.
3. Im Zweifel eine Testdatei `test.txt` hochladen und
   `https://meinedomain.de/test.txt` im Browser aufrufen. Erscheint der Inhalt,
   stimmt der Ordner.

> **Wichtig:** Der Zielordner muss mit einem **Schrägstrich enden**, z. B.
> `/httpdocs/`. Der Workflow ergänzt ihn zwar automatisch, aber richtig
> eingetragen ist besser.

**Soll die Seite in einem Unterordner liegen** (z. B.
`https://meinedomain.de/silberhochzeit/`), dann ist der Zielordner
`/httpdocs/silberhochzeit/` – **und zusätzlich muss die Basis-URL gesetzt
werden**, siehe Schritt 7.

---

## Schritt 5 – GitHub Secrets eintragen

> **Niemals** Zugangsdaten in Dateien des Repositories schreiben. Secrets sind
> verschlüsselt gespeichert und erscheinen auch in den Protokollen nur als
> `***`.

**Weg:** Repository → **Settings** → linke Spalte **Secrets and variables** →
**Actions** → Reiter **Secrets** → **New repository secret**.

Es werden genau **drei** Secrets gebraucht – mehr nicht:

| Name | Wert (Beispiel) |
| --- | --- |
| `FTP_SERVER` | `w021c706.kasserver.com` |
| `FTP_USERNAME` | der FTP-Benutzer |
| `FTP_PASSWORD` | das FTP-Passwort |

Protokoll (**explizites FTPS**), Port (**21**) und Zielverzeichnis (**`/`**)
stehen fest im Workflow und brauchen keine Secrets.

### Worauf es bei den Werten ankommt

- **`FTP_SERVER`** enthält nur den Hostnamen. Kein `ftp://` davor, kein
  Schrägstrich oder Pfad dahinter, keine Leer- oder Zeilenumbruchzeichen.
  Bei ALL-INKL ist das der Servername der Form `wNNNcNNN.kasserver.com`,
  **nicht** die eigene Domain.
- **`FTP_USERNAME`** ist der FTP-Benutzer aus dem KAS (Form `fNNNNNNN`),
  nicht die E-Mail-Adresse des KAS-Logins.
- **`FTP_PASSWORD`** ist das Passwort des FTP-Benutzers, nicht das
  KAS-Login-Passwort.

> **Achtung beim Einfügen:** Ein versehentliches Leerzeichen oder ein
> Zeilenumbruch am Ende eines Secrets führt zu einem Login-Fehler, der wie ein
> falsches Passwort aussieht. Im Zweifel das Secret löschen und neu anlegen.

### Der häufigste Fehler: falscher Reiter

Unter *Settings → Secrets and variables → Actions* gibt es **zwei Reiter**:

| Reiter | Zugriff im Workflow | Wofür |
| --- | --- | --- |
| **Secrets** | `${{ secrets.NAME }}` | Passwörter, Zugangsdaten – Werte sind nicht mehr lesbar |
| **Variables** | `${{ vars.NAME }}` | unkritische Einstellungen – Werte bleiben im Klartext sichtbar |

Werden die Zugangsdaten versehentlich im Reiter **Variables** angelegt, bleibt
`secrets.FTP_SERVER` leer. Die FTP-Action meldet dann nur:

```
Error: Input required and not supplied: server
```

Das klingt nach einem Fehler im Workflow, ist aber ein Hinweis darauf, dass die
Secrets nicht ankommen. Weitere mögliche Ursachen:

- Die Werte wurden als **Environment secrets** statt als **Repository secrets**
  angelegt. Environment-Secrets sind nur erreichbar, wenn der Job zusätzlich
  ein `environment:` deklariert.
- Im Namen steht ein Leerzeichen (`FTP_SERVER ` statt `FTP_SERVER`).
- Die Secrets liegen in einem anderen Repository.

Der Workflow prüft das inzwischen im Schritt **„Zugangsdaten prüfen"** und nennt
beim Fehlschlag genau, welches der drei Secrets leer ankommt. Werte werden dabei
nie ausgegeben.

### Warum das Zielverzeichnis `/` ist

Bei ALL-INKL wird ein FTP-Benutzer beim Anlegen auf ein Verzeichnis
eingeschränkt. Ist er bereits auf das Webverzeichnis der Seite begrenzt, dann
**ist** die Wurzel der FTP-Verbindung schon dieses Verzeichnis. Ein zusätzlicher
Pfad wie `/httpdocs/` würde dann ins Leere zeigen und zu
`550 … No such file or directory` führen.

Ist der FTP-Benutzer dagegen auf die Kontowurzel gesetzt und die Seite liegt
in einem Unterordner, muss `server-dir` im Workflow entsprechend angepasst
werden, z. B. auf `/silberhochzeit/`.

### Falls FTPS Verbindungsprobleme macht

Manche Server sprechen kein modernes TLS. Dann in
`.github/workflows/deploy.yml` beim Schritt *„Website per FTPS veröffentlichen“*
`protocol: ftps` einmalig auf `ftps-legacy` ändern. Bei ALL-INKL ist das
normalerweise nicht nötig.

---

## Schritt 6 – Deployment auslösen

Ab jetzt genügt:

```bash
git add .
git commit -m "Feierdaten ergänzt"
git push
```

**Wichtig:** Es wird **nur** bei einem Push auf den Branch `main` etwas
hochgeladen. Lokales Speichern einer Datei löst nichts aus, und Pushes auf
andere Branches werden zwar gebaut, aber nicht veröffentlicht.

### Manuell starten

1. Repository → Reiter **Actions**
2. links **Build & Deployment** wählen
3. rechts **Run workflow** → Branch `main` → **Run workflow**

Praktisch, um nach einer Änderung an den Secrets ohne neuen Commit erneut zu
deployen.

---

## Schritt 7 – Basis-URL bei einem Unterordner

**Nur nötig, wenn die Seite NICHT direkt unter der Domain liegt.**

| Adresse der Website | Einstellung |
| --- | --- |
| `https://meinedomain.de/` | nichts tun (Standard `/`) |
| `https://meinedomain.de/silberhochzeit/` | `VITE_BASE_PATH` = `/silberhochzeit/` |

Diese Einstellung ist eine **Variable**, kein Secret:

Repository → **Settings** → **Secrets and variables** → **Actions** →
Reiter **Variables** → **New repository variable**

| Name | Wert |
| --- | --- |
| `VITE_BASE_PATH` | `/silberhochzeit/` |

Der Wert muss mit `/` **beginnen und enden**.

Lokal testen lässt sich das so:

```bash
VITE_BASE_PATH=/silberhochzeit/ npm run build
npm run preview
```

> Wird die Basis-URL vergessen, lädt die Seite zwar, bleibt aber weiß, weil
> Stylesheet und Skripte unter der falschen Adresse gesucht werden. Ein Blick
> in die Browser-Konsole zeigt dann 404-Fehler.

---

## Schritt 8 – Fehler in GitHub Actions prüfen

Repository → Reiter **Actions**. Jeder Lauf hat ein Symbol:

- 🟡 läuft gerade
- ✅ erfolgreich
- ❌ fehlgeschlagen

Auf den Lauf klicken → auf den roten Job klicken → der fehlgeschlagene Schritt
ist bereits aufgeklappt.

### Häufige Fehlermeldungen

| Meldung | Ursache | Lösung |
| --- | --- | --- |
| **Gar kein Lauf erscheint** | Der Workflow liegt nicht auf `main` | Actions liest die Workflow-Datei aus dem Branch, auf den gepusht wird. `.github/workflows/deploy.yml` muss auf `main` liegen. |
| `530 Login authentication failed` | Benutzername oder Passwort falsch – oft ein mitkopiertes Leerzeichen | Secrets löschen und sauber neu anlegen |
| `ENOTFOUND` / `getaddrinfo` | Servername falsch | nur den Hostnamen eintragen, ohne `ftp://` und ohne Pfad |
| `ECONNREFUSED` / Zeitüberschreitung | falscher Port | für FTPS muss der Port `21` sein, nicht 22 oder 990 |
| `550 … No such file or directory` | `server-dir` zeigt ins Leere | Ist der FTP-Benutzer aufs Webverzeichnis beschränkt, muss `server-dir: /` sein |
| TLS-/Zertifikatsfehler | Server spricht kein modernes TLS | `protocol: ftps` einmalig auf `ftps-legacy` ändern |
| `npm ci` schlägt fehl | `package-lock.json` fehlt oder passt nicht | `npm install` lokal ausführen, Lockfile committen |
| Build bricht bei `tsc -b` ab | Tippfehler in `content.ts` | Fehlermeldung nennt Datei und Zeile |
| Seite bleibt weiß, 404 bei `/assets/…` | falsche Basis-URL | Schritt 7 – bei Betrieb direkt unter der Domain muss `VITE_BASE_PATH` **ungesetzt** bleiben |

Die Timeout-Zeit bei FTP kann bei sehr langsamen Servern zu knapp sein. Dann
im Workflow beim FTP-Schritt `timeout: 60000` ergänzen.

---

## Schritt 9 – Prüfen, ob alles geklappt hat

1. `https://meinedomain.de` im Browser öffnen.
2. **Neu laden mit `Strg`+`F5`** (bzw. `Cmd`+`Shift`+`R`) – sonst zeigt der
   Browser womöglich noch die alte Fassung.
3. Diese Punkte durchgehen:
   - [ ] Titelbereich mit „Britta & Lutz“ erscheint
   - [ ] Schriften sehen elegant aus (Serifen bei den Überschriften)
   - [ ] Bilder werden angezeigt
   - [ ] Navigation springt zu den Abschnitten
   - [ ] Quiz lässt sich spielen
   - [ ] Galerie öffnet die Großansicht
   - [ ] Auf dem **Smartphone** prüfen – nicht nur am Rechner
   - [ ] Kein waagerechter Scrollbalken

Bleibt die Seite weiß: Browser-Konsole öffnen (`F12`). 404-Fehler bei
`/assets/…` deuten fast immer auf eine falsche Basis-URL hin (Schritt 7).

---

## Schritt 10 – Ein fehlerhaftes Deployment zurücknehmen

### Weg 1: Fehler korrigieren und neu pushen (meist am schnellsten)

```bash
# Änderung rückgängig machen
git revert HEAD
git push
```

`git revert` erzeugt einen neuen Commit, der die letzte Änderung aufhebt. Der
Workflow läuft automatisch und stellt den vorherigen Stand wieder her.

### Weg 2: Zu einem bestimmten Stand zurück

```bash
git log --oneline          # gewünschten Commit heraussuchen
git revert <commit-hash>
git push
```

### Weg 3: Notfall – Seite sofort offline nehmen

Über WebFTP oder FileZilla die Datei `index.html` im Zielordner umbenennen
(z. B. in `index.html.aus`). Danach in Ruhe reparieren und erneut deployen.

> **Hinweis:** Der Workflow löscht auf dem Webspace bewusst **keine** Dateien.
> Ein fehlgeschlagenes Deployment kann also nichts zerstören, was schon da war.
> Der Nachteil: Alte, nicht mehr benötigte Dateien bleiben liegen. Bei Bedarf
> lassen sie sich gefahrlos von Hand löschen.

---

## Wie der Workflow arbeitet

Datei: `.github/workflows/deploy.yml`

```
Push auf main
      │
      ▼
┌─────────────────────┐
│  Job 1: build       │
│  • Code auschecken  │
│  • Node 20          │
│  • npm ci           │
│  • npm run build    │  ← bricht bei Typ- oder Build-Fehlern ab
│  • dist/ prüfen     │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│  Job 2: deploy      │  (nur bei Branch main)
│  • Protokoll wählen │
│  • Upload dist/     │  ← SFTP / FTPS / FTP
└─────────────────────┘
```

**Sicherheitseigenschaften:**

- Schlägt der Build fehl, wird **nichts** hochgeladen – eine kaputte Seite
  kann so nie online gehen.
- Übertragen wird ausschließlich der **Inhalt** von `dist/`.
  `node_modules/`, `src/`, `.git/` und Konfigurationsdateien landen nie auf
  dem Webspace.
- Es wird auf dem Server **nichts gelöscht**.
- Der Workflow hat nur Leserechte auf das Repository.
- Zwei gleichzeitige Deployments sind ausgeschlossen.
- Nach dem ersten Mal werden nur noch geänderte Dateien übertragen.

---

## Sicherheitsregeln

**Diese Angaben gehören ausschließlich in GitHub Secrets:**

Serveradresse · Benutzername · Passwort · privater SSH-Schlüssel · Zielordner

**Niemals** in: Quellcode, Workflow-Dateien, `.env`-Dateien im Repository,
README-Dateien, Commit-Nachrichten.

Die `.gitignore` blockiert bereits `.env`, `*.pem`, `*.key`, `id_rsa` und
ähnliche Dateien.

> **Wenn doch einmal ein Passwort im Repository gelandet ist:** Es genügt
> **nicht**, es zu löschen und neu zu committen – es bleibt in der
> Git-Historie lesbar. Das Passwort muss beim Hoster **sofort geändert**
> werden.
