import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useModalVerhalten } from '../hooks/useModalVerhalten'
import { useBewegungReduziert } from '../hooks/useBewegungReduziert'

/**
 * Ein Bild in der Grossansicht.
 *
 * `quelle` ist die fertige URL – die Umrechnung auf den Basispfad
 * passiert bereits beim Aufrufer. Dadurch funktioniert die Lightbox
 * sowohl mit mitgelieferten als auch mit hochgeladenen Bildern.
 */
export interface LightboxBild {
  id: string
  quelle: string
  alt: string
  unterschrift?: string
  jahr?: string
}

interface ImageLightboxProps {
  bilder: LightboxBild[]
  /** Index des angezeigten Bildes; null = geschlossen. */
  index: number | null
  beiSchliessen: () => void
  beiWechsel: (index: number) => void
  platzhalterText: string
}

/** Mindestdistanz in Pixeln, ab der ein Wischen als Wischen gilt. */
const WISCH_SCHWELLE = 50

export function ImageLightbox({
  bilder,
  index,
  beiSchliessen,
  beiWechsel,
  platzhalterText,
}: ImageLightboxProps) {
  const offen = index !== null
  const behaelterRef = useModalVerhalten(offen, beiSchliessen)
  const bewegungReduziert = useBewegungReduziert()
  const [wischStart, setWischStart] = useState<number | null>(null)

  // Fehlgeschlagene Bilder werden anhand ihrer ID gemerkt. Dadurch braucht
  // es beim Bildwechsel kein Zuruecksetzen – der Zustand wird abgeleitet.
  const [fehlerIds, setFehlerIds] = useState<ReadonlySet<string>>(
    () => new Set(),
  )

  const aktuell = index !== null ? bilder[index] : undefined
  const anzahl = bilder.length
  const bildFehlt = aktuell ? fehlerIds.has(aktuell.id) : false

  const merkeFehler = (id: string) => {
    setFehlerIds((vorher) => new Set(vorher).add(id))
  }

  const zurueck = useCallback(() => {
    if (index === null || anzahl === 0) return
    beiWechsel((index - 1 + anzahl) % anzahl)
  }, [index, anzahl, beiWechsel])

  const vor = useCallback(() => {
    if (index === null || anzahl === 0) return
    beiWechsel((index + 1) % anzahl)
  }, [index, anzahl, beiWechsel])

  // Pfeiltasten – Escape wird bereits von useModalVerhalten behandelt.
  useEffect(() => {
    if (!offen) return

    const beiTaste = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        zurueck()
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        vor()
      }
    }

    document.addEventListener('keydown', beiTaste)
    return () => document.removeEventListener('keydown', beiTaste)
  }, [offen, zurueck, vor])

  return (
    <AnimatePresence>
      {offen && aktuell ? (
        <motion.div
          ref={behaelterRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-label={`Bild ${index + 1} von ${anzahl}: ${aktuell.alt}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: bewegungReduziert ? 0.15 : 0.25 }}
          className="auf-dunkel fixed inset-0 z-[70] flex flex-col bg-[rgb(20_20_20/0.96)]"
          // Klick auf den Hintergrund schliesst – Klicks auf Kindelemente
          // (Bild, Buttons) sollen das nicht ausloesen.
          onClick={(event) => {
            if (event.target === event.currentTarget) beiSchliessen()
          }}
        >
          {/* Kopfzeile */}
          <div className="flex items-center justify-between px-4 py-4 md:px-8">
            <p
              className="text-sm text-white/60 tabular-nums"
              aria-live="polite"
              aria-atomic="true"
            >
              {index + 1} / {anzahl}
            </p>

            <button
              type="button"
              onClick={beiSchliessen}
              className="-mr-2 flex h-11 w-11 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              <span className="sr-only">Bildansicht schließen</span>
              <X className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>

          {/* Bildbereich */}
          <div
            className="flex min-h-0 flex-1 items-center justify-center px-3 md:px-16"
            onClick={(event) => {
              if (event.target === event.currentTarget) beiSchliessen()
            }}
            onTouchStart={(event) =>
              setWischStart(event.touches[0]?.clientX ?? null)
            }
            onTouchEnd={(event) => {
              if (wischStart === null) return
              const ende = event.changedTouches[0]?.clientX ?? wischStart
              const distanz = ende - wischStart
              if (Math.abs(distanz) > WISCH_SCHWELLE) {
                if (distanz > 0) zurueck()
                else vor()
              }
              setWischStart(null)
            }}
          >
            <AnimatePresence mode="wait">
              <motion.figure
                key={aktuell.id}
                initial={{ opacity: 0, scale: bewegungReduziert ? 1 : 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: bewegungReduziert ? 1 : 0.98 }}
                transition={{ duration: bewegungReduziert ? 0.12 : 0.25 }}
                className="flex max-h-full flex-col items-center"
              >
                {bildFehlt ? (
                  <div className="flex h-56 w-[min(85vw,26rem)] items-center justify-center rounded-lg border border-white/15 px-6 text-center">
                    <span className="text-sm text-white/60 italic">
                      {aktuell.unterschrift ?? platzhalterText}
                    </span>
                  </div>
                ) : (
                  <img
                    src={aktuell.quelle}
                    alt={aktuell.alt}
                    onError={() => merkeFehler(aktuell.id)}
                    className="max-h-[70svh] w-auto max-w-full rounded-sm object-contain shadow-2xl"
                  />
                )}

                {aktuell.unterschrift || aktuell.jahr ? (
                  <figcaption className="mt-5 max-w-xl px-2 text-center">
                    {aktuell.jahr ? (
                      <span className="mb-1 block text-xs tracking-[0.18em] text-white/45 uppercase">
                        {aktuell.jahr}
                      </span>
                    ) : null}
                    {aktuell.unterschrift ? (
                      <span className="text-[0.95rem] text-white/80 italic">
                        {aktuell.unterschrift}
                      </span>
                    ) : null}
                  </figcaption>
                ) : null}
              </motion.figure>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          {anzahl > 1 ? (
            <>
              <button
                type="button"
                onClick={zurueck}
                className="absolute top-1/2 left-2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white md:left-5"
              >
                <span className="sr-only">Vorheriges Bild</span>
                <ChevronLeft
                  className="h-6 w-6"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </button>

              <button
                type="button"
                onClick={vor}
                className="absolute top-1/2 right-2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white md:right-5"
              >
                <span className="sr-only">Nächstes Bild</span>
                <ChevronRight
                  className="h-6 w-6"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </button>
            </>
          ) : null}

          <p className="px-4 pt-2 pb-5 text-center text-xs text-white/40">
            Mit den Pfeiltasten wechseln · Escape schließt
          </p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
