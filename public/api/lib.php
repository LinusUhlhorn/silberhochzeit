<?php
/**
 * Gemeinsame Grundlage aller API-Endpunkte.
 *
 * Wird von upload.php, entries.php, admin.php und setup.php eingebunden.
 * Enthaelt Konfiguration, Verzeichnisanlage, Sicherheits-Header,
 * Ratenbegrenzung und kleine Helfer.
 */

declare(strict_types=1);

// Fehler niemals an Besucher ausgeben – sie koennten Pfade verraten.
ini_set('display_errors', '0');
ini_set('log_errors', '1');
error_reporting(E_ALL);

/* ==========================================================================
   PFADE
   ========================================================================== */

/** Wurzelverzeichnis der Website (api/ liegt direkt darunter). */
const SH_ROOT = __DIR__ . '/..';

/** Nicht oeffentlich lesbar – Eintraege, Sperrlisten, Konfiguration. */
const SH_DATEN = SH_ROOT . '/daten';

/** Oeffentlich lesbar – ausschliesslich fertig verarbeitete Bilder. */
const SH_UPLOADS = SH_ROOT . '/uploads';

/* ==========================================================================
   STANDARDKONFIGURATION
   Wird von daten/config.php ueberschrieben, sofern vorhanden.
   ========================================================================== */

$SH_CONFIG = [
    // Passwort-Hash des Admin-Zugangs. Wird von setup.php gesetzt.
    'admin_hash' => '',

    // Muessen Beitraege erst freigegeben werden, bevor sie erscheinen?
    // false = sofort sichtbar, Archivieren im Nachhinein (Voreinstellung)
    // true  = erscheinen erst nach Freigabe im Admin-Bereich
    'vorabfreigabe' => false,

    // Optionaler Zugangscode fuer das Hochladen.
    // Leer = jeder mit dem Link darf hochladen.
    // Beispiel: 'BRITTA25'
    'zugangscode' => '',

    // Grenzen
    'max_bilder_pro_beitrag' => 5,
    'max_dateigroesse'       => 12 * 1024 * 1024,  // 12 MB je Bild
    'max_kante'              => 1800,              // laengste Bildkante
    'max_kante_vorschau'     => 500,
    'jpeg_qualitaet'         => 82,
    'max_name_laenge'        => 60,
    'max_text_laenge'        => 1000,

    // Ratenbegrenzung je IP
    'limit_uploads'          => 40,   // Beitraege
    'limit_uploads_fenster'  => 3600, // pro Stunde
    'limit_login'            => 8,    // Anmeldeversuche
    'limit_login_fenster'    => 900,  // pro 15 Minuten
];

$configDatei = SH_DATEN . '/config.php';
if (is_file($configDatei)) {
    /** @var array $benutzerConfig */
    $benutzerConfig = require $configDatei;
    if (is_array($benutzerConfig)) {
        $SH_CONFIG = array_merge($SH_CONFIG, $benutzerConfig);
    }
}

/* ==========================================================================
   VERZEICHNISSE UND SCHUTZDATEIEN
   ========================================================================== */

/**
 * Legt die benoetigten Verzeichnisse an und stellt sicher, dass in ihnen
 * kein Skript ausgefuehrt werden kann. Selbstheilend: laeuft bei jedem
 * Aufruf, greift aber nur, wenn etwas fehlt.
 */
function sh_verzeichnisse_vorbereiten(): void
{
    $struktur = [
        SH_DATEN               => true,   // true = komplett sperren
        SH_DATEN . '/eintraege' => true,
        SH_DATEN . '/system'    => true,
        SH_UPLOADS             => false,  // false = Bilder duerfen gelesen werden
        SH_UPLOADS . '/bilder'  => false,
    ];

    foreach ($struktur as $pfad => $komplettSperren) {
        if (!is_dir($pfad)) {
            @mkdir($pfad, 0755, true);
        }

        $htaccess = $pfad . '/.htaccess';
        if (!is_file($htaccess)) {
            @file_put_contents(
                $htaccess,
                $komplettSperren ? sh_htaccess_gesperrt() : sh_htaccess_nur_bilder()
            );
        }
    }
}

/** Verzeichnis ist von aussen ueberhaupt nicht erreichbar. */
function sh_htaccess_gesperrt(): string
{
    return <<<'HTACCESS'
# Dieses Verzeichnis darf von aussen nicht gelesen werden.
Options -Indexes -ExecCGI
<IfModule mod_authz_core.c>
    Require all denied
</IfModule>
<IfModule !mod_authz_core.c>
    Order allow,deny
    Deny from all
</IfModule>
HTACCESS;
}

/**
 * Verzeichnis liefert ausschliesslich Bilder aus.
 *
 * Mehrfach abgesichert, weil je nach Serverkonfiguration nicht jede
 * Massnahme greift: PHP-Engine abschalten wirkt nur bei mod_php,
 * RemoveHandler/AddType wirken auch bei FastCGI. Zusaetzlich werden
 * ausschliesslich .jpg-Dateien mit selbst erzeugten Namen abgelegt.
 */
function sh_htaccess_nur_bilder(): string
{
    return <<<'HTACCESS'
# Hier liegen ausschliesslich fertig verarbeitete Bilder.
# Es darf unter keinen Umstaenden Code ausgefuehrt werden.
Options -Indexes -ExecCGI

<IfModule mod_php.c>
    php_flag engine off
</IfModule>
<IfModule mod_php7.c>
    php_flag engine off
</IfModule>
<IfModule mod_php8.c>
    php_flag engine off
</IfModule>

RemoveHandler .php .phtml .php3 .php4 .php5 .php6 .php7 .php8 .phps .cgi .pl .py .jsp .asp .sh .shtml
AddType text/plain .php .phtml .php3 .php4 .php5 .php6 .php7 .php8 .phps .cgi .pl .py .jsp .asp .sh .shtml

# Nur Bilddateien ausliefern, alles andere sperren.
<FilesMatch "\.(jpe?g|png|webp)$">
    <IfModule mod_authz_core.c>
        Require all granted
    </IfModule>
</FilesMatch>
<FilesMatch "(?<!\.jpe?g|\.png|\.webp)$">
    <IfModule mod_authz_core.c>
        Require all denied
    </IfModule>
</FilesMatch>
HTACCESS;
}

/* ==========================================================================
   ANTWORTEN
   ========================================================================== */

function sh_sicherheits_header(): void
{
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: DENY');
    header('Referrer-Policy: same-origin');
    header('Cache-Control: no-store');
}

/**
 * Beendet die Verarbeitung mit einer JSON-Antwort.
 *
 * @param array<string,mixed> $daten
 */
function sh_json(array $daten, int $status = 200): never
{
    sh_sicherheits_header();
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($daten, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function sh_fehler(string $meldung, int $status = 400, string $code = ''): never
{
    sh_json(['ok' => false, 'fehler' => $meldung, 'code' => $code], $status);
}

/** Erzwingt eine bestimmte HTTP-Methode. */
function sh_nur_methode(string $methode): void
{
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== $methode) {
        header('Allow: ' . $methode);
        sh_fehler('Methode nicht erlaubt.', 405);
    }
}

/**
 * Prueft, ob die Anfrage von der eigenen Seite kommt.
 *
 * Schuetzt davor, dass fremde Seiten im Namen eines Besuchers Beitraege
 * anlegen oder Admin-Aktionen ausloesen.
 */
function sh_gleiche_herkunft_pruefen(): void
{
    $host = $_SERVER['HTTP_HOST'] ?? '';
    $quelle = $_SERVER['HTTP_ORIGIN'] ?? $_SERVER['HTTP_REFERER'] ?? '';

    if ($quelle === '') {
        // Manche Browser senden bei same-origin-POST keinen Origin-Header.
        // Das ist kein Angriffssignal, also durchlassen.
        return;
    }

    $quellHost = parse_url($quelle, PHP_URL_HOST);
    if ($quellHost === null || $quellHost === false) {
        sh_fehler('Ungültige Herkunft.', 403);
    }

    // Port aus dem Host entfernen, bevor verglichen wird.
    $eigenerHost = preg_replace('/:\d+$/', '', $host) ?? '';

    if (strcasecmp($quellHost, $eigenerHost) !== 0) {
        sh_fehler('Anfrage kommt nicht von dieser Website.', 403);
    }
}

/* ==========================================================================
   RATENBEGRENZUNG
   ========================================================================== */

function sh_ip(): string
{
    $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    return is_string($ip) ? $ip : '0.0.0.0';
}

/**
 * Erlaubt hoechstens $anzahl Vorgaenge je $fenster Sekunden pro IP.
 *
 * Die Zeitstempel liegen in einer Datei je IP-Hash. Der Zugriff ist mit
 * flock abgesichert, damit gleichzeitige Aufrufe sich nicht ins Gehege
 * kommen.
 *
 * @return bool true = erlaubt
 */
function sh_rate_limit(string $bereich, int $anzahl, int $fenster): bool
{
    $datei = SH_DATEN . '/system/rl_' . $bereich . '_'
        . substr(hash('sha256', sh_ip() . '|' . $bereich), 0, 32) . '.json';

    $griff = @fopen($datei, 'c+');
    if ($griff === false) {
        // Im Zweifel durchlassen – lieber ein Upload zu viel als eine
        // Feier, auf der niemand etwas hochladen kann.
        return true;
    }

    try {
        if (!flock($griff, LOCK_EX)) {
            return true;
        }

        $inhalt = stream_get_contents($griff);
        $stempel = json_decode((string) $inhalt, true);
        if (!is_array($stempel)) {
            $stempel = [];
        }

        $jetzt = time();
        $stempel = array_values(array_filter(
            $stempel,
            static fn($t): bool => is_int($t) && $t > $jetzt - $fenster
        ));

        if (count($stempel) >= $anzahl) {
            return false;
        }

        $stempel[] = $jetzt;

        ftruncate($griff, 0);
        rewind($griff);
        fwrite($griff, json_encode($stempel));
        fflush($griff);

        return true;
    } finally {
        flock($griff, LOCK_UN);
        fclose($griff);
    }
}

/* ==========================================================================
   EINTRAEGE
   ========================================================================== */

/**
 * Schreibt eine Datei atomar: erst in eine temporaere Datei, dann
 * umbenennen. Dadurch sieht ein gleichzeitiger Leser die Datei entweder
 * gar nicht oder vollstaendig – nie halb geschrieben.
 */
function sh_atomar_schreiben(string $ziel, string $inhalt): bool
{
    $temp = $ziel . '.tmp' . bin2hex(random_bytes(6));
    if (@file_put_contents($temp, $inhalt, LOCK_EX) === false) {
        return false;
    }
    if (!@rename($temp, $ziel)) {
        @unlink($temp);
        return false;
    }
    return true;
}

function sh_eintrag_pfad(string $id): string
{
    return SH_DATEN . '/eintraege/' . $id . '.json';
}

/** Erlaubt nur selbst erzeugte IDs – schuetzt vor Pfad-Manipulation. */
function sh_id_gueltig(string $id): bool
{
    return (bool) preg_match('/^[0-9a-f]{32}$/', $id);
}

/**
 * Liest alle Eintraege, neueste zuerst.
 *
 * @return list<array<string,mixed>>
 */
function sh_eintraege_lesen(): array
{
    $muster = SH_DATEN . '/eintraege/*.json';
    $dateien = glob($muster);
    if ($dateien === false) {
        return [];
    }

    $eintraege = [];
    foreach ($dateien as $datei) {
        $roh = @file_get_contents($datei);
        if ($roh === false) {
            continue;
        }
        $eintrag = json_decode($roh, true);
        if (is_array($eintrag) && isset($eintrag['id'])) {
            $eintraege[] = $eintrag;
        }
    }

    usort(
        $eintraege,
        static fn(array $a, array $b): int => ($b['zeit'] ?? 0) <=> ($a['zeit'] ?? 0)
    );

    return $eintraege;
}

/** Entfernt Felder, die Besucher nichts angehen (z. B. IP-Hash). */
function sh_eintrag_oeffentlich(array $eintrag): array
{
    return [
        'id'     => $eintrag['id'] ?? '',
        'name'   => $eintrag['name'] ?? '',
        'text'   => $eintrag['text'] ?? '',
        'bilder' => $eintrag['bilder'] ?? [],
        'zeit'   => $eintrag['zeit'] ?? 0,
    ];
}

sh_verzeichnisse_vorbereiten();
