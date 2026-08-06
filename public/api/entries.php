<?php
/**
 * Liefert alle sichtbaren Gästebeiträge für die Website.
 *
 * Sichtbar heisst: nicht archiviert und – falls die Vorabfreigabe aktiv
 * ist – bereits freigegeben.
 */

declare(strict_types=1);

require_once __DIR__ . '/lib.php';

sh_nur_methode('GET');

$alle = sh_eintraege_lesen();

$sichtbar = [];
foreach ($alle as $eintrag) {
    if (($eintrag['archiviert'] ?? false) === true) {
        continue;
    }
    if (($eintrag['wartet'] ?? false) === true) {
        continue;
    }
    $sichtbar[] = sh_eintrag_oeffentlich($eintrag);
}

sh_json([
    'ok'       => true,
    'anzahl'   => count($sichtbar),
    'eintraege' => $sichtbar,
]);
