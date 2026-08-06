<?php
/**
 * Admin-Schnittstelle: anmelden, Beiträge ansehen, archivieren, löschen.
 *
 * Alle Aktionen laufen über POST mit einem `aktion`-Feld.
 * Zustandsändernde Aktionen brauchen zusätzlich das CSRF-Token, das beim
 * Anmelden ausgegeben wird.
 */

declare(strict_types=1);

require_once __DIR__ . '/lib.php';
require_once __DIR__ . '/bild.php';

sh_nur_methode('POST');
sh_gleiche_herkunft_pruefen();

/* ==========================================================================
   Sitzung
   ========================================================================== */

$sicher = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
    || ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https';

session_set_cookie_params([
    'lifetime' => 0,
    'path'     => '/',
    'httponly' => true,   // fuer JavaScript unsichtbar
    'samesite' => 'Strict', // wird bei fremden Seiten nicht mitgeschickt
    'secure'   => $sicher,
]);
session_name('SHADMIN');
session_start();

function sh_angemeldet(): bool
{
    return ($_SESSION['admin'] ?? false) === true;
}

function sh_anmeldung_verlangen(): void
{
    if (!sh_angemeldet()) {
        sh_fehler('Nicht angemeldet.', 401, 'auth');
    }
}

/** Schützt zustandsändernde Aktionen gegen fremde Auslöser. */
function sh_csrf_pruefen(): void
{
    $token = (string) ($_POST['token'] ?? '');
    $soll = (string) ($_SESSION['csrf'] ?? '');
    if ($soll === '' || !hash_equals($soll, $token)) {
        sh_fehler('Sicherheitstoken ungültig. Bitte neu anmelden.', 403, 'csrf');
    }
}

$aktion = (string) ($_POST['aktion'] ?? '');

/* ==========================================================================
   Anmelden / Abmelden / Status
   ========================================================================== */

if ($aktion === 'status') {
    sh_json([
        'ok'            => true,
        'angemeldet'    => sh_angemeldet(),
        'token'         => sh_angemeldet() ? ($_SESSION['csrf'] ?? '') : '',
        'eingerichtet'  => ($SH_CONFIG['admin_hash'] ?? '') !== '',
        'vorabfreigabe' => (bool) $SH_CONFIG['vorabfreigabe'],
    ]);
}

if ($aktion === 'login') {
    if (($SH_CONFIG['admin_hash'] ?? '') === '') {
        sh_fehler(
            'Es ist noch kein Admin-Passwort eingerichtet. Bitte zuerst api/setup.php aufrufen.',
            409,
            'setup'
        );
    }

    if (!sh_rate_limit('login', (int) $SH_CONFIG['limit_login'], (int) $SH_CONFIG['limit_login_fenster'])) {
        sh_fehler('Zu viele Anmeldeversuche. Bitte in 15 Minuten noch einmal versuchen.', 429, 'limit');
    }

    $passwort = (string) ($_POST['passwort'] ?? '');

    if (!password_verify($passwort, (string) $SH_CONFIG['admin_hash'])) {
        // Bewusst ohne Detail, damit nichts über gültige Eingaben verrät.
        sh_fehler('Passwort falsch.', 401, 'passwort');
    }

    // Sitzungskennung wechseln – verhindert Session-Fixation.
    session_regenerate_id(true);
    $_SESSION['admin'] = true;
    $_SESSION['csrf'] = bin2hex(random_bytes(32));

    sh_json(['ok' => true, 'token' => $_SESSION['csrf']]);
}

if ($aktion === 'logout') {
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $p = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $p['path'], $p['domain'], $p['secure'], $p['httponly']);
    }
    session_destroy();
    sh_json(['ok' => true]);
}

/* ==========================================================================
   Ab hier nur angemeldet
   ========================================================================== */

sh_anmeldung_verlangen();

/** Liste aller Beiträge, auch archivierte und wartende. */
if ($aktion === 'liste') {
    $eintraege = array_map(
        static fn(array $e): array => [
            'id'         => $e['id'] ?? '',
            'name'       => $e['name'] ?? '',
            'text'       => $e['text'] ?? '',
            'bilder'     => $e['bilder'] ?? [],
            'zeit'       => $e['zeit'] ?? 0,
            'archiviert' => (bool) ($e['archiviert'] ?? false),
            'wartet'     => (bool) ($e['wartet'] ?? false),
        ],
        sh_eintraege_lesen()
    );

    sh_json([
        'ok'            => true,
        'eintraege'     => $eintraege,
        'vorabfreigabe' => (bool) $SH_CONFIG['vorabfreigabe'],
    ]);
}

/* ---------- Zustandsändernde Aktionen ---------- */

sh_csrf_pruefen();

$id = (string) ($_POST['id'] ?? '');
if (!sh_id_gueltig($id)) {
    sh_fehler('Unbekannter Beitrag.', 404, 'id');
}

$pfad = sh_eintrag_pfad($id);
if (!is_file($pfad)) {
    sh_fehler('Unbekannter Beitrag.', 404, 'id');
}

$eintrag = json_decode((string) @file_get_contents($pfad), true);
if (!is_array($eintrag)) {
    sh_fehler('Der Beitrag konnte nicht gelesen werden.', 500);
}

switch ($aktion) {
    case 'archivieren':
        $eintrag['archiviert'] = true;
        break;

    case 'wiederherstellen':
        $eintrag['archiviert'] = false;
        break;

    case 'freigeben':
        $eintrag['wartet'] = false;
        break;

    case 'loeschen':
        // Endgültig: Bilddateien mit entfernen, sonst bleiben sie liegen.
        sh_bilder_loeschen($eintrag['bilder'] ?? []);
        if (!@unlink($pfad)) {
            sh_fehler('Der Beitrag konnte nicht gelöscht werden.', 500);
        }
        sh_json(['ok' => true, 'geloescht' => true]);

    default:
        sh_fehler('Unbekannte Aktion.', 400, 'aktion');
}

if (!sh_atomar_schreiben($pfad, json_encode($eintrag, JSON_UNESCAPED_UNICODE))) {
    sh_fehler('Die Änderung konnte nicht gespeichert werden.', 500);
}

sh_json([
    'ok'         => true,
    'id'         => $id,
    'archiviert' => (bool) $eintrag['archiviert'],
    'wartet'     => (bool) ($eintrag['wartet'] ?? false),
]);
