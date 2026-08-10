import { useState } from 'react'
import { ImageIcon } from 'lucide-react'
import { asset } from '../../lib/assets'

interface BildProps {
  /** Pfad relativ zu `public/`, z. B. "images/hero.jpg". */
  quelle: string
  alt: string
  className?: string
  /** Text im Platzhalter, falls das Bild fehlt. */
  platzhalterText?: string
  /** Hero-Bild: sofort laden statt lazy. */
  vorrang?: boolean
  /** Seitenverhaeltnis als CSS-Wert, z. B. "4 / 5". Verhindert Layout-Spruenge. */
  seitenverhaeltnis?: string
  /** Zusaetzliche Klassen fuer das <img> selbst. */
  bildKlasse?: string
  /**
   * Wo der Platzhaltertext sitzt. Wichtig ueberall dort, wo zwei
   * Platzhalter nebeneinander liegen (z. B. Vorher-Nachher-Vergleich) –
   * mittig ausgerichtet wuerden sie sich sonst ueberlagern.
   */
  platzhalterAusrichtung?: 'mitte' | 'links' | 'rechts'
  /**
   * Bildfokus beim Zuschneiden, z. B. '50% 30%'.
   * Wichtig bei Hochformat-Fotos in breiten Flaechen.
   */
  bildPosition?: string
}

/**
 * Bild mit gestaltetem Platzhalter.
 *
 * Fehlt die Bilddatei (oder ist sie noch nicht eingepflegt), zeigt die
 * Seite KEIN kaputtes Browser-Bildsymbol, sondern eine ruhige Flaeche in
 * Creme mit feiner Silberlinie und Bildunterschrift.
 *
 * Dadurch sieht die Website auch vor dem Einpflegen der echten Fotos
 * vollstaendig aus – wichtig fuer die Abnahme durch die Familie.
 */
export function Bild({
  quelle,
  alt,
  className = '',
  platzhalterText,
  vorrang = false,
  seitenverhaeltnis,
  bildKlasse = '',
  platzhalterAusrichtung = 'mitte',
  bildPosition,
}: BildProps) {
  const [fehlgeschlagen, setFehlgeschlagen] = useState(false)
  const hatQuelle = Boolean(quelle)

  const rahmenStil = seitenverhaeltnis
    ? { aspectRatio: seitenverhaeltnis }
    : undefined

  const ausrichtung =
    platzhalterAusrichtung === 'links'
      ? 'items-start text-left'
      : platzhalterAusrichtung === 'rechts'
        ? 'items-end text-right'
        : 'items-center text-center'

  if (!hatQuelle || fehlgeschlagen) {
    return (
      <div
        className={`border-linie bg-creme flex flex-col justify-center gap-3 border p-6 ${ausrichtung} ${className}`}
        style={rahmenStil}
        role="img"
        aria-label={alt}
      >
        <ImageIcon
          className="text-silber h-7 w-7"
          strokeWidth={1.25}
          aria-hidden="true"
        />
        <span className="text-tinte-weich max-w-[22ch] text-sm italic">
          {platzhalterText ?? alt}
        </span>
      </div>
    )
  }

  return (
    <div className={`overflow-hidden ${className}`} style={rahmenStil}>
      <img
        src={asset(quelle)}
        alt={alt}
        loading={vorrang ? 'eager' : 'lazy'}
        decoding={vorrang ? 'sync' : 'async'}
        fetchPriority={vorrang ? 'high' : 'auto'}
        onError={() => setFehlgeschlagen(true)}
        style={bildPosition ? { objectPosition: bildPosition } : undefined}
        className={`h-full w-full object-cover ${bildKlasse}`}
      />
    </div>
  )
}
