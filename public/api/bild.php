<?php
/**
 * Bildverarbeitung.
 *
 * Kernidee der Sicherheit: Es wird NIE die hochgeladene Datei gespeichert.
 * Jedes Bild wird eingelesen, neu berechnet und als frisches JPEG unter
 * einem selbst erzeugten Namen geschrieben.
 *
 * Damit ist ausgeschlossen, dass Schadcode ueberlebt: Ein als Bild
 * getarntes PHP-Skript oder eine Datei mit angehaengtem Code ergibt beim
 * Neuberechnen entweder einen Fehler oder ein harmloses Bild. Uebrig
 * bleiben ausschliesslich Pixel.
 */

declare(strict_types=1);

/** Vom Server akzeptierte Eingangsformate. */
const SH_ERLAUBTE_TYPEN = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * Prueft und verarbeitet ein hochgeladenes Bild.
 *
 * @param array{tmp_name:string,size:int,error:int} $datei Eintrag aus $_FILES
 * @return array{name:string,vorschau:string,breite:int,hoehe:int,hash:string}
 * @throws RuntimeException bei jedem Problem – mit Text fuer den Besucher
 */
function sh_bild_verarbeiten(array $datei, array $config): array
{
    /* ---------- 1. Upload-Status ---------- */
    $fehlerText = [
        UPLOAD_ERR_INI_SIZE   => 'Das Bild ist zu groß für den Server.',
        UPLOAD_ERR_FORM_SIZE  => 'Das Bild ist zu groß.',
        UPLOAD_ERR_PARTIAL    => 'Das Bild wurde nur teilweise übertragen. Bitte noch einmal versuchen.',
        UPLOAD_ERR_NO_FILE    => 'Es wurde keine Datei übertragen.',
        UPLOAD_ERR_NO_TMP_DIR => 'Auf dem Server fehlt ein temporäres Verzeichnis.',
        UPLOAD_ERR_CANT_WRITE => 'Der Server konnte die Datei nicht speichern.',
        UPLOAD_ERR_EXTENSION  => 'Der Upload wurde vom Server abgelehnt.',
    ];

    if ($datei['error'] !== UPLOAD_ERR_OK) {
        throw new RuntimeException($fehlerText[$datei['error']] ?? 'Der Upload ist fehlgeschlagen.');
    }

    /* ---------- 2. Nur echte Uploads ---------- */
    // Verhindert, dass ueber einen manipulierten Aufruf eine beliebige
    // Serverdatei als "Upload" ausgegeben wird.
    if (!is_uploaded_file($datei['tmp_name'])) {
        throw new RuntimeException('Ungültiger Upload.');
    }

    /* ---------- 3. Groesse ---------- */
    if ($datei['size'] <= 0) {
        throw new RuntimeException('Die Datei ist leer.');
    }
    if ($datei['size'] > $config['max_dateigroesse']) {
        $mb = (int) round($config['max_dateigroesse'] / 1048576);
        throw new RuntimeException("Das Bild ist größer als {$mb} MB.");
    }

    /* ---------- 4. Typ anhand des Inhalts, nicht des Namens ---------- */
    // Dateiendung und der vom Browser gemeldete Typ sind frei waehlbar
    // und deshalb wertlos. Entscheidend ist, was wirklich in der Datei steht.
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $typ = $finfo->file($datei['tmp_name']);
    if (!is_string($typ) || !in_array($typ, SH_ERLAUBTE_TYPEN, true)) {
        throw new RuntimeException('Nur JPG-, PNG- und WebP-Bilder sind möglich.');
    }

    /* ---------- 5. Muss ein lesbares Bild sein ---------- */
    $masse = @getimagesize($datei['tmp_name']);
    if ($masse === false || $masse[0] < 1 || $masse[1] < 1) {
        throw new RuntimeException('Die Datei ist kein gültiges Bild.');
    }

    // Schutz vor "Dekompressionsbomben": ein kleines Bild kann beim
    // Entpacken viele Gigabyte Arbeitsspeicher belegen.
    if ($masse[0] * $masse[1] > 60_000_000) {
        throw new RuntimeException('Die Bildauflösung ist zu hoch.');
    }

    /* ---------- 6. Einlesen ---------- */
    $quelle = match ($typ) {
        'image/jpeg' => @imagecreatefromjpeg($datei['tmp_name']),
        'image/png'  => @imagecreatefrompng($datei['tmp_name']),
        'image/webp' => @imagecreatefromwebp($datei['tmp_name']),
        default      => false,
    };

    if (!$quelle instanceof GdImage) {
        throw new RuntimeException('Das Bild konnte nicht gelesen werden.');
    }

    try {
        // Handyfotos sind oft gedreht gespeichert. Ohne diese Korrektur
        // laegen sie auf der Website auf der Seite.
        if ($typ === 'image/jpeg') {
            $quelle = sh_bild_drehen($quelle, $datei['tmp_name']);
        }

        $gross = sh_bild_skalieren($quelle, $config['max_kante']);
        $klein = sh_bild_skalieren($quelle, $config['max_kante_vorschau']);

        $name = bin2hex(random_bytes(16));
        $dateiGross = $name . '.jpg';
        $dateiKlein = $name . '_v.jpg';

        $pfadGross = SH_UPLOADS . '/bilder/' . $dateiGross;
        $pfadKlein = SH_UPLOADS . '/bilder/' . $dateiKlein;

        try {
            sh_jpeg_schreiben($gross, $pfadGross, (int) $config['jpeg_qualitaet']);
            sh_jpeg_schreiben($klein, $pfadKlein, 78);

            $hash = hash_file('sha256', $pfadGross) ?: '';

            return [
                'name'     => $dateiGross,
                'vorschau' => $dateiKlein,
                'breite'   => imagesx($gross),
                'hoehe'    => imagesy($gross),
                'hash'     => $hash,
            ];
        } finally {
            imagedestroy($gross);
            imagedestroy($klein);
        }
    } finally {
        if ($quelle instanceof GdImage) {
            imagedestroy($quelle);
        }
    }
}

/** Dreht das Bild gemaess der EXIF-Angabe der Kamera. */
function sh_bild_drehen(GdImage $bild, string $pfad): GdImage
{
    if (!function_exists('exif_read_data')) {
        return $bild;
    }

    $exif = @exif_read_data($pfad);
    if (!is_array($exif) || !isset($exif['Orientation'])) {
        return $bild;
    }

    $winkel = match ((int) $exif['Orientation']) {
        3 => 180,
        6 => -90,
        8 => 90,
        default => 0,
    };

    if ($winkel === 0) {
        return $bild;
    }

    $gedreht = imagerotate($bild, $winkel, 0);
    if (!$gedreht instanceof GdImage) {
        return $bild;
    }

    imagedestroy($bild);
    return $gedreht;
}

/**
 * Verkleinert auf eine maximale Kantenlaenge. Kleinere Bilder bleiben,
 * wie sie sind – Hochskalieren macht sie nur unscharf und gross.
 */
function sh_bild_skalieren(GdImage $quelle, int $maxKante): GdImage
{
    $breite = imagesx($quelle);
    $hoehe = imagesy($quelle);
    $faktor = min(1.0, $maxKante / max($breite, $hoehe));

    $neuBreite = max(1, (int) round($breite * $faktor));
    $neuHoehe = max(1, (int) round($hoehe * $faktor));

    $ziel = imagecreatetruecolor($neuBreite, $neuHoehe);
    if (!$ziel instanceof GdImage) {
        throw new RuntimeException('Das Bild konnte nicht verarbeitet werden.');
    }

    // Durchsichtige Bereiche (PNG/WebP) werden weiss statt schwarz.
    $weiss = imagecolorallocate($ziel, 255, 255, 255);
    imagefilledrectangle($ziel, 0, 0, $neuBreite, $neuHoehe, $weiss);

    imagecopyresampled($ziel, $quelle, 0, 0, 0, 0, $neuBreite, $neuHoehe, $breite, $hoehe);

    return $ziel;
}

/** Schreibt das JPEG atomar, damit nie eine halbe Datei sichtbar wird. */
function sh_jpeg_schreiben(GdImage $bild, string $ziel, int $qualitaet): void
{
    $temp = $ziel . '.tmp' . bin2hex(random_bytes(6));

    if (!imagejpeg($bild, $temp, $qualitaet)) {
        @unlink($temp);
        throw new RuntimeException('Das Bild konnte nicht gespeichert werden.');
    }

    if (!@rename($temp, $ziel)) {
        @unlink($temp);
        throw new RuntimeException('Das Bild konnte nicht gespeichert werden.');
    }

    @chmod($ziel, 0644);
}

/** Loescht die Bilddateien eines Eintrags. */
function sh_bilder_loeschen(array $bilder): void
{
    foreach ($bilder as $bild) {
        foreach (['name', 'vorschau'] as $feld) {
            $datei = $bild[$feld] ?? '';
            // Nur selbst erzeugte Namen akzeptieren – kein "../".
            if (is_string($datei) && preg_match('/^[0-9a-f]{32}(_v)?\.jpg$/', $datei)) {
                @unlink(SH_UPLOADS . '/bilder/' . $datei);
            }
        }
    }
}
