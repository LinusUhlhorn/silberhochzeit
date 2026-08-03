import { Einblenden } from './ui/Einblenden'
import { inhalt } from '../data/content'

export function IntroSection() {
  const { begruessung } = inhalt

  return (
    <section
      id="begruessung"
      aria-labelledby="begruessung-titel"
      className="sektion bg-creme scroll-mt-20"
    >
      <div className="inhalt-breite">
        <div className="mx-auto max-w-3xl">
          <Einblenden className="flex flex-col items-center text-center">
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="font-display text-champagner-tief text-lg"
              >
                {begruessung.nummer}
              </span>
              <span aria-hidden="true" className="bg-linie h-px w-8" />
              <span className="eyebrow">{begruessung.eyebrow}</span>
            </div>

            <h2
              id="begruessung-titel"
              className="mt-5 text-[2rem] md:text-[2.75rem] lg:text-[3.25rem]"
            >
              {begruessung.ueberschrift}
            </h2>
          </Einblenden>

          <div className="mt-10 space-y-6 md:mt-12">
            {begruessung.absaetze.map((absatz, index) => (
              <Einblenden key={index} verzoegerung={index * 0.07}>
                <p className="text-tinte-zart leading-[1.75]">{absatz}</p>
              </Einblenden>
            ))}
          </div>

          {/* Zitat */}
          <Einblenden verzoegerung={0.15}>
            <figure className="mt-14 md:mt-16">
              <div
                aria-hidden="true"
                className="bg-champagner mx-auto h-px w-16"
              />
              <blockquote className="mt-8">
                <p className="font-display text-tinte text-center text-2xl leading-[1.35] text-balance md:text-[2rem]">
                  „{begruessung.zitat.text}“
                </p>
              </blockquote>
              <figcaption className="text-tinte-weich mt-6 text-center text-sm tracking-[0.12em] uppercase">
                {begruessung.zitat.quelle}
              </figcaption>
              <div
                aria-hidden="true"
                className="bg-champagner mx-auto mt-8 h-px w-16"
              />
            </figure>
          </Einblenden>
        </div>
      </div>
    </section>
  )
}
