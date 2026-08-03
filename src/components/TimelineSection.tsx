import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { inhalt } from '../data/content'
import { Einblenden } from './ui/Einblenden'
import { EntwurfHinweis } from './ui/EntwurfHinweis'
import { SektionsKopf } from './ui/SektionsKopf'
import { useBewegungReduziert } from '../hooks/useBewegungReduziert'

export function TimelineSection() {
  const { timeline } = inhalt
  const bewegungReduziert = useBewegungReduziert()
  const behaelterRef = useRef<HTMLDivElement>(null)

  // Die Achse waechst mit dem Scrollfortschritt durch den Abschnitt.
  const { scrollYProgress } = useScroll({
    target: behaelterRef,
    offset: ['start 65%', 'end 60%'],
  })
  const achsenHoehe = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <section
      id="geschichte"
      aria-labelledby="geschichte-titel"
      className="sektion scroll-mt-20 bg-white"
    >
      <div className="inhalt-breite">
        <SektionsKopf
          nummer={timeline.nummer}
          eyebrow={timeline.eyebrow}
          ueberschrift={timeline.ueberschrift}
          einleitung={timeline.einleitung}
          ueberschriftId="geschichte-titel"
        />

        <div ref={behaelterRef} className="relative mt-16 md:mt-24">
          {/* Achse: links auf dem Smartphone, mittig auf dem Desktop */}
          <div
            aria-hidden="true"
            className="bg-linie absolute top-0 bottom-0 left-[7px] w-px md:left-1/2 md:-translate-x-1/2"
          >
            <motion.div
              className="bg-champagner-tief absolute inset-x-0 top-0 origin-top"
              style={{
                height: '100%',
                scaleY: bewegungReduziert ? 1 : achsenHoehe,
              }}
            />
          </div>

          <ol className="space-y-12 md:space-y-0">
            {timeline.stationen.map((station, index) => {
              const rechts = index % 2 === 1

              return (
                <li
                  key={station.id}
                  className="relative md:grid md:grid-cols-2 md:gap-x-16 md:pb-20 last:md:pb-0"
                >
                  {/* Punkt auf der Achse */}
                  <span
                    aria-hidden="true"
                    className="border-champagner-tief absolute top-1.5 left-0 z-10 h-[15px] w-[15px] rounded-full border-2 bg-white md:left-1/2 md:-translate-x-1/2"
                  />

                  {/* Inhalt: abwechselnd links und rechts */}
                  <div
                    className={
                      rechts
                        ? 'md:col-start-2 md:pl-4'
                        : 'md:col-start-1 md:row-start-1 md:pr-4 md:text-right'
                    }
                  >
                    <Einblenden className="pl-8 md:pl-0">
                      <div
                        className={`flex items-baseline gap-3 ${
                          rechts ? '' : 'md:justify-end'
                        }`}
                      >
                        <span className="font-display text-champagner-tief text-2xl md:text-3xl">
                          {station.jahr}
                        </span>
                        <span
                          aria-hidden="true"
                          className="bg-linie h-px w-8 md:hidden"
                        />
                      </div>

                      <h3 className="text-tinte mt-2 text-[1.4rem] md:text-[1.75rem]">
                        {station.titel}
                        <EntwurfHinweis wenn={station.entwurf} />
                      </h3>

                      <p
                        className={`text-tinte-zart mt-3 max-w-prose text-[0.975rem] leading-[1.75] md:text-base ${
                          rechts ? '' : 'md:ml-auto'
                        }`}
                      >
                        {station.text}
                      </p>
                    </Einblenden>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
