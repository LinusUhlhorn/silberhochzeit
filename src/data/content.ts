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

export interface GalerieBild extends Entwurfsfaehig {
  id: string
  quelle: string
  alt: string
  /** Optionale Bildunterschrift. Leer lassen = keine Unterschrift. */
  unterschrift?: string
  jahr?: string
  /** Bestimmt die Kachelgroesse im Galerie-Raster. */
  format: 'hoch' | 'quer' | 'quadrat'
}

export interface GalerieInhalt {
  nummer: string
  eyebrow: string
  ueberschrift: string
  einleitung: string
  hinweisLeer: string
  bilder: GalerieBild[]
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
  }
  heute: {
    label: string
    jahr: string
    bild: string
    alt: string
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

export interface Gruss extends Entwurfsfaehig {
  id: string
  text: string
  absender: string
  /** Optionaler Zusatz, z. B. „aus Bremen“ oder „Nachbarn“. */
  zusatz?: string
}

export interface GruesseInhalt {
  nummer: string
  eyebrow: string
  ueberschrift: string
  einleitung: string
  eintraege: Gruss[]
}

export interface FeierDetail extends Entwurfsfaehig {
  id: string
  /** Name eines Lucide-Icons, siehe iconMap in EventInfoSection.tsx */
  icon: 'kalender' | 'uhr' | 'ort' | 'auto' | 'kleidung' | 'kontakt' | 'geschenk'
  label: string
  /** Mehrere Zeilen werden untereinander dargestellt. */
  zeilen: string[]
}

export interface FeierInhalt {
  nummer: string
  eyebrow: string
  ueberschrift: string
  einleitung: string
  details: FeierDetail[]
  karte: {
    label: string
    /** Google-Maps-Link. Leer lassen = Button wird ausgeblendet. */
    url: string
    hinweisOhneLink: string
  }
  rueckmeldung: {
    text: string
    entwurf?: boolean
  }
}

export interface FotowandInhalt {
  nummer: string
  eyebrow: string
  ueberschrift: string
  einleitung: string[]
  buttonLabel: string
  /** Upload-Link. Leer lassen, solange kein Link existiert. */
  uploadUrl: string
  hinweisOhneLink: string
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
  galerie: GalerieInhalt
  damalsHeute: DamalsHeuteInhalt
  fakten: FaktenInhalt
  quiz: QuizInhalt
  gruesse: GruesseInhalt
  feier: FeierInhalt
  fotowand: FotowandInhalt
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
    { label: 'Galerie', anker: 'galerie' },
    { label: 'Damals & heute', anker: 'damals-heute' },
    { label: 'Quiz', anker: 'quiz' },
    { label: 'Grüße', anker: 'gruesse' },
    { label: 'Feier', anker: 'feier' },
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
     05 · GALERIE
     Bilder gehoeren in den Ordner public/images/.
     Fehlt eine Datei, zeigt die Seite automatisch eine gestaltete
     Platzhalterflaeche statt eines kaputten Bildes.
     ------------------------------------------------------------------ */
  galerie: {
    nummer: '04',
    eyebrow: 'Bilder',
    ueberschrift: 'Fünfundzwanzig Jahre in Bildern',
    einleitung:
      'Ein paar Momente aus einem Vierteljahrhundert. Nicht chronologisch, nicht vollständig — aber ziemlich ehrlich.',
    hinweisLeer: 'Foto folgt',
    bilder: [
      {
        id: 'g01',
        quelle: 'images/gallery-01.jpg',
        alt: 'Britta und Lutz am Hochzeitstag',
        unterschrift: 'Der Tag, an dem alles offiziell wurde.',
        jahr: '2001',
        format: 'hoch',
        entwurf: true,
      },
      {
        id: 'g02',
        quelle: 'images/gallery-02.jpg',
        alt: 'Die erste gemeinsame Wohnung',
        unterschrift: 'Klein, aber voller Pläne.',
        jahr: '2002',
        format: 'quer',
        entwurf: true,
      },
      {
        id: 'g03',
        quelle: 'images/gallery-03.jpg',
        alt: 'Familienfoto im Garten',
        unterschrift: 'Sonntagnachmittag im Garten.',
        jahr: '2005',
        format: 'quadrat',
        entwurf: true,
      },
      {
        id: 'g04',
        quelle: 'images/gallery-04.jpg',
        alt: 'Gemeinsamer Urlaub am Meer',
        unterschrift: 'Wind, Sand und viel zu wenig Sonnencreme.',
        jahr: '2008',
        format: 'quer',
        entwurf: true,
      },
      {
        id: 'g05',
        quelle: 'images/gallery-05.jpg',
        alt: 'Britta und Lutz auf einer Familienfeier',
        unterschrift: 'Immer die Letzten auf der Tanzfläche.',
        jahr: '2010',
        format: 'hoch',
        entwurf: true,
      },
      {
        id: 'g06',
        quelle: 'images/gallery-06.jpg',
        alt: 'Weihnachten im Kreis der Familie',
        unterschrift: 'Weihnachten, wie es sein soll: laut.',
        jahr: '2012',
        format: 'quadrat',
        entwurf: true,
      },
      {
        id: 'g07',
        quelle: 'images/gallery-07.jpg',
        alt: 'Ausflug mit dem Fahrrad',
        unterschrift: 'Der Umweg war Absicht. Angeblich.',
        jahr: '2014',
        format: 'quer',
        entwurf: true,
      },
      {
        id: 'g08',
        quelle: 'images/gallery-08.jpg',
        alt: 'Britta und Lutz im Wohnzimmer',
        unterschrift: 'Feierabend.',
        jahr: '2016',
        format: 'hoch',
        entwurf: true,
      },
      {
        id: 'g09',
        quelle: 'images/gallery-09.jpg',
        alt: 'Gemeinsames Essen mit Freunden',
        unterschrift: 'Es war eigentlich nur ein Kaffee geplant.',
        jahr: '2018',
        format: 'quadrat',
        entwurf: true,
      },
      {
        id: 'g10',
        quelle: 'images/gallery-10.jpg',
        alt: 'Spaziergang im Herbst',
        unterschrift: 'Zwischen Feldern, wie fast immer.',
        jahr: '2021',
        format: 'quer',
        entwurf: true,
      },
      {
        id: 'g11',
        quelle: 'images/gallery-11.jpg',
        alt: 'Britta und Lutz bei einem runden Geburtstag',
        unterschrift: 'Ein runder Geburtstag, gebührend begangen.',
        jahr: '2023',
        format: 'hoch',
        entwurf: true,
      },
      {
        id: 'g12',
        quelle: 'images/gallery-12.jpg',
        alt: 'Aktuelles Foto von Britta und Lutz',
        unterschrift: 'Und heute.',
        jahr: '2025',
        format: 'quer',
        entwurf: true,
      },
    ],
  },

  /* ------------------------------------------------------------------
     06 · DAMALS & HEUTE
     Wichtig: Fuer den besten Effekt sollten beide Bilder den gleichen
     Bildausschnitt und moeglichst das gleiche Seitenverhaeltnis haben.
     ------------------------------------------------------------------ */
  damalsHeute: {
    nummer: '05',
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
    },
    heute: {
      label: 'Heute',
      jahr: '2026',
      bild: 'images/heute.jpg',
      alt: 'Britta und Lutz heute',
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
    nummer: '06',
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
    nummer: '07',
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
     09 · GRÜSSE
     ACHTUNG: Alle Grueße sind Beispieltexte mit erfundenen Absendern!
     Bitte vor der Veroeffentlichung durch echte Grueße ersetzen oder
     den gesamten Abschnitt entfernen. Niemand sollte einen Gruß
     zugeschrieben bekommen, den er nicht geschrieben hat.
     ------------------------------------------------------------------ */
  gruesse: {
    nummer: '08',
    eyebrow: 'Grüße',
    ueberschrift: 'Was andere sagen',
    einleitung:
      'Ein paar Zeilen von Menschen, die die beiden schon eine Weile begleiten.',
    eintraege: [
      {
        id: 'm01',
        text: 'Fünfundzwanzig Jahre — und ihr schafft es immer noch, euch gegenseitig zum Lachen zu bringen. Genau so soll das sein. Wir freuen uns auf euer Fest und auf alles, was danach noch kommt.',
        absender: '[Name eintragen]',
        zusatz: 'Familie',
        entwurf: true,
      },
      {
        id: 'm02',
        text: 'Ihr habt uns immer das Gefühl gegeben, jederzeit vorbeikommen zu können. Das ist mehr wert, als ihr wahrscheinlich ahnt. Danke für ein Vierteljahrhundert offene Tür.',
        absender: '[Name eintragen]',
        zusatz: 'Nachbarn',
        entwurf: true,
      },
      {
        id: 'm03',
        text: 'Wir haben ausgerechnet, dass ihr in fünfundzwanzig Jahren ungefähr dreitausend Mal darüber diskutiert habt, wer den Müll rausbringt. Und dass ihr trotzdem noch zusammen seid. Respekt.',
        absender: '[Name eintragen]',
        entwurf: true,
      },
      {
        id: 'm04',
        text: 'Bei euch habe ich gelernt, wie das eigentlich geht: zusammenbleiben. Nicht, weil es immer leicht war, sondern weil ihr euch entschieden habt, es leicht zu machen, wo es ging. Danke dafür.',
        absender: '[Name eintragen]',
        entwurf: true,
      },
      {
        id: 'm05',
        text: 'Auf die nächsten fünfundzwanzig. Wir bringen den Nachtisch mit.',
        absender: '[Name eintragen]',
        entwurf: true,
      },
      {
        id: 'm06',
        text: 'Ihr beide seid der Beweis dafür, dass die schönsten Geschichten selten spektakulär beginnen. Herzlichen Glückwunsch zur Silberhochzeit — von ganzem Herzen.',
        absender: '[Name eintragen]',
        zusatz: 'aus alter Verbundenheit',
        entwurf: true,
      },
    ],
  },

  /* ------------------------------------------------------------------
     10 · FEIER
     ACHTUNG: Alle Angaben sind Platzhalter!
     ------------------------------------------------------------------ */
  feier: {
    nummer: '09',
    eyebrow: 'Die Feier',
    ueberschrift: 'Alles Wichtige auf einen Blick',
    einleitung:
      'Damit am Tag selbst niemand suchen muss: Hier stehen Zeit, Ort und alles, was sonst noch gut zu wissen ist.',
    details: [
      {
        id: 'datum',
        icon: 'kalender',
        label: 'Datum',
        zeilen: ['[Datum eintragen]', 'z. B. Samstag, 12. September 2026'],
        entwurf: true,
      },
      {
        id: 'uhrzeit',
        icon: 'uhr',
        label: 'Uhrzeit',
        zeilen: [
          '[Uhrzeit eintragen]',
          'Empfang ab [Uhrzeit], Essen ab [Uhrzeit]',
        ],
        entwurf: true,
      },
      {
        id: 'ort',
        icon: 'ort',
        label: 'Wo',
        zeilen: [
          '[Name der Location]',
          '[Straße und Hausnummer]',
          '[PLZ] Drentwede',
        ],
        entwurf: true,
      },
      {
        id: 'parken',
        icon: 'auto',
        label: 'Parken',
        zeilen: [
          '[Parkmöglichkeiten eintragen]',
          'z. B. Parkplätze direkt am Haus, weitere entlang der Straße.',
        ],
        entwurf: true,
      },
      {
        id: 'dresscode',
        icon: 'kleidung',
        label: 'Dresscode',
        zeilen: [
          '[Dresscode eintragen]',
          'z. B. festlich, aber bequem – getanzt wird auf jeden Fall.',
        ],
        entwurf: true,
      },
      {
        id: 'kontakt',
        icon: 'kontakt',
        label: 'Fragen & Rückmeldungen',
        zeilen: ['[Ansprechpartner eintragen]', '[Telefonnummer oder E-Mail]'],
        entwurf: true,
      },
      {
        id: 'geschenke',
        icon: 'geschenk',
        label: 'Zum Thema Geschenke',
        zeilen: [
          'Das größte Geschenk ist, dass ihr da seid.',
          '[Optionaler Hinweis der Familie – bitte selbst formulieren.]',
        ],
        entwurf: true,
      },
    ],
    karte: {
      label: 'In Google Maps öffnen',
      // Sobald die Adresse feststeht: Ort in Google Maps suchen,
      // "Teilen" -> "Link kopieren" und den Link hier einsetzen.
      url: '',
      hinweisOhneLink:
        'Der Kartenlink wird ergänzt, sobald der Veranstaltungsort feststeht.',
    },
    rueckmeldung: {
      text: 'Bitte gebt uns bis zum [Datum eintragen] Bescheid, ob ihr dabei seid — telefonisch, per Nachricht oder beim nächsten Treffen.',
      entwurf: true,
    },
  },

  /* ------------------------------------------------------------------
     11 · DIGITALE FOTOWAND
     Solange `uploadUrl` leer ist, wird der Button deaktiviert und
     stattdessen ein freundlicher Hinweis angezeigt.
     ------------------------------------------------------------------ */
  fotowand: {
    nummer: '10',
    eyebrow: 'Digitale Fotowand',
    ueberschrift: 'Eure Bilder gehören dazu',
    einleitung: [
      'Am Ende eines solchen Abends gibt es immer die eine Aufnahme, die alles erzählt — und sie liegt auf irgendeinem Handy und wird nie wieder angeschaut.',
      'Damit das diesmal nicht passiert, sammeln wir alle Fotos an einem Ort. Einfach den Code scannen oder auf den Button tippen, Bilder auswählen, fertig. Kein Konto, keine Anmeldung.',
    ],
    buttonLabel: 'Fotos hochladen',
    // Hier den Link zum Cloud-Ordner eintragen (z. B. Nextcloud,
    // Google Drive, Dropbox). Solange das Feld leer ist, erscheint
    // automatisch der Hinweistext unten.
    uploadUrl: '',
    hinweisOhneLink: 'Der Foto-Upload wird zur Feier freigeschaltet.',
    qrCodeBild: 'images/qr-fotowand.png',
    qrCodeAlt: 'QR-Code zum Hochladen der Fotos',
    qrHinweis: 'Mit der Handykamera scannen',
  },

  /* ------------------------------------------------------------------
     12 · ABSCHLUSS
     ------------------------------------------------------------------ */
  abschluss: {
    nummer: '11',
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
  'galerie',
  'damals-heute',
  'fakten',
  'quiz',
  'gruesse',
  'feier',
  'fotowand',
  'abschluss',
] as const

export type SektionsAnker = (typeof sektionsAnker)[number]

export default inhalt
