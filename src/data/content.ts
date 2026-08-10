/**
 * ============================================================================
 *  ZENTRALE INHALTSDATEI
 * ============================================================================
 *
 *  Hier stehen ALLE Texte, Bilder und Daten der Website.
 *  Wer etwas am Inhalt aendern moechte, aendert es hier – und nur hier.
 *  Die React-Komponenten enthalten bewusst keine persoenlichen Texte.
 *
 *  ----------------------------------------------------------------------
 *  WICHTIG: Das Feld `entwurf: true`
 *  ----------------------------------------------------------------------
 *  Alle Inhalte, die frei erfunden sind und noch von der Familie bestaetigt
 *  werden muessen, sind mit `entwurf: true` markiert.
 *
 *  Waehrend der Entwicklung (`npm run dev`) zeigt die Website neben diesen
 *  Stellen einen kleinen Hinweis „Entwurf“. In der fertigen Website
 *  (`npm run build`) ist dieser Hinweis NICHT sichtbar.
 *
 *  Wenn ein Inhalt geprueft und richtig ist:
 *  einfach die Zeile `entwurf: true,` loeschen.
 *
 *  Eine Uebersicht aller offenen Stellen steht in INHALTE-BEARBEITEN.md.
 *  ----------------------------------------------------------------------
 *
 *  Tipp zum Bearbeiten: Texte stehen immer zwischen Anfuehrungszeichen.
 *  Nur den Text zwischen den Anfuehrungszeichen aendern, die Kommas und
 *  Klammern stehen lassen.
 */

/* ==========================================================================
   TYPEN
   ========================================================================== */

/** Basis fuer alle Inhalte, die noch bestaetigt werden muessen. */
export interface Entwurfsfaehig {
  /** true = Inhalt ist ein Vorschlag und noch nicht bestaetigt. */
  entwurf?: boolean
}

export interface HeroInhalt {
  eyebrow: string
  namen: string
  untertitel: string
  ort: string
  /** Kurze, hochwertige Botschaft unter dem Untertitel. */
  botschaft: string
  ctaLabel: string
  ctaZiel: string
  bild: string
  bildAlt: string
  /**
   * Bildfokus – welcher Teil des Fotos beim Zuschneiden sichtbar bleibt.
   *
   * Der Titelbereich ist breiter als hoch. Bei einem HOCHKANT-Foto wird
   * deshalb oben und unten viel abgeschnitten. Mit diesem Wert laesst sich
   * steuern, welcher Ausschnitt erhalten bleibt.
   *
   *   '50% 50%'  Mitte (Standard)
   *   '50% 30%'  weiter oben – gut, wenn Koepfe abgeschnitten werden
   *   '50% 20%'  noch weiter oben
   *
   * Am besten passt ein QUERFORMAT-Foto, bei dem das untere Drittel frei
   * ist – dort liegen Text und Farbverlauf.
   */
  bildPosition?: string
}

export interface BegruessungInhalt {
  nummer: string
  eyebrow: string
  ueberschrift: string
  absaetze: string[]
  zitat: {
    text: string
    quelle: string
  }
}

export interface TimelineStation extends Entwurfsfaehig {
  id: string
  jahr: string
  titel: string
  text: string
  /** Optionales Bild fuer diese Station. Leer lassen = kein Bild. */
  bild?: string
  bildAlt?: string
}

export interface TimelineInhalt {
  nummer: string
  eyebrow: string
  ueberschrift: string
  einleitung: string
  stationen: TimelineStation[]
}

export interface Statistik extends Entwurfsfaehig {
  id: string
  /** Zahl fuer die Count-up-Animation. */
  wert: number
  /** Zeichen vor der Zahl, z. B. „~“. Optional. */
  praefix?: string
  /** Zeichen nach der Zahl, z. B. „+“. Optional. */
  suffix?: string
  /**
   * Ersetzt die Zahl vollstaendig, z. B. „unzählige“.
   * Wenn gesetzt, wird nicht animiert.
   */
  textStattZahl?: string
  label: string
  beschreibung: string
}

export interface StatistikInhalt {
  nummer: string
  eyebrow: string
  ueberschrift: string
  einleitung: string
  eintraege: Statistik[]
}

export interface DamalsHeuteInhalt {
  nummer: string
  eyebrow: string
  ueberschrift: string
  begleittext: string[]
  damals: {
    label: string
    jahr: string
    bild: string
    alt: string
    /** Bildfokus, siehe HeroInhalt.bildPosition. */
    bildPosition?: string
  }
  heute: {
    label: string
    jahr: string
    bild: string
    alt: string
    /** Bildfokus, siehe HeroInhalt.bildPosition. */
    bildPosition?: string
  }
  bedienhinweis: string
}

export interface Fakt extends Entwurfsfaehig {
  id: string
  frage: string
  antwort: string
}

export interface FaktenInhalt {
  nummer: string
  eyebrow: string
  ueberschrift: string
  einleitung: string
  aufklappHinweis: string
  eintraege: Fakt[]
}

export interface QuizAntwort {
  text: string
  richtig: boolean
}

export interface QuizFrage extends Entwurfsfaehig {
  id: string
  frage: string
  antworten: QuizAntwort[]
  /** Wird nach der Beantwortung angezeigt. Optional. */
  aufloesung?: string
}

export interface QuizErgebnis {
  /** Ab wie viel Prozent richtiger Antworten dieser Text gilt (0–100). */
  abProzent: number
  titel: string
  text: string
}

export interface QuizInhalt {
  nummer: string
  eyebrow: string
  ueberschrift: string
  einleitung: string
  startLabel: string
  weiterLabel: string
  abschlussLabel: string
  neustartLabel: string
  fortschrittFormat: string
  fragen: QuizFrage[]
  ergebnisse: QuizErgebnis[]
}

/** Ein Bild, das ein Gast hochgeladen hat. Kommt vom Server. */
export interface GastBild {
  /** Dateiname des grossen Bildes in uploads/bilder/ */
  name: string
  /** Dateiname der Vorschau */
  vorschau: string
  breite: number
  hoehe: number
}

/** Ein Gästebeitrag. Kommt vom Server, steht nicht in dieser Datei. */
export interface GastBeitrag {
  id: string
  name: string
  text: string
  bilder: GastBild[]
  /** Unix-Zeit in Sekunden */
  zeit: number
}

export interface GaestewandInhalt {
  nummer: string
  eyebrow: string
  ueberschrift: string
  einleitung: string[]
  /** Beschriftungen des Formulars */
  formular: {
    titel: string
    nameLabel: string
    namePlatzhalter: string
    textLabel: string
    textPlatzhalter: string
    bilderLabel: string
    bilderHinweis: string
    codeLabel: string
    codePlatzhalter: string
    absendenLabel: string
    sendetLabel: string
    dankeTitel: string
    dankeText: string
    dankeWartetText: string
    nochEinerLabel: string
  }
  /** Beschriftungen der Beitragsliste */
  liste: {
    titel: string
    ladeText: string
    leerTitel: string
    leerText: string
    fehlerText: string
    erneutLabel: string
    bildOeffnen: string
  }
  qrCodeBild: string
  qrCodeAlt: string
  qrHinweis: string
}

export interface AbschlussInhalt {
  nummer: string
  eyebrow: string
  ueberschrift: string
  absaetze: string[]
  signatur: string
}

export interface FooterInhalt {
  titel: string
  ortJahr: string
  hinweis: string
  /**
   * Optionale Zusatzzeilen, z. B. ein Link zum Impressum.
   * Leer lassen = wird nicht angezeigt.
   */
  zusatz?: string
}

export interface NavigationsPunkt {
  label: string
  anker: string
}

export interface SeitenInhalt {
  meta: {
    namen: string
    ort: string
    jahr: string
    jahreZusammen: number
  }
  navigation: NavigationsPunkt[]
  navigationLabels: {
    menueOeffnen: string
    menueSchliessen: string
    zumInhalt: string
    nachOben: string
    marke: string
  }
  hero: HeroInhalt
  begruessung: BegruessungInhalt
  timeline: TimelineInhalt
  statistik: StatistikInhalt
  damalsHeute: DamalsHeuteInhalt
  fakten: FaktenInhalt
  quiz: QuizInhalt
  gaestewand: GaestewandInhalt
  abschluss: AbschlussInhalt
  footer: FooterInhalt
}

/* ==========================================================================
   INHALTE
   ========================================================================== */

export const inhalt: SeitenInhalt = {
  /* ------------------------------------------------------------------
     Grunddaten – werden an mehreren Stellen verwendet
     ------------------------------------------------------------------ */
  meta: {
    namen: 'Britta & Lutz',
    ort: 'Drentwede',
    jahr: '2026',
    jahreZusammen: 25,
  },

  /* ------------------------------------------------------------------
     Navigation
     Bewusst nur sechs Punkte – mehr wird auf dem Smartphone unuebersichtlich.
     Der Anker muss zur id der jeweiligen Sektion passen.
     ------------------------------------------------------------------ */
  navigation: [
    { label: 'Geschichte', anker: 'geschichte' },
    { label: 'Damals & heute', anker: 'damals-heute' },
    { label: 'Quiz', anker: 'quiz' },
    { label: 'Gästewand', anker: 'gaestewand' },
  ],

  navigationLabels: {
    menueOeffnen: 'Menü öffnen',
    menueSchliessen: 'Menü schließen',
    zumInhalt: 'Zum Inhalt springen',
    nachOben: 'Zurück nach oben',
    marke: 'B & L',
  },

  /* ------------------------------------------------------------------
     01 · HERO
     ------------------------------------------------------------------ */
  hero: {
    eyebrow: 'Silberhochzeit',
    namen: 'Britta & Lutz',
    untertitel: '25 Jahre gemeinsam',
    ort: 'Drentwede',
    botschaft:
      'Fünfundzwanzig Jahre, in denen aus zwei Menschen ein Zuhause geworden ist.',
    ctaLabel: 'Unsere Geschichte entdecken',
    ctaZiel: 'begruessung',
    bild: 'images/hero.jpg',
    bildAlt: 'Britta und Lutz Barmbold',
    // Standard ist die Bildmitte. Bei einem HOCHKANT-Foto werden damit auf
    // dem Desktop die Koepfe angeschnitten – dann auf '50% 30%' setzen.
    // (Nachgemessen an einem 2:3-Foto: bei '50% 50%' liegen die Koepfe
    //  genau auf der Oberkante, bei '50% 30%' sitzen sie frei.)
    bildPosition: '50% 50%',
  },

  /* ------------------------------------------------------------------
     02 · BEGRÜSSUNG
     ------------------------------------------------------------------ */
  begruessung: {
    nummer: '01',
    eyebrow: 'Willkommen',
    ueberschrift: 'Schön, dass ihr da seid',
    absaetze: [
      'Fünfundzwanzig Jahre sind eine seltsame Größe. Ausgesprochen klingen sie nach einer halben Ewigkeit. Gelebt fühlen sie sich an wie eine Ansammlung von Dienstagabenden, verpassten Zügen, geteilten Nachtischen und Sätzen, die man nicht mehr zu Ende sagen muss, weil der andere sie ohnehin kennt.',
      'Genau darum geht es auf dieser Seite. Nicht um die großen Worte, sondern um das, was daraus geworden ist: ein Haus in Drentwede, in dem ständig jemand am Tisch sitzt. Eine Familie, die sich auch dann meldet, wenn nichts ist. Und zwei Menschen, die sich nach all der Zeit immer noch etwas zu erzählen haben.',
      'Blättert euch in Ruhe durch, schaut euch die Bilder an, ratet beim Quiz mit — und feiert mit uns.',
    ],
    zitat: {
      text: 'Zusammenbleiben ist keine einzelne große Entscheidung. Es sind fünfundzwanzig Jahre voller kleiner.',
      quelle: 'Für Britta & Lutz',
    },
  },

  /* ------------------------------------------------------------------
     03 · TIMELINE
     ACHTUNG: Alle Jahreszahlen und Geschichten sind Entwuerfe!
     ------------------------------------------------------------------ */
  timeline: {
    nummer: '02',
    eyebrow: 'Unsere Geschichte',
    ueberschrift: 'Wie aus einem Sommer ein Vierteljahrhundert wurde',
    einleitung:
      'Ein paar Stationen aus fünfundzwanzig Jahren. Vollständig ist die Liste natürlich nicht — das Beste steht ohnehin nirgends geschrieben.',
    stationen: [
      {
        id: 'kennenlernen',
        jahr: '1997',
        titel: 'Das erste Mal',
        text: 'Ein Sommerfest im Dorf, ein gemeinsamer Freundeskreis und ein Gespräch, das länger dauerte als geplant. Wer wen zuerst angesprochen hat, wird bis heute unterschiedlich erzählt — und beide Versionen sind großartig. [Bitte anpassen: Wo und wie habt ihr euch wirklich kennengelernt?]',
        entwurf: true,
      },
      {
        id: 'beziehung',
        jahr: '1998',
        titel: 'Aus zwei wurde ein Wir',
        text: 'Aus gelegentlichen Treffen wurden feste Wochenenden, aus festen Wochenenden wurde Alltag. Irgendwann stand die zweite Zahnbürste im Bad, und niemand hatte darüber gesprochen. [Bitte anpassen: Wann wurde aus dem Kennenlernen eine Beziehung? Gab es einen besonderen Moment?]',
        entwurf: true,
      },
      {
        id: 'hochzeit',
        jahr: '2001',
        titel: 'Der Tag, um den es hier geht',
        text: 'Ja gesagt, Ringe getauscht, gefeiert bis in die Nacht. Ein Tag, von dem beide bis heute behaupten, er sei viel zu schnell vergangen. [Bitte anpassen: Genaues Hochzeitsdatum, Ort der Trauung, eine Anekdote vom Hochzeitstag.]',
        entwurf: true,
      },
      {
        id: 'zuhause',
        jahr: '2002',
        titel: 'Das erste eigene Zuhause',
        text: 'Vier Wände, deutlich mehr Pläne als Geld und eine Küche, in der man sich nicht gleichzeitig umdrehen konnte. Gestrichen wurde selbst, geflucht wurde gemeinsam. [Bitte anpassen: Wo war die erste gemeinsame Wohnung? Was ist dort passiert?]',
        entwurf: true,
      },
      {
        id: 'familie',
        jahr: '2004',
        titel: 'Die Familie wächst',
        text: 'Ab hier wurde es lauter, unordentlicher und in jeder Hinsicht voller. Der Schlaf wurde weniger, die Gründe zum Lachen deutlich mehr. [Bitte anpassen: Angaben zur Familie — bitte vorher gemeinsam entscheiden, welche Namen und Details öffentlich stehen sollen.]',
        entwurf: true,
      },
      {
        id: 'reisen',
        jahr: '2011',
        titel: 'Unterwegs',
        text: 'Ein voll beladenes Auto, eine Route, an die sich niemand gehalten hat, und die Erkenntnis: Der schönste Teil des Urlaubs ist oft der Umweg. [Bitte anpassen: Lieblingsreiseziel, ein besonderer Urlaub oder eine Reisegeschichte, die in der Familie immer wieder erzählt wird.]',
        entwurf: true,
      },
      {
        id: 'erlebnisse',
        jahr: '2018',
        titel: 'Ein Jahr, das hängen geblieben ist',
        text: 'Es gibt Jahre, die man an einem einzigen Wochenende festmachen kann. Dieses war so eines. [Bitte anpassen: Ein besonderes Erlebnis, ein Jubiläum, ein Umzug, ein Fest — etwas, das für euch beide wichtig war.]',
        entwurf: true,
      },
      {
        id: 'silberhochzeit',
        jahr: '2026',
        titel: 'Silberhochzeit',
        text: 'Fünfundzwanzig Jahre später steht wieder eine Feier an — mit denselben Menschen, ein paar mehr Stühlen und deutlich besseren Geschichten. Wir freuen uns auf euch.',
      },
    ],
  },

  /* ------------------------------------------------------------------
     04 · 25 JAHRE IN ZAHLEN
     ------------------------------------------------------------------ */
  statistik: {
    nummer: '03',
    eyebrow: '25 Jahre in Zahlen',
    ueberschrift: 'Nachgerechnet',
    einleitung:
      'Wir haben einmal den Taschenrechner bemüht. Manche Zahlen sind erstaunlich, andere ein bisschen albern — beide durften bleiben.',
    eintraege: [
      {
        id: 'jahre',
        wert: 25,
        label: 'Jahre verheiratet',
        beschreibung: 'Und noch immer keine Anzeichen von Ermüdung.',
      },
      {
        id: 'tage',
        wert: 9125,
        praefix: '~',
        label: 'gemeinsame Tage',
        beschreibung: 'Von denen keiner ganz wie der andere war.',
      },
      {
        id: 'sonntage',
        wert: 1300,
        praefix: '~',
        label: 'gemeinsame Sonntage',
        beschreibung: 'Frühstück, Zeitung, Spaziergang. Bewährtes Programm.',
      },
      {
        id: 'reisen',
        wert: 30,
        suffix: '+',
        label: 'gemeinsame Reisen',
        beschreibung:
          'Immer mit zwei Koffern zu viel. [Bitte anpassen: tatsächliche Zahl.]',
        entwurf: true,
      },
      {
        id: 'feste',
        wert: 100,
        suffix: '+',
        label: 'Familienfeste',
        beschreibung:
          'Geburtstage, Taufen, Konfirmationen — und dieses hier. [Bitte anpassen.]',
        entwurf: true,
      },
      {
        id: 'erinnerungen',
        wert: 0,
        textStattZahl: 'unzählige',
        label: 'Erinnerungen',
        beschreibung: 'Hier hat der Taschenrechner aufgegeben.',
      },
    ],
  },


  /* ------------------------------------------------------------------
     06 · DAMALS & HEUTE
     Wichtig: Fuer den besten Effekt sollten beide Bilder den gleichen
     Bildausschnitt und moeglichst das gleiche Seitenverhaeltnis haben.
     ------------------------------------------------------------------ */
  damalsHeute: {
    nummer: '04',
    eyebrow: 'Damals & heute',
    ueberschrift: 'Zwei Bilder, fünfundzwanzig Jahre',
    begleittext: [
      'Die Frisuren haben sich geändert, die Brillen sowieso, und niemand trägt heute noch das, was damals als gute Idee galt.',
      'Was gleich geblieben ist, sieht man auf beiden Bildern trotzdem sofort: die gleiche Art, nebeneinander zu stehen. Als wäre der Platz schon immer für den anderen reserviert gewesen.',
    ],
    damals: {
      label: 'Damals',
      jahr: '2001',
      bild: 'images/damals.jpg',
      alt: 'Britta und Lutz um das Jahr 2001',
      bildPosition: '50% 50%',
    },
    heute: {
      label: 'Heute',
      jahr: '2026',
      bild: 'images/heute.jpg',
      alt: 'Britta und Lutz heute',
      bildPosition: '50% 50%',
    },
    bedienhinweis:
      'Regler ziehen oder mit den Pfeiltasten bewegen, um zwischen damals und heute zu wechseln.',
  },

  /* ------------------------------------------------------------------
     07 · 25 DINGE
     ACHTUNG: Alle Antworten sind erfunden!
     Diese Rubrik lebt davon, dass sie stimmt. Bitte gemeinsam mit
     Britta und Lutz durchgehen.
     ------------------------------------------------------------------ */
  fakten: {
    nummer: '05',
    eyebrow: '25 Dinge',
    ueberschrift: '25 Dinge über Britta & Lutz',
    einleitung:
      'Fünfundzwanzig kleine Wahrheiten aus fünfundzwanzig Jahren. Antworten antippen — auf eigene Gefahr.',
    aufklappHinweis: 'Antwort anzeigen',
    eintraege: [
      {
        id: 'f01',
        frage: 'Wer steht früher auf?',
        antwort:
          'Lutz. Und zwar deutlich. Britta hält den Zeitraum vor sieben Uhr für rein theoretisch.',
        entwurf: true,
      },
      {
        id: 'f02',
        frage: 'Wer plant die Urlaube?',
        antwort:
          'Britta plant. Lutz nickt zustimmend und packt am Abend vorher.',
        entwurf: true,
      },
      {
        id: 'f03',
        frage: 'Wer kocht häufiger?',
        antwort:
          'Britta kocht, Lutz kommentiert. Beide halten diese Aufteilung für gerecht.',
        entwurf: true,
      },
      {
        id: 'f04',
        frage: 'Wer braucht länger im Badezimmer?',
        antwort:
          'Unentschieden — allerdings aus vollkommen unterschiedlichen Gründen.',
        entwurf: true,
      },
      {
        id: 'f05',
        frage: 'Wer behält in Diskussionen meistens recht?',
        antwort:
          'Britta. Lutz gewinnt dafür alle Diskussionen, die erst am nächsten Tag stattfinden.',
        entwurf: true,
      },
      {
        id: 'f06',
        frage: 'Wer ist spontaner?',
        antwort:
          'Lutz. „Wir könnten doch mal eben …“ ist statistisch gesehen sein Satz.',
        entwurf: true,
      },
      {
        id: 'f07',
        frage: 'Wer findet verlegte Gegenstände wieder?',
        antwort:
          'Britta. Meistens genau dort, wo Lutz bereits zweimal geschaut hat.',
        entwurf: true,
      },
      {
        id: 'f08',
        frage: 'Wer schläft abends zuerst ein?',
        antwort: 'Lutz. Zuverlässig. Häufig noch während des Films.',
        entwurf: true,
      },
      {
        id: 'f09',
        frage: 'Wer erzählt Geschichten ausführlicher?',
        antwort:
          'Lutz. Britta liefert währenddessen die gekürzte Fassung für Ungeduldige.',
        entwurf: true,
      },
      {
        id: 'f10',
        frage: 'Wer bringt den anderen häufiger zum Lachen?',
        antwort:
          'Beide behaupten, es seien sie selbst. Die Familie hat da eine klare Meinung.',
        entwurf: true,
      },
      {
        id: 'f11',
        frage: 'Wer ist ordentlicher?',
        antwort:
          'Britta — außer in der Werkstatt. Da gelten Lutz’ eigene Gesetze.',
        entwurf: true,
      },
      {
        id: 'f12',
        frage: 'Wer fährt auf langen Strecken?',
        antwort:
          'Lutz fährt, Britta navigiert. Und übernimmt die letzten Kilometer.',
        entwurf: true,
      },
      {
        id: 'f13',
        frage: 'Wer packt den Koffer früher?',
        antwort: 'Britta, drei Tage vorher. Lutz, dreißig Minuten vorher.',
        entwurf: true,
      },
      {
        id: 'f14',
        frage: 'Wer schaut zuerst auf die Wettervorhersage?',
        antwort: 'Lutz. Täglich. Auch wenn nichts geplant ist.',
        entwurf: true,
      },
      {
        id: 'f15',
        frage: 'Wer ruft öfter bei den Kindern an?',
        antwort: 'Britta ruft an. Lutz lässt ausrichten, dass er auch da ist.',
        entwurf: true,
      },
      {
        id: 'f16',
        frage: 'Wer singt lauter im Auto?',
        antwort: 'Lutz. Textsicherheit ist dabei zweitrangig.',
        entwurf: true,
      },
      {
        id: 'f17',
        frage: 'Wer ist der bessere Gastgeber?',
        antwort:
          'Britta plant, Lutz sorgt für Stimmung. Zusammen funktioniert es hervorragend.',
        entwurf: true,
      },
      {
        id: 'f18',
        frage: 'Wer vergisst häufiger etwas einzukaufen?',
        antwort: 'Lutz. Der Einkaufszettel liegt dann meist noch zu Hause.',
        entwurf: true,
      },
      {
        id: 'f19',
        frage: 'Wer hält länger durch auf einer Feier?',
        antwort: 'Britta. Lutz macht früh eine Pause und ist dann wieder da.',
        entwurf: true,
      },
      {
        id: 'f20',
        frage: 'Wer entscheidet, was abends geschaut wird?',
        antwort:
          'Offiziell wird gemeinsam entschieden. Inoffiziell entscheidet Britta.',
        entwurf: true,
      },
      {
        id: 'f21',
        frage: 'Wer kümmert sich um den Garten?',
        antwort:
          'Beide — mit deutlich unterschiedlichen Vorstellungen von „fertig“.',
        entwurf: true,
      },
      {
        id: 'f22',
        frage: 'Wer schreibt die Geburtstagskarten?',
        antwort:
          'Britta schreibt, Lutz unterschreibt. Ein bewährtes Verfahren.',
        entwurf: true,
      },
      {
        id: 'f23',
        frage: 'Wer ist hartnäckiger?',
        antwort:
          'Lutz bei Dingen, Britta bei Menschen. Beides hat sich schon oft ausgezahlt.',
        entwurf: true,
      },
      {
        id: 'f24',
        frage: 'Was können beide gleich gut?',
        antwort:
          'Ruhig bleiben, wenn es darauf ankommt. Und Gäste zum Bleiben überreden.',
        entwurf: true,
      },
      {
        id: 'f25',
        frage: 'Was macht die beiden aus?',
        antwort:
          'Dass man bei ihnen nie das Gefühl hat zu stören. Auch nach fünfundzwanzig Jahren nicht.',
        entwurf: true,
      },
    ],
  },

  /* ------------------------------------------------------------------
     08 · GÄSTEQUIZ
     Pro Frage muss genau EINE Antwort `richtig: true` haben.
     ------------------------------------------------------------------ */
  quiz: {
    nummer: '06',
    eyebrow: 'Gästequiz',
    ueberschrift: 'Wie gut kennt ihr die beiden?',
    einleitung:
      'Neun Fragen, vier Antworten, kein Preis. Dafür Ruhm und Ehre am Buffet. Ehrlich raten — Nachschlagen gilt nicht.',
    startLabel: 'Quiz starten',
    weiterLabel: 'Weiter',
    abschlussLabel: 'Ergebnis anzeigen',
    neustartLabel: 'Noch einmal',
    fortschrittFormat: 'Frage {aktuell} von {gesamt}',
    fragen: [
      {
        id: 'q01',
        frage: 'In welchem Jahr haben Britta und Lutz geheiratet?',
        antworten: [
          { text: '1999', richtig: false },
          { text: '2001', richtig: true },
          { text: '2003', richtig: false },
          { text: '2005', richtig: false },
        ],
        aufloesung:
          '2001 — und damit sind es dieses Jahr genau fünfundzwanzig.',
        entwurf: true,
      },
      {
        id: 'q02',
        frage: 'Wo haben sich die beiden kennengelernt?',
        antworten: [
          { text: 'Auf einem Dorffest', richtig: true },
          { text: 'Bei der Arbeit', richtig: false },
          { text: 'Im Urlaub', richtig: false },
          { text: 'Über gemeinsame Freunde', richtig: false },
        ],
        aufloesung:
          '[Bitte anpassen: richtige Antwort und Ablenker durch echte Angaben ersetzen.]',
        entwurf: true,
      },
      {
        id: 'q03',
        frage: 'Wer von beiden steht morgens zuerst auf?',
        antworten: [
          { text: 'Britta', richtig: false },
          { text: 'Lutz', richtig: true },
          { text: 'Beide gleichzeitig', richtig: false },
          { text: 'Kommt ganz auf den Wochentag an', richtig: false },
        ],
        aufloesung: 'Lutz — und meistens deutlich vor dem Wecker.',
        entwurf: true,
      },
      {
        id: 'q04',
        frage: 'Wie viele gemeinsame Tage sind fünfundzwanzig Jahre ungefähr?',
        antworten: [
          { text: 'rund 4.500', richtig: false },
          { text: 'rund 6.800', richtig: false },
          { text: 'rund 9.100', richtig: true },
          { text: 'rund 12.400', richtig: false },
        ],
        aufloesung: 'Etwa 9.125 Tage. Nachgerechnet werden darf gern.',
      },
      {
        id: 'q05',
        frage: 'Welches Hochzeitsjubiläum wird nach 25 Jahren gefeiert?',
        antworten: [
          { text: 'Silberhochzeit', richtig: true },
          { text: 'Goldene Hochzeit', richtig: false },
          { text: 'Perlenhochzeit', richtig: false },
          { text: 'Rosenhochzeit', richtig: false },
        ],
        aufloesung:
          'Silberhochzeit. Gold gibt es nach 50 Jahren — der Termin steht also schon.',
      },
      {
        id: 'q06',
        frage: 'Wer plant in der Regel den Urlaub?',
        antworten: [
          { text: 'Britta', richtig: true },
          { text: 'Lutz', richtig: false },
          { text: 'Die Kinder', richtig: false },
          { text: 'Wird jedes Jahr neu ausgehandelt', richtig: false },
        ],
        aufloesung: 'Britta plant, Lutz packt. Bewährt seit Jahrzehnten.',
        entwurf: true,
      },
      {
        id: 'q07',
        frage: 'Was darf bei den beiden am Sonntagmorgen nicht fehlen?',
        antworten: [
          { text: 'Ein ausgiebiges Frühstück', richtig: true },
          { text: 'Ein Frühsport-Programm', richtig: false },
          { text: 'Der Wocheneinkauf', richtig: false },
          { text: 'Gartenarbeit vor acht Uhr', richtig: false },
        ],
        aufloesung:
          '[Bitte anpassen: Was gehört bei Britta und Lutz wirklich zum Sonntag?]',
        entwurf: true,
      },
      {
        id: 'q08',
        frage: 'Welchen Satz hört man in diesem Haushalt am häufigsten?',
        antworten: [
          { text: '„Hast du das gesehen?“', richtig: false },
          { text: '„Wir könnten doch mal eben …“', richtig: true },
          { text: '„Ich hab’s dir doch gesagt.“', richtig: false },
          { text: '„Wo ist eigentlich …?“', richtig: false },
        ],
        aufloesung:
          '[Bitte anpassen: den echten Lieblingssatz der beiden eintragen.]',
        entwurf: true,
      },
      {
        id: 'q09',
        frage: 'In welchem Ort wird heute gefeiert?',
        antworten: [
          { text: 'Drentwede', richtig: true },
          { text: 'Barnstorf', richtig: false },
          { text: 'Diepholz', richtig: false },
          { text: 'Bremen', richtig: false },
        ],
        aufloesung: 'Drentwede. Wo sonst.',
      },
    ],
    ergebnisse: [
      {
        abProzent: 90,
        titel: 'Beeindruckend.',
        text: 'Entweder gehört ihr zur engsten Familie — oder ihr habt heimlich mitgeschrieben. Beides ehrt euch.',
      },
      {
        abProzent: 70,
        titel: 'Sehr solide.',
        text: 'Ihr kennt die beiden gut. Für die letzten Punkte hilft nur: noch ein Abend am Küchentisch.',
      },
      {
        abProzent: 40,
        titel: 'Da geht noch was.',
        text: 'Solide Grundkenntnisse. Der Rest lässt sich heute Abend hervorragend nachholen.',
      },
      {
        abProzent: 0,
        titel: 'Ehrlich geraten.',
        text: 'Kein Grund zur Sorge — dafür sind Feiern schließlich da. Fragt Britta und Lutz einfach selbst.',
      },
    ],
  },



  /* ------------------------------------------------------------------
     08 · GÄSTEWAND
     Grüße und Fotos der Gäste. Die Beiträge selbst stehen NICHT hier –
     sie kommen vom Server (api/entries.php). Hier stehen nur die
     Beschriftungen rundherum.
     ------------------------------------------------------------------ */
  gaestewand: {
    nummer: '07',
    eyebrow: 'Gästewand',
    ueberschrift: 'Schreibt uns etwas',
    einleitung: [
      'Ein Gruß, eine Erinnerung, ein Foto vom Abend — alles ist willkommen und erscheint gleich hier auf der Seite.',
      'Kein Konto, keine Anmeldung. Name eintragen, etwas schreiben, Fotos auswählen, fertig.',
    ],
    formular: {
      titel: 'Beitrag hinzufügen',
      nameLabel: 'Dein Name',
      namePlatzhalter: 'z. B. Familie Meier',
      textLabel: 'Dein Gruß',
      textPlatzhalter: 'Was möchtest du Britta und Lutz sagen?',
      bilderLabel: 'Fotos',
      bilderHinweis: 'Bis zu 5 Bilder, je höchstens 12 MB (JPG, PNG oder WebP).',
      codeLabel: 'Zugangscode',
      codePlatzhalter: 'Code aus der Einladung',
      absendenLabel: 'Beitrag senden',
      sendetLabel: 'Wird gesendet …',
      dankeTitel: 'Vielen Dank!',
      dankeText: 'Dein Beitrag steht jetzt auf der Gästewand.',
      dankeWartetText:
        'Dein Beitrag ist angekommen und erscheint, sobald er freigegeben wurde.',
      nochEinerLabel: 'Noch einen Beitrag schreiben',
    },
    liste: {
      titel: 'Was die Gäste schreiben',
      ladeText: 'Beiträge werden geladen …',
      leerTitel: 'Noch ist es hier leer',
      leerText: 'Sei die erste Person, die etwas hinterlässt.',
      fehlerText: 'Die Beiträge konnten nicht geladen werden.',
      erneutLabel: 'Erneut versuchen',
      bildOeffnen: 'Bild vergrößern',
    },
    qrCodeBild: 'images/qr-gaestewand.png',
    qrCodeAlt: 'QR-Code zur Gästewand',
    qrHinweis: 'Mit der Handykamera scannen',
  },

  /* ------------------------------------------------------------------
     12 · ABSCHLUSS
     ------------------------------------------------------------------ */
  abschluss: {
    nummer: '08',
    eyebrow: 'Zum Schluss',
    ueberschrift: 'Auf die nächsten Jahre',
    absaetze: [
      'Fünfundzwanzig Jahre lassen sich nicht auf eine Internetseite bringen. Das hier ist bestenfalls ein Ausschnitt — ein paar Bilder, ein paar Zahlen, ein paar Geschichten, die schon oft erzählt wurden und trotzdem jedes Mal besser werden.',
      'Liebe Britta, lieber Lutz: Ihr habt in diesen Jahren etwas aufgebaut, das man nicht planen kann. Einen Ort, an dem Menschen gern länger bleiben, als sie vorhatten. Dafür ein großes Dankeschön — und die herzlichsten Glückwünsche zu eurer Silberhochzeit.',
      'Auf die vergangenen 25 Jahre — und auf all die schönen Jahre, die noch kommen.',
    ],
    signatur: 'Eure Familie und Freunde',
  },

  /* ------------------------------------------------------------------
     13 · FOOTER
     ------------------------------------------------------------------ */
  footer: {
    titel: 'Silberhochzeit von Britta & Lutz',
    ortJahr: 'Drentwede · 2026',
    hinweis: 'Mit Liebe erstellt',
    // Falls die Seite oeffentlich erreichbar ist, kann hier ein
    // Impressumshinweis ergaenzt werden.
    zusatz: '',
  },
}

/* ==========================================================================
   ABGELEITETE WERTE – bitte nicht aendern
   ========================================================================== */

/** Alle Anker-IDs der Sektionen in der Reihenfolge der Seite. */
export const sektionsAnker = [
  'start',
  'begruessung',
  'geschichte',
  'zahlen',
  'damals-heute',
  'fakten',
  'quiz',
  'gaestewand',
  'abschluss',
] as const

export type SektionsAnker = (typeof sektionsAnker)[number]

export default inhalt
