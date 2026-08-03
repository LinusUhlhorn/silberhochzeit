import { Quote } from 'lucide-react'
import { inhalt } from '../data/content'
import { Einblenden } from './ui/Einblenden'
import { EntwurfHinweis } from './ui/EntwurfHinweis'
import { SektionsKopf } from './ui/SektionsKopf'

export function MessagesSection() {
  const { gruesse } = inhalt

  return (
    <section
      id="gruesse"
      aria-labelledby="gruesse-titel"
      className="sektion scroll-mt-20 bg-white"
    >
      <div className="inhalt-breite">
        <SektionsKopf
          nummer={gruesse.nummer}
          eyebrow={gruesse.eyebrow}
          ueberschrift={gruesse.ueberschrift}
          einleitung={gruesse.einleitung}
          ueberschriftId="gruesse-titel"
        />

        {/*
          Mehrspaltiges Layout (columns statt grid): dadurch dürfen die
          Karten unterschiedlich hoch sein, ohne Lücken zu hinterlassen.
        */}
        <ul className="mt-14 gap-5 md:columns-2 lg:columns-3">
          {gruesse.eintraege.map((gruss, index) => (
            <Einblenden
              as="li"
              key={gruss.id}
              verzoegerung={Math.min(index, 5) * 0.06}
              className="mb-5 break-inside-avoid"
            >
              <figure className="border-linie shadow-karte hover:shadow-karte-hover bg-creme rounded-2xl border p-7 transition-shadow duration-300">
                <Quote
                  className="text-champagner h-6 w-6"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />

                <blockquote className="mt-4">
                  <p className="text-tinte-zart text-[0.975rem] leading-[1.75]">
                    {gruss.text}
                  </p>
                </blockquote>

                <figcaption className="mt-5">
                  <div aria-hidden="true" className="bg-linie mb-4 h-px w-10" />
                  <span className="text-tinte block text-sm font-medium">
                    {gruss.absender}
                    <EntwurfHinweis wenn={gruss.entwurf} text="Beispieltext" />
                  </span>
                  {gruss.zusatz ? (
                    <span className="text-tinte-weich mt-0.5 block text-xs">
                      {gruss.zusatz}
                    </span>
                  ) : null}
                </figcaption>
              </figure>
            </Einblenden>
          ))}
        </ul>
      </div>
    </section>
  )
}
