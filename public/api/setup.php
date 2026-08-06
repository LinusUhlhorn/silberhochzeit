<?php
/**
 * Einmalige Einrichtung des Admin-Zugangs.
 *
 * Wieso ein Freigabe-Nachweis nötig ist
 * -------------------------------------
 * Diese Datei liegt öffentlich im Netz. Ohne Schutz könnte der Erste, der
 * die Adresse errät, das Admin-Passwort setzen. Deshalb arbeitet setup.php
 * nur, wenn im Verzeichnis `daten/` eine Datei namens `SETUP-ERLAUBT`
 * liegt. Die kann nur anlegen, wer Zugriff auf den Webspace hat – also du.
 *
 * Ablauf
 * ------
 * 1. Im KAS-Dateimanager (oder per FTP) im Ordner `daten/` eine leere
 *    Datei `SETUP-ERLAUBT` anlegen.
 * 2. https://DEINE-ADRESSE/api/setup.php aufrufen.
 * 3. Passwort vergeben.
 * 4. Die Datei `SETUP-ERLAUBT` wird automatisch gelöscht, danach ist
 *    setup.php wirkungslos.
 *
 * Passwort später ändern: Schritt 1 bis 3 einfach wiederholen.
 */

declare(strict_types=1);

require_once __DIR__ . '/lib.php';

$marker = SH_DATEN . '/SETUP-ERLAUBT';
$configDatei = SH_DATEN . '/config.php';

sh_sicherheits_header();
header('Content-Type: text/html; charset=utf-8');

/** Rahmen für alle Ausgaben dieser Seite. */
function sh_setup_seite(string $titel, string $inhalt): never
{
    echo '<!doctype html><html lang="de"><head><meta charset="utf-8">'
        . '<meta name="viewport" content="width=device-width,initial-scale=1">'
        . '<meta name="robots" content="noindex,nofollow">'
        . '<title>Einrichtung</title><style>'
        . 'body{font-family:system-ui,-apple-system,"Segoe UI",sans-serif;background:#f8f7f3;'
        . 'color:#292929;display:flex;min-height:100vh;align-items:center;justify-content:center;'
        . 'margin:0;padding:1.5rem;line-height:1.6}'
        . '.k{background:#fff;border:1px solid #e7e7e7;border-radius:16px;padding:2rem;'
        . 'max-width:32rem;width:100%;box-shadow:0 8px 24px rgba(41,41,41,.05)}'
        . 'h1{font-size:1.4rem;margin:0 0 1rem;font-weight:500}'
        . 'label{display:block;margin:1rem 0 .35rem;font-size:.9rem}'
        . 'input{width:100%;padding:.7rem .8rem;border:1px solid #e7e7e7;border-radius:8px;'
        . 'font-size:1rem;box-sizing:border-box}'
        . 'button{margin-top:1.5rem;background:#292929;color:#fff;border:0;border-radius:999px;'
        . 'padding:.85rem 1.8rem;font-size:.95rem;cursor:pointer}'
        . '.f{background:#fef2f2;border:1px solid #fecaca;color:#991b1b;padding:.8rem;'
        . 'border-radius:8px;margin:1rem 0;font-size:.9rem}'
        . '.g{background:#f0fdf4;border:1px solid #bbf7d0;color:#166534;padding:.8rem;'
        . 'border-radius:8px;margin:1rem 0;font-size:.9rem}'
        . 'code{background:#f8f7f3;padding:.15rem .4rem;border-radius:4px;font-size:.9em}'
        . 'ol{padding-left:1.2rem}li{margin:.4rem 0}'
        . '</style></head><body><div class="k"><h1>' . $titel . '</h1>'
        . $inhalt . '</div></body></html>';
    exit;
}

/* ---------- Ohne Nachweis passiert gar nichts ---------- */

if (!is_file($marker)) {
    $schonEingerichtet = is_file($configDatei);

    sh_setup_seite(
        'Einrichtung gesperrt',
        ($schonEingerichtet
            ? '<div class="g">Der Admin-Zugang ist bereits eingerichtet. '
              . 'Zum Anmelden bitte <code>/admin.html</code> aufrufen.</div>'
            : '')
        . '<p>Damit niemand Fremdes das Passwort setzen kann, ist ein Nachweis nötig, '
        . 'dass du Zugriff auf den Webspace hast.</p>'
        . '<p><strong>So geht es weiter:</strong></p><ol>'
        . '<li>Im ALL-INKL-Dateimanager (KAS) oder per FTP in den Ordner '
        . '<code>daten/</code> wechseln.</li>'
        . '<li>Dort eine leere Datei mit dem Namen <code>SETUP-ERLAUBT</code> anlegen '
        . '(ohne Dateiendung).</li>'
        . '<li>Diese Seite neu laden.</li></ol>'
        . '<p>Nach dem Vergeben des Passworts wird die Datei automatisch gelöscht.</p>'
    );
}

/* ---------- Formular abgeschickt ---------- */

$meldung = '';

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST') {
    sh_gleiche_herkunft_pruefen();

    $pw1 = (string) ($_POST['passwort'] ?? '');
    $pw2 = (string) ($_POST['passwort2'] ?? '');

    if (mb_strlen($pw1) < 10) {
        $meldung = '<div class="f">Das Passwort muss mindestens 10 Zeichen lang sein.</div>';
    } elseif ($pw1 !== $pw2) {
        $meldung = '<div class="f">Die beiden Eingaben stimmen nicht überein.</div>';
    } else {
        $hash = password_hash($pw1, PASSWORD_DEFAULT);

        // Bestehende Einstellungen erhalten, nur den Hash ersetzen.
        $bestehend = is_file($configDatei) ? (require $configDatei) : [];
        if (!is_array($bestehend)) {
            $bestehend = [];
        }
        $bestehend['admin_hash'] = $hash;
        $bestehend += [
            'vorabfreigabe' => false,
            'zugangscode'   => '',
        ];

        $php = "<?php\n"
            . "/**\n"
            . " * Konfiguration der Gästewand.\n"
            . " *\n"
            . " * Diese Datei liegt bewusst NICHT im Git-Repository und wird von\n"
            . " * keinem Deployment überschrieben.\n"
            . " *\n"
            . " * vorabfreigabe: false = Beiträge sind sofort sichtbar\n"
            . " *                true  = Beiträge erscheinen erst nach Freigabe\n"
            . " * zugangscode:   leer  = jeder mit dem Link darf hochladen\n"
            . " *                sonst = Gäste müssen diesen Code eingeben\n"
            . " */\n"
            . "return " . var_export($bestehend, true) . ";\n";

        if (!sh_atomar_schreiben($configDatei, $php)) {
            $meldung = '<div class="f">Die Konfiguration konnte nicht geschrieben werden. '
                . 'Bitte die Schreibrechte des Ordners <code>daten/</code> prüfen.</div>';
        } else {
            @unlink($marker);
            sh_setup_seite(
                'Fertig',
                '<div class="g">Der Admin-Zugang ist eingerichtet.</div>'
                . '<p>Die Datei <code>SETUP-ERLAUBT</code> wurde gelöscht, diese Seite ist '
                . 'damit wieder gesperrt.</p>'
                . '<p><a href="../admin.html">Zum Admin-Bereich</a></p>'
            );
        }
    }
}

/* ---------- Formular ---------- */

sh_setup_seite(
    'Admin-Passwort vergeben',
    $meldung
    . '<p>Mit diesem Passwort kannst du später Beiträge ausblenden oder löschen. '
    . 'Bitte an einem sicheren Ort notieren – es lässt sich nicht auslesen.</p>'
    . '<form method="post" autocomplete="off">'
    . '<label for="p1">Passwort (mindestens 10 Zeichen)</label>'
    . '<input id="p1" type="password" name="passwort" required minlength="10" autocomplete="new-password">'
    . '<label for="p2">Passwort wiederholen</label>'
    . '<input id="p2" type="password" name="passwort2" required minlength="10" autocomplete="new-password">'
    . '<button type="submit">Passwort speichern</button>'
    . '</form>'
);
