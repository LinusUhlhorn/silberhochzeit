import { inhalt } from '../data/content'
import { Einblenden } from './ui/Einblenden'

export function ClosingSection() {
  const { abschluss } = inhalt

  // Der letzte Absatz ist die eigentliche Botschaft und wird groesser gesetzt.
  const absaetze = abschluss.absaetze.slice(0, -1)
  const schlusssatz = abschluss.absaetze.at(-1)

  return (
    <section
      id="abschluss"
      aria-labelledby="abschluss-titel"
      className="auf-dunkel sektion scroll-mt-20 bg-[#1c1c1c] text-white"
    >
      <div className="inhalt-breite">
        <div className="mx-auto max-w-3xl text-center">
          <Einblenden className="flex flex-col items-center">
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="font-display text-champagner text-lg"
              >
                {abschluss.nummer}
              </span>
              <span aria-hidden="true" className="h-px w-8 bg-white/25" />
              <span className="eyebrow text-white/70">{abschluss.eyebrow}</span>
            </div>

            <h2
              id="abschluss-titel"
              className="mt-6 text-[2.25rem] leading-[1.1] text-white md:text-[3rem] lg:text-[3.5rem]"
            >
              {abschluss.ueberschrift}
            </h2>
          </Einblenden>

          <div className="mt-10 space-y-6">
            {absaetze.map((absatz, index) => (
              <Einblenden key={index} verzoegerung={index * 0.08}>
                <p className="leading-[1.8] text-white/70">{absatz}</p>
              </Einblenden>
            ))}
          </div>

          {schlusssatz ? (
            <Einblenden verzoegerung={0.2}>
              <div className="mt-14">
                <div
                  aria-hidden="true"
                  className="bg-champagner/50 mx-auto h-px w-20"
                />
                <p className="font-display mt-10 text-[1.6rem] leading-[1.35] text-balance text-white md:text-[2.25rem]">
                  {schlusssatz}
                </p>
                <p className="mt-10 text-xs tracking-[0.2em] text-white/50 uppercase">
                  {abschluss.signatur}
                </p>
              </div>
            </Einblenden>
          ) : null}
        </div>
      </div>
    </section>
  )
}
