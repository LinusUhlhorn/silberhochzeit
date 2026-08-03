import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { inhalt } from '../data/content'
import type { Statistik } from '../data/content'
import { Einblenden } from './ui/Einblenden'
import { EntwurfHinweis } from './ui/EntwurfHinweis'
import { SektionsKopf } from './ui/SektionsKopf'
import { useBewegungReduziert } from '../hooks/useBewegungReduziert'

const ZAEHL_DAUER = 1600

/** Weiches Auslaufen – die Zahl wird zum Ende hin langsamer. */
function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

function ZahlAnimiert({ ziel }: { ziel: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const imBlick = useInView(ref, { once: true, margin: '0px 0px -60px 0px' })
  const bewegungReduziert = useBewegungReduziert()
  const [gezaehlt, setGezaehlt] = useState(0)

  useEffect(() => {
    if (!imBlick || bewegungReduziert) return

    let frame = 0
    const start = performance.now()

    const schritt = (jetzt: number) => {
      const fortschritt = Math.min((jetzt - start) / ZAEHL_DAUER, 1)
      setGezaehlt(Math.round(easeOut(fortschritt) * ziel))
      if (fortschritt < 1) frame = requestAnimationFrame(schritt)
    }

    frame = requestAnimationFrame(schritt)
    return () => cancelAnimationFrame(frame)
  }, [imBlick, ziel, bewegungReduziert])

  // Bei reduzierter Bewegung steht der Endwert sofort da – abgeleitet
  // statt ueber den Umweg eines zusaetzlichen State-Updates.
  const anzeige = bewegungReduziert ? ziel : gezaehlt

  return (
    <span ref={ref} aria-hidden="true">
      {anzeige.toLocaleString('de-DE')}
    </span>
  )
}

function StatistikKarte({ eintrag }: { eintrag: Statistik }) {
  const hatText = Boolean(eintrag.textStattZahl)

  // Fuer Screenreader wird immer der fertige Wert vorgelesen,
  // nicht die hochzaehlende Zwischenzahl.
  const vorleseWert = hatText
    ? eintrag.textStattZahl
    : `${eintrag.praefix ?? ''}${eintrag.wert.toLocaleString('de-DE')}${eintrag.suffix ?? ''}`

  return (
    <div className="border-linie shadow-karte hover:shadow-karte-hover flex h-full flex-col rounded-2xl border bg-white p-7 transition-shadow duration-300 md:p-8">
      <p className="font-display text-tinte text-[2.75rem] leading-none md:text-[3.5rem]">
        <span className="sr-only">{vorleseWert}</span>
        {hatText ? (
          <span aria-hidden="true" className="text-[2rem] md:text-[2.5rem]">
            {eintrag.textStattZahl}
          </span>
        ) : (
          <span aria-hidden="true">
            {eintrag.praefix ? (
              <span className="text-silber text-[1.75rem] md:text-[2rem]">
                {eintrag.praefix}
              </span>
            ) : null}
            <ZahlAnimiert ziel={eintrag.wert} />
            {eintrag.suffix ? (
              <span className="text-champagner-tief">{eintrag.suffix}</span>
            ) : null}
          </span>
        )}
      </p>

      <p className="text-tinte mt-4 text-base font-medium">
        {eintrag.label}
        <EntwurfHinweis wenn={eintrag.entwurf} />
      </p>

      <div aria-hidden="true" className="bg-linie mt-4 h-px w-10" />

      <p className="text-tinte-weich mt-4 text-[0.95rem] leading-relaxed">
        {eintrag.beschreibung}
      </p>
    </div>
  )
}

export function StatsSection() {
  const { statistik } = inhalt

  return (
    <section
      id="zahlen"
      aria-labelledby="zahlen-titel"
      className="sektion bg-creme scroll-mt-20"
    >
      <div className="inhalt-breite">
        <SektionsKopf
          nummer={statistik.nummer}
          eyebrow={statistik.eyebrow}
          ueberschrift={statistik.ueberschrift}
          einleitung={statistik.einleitung}
          ueberschriftId="zahlen-titel"
        />

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {statistik.eintraege.map((eintrag, index) => (
            <Einblenden
              as="li"
              key={eintrag.id}
              verzoegerung={index * 0.07}
              className="h-full"
            >
              <StatistikKarte eintrag={eintrag} />
            </Einblenden>
          ))}
        </ul>
      </div>
    </section>
  )
}
