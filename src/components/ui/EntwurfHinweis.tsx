import { istEntwicklung } from '../../lib/assets'

interface EntwurfHinweisProps {
  /** Nur anzeigen, wenn der Inhalt als Entwurf markiert ist. */
  wenn?: boolean
  /** Zusatztext, z. B. „Antwort erfunden“. */
  text?: string
}

/**
 * Kleiner Hinweis „Entwurf“ neben noch nicht bestaetigten Inhalten.
 *
 * WICHTIG: Erscheint ausschliesslich waehrend der Entwicklung
 * (`npm run dev`). In der fertigen Website (`npm run build`) wird
 * dieser Hinweis komplett entfernt – der Aufruf wird dort zu `null`.
 *
 * Zweck: Beim Durchgehen der Seite mit der Familie sofort sehen,
 * welche Stellen noch echte Angaben brauchen.
 */
export function EntwurfHinweis({ wenn = true, text }: EntwurfHinweisProps) {
  if (!istEntwicklung || !wenn) return null

  return (
    <span
      className="ml-2 inline-flex shrink-0 items-center gap-1 rounded-full border border-dashed border-amber-500/60 bg-amber-50 px-2 py-0.5 align-middle text-[10px] font-medium tracking-wide text-amber-800 uppercase"
      title="Dieser Inhalt ist ein Vorschlag und muss noch bestätigt werden. Sichtbar nur während der Entwicklung."
    >
      Entwurf
      {text ? <span className="font-normal normal-case">· {text}</span> : null}
    </span>
  )
}
