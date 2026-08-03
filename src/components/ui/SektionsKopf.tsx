import { Einblenden } from './Einblenden'

interface SektionsKopfProps {
  /** Laufende Nummer, z. B. "02". */
  nummer: string
  eyebrow: string
  ueberschrift: string
  einleitung?: string
  /** Kopf mittig statt linksbuendig setzen. */
  zentriert?: boolean
  /** Helle Schrift fuer dunkle Abschnitte. */
  hell?: boolean
  /** ID fuer aria-labelledby der umgebenden Sektion. */
  ueberschriftId?: string
}

/**
 * Einheitlicher Abschnittskopf: Ziffer, Label, Ueberschrift, Einleitung.
 *
 * Die kleine Serifen-Ziffer gibt der Seite den Charakter einer
 * gedruckten Festschrift und hilft beim Orientieren.
 */
export function SektionsKopf({
  nummer,
  eyebrow,
  ueberschrift,
  einleitung,
  zentriert = false,
  hell = false,
  ueberschriftId,
}: SektionsKopfProps) {
  const ausrichtung = zentriert ? 'items-center text-center' : 'items-start'

  return (
    <Einblenden className={`flex flex-col ${ausrichtung}`}>
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className={`font-display text-lg ${
            hell ? 'text-champagner' : 'text-champagner-tief'
          }`}
        >
          {nummer}
        </span>
        <span
          aria-hidden="true"
          className={`h-px w-8 ${hell ? 'bg-white/30' : 'bg-linie'}`}
        />
        <span className={`eyebrow ${hell ? 'text-white/70' : ''}`}>
          {eyebrow}
        </span>
      </div>

      <h2
        id={ueberschriftId}
        className={`mt-5 max-w-[20ch] text-[2rem] leading-[1.12] md:text-[2.75rem] lg:text-[3.25rem] ${
          hell ? 'text-white' : 'text-tinte'
        }`}
      >
        {ueberschrift}
      </h2>

      {einleitung ? (
        <p
          className={`text-spalte mt-5 ${
            hell ? 'text-white/75' : 'text-tinte-weich'
          } ${zentriert ? 'mx-auto' : ''}`}
        >
          {einleitung}
        </p>
      ) : null}
    </Einblenden>
  )
}
