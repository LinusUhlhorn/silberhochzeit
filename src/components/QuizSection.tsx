import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, RotateCcw, X } from 'lucide-react'
import { inhalt } from '../data/content'
import { Einblenden } from './ui/Einblenden'
import { EntwurfHinweis } from './ui/EntwurfHinweis'
import { SektionsKopf } from './ui/SektionsKopf'
import { useBewegungReduziert } from '../hooks/useBewegungReduziert'

type Phase = 'start' | 'laeuft' | 'ergebnis'

export function QuizSection() {
  const { quiz } = inhalt
  const bewegungReduziert = useBewegungReduziert()

  const [phase, setPhase] = useState<Phase>('start')
  const [frageIndex, setFrageIndex] = useState(0)
  const [gewaehlt, setGewaehlt] = useState<number | null>(null)
  const [punkte, setPunkte] = useState(0)

  const gesamt = quiz.fragen.length
  const aktuelleFrage = quiz.fragen[frageIndex]
  const letzteFrage = frageIndex === gesamt - 1
  const beantwortet = gewaehlt !== null

  const prozent = gesamt > 0 ? Math.round((punkte / gesamt) * 100) : 0

  // Passenden Ergebnistext suchen: hoechste Schwelle, die erreicht wurde.
  const ergebnis = useMemo(() => {
    const sortiert = [...quiz.ergebnisse].sort(
      (a, b) => b.abProzent - a.abProzent,
    )
    return sortiert.find((e) => prozent >= e.abProzent) ?? sortiert.at(-1)
  }, [prozent, quiz.ergebnisse])

  const fortschrittText = quiz.fortschrittFormat
    .replace('{aktuell}', String(frageIndex + 1))
    .replace('{gesamt}', String(gesamt))

  const antworten = (index: number) => {
    if (beantwortet || !aktuelleFrage) return
    setGewaehlt(index)
    if (aktuelleFrage.antworten[index]?.richtig) {
      setPunkte((wert) => wert + 1)
    }
  }

  const weiter = () => {
    if (letzteFrage) {
      setPhase('ergebnis')
      return
    }
    setFrageIndex((index) => index + 1)
    setGewaehlt(null)
  }

  const neustart = () => {
    setPhase('start')
    setFrageIndex(0)
    setGewaehlt(null)
    setPunkte(0)
  }

  return (
    <section
      id="quiz"
      aria-labelledby="quiz-titel"
      className="sektion bg-creme scroll-mt-20"
    >
      <div className="inhalt-breite">
        <SektionsKopf
          nummer={quiz.nummer}
          eyebrow={quiz.eyebrow}
          ueberschrift={quiz.ueberschrift}
          einleitung={quiz.einleitung}
          zentriert
          ueberschriftId="quiz-titel"
        />

        <Einblenden className="mx-auto mt-12 w-full max-w-2xl">
          <div className="border-linie shadow-karte rounded-2xl border bg-white p-6 md:p-10">
            <AnimatePresence mode="wait">
              {/* ---------- Startbildschirm ---------- */}
              {phase === 'start' ? (
                <motion.div
                  key="start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: bewegungReduziert ? 0.12 : 0.25 }}
                  className="py-6 text-center"
                >
                  <p className="font-display text-tinte text-[2.5rem] leading-none">
                    {gesamt}
                  </p>
                  <p className="text-tinte-weich mt-2 text-sm tracking-[0.16em] uppercase">
                    Fragen
                  </p>
                  <button
                    type="button"
                    onClick={() => setPhase('laeuft')}
                    className="bg-tinte mt-8 inline-flex items-center rounded-full px-8 py-3.5 text-sm text-white transition-opacity hover:opacity-90"
                  >
                    {quiz.startLabel}
                  </button>
                </motion.div>
              ) : null}

              {/* ---------- Fragen ---------- */}
              {phase === 'laeuft' && aktuelleFrage ? (
                <motion.div
                  key={`frage-${frageIndex}`}
                  initial={{ opacity: 0, x: bewegungReduziert ? 0 : 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: bewegungReduziert ? 0 : -16 }}
                  transition={{ duration: bewegungReduziert ? 0.12 : 0.28 }}
                >
                  {/* Fortschritt */}
                  <div className="mb-7">
                    <div className="text-tinte-weich mb-2 flex items-center justify-between text-xs tracking-wider uppercase">
                      <span>{fortschrittText}</span>
                      <span className="tabular-nums">
                        {punkte} richtig
                      </span>
                    </div>
                    <div
                      className="bg-linie h-1 w-full overflow-hidden rounded-full"
                      role="progressbar"
                      aria-valuemin={1}
                      aria-valuemax={gesamt}
                      aria-valuenow={frageIndex + 1}
                      aria-label={fortschrittText}
                    >
                      <motion.div
                        className="bg-champagner-tief h-full rounded-full"
                        initial={false}
                        animate={{ width: `${((frageIndex + 1) / gesamt) * 100}%` }}
                        transition={{ duration: bewegungReduziert ? 0 : 0.4 }}
                      />
                    </div>
                  </div>

                  <h3 className="text-tinte text-[1.35rem] leading-snug md:text-[1.6rem]">
                    {aktuelleFrage.frage}
                    <EntwurfHinweis wenn={aktuelleFrage.entwurf} />
                  </h3>

                  {/* Antworten */}
                  <ul className="mt-6 space-y-2.5">
                    {aktuelleFrage.antworten.map((antwort, index) => {
                      const istGewaehlt = gewaehlt === index
                      const zeigeRichtig = beantwortet && antwort.richtig
                      const zeigeFalsch =
                        beantwortet && istGewaehlt && !antwort.richtig

                      let stil =
                        'border-linie hover:border-silber hover:bg-creme'
                      if (zeigeRichtig) {
                        stil = 'border-emerald-600/40 bg-emerald-50'
                      } else if (zeigeFalsch) {
                        stil = 'border-red-500/40 bg-red-50'
                      } else if (beantwortet) {
                        stil = 'border-linie opacity-55'
                      }

                      return (
                        <li key={index}>
                          <button
                            type="button"
                            onClick={() => antworten(index)}
                            disabled={beantwortet}
                            className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-[0.975rem] transition-all duration-200 disabled:cursor-default ${stil}`}
                          >
                            <span className="flex-1">{antwort.text}</span>

                            {zeigeRichtig ? (
                              <Check
                                className="h-4 w-4 shrink-0 text-emerald-700"
                                strokeWidth={2}
                                aria-hidden="true"
                              />
                            ) : null}
                            {zeigeFalsch ? (
                              <X
                                className="h-4 w-4 shrink-0 text-red-600"
                                strokeWidth={2}
                                aria-hidden="true"
                              />
                            ) : null}
                          </button>
                        </li>
                      )
                    })}
                  </ul>

                  {/* Rueckmeldung */}
                  <div aria-live="polite" aria-atomic="true">
                    {beantwortet ? (
                      <motion.div
                        initial={{ opacity: 0, y: bewegungReduziert ? 0 : 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25 }}
                        className="mt-6"
                      >
                        <p className="text-tinte mb-1 text-sm font-medium">
                          {aktuelleFrage.antworten[gewaehlt]?.richtig
                            ? 'Richtig.'
                            : 'Leider nicht.'}
                        </p>
                        {aktuelleFrage.aufloesung ? (
                          <p className="text-tinte-weich text-[0.95rem] leading-relaxed">
                            {aktuelleFrage.aufloesung}
                          </p>
                        ) : null}
                      </motion.div>
                    ) : null}
                  </div>

                  {beantwortet ? (
                    <button
                      type="button"
                      onClick={weiter}
                      className="bg-tinte mt-7 w-full rounded-full px-8 py-3.5 text-sm text-white transition-opacity hover:opacity-90 sm:w-auto"
                    >
                      {letzteFrage ? quiz.abschlussLabel : quiz.weiterLabel}
                    </button>
                  ) : null}
                </motion.div>
              ) : null}

              {/* ---------- Ergebnis ---------- */}
              {phase === 'ergebnis' ? (
                <motion.div
                  key="ergebnis"
                  initial={{ opacity: 0, y: bewegungReduziert ? 0 : 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: bewegungReduziert ? 0.12 : 0.35 }}
                  className="py-4 text-center"
                >
                  <p className="eyebrow">Ergebnis</p>

                  <p className="font-display text-tinte mt-4 text-[3.5rem] leading-none md:text-[4.5rem]">
                    {punkte}
                    <span className="text-silber text-[2rem] md:text-[2.5rem]">
                      /{gesamt}
                    </span>
                  </p>

                  <div
                    aria-hidden="true"
                    className="bg-champagner mx-auto mt-7 h-px w-16"
                  />

                  <h3 className="text-tinte mt-7 text-[1.6rem] md:text-[2rem]">
                    {ergebnis?.titel}
                  </h3>
                  <p className="text-tinte-zart mx-auto mt-3 max-w-md text-[0.975rem] leading-relaxed">
                    {ergebnis?.text}
                  </p>

                  <button
                    type="button"
                    onClick={neustart}
                    className="border-tinte text-tinte hover:bg-tinte mt-9 inline-flex items-center gap-2 rounded-full border px-7 py-3 text-sm transition-colors hover:text-white"
                  >
                    <RotateCcw
                      className="h-4 w-4"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                    {quiz.neustartLabel}
                  </button>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </Einblenden>
      </div>
    </section>
  )
}
