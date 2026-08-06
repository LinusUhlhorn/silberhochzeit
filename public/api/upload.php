<?php
/**
 * Nimmt einen Gästebeitrag entgegen: Name, Text und optional Bilder.
 *
 * Schutz vor doppelten Beiträgen
 * ------------------------------
 * Bei langsamer Verbindung tippen Menschen zweimal auf „Senden“, oder der
 * Browser wiederholt die Anfrage. Deshalb schickt die Website zu jedem
 * Absenden eine selbst erzeugte, einmalige Kennung mit.
 *
 * Der Server legt zu dieser Kennung eine Sperrdatei an – mit dem Modus
 * 'x', der auf Dateisystemebene atomar ist. Nur der erste Versuch gewinnt.
 * Jeder weitere Versuch mit derselben Kennung bekommt die Antwort des
 * ersten zurück, statt einen zweiten Beitrag anzulegen.
 *
 * Das funktioniert auch dann, wenn beide Anfragen exakt gleichzeitig
 * eintreffen – anders als eine Prüfung „gibt es schon?“ gefolgt von
 * „dann anlegen“, bei der genau dazwischen der zweite Aufruf durchrutschen
 * könnte.
 */

declare(strict_types=1);

require_once __DIR__ . '/lib.php';
require_once __DIR__ . '/bild.php';

sh_nur_methode('POST');
sh_gleiche_herkunft_pruefen();

/* ==========================================================================
   Einmalige Kennung des Absendevorgangs
   ========================================================================== */

$vorgang = (string) ($_POST['vorgang'] ?? '');
if (!preg_match('/^[0-9a-f]{32}$/', $vorgang)) {
    sh_fehler('Ungültige Vorgangskennung.', 400, 'vorgang');
}

$sperrDatei = SH_DATEN . '/system/vorgang_' . $vorgang . '.json';

// 'x' schlaegt fehl, wenn die Datei bereits existiert – und das
// Anlegen ist atomar. Genau das brauchen wir hier.
$sperre = @fopen($sperrDatei, 'x');

if ($sperre === false) {
    if (is_file($sperrDatei)) {
        // Dieser Vorgang lief schon. Fruehere Antwort zurueckgeben,
        // damit der Besucher eine Bestaetigung sieht statt eines Fehlers.
        $frueher = json_decode((string) @file_get_contents($sperrDatei), true);
        if (is_array($frueher) && ($frueher['ok'] ?? false)) {
            $frueher['wiederholung'] = true;
            sh_json($frueher);
        }
        // Der erste Versuch laeuft noch oder ist gescheitert.
        sh_fehler(
            'Dieser Beitrag wird bereits verarbeitet. Bitte einen Moment warten.',
            409,
            'laeuft'
        );
    }
    sh_fehler('Der Beitrag konnte nicht angenommen werden.', 500);
}

// Ab hier gilt: Wir sind die Einzigen, die diesen Vorgang bearbeiten.
$erfolgreich = false;

/** Raeumt die Sperre auf, wenn der Vorgang scheitert – sonst bliebe der
 *  Gast dauerhaft blockiert und koennte es nie erneut versuchen. */
$aufraeumen = static function () use ($sperrDatei, &$erfolgreich): void {
    if (!$erfolgreich) {
        @unlink($sperrDatei);
    }
};
register_shutdown_function($aufraeumen);

/* ==========================================================================
   Ratenbegrenzung
   ========================================================================== */

if (!sh_rate_limit('upload', (int) $SH_CONFIG['limit_uploads'], (int) $SH_CONFIG['limit_uploads_fenster'])) {
    sh_fehler(
        'Es wurden gerade sehr viele Beiträge gesendet. Bitte in einigen Minuten noch einmal versuchen.',
        429,
        'limit'
    );
}

/* ==========================================================================
   Zugangscode (nur falls konfiguriert)
   ========================================================================== */

$codeSoll = trim((string) $SH_CONFIG['zugangscode']);
if ($codeSoll !== '') {
    $codeIst = trim((string) ($_POST['code'] ?? ''));
    // hash_equals vergleicht in konstanter Zeit – so laesst sich der Code
    // nicht durch Messen der Antwortzeit Zeichen fuer Zeichen erraten.
    if (!hash_equals(strtoupper($codeSoll), strtoupper($codeIst))) {
        sh_fehler('Der Zugangscode stimmt nicht.', 403, 'code');
    }
}

/* ==========================================================================
   Bot-Falle
   ========================================================================== */

// Ein fuer Menschen unsichtbares Feld. Wird es ausgefuellt, war es ein Bot.
if (trim((string) ($_POST['website'] ?? '')) !== '') {
    // Bewusst eine freundliche Erfolgsmeldung, damit der Bot nicht lernt,
    // woran er gescheitert ist. Gespeichert wird nichts.
    sh_json(['ok' => true, 'id' => '', 'wartet' => false]);
}

/* ==========================================================================
   Text pruefen
   ========================================================================== */

/** Entfernt Steuerzeichen und begrenzt die Laenge. */
function sh_text_saeubern(string $wert, int $maxLaenge): string
{
    // Ungueltige UTF-8-Sequenzen entfernen.
    $wert = mb_convert_encoding($wert, 'UTF-8', 'UTF-8');
    // Steuerzeichen raus, Zeilenumbrueche behalten.
    $wert = preg_replace('/[^\P{C}\n]+/u', '', $wert) ?? '';
    // Hoechstens zwei Leerzeilen am Stueck.
    $wert = preg_replace('/\n{3,}/', "\n\n", $wert) ?? '';
    $wert = trim($wert);

    if (mb_strlen($wert) > $maxLaenge) {
        $wert = mb_substr($wert, 0, $maxLaenge);
    }

    return $wert;
}

$name = sh_text_saeubern((string) ($_POST['name'] ?? ''), (int) $SH_CONFIG['max_name_laenge']);
$text = sh_text_saeubern((string) ($_POST['text'] ?? ''), (int) $SH_CONFIG['max_text_laenge']);

// Im Namen ergeben Zeilenumbrueche keinen Sinn.
$name = str_replace("\n", ' ', $name);

if ($name === '') {
    sh_fehler('Bitte einen Namen angeben.', 422, 'name');
}

/* ==========================================================================
   Bilder verarbeiten
   ========================================================================== */

$bilder = [];
$hashes = [];

if (isset($_FILES['bilder']) && is_array($_FILES['bilder']['error'])) {
    $anzahl = count($_FILES['bilder']['error']);

    if ($anzahl > (int) $SH_CONFIG['max_bilder_pro_beitrag']) {
        sh_fehler(
            'Es sind höchstens ' . (int) $SH_CONFIG['max_bilder_pro_beitrag'] . ' Bilder pro Beitrag möglich.',
            422,
            'anzahl'
        );
    }

    for ($i = 0; $i < $anzahl; $i++) {
        if ($_FILES['bilder']['error'][$i] === UPLOAD_ERR_NO_FILE) {
            continue;
        }

        try {
            $bild = sh_bild_verarbeiten([
                'tmp_name' => (string) $_FILES['bilder']['tmp_name'][$i],
                'size'     => (int) $_FILES['bilder']['size'][$i],
                'error'    => (int) $_FILES['bilder']['error'][$i],
            ], $SH_CONFIG);
        } catch (RuntimeException $e) {
            // Bereits verarbeitete Bilder dieses Beitrags wieder entfernen,
            // damit keine verwaisten Dateien zurueckbleiben.
            sh_bilder_loeschen($bilder);
            sh_fehler($e->getMessage(), 422, 'bild');
        }

        // Dasselbe Bild zweimal im selben Beitrag: nur einmal behalten.
        if ($bild['hash'] !== '' && in_array($bild['hash'], $hashes, true)) {
            sh_bilder_loeschen([$bild]);
            continue;
        }

        $hashes[] = $bild['hash'];
        $bilder[] = $bild;
    }
}

if ($text === '' && $bilder === []) {
    sh_fehler('Bitte einen Gruß schreiben oder ein Foto auswählen.', 422, 'leer');
}

/* ==========================================================================
   Eintrag speichern
   ========================================================================== */

$id = bin2hex(random_bytes(16));
$wartet = (bool) $SH_CONFIG['vorabfreigabe'];

$eintrag = [
    'id'        => $id,
    'name'      => $name,
    'text'      => $text,
    'bilder'    => $bilder,
    'zeit'      => time(),
    'archiviert' => false,
    // Wartet auf Freigabe? Nur relevant, wenn Vorabfreigabe aktiv ist.
    'wartet'    => $wartet,
    // Nur ein Hash, nie die IP selbst – falls doch einmal jemand
    // stoert, laesst sich so vergleichen, ohne Adressen zu speichern.
    'ip_hash'   => substr(hash('sha256', sh_ip() . '|silberhochzeit'), 0, 16),
];

if (!sh_atomar_schreiben(sh_eintrag_pfad($id), json_encode($eintrag, JSON_UNESCAPED_UNICODE))) {
    sh_bilder_loeschen($bilder);
    sh_fehler('Der Beitrag konnte nicht gespeichert werden.', 500);
}

/* ==========================================================================
   Antwort – und dieselbe Antwort in der Sperrdatei ablegen
   ========================================================================== */

$antwort = [
    'ok'     => true,
    'id'     => $id,
    'wartet' => $wartet,
    'bilder' => count($bilder),
];

@file_put_contents($sperrDatei, json_encode($antwort, JSON_UNESCAPED_UNICODE));
$erfolgreich = true;

sh_json($antwort);
