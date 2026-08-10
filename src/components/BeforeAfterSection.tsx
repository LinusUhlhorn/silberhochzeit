import { useState } from 'react'
import { MoveHorizontal } from 'lucide-react'
import { inhalt } from '../data/content'
import { Bild } from './ui/Bild'
import { Einblenden } from './ui/Einblenden'
import { SektionsKopf } from './ui/SektionsKopf'

export function BeforeAfterSection() {
  const { damalsHeute } = inhalt
  const [position, setPosition] = useState(50)

  return (
    <section
      id="damals-heute"
      aria-labelledby="damals-heute-titel"
      className="sektion bg-creme scroll-mt-20"
    >
      <div className="inhalt-breite">
        <SektionsKopf
          nummer={damalsHeute.nummer}
          eyebrow={damalsHeute.eyebrow}
          ueberschrift={damalsHeute.ueberschrift}
          ueberschriftId="damals-heute-titel"
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:items-center lg:gap-16">
          {/* Vergleich */}
          <Einblenden>
            <div className="shadow-karte relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-white select-none">
              {/* Unten: heute */}
              <Bild
                quelle={damalsHeute.heute.bild}
                alt={damalsHeute.heute.alt}
                platzhalterText="Foto folgt"
                platzhalterAusrichtung="rechts"
                bildPosition={damalsHeute.heute.bildPosition}
                className="absolute inset-0 h-full w-full"
              />

              {/* Oben: damals – wird von links her freigegeben */}
              <div
                className="absolute inset-0"
                style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
              >
                <Bild
                  quelle={damalsHeute.damals.bild}
                  alt={damalsHeute.damals.alt}
                  platzhalterText="Foto folgt"
                  platzhalterAusrichtung="links"
                  bildPosition={damalsHeute.damals.bildPosition}
                  className="absolute inset-0 h-full w-full"
                />
              </div>

              {/* Beschriftungen */}
              <span className="pointer-events-none absolute top-4 left-4 rounded-full bg-black/45 px-3 py-1 text-xs tracking-[0.16em] text-white uppercase backdrop-blur-sm">
                {damalsHeute.damals.label} · {damalsHeute.damals.jahr}
              </span>
              <span className="pointer-events-none absolute top-4 right-4 rounded-full bg-black/45 px-3 py-1 text-xs tracking-[0.16em] text-white uppercase backdrop-blur-sm">
                {damalsHeute.heute.label} · {damalsHeute.heute.jahr}
              </span>

              {/* Trennlinie und Griff (rein visuell) */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 w-0.5 bg-white/90 shadow-[0_0_10px_rgba(0,0,0,0.35)]"
                style={{ left: `calc(${position}% - 1px)` }}
              >
                <span className="absolute top-1/2 left-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg">
                  <MoveHorizontal
                    className="text-tinte h-5 w-5"
                    strokeWidth={1.5}
                  />
                </span>
              </div>

              {/*
                Der eigentliche Regler ist ein echtes <input type="range">.
                Es liegt unsichtbar ueber dem Bild und liefert damit ohne
                Zusatzaufwand: Maus, Touch, Pfeiltasten, Pos1/Ende und die
                korrekte Ansage durch Screenreader.
              */}
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={position}
                onChange={(event) => setPosition(Number(event.target.value))}
                aria-label={`Vergleich zwischen ${damalsHeute.damals.label} und ${damalsHeute.heute.label}`}
                aria-valuetext={`${position} Prozent ${damalsHeute.damals.label}`}
                className="absolute inset-0 h-full w-full cursor-ew-resize appearance-none bg-transparent focus-visible:outline-offset-4 [&::-moz-range-thumb]:h-11 [&::-moz-range-thumb]:w-11 [&::-moz-range-thumb]:cursor-ew-resize [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-transparent [&::-webkit-slider-thumb]:h-11 [&::-webkit-slider-thumb]:w-11 [&::-webkit-slider-thumb]:cursor-ew-resize [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-transparent"
              />
            </div>

            <p className="text-tinte-weich mt-4 flex items-start gap-2 text-sm">
              <MoveHorizontal
                className="mt-0.5 h-4 w-4 shrink-0"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              {damalsHeute.bedienhinweis}
            </p>
          </Einblenden>

          {/* Begleittext */}
          <Einblenden verzoegerung={0.12}>
            <div className="space-y-5">
              {damalsHeute.begleittext.map((absatz, index) => (
                <p key={index} className="text-tinte-zart leading-[1.75]">
                  {absatz}
                </p>
              ))}

              <div aria-hidden="true" className="bg-champagner h-px w-16" />

              <p className="font-display text-tinte text-2xl leading-snug">
                {damalsHeute.damals.jahr} – {damalsHeute.heute.jahr}
              </p>
            </div>
          </Einblenden>
        </div>
      </div>
    </section>
  )
}
