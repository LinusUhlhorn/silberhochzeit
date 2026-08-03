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

Jetzt je nach Protokoll die passenden Secrets anlegen.

### Variante A – SFTP mit Passwort (empfohlen)

| Name | Wert (Beispiel) |
| --- | --- |
| `FTP_PROTOCOL` | `sftp` |
| `SFTP_HOST` | `ssh.meinedomain.de` |
| `SFTP_USERNAME` | `benutzer123` |
| `SFTP_PASSWORD` | das Passwort |
| `SFTP_PORT` | `22` |
| `SFTP_REMOTE_DIR` | `/httpdocs/` |

### Variante B – SFTP mit SSH-Schlüssel (am sichersten)

Wie Variante A, aber **statt** `SFTP_PASSWORD`:

| Name | Wert |
| --- | --- |
| `SFTP_PRIVATE_KEY` | der **komplette private** Schlüssel |

Schlüsselpaar erzeugen:

```bash
ssh-keygen -t ed25519 -C "deploy-silberhochzeit" -f ~/.ssh/silberhochzeit_deploy
```

- Der **öffentliche** Teil (`silberhochzeit_deploy.pub`) wird beim Hoster
  hinterlegt bzw. an `~/.ssh/authorized_keys` auf dem Server angehängt.
- Der **private** Teil (`silberhochzeit_deploy`, ohne `.pub`) kommt komplett
  in das Secret – **einschließlich** der Zeilen
  `-----BEGIN OPENSSH PRIVATE KEY-----` und `-----END OPENSSH PRIVATE KEY-----`.

Ist `SFTP_PRIVATE_KEY` gesetzt, benutzt der Workflow automatisch den
Schlüssel und ignoriert das Passwort.

### Variante C – FTPS oder FTP

| Name | Wert (Beispiel) |
| --- | --- |
| `FTP_PROTOCOL` | `ftps` (oder `ftp`) |
| `FTP_SERVER` | `ftp.meinedomain.de` |
| `FTP_USERNAME` | `ftp1234567-web` |
| `FTP_PASSWORD` | das Passwort |
| `FTP_PORT` | `21` |
| `FTP_REMOTE_DIR` | `/httpdocs/` |

> Wird `FTP_PROTOCOL` nicht gesetzt, verwendet der Workflow **`ftps`**.

### Zwischen FTP, FTPS und SFTP wechseln

Nur das Secret `FTP_PROTOCOL` auf `sftp`, `ftps` oder `ftp` ändern und die
passenden Zugangsdaten hinterlegen. Am Code muss nichts angepasst werden.

Bei Verbindungsproblemen mit FTPS meldet der Hoster manchmal ein veraltetes
TLS-Verfahren. Dann in `.github/workflows/deploy.yml` beim Schritt
*„Übertragen per FTPS / FTP“* `protocol` einmalig fest auf `ftps-legacy`
setzen.

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
| `Kein Server hinterlegt` | Secret fehlt | `SFTP_HOST` bzw. `FTP_SERVER` anlegen |
| `530 Login authentication failed` | Benutzername oder Passwort falsch | Zugangsdaten prüfen, Passwort neu setzen |
| `ENOTFOUND` / `getaddrinfo` | Servername falsch | ohne `ftp://` eintragen, nur den Hostnamen |
| `ECONNREFUSED` | falscher Port oder Protokoll | 22 für SFTP, 21 für FTP/FTPS |
| `Permission denied (publickey)` | öffentlicher Schlüssel nicht auf dem Server | `.pub`-Datei beim Hoster hinterlegen |
| `550 … No such file or directory` | Zielordner existiert nicht | Ordner prüfen, Schritt 4 |
| `Host key verification failed` | Server unbekannt | Port in `SFTP_PORT` prüfen |
| `npm ci` schlägt fehl | `package-lock.json` fehlt oder passt nicht | `npm install` lokal ausführen, Lockfile committen |
| Build bricht bei `tsc -b` ab | Tippfehler in `content.ts` | Fehlermeldung nennt Datei und Zeile |

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
