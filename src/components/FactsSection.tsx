import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { inhalt } from '../data/content'
import type { Fakt } from '../data/content'
import { Einblenden } from './ui/Einblenden'
import { EntwurfHinweis } from './ui/EntwurfHinweis'
import { SektionsKopf } from './ui/SektionsKopf'
import { useBewegungReduziert } from '../hooks/useBewegungReduziert'

function FaktKarte({
  fakt,
  nummer,
  hinweis,
}: {
  fakt: Fakt
  nummer: number
  hinweis: string
}) {
  const [offen, setOffen] = useState(false)
  const bewegungReduziert = useBewegungReduziert()
  const inhaltId = `fakt-${fakt.id}`

  return (
    <div className="border-linie shadow-karte hover:shadow-karte-hover h-full rounded-2xl border bg-white transition-shadow duration-300">
      <h3>
        <button
          type="button"
          onClick={() => setOffen((wert) => !wert)}
          aria-expanded={offen}
          aria-controls={inhaltId}
          className="flex w-full items-start gap-4 rounded-2xl p-6 text-left"
        >
          <span
            aria-hidden="true"
            className="font-display text-champagner-tief mt-0.5 shrink-0 text-sm tabular-nums"
          >
            {String(nummer).padStart(2, '0')}
          </span>

          <span className="flex-1">
            <span className="text-tinte block text-[1.05rem] leading-snug font-medium">
              {fakt.frage}
            </span>
            {!offen ? (
              <span className="text-tinte-weich mt-1 block text-xs">
                {hinweis}
              </span>
            ) : null}
          </span>

          <span
            aria-hidden="true"
            className="border-linie text-tinte-weich mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-transform duration-300"
            style={{ transform: offen ? 'rotate(45deg)' : 'rotate(0deg)' }}
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={1.75} />
          </span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {offen ? (
          <motion.div
            id={inhaltId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: bewegungReduziert ? 0.15 : 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pl-[3.25rem]">
              <div aria-hidden="true" className="bg-linie mb-4 h-px w-10" />
              <p className="text-tinte-zart text-[0.95rem] leading-relaxed">
                {fakt.antwort}
                <EntwurfHinweis wenn={fakt.entwurf} text="Antwort erfunden" />
              </p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

export function FactsSection() {
  const { fakten } = inhalt

  return (
    <section
      id="fakten"
      aria-labelledby="fakten-titel"
      className="sektion scroll-mt-20 bg-white"
    >
      <div className="inhalt-breite">
        <SektionsKopf
          nummer={fakten.nummer}
          eyebrow={fakten.eyebrow}
          ueberschrift={fakten.ueberschrift}
          einleitung={fakten.einleitung}
          ueberschriftId="fakten-titel"
        />

        <ul className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {fakten.eintraege.map((fakt, index) => (
            <Einblenden
              as="li"
              key={fakt.id}
              verzoegerung={Math.min(index, 6) * 0.05}
              className="h-full"
            >
              <FaktKarte
                fakt={fakt}
                nummer={index + 1}
                hinweis={fakten.aufklappHinweis}
              />
            </Einblenden>
          ))}
        </ul>
      </div>
    </section>
  )
}
