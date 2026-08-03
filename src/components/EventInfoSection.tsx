import type { ComponentType } from 'react'
import {
  CalendarDays,
  Car,
  Clock,
  Gift,
  MapPin,
  Phone,
  Shirt,
} from 'lucide-react'
import { inhalt } from '../data/content'
import type { FeierDetail } from '../data/content'
import { Einblenden } from './ui/Einblenden'
import { EntwurfHinweis } from './ui/EntwurfHinweis'
import { SektionsKopf } from './ui/SektionsKopf'

/** Ordnet die Icon-Namen aus content.ts den Lucide-Icons zu. */
const iconMap: Record<FeierDetail['icon'], ComponentType<{ className?: string; strokeWidth?: number }>> =
  {
    kalender: CalendarDays,
    uhr: Clock,
    ort: MapPin,
    auto: Car,
    kleidung: Shirt,
    kontakt: Phone,
    geschenk: Gift,
  }

export function EventInfoSection() {
  const { feier } = inhalt
  const hatKartenLink = feier.karte.url.trim().length > 0

  return (
    <section
      id="feier"
      aria-labelledby="feier-titel"
      className="sektion bg-creme scroll-mt-20"
    >
      <div className="inhalt-breite">
        <SektionsKopf
          nummer={feier.nummer}
          eyebrow={feier.eyebrow}
          ueberschrift={feier.ueberschrift}
          einleitung={feier.einleitung}
          ueberschriftId="feier-titel"
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {feier.details.map((detail, index) => {
            const Icon = iconMap[detail.icon]

            return (
              <Einblenden
                key={detail.id}
                verzoegerung={Math.min(index, 6) * 0.05}
                className="h-full"
              >
                <div className="border-linie shadow-karte hover:shadow-karte-hover flex h-full flex-col rounded-2xl border bg-white p-7 transition-shadow duration-300">
                  <Icon
                    className="text-champagner-tief h-5 w-5"
                    strokeWidth={1.5}
                  />

                  <h3 className="font-sans text-tinte mt-4 text-sm font-medium tracking-[0.1em] uppercase">
                    {detail.label}
                    <EntwurfHinweis wenn={detail.entwurf} />
                  </h3>

                  <div aria-hidden="true" className="bg-linie mt-3 h-px w-10" />

                  <div className="mt-4 space-y-1">
                    {detail.zeilen.map((zeile, zeilenIndex) => (
                      <p
                        key={zeilenIndex}
                        className={
                          zeilenIndex === 0
                            ? 'text-tinte text-[1.05rem] leading-snug'
                            : 'text-tinte-weich text-[0.9rem] leading-relaxed'
                        }
                      >
                        {zeile}
                      </p>
                    ))}
                  </div>
                </div>
              </Einblenden>
            )
          })}
        </div>

        {/* Karte und Rueckmeldung */}
        <Einblenden verzoegerung={0.1}>
          <div className="border-linie mt-8 flex flex-col gap-6 rounded-2xl border bg-white p-7 md:flex-row md:items-center md:justify-between md:p-8">
            <div className="max-w-xl">
              <p className="text-tinte-zart text-[0.975rem] leading-relaxed">
                {feier.rueckmeldung.text}
                <EntwurfHinweis wenn={feier.rueckmeldung.entwurf} />
              </p>
            </div>

            <div className="shrink-0">
              {hatKartenLink ? (
                <a
                  href={feier.karte.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-tinte inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm text-white transition-opacity hover:opacity-90"
                >
                  <MapPin
                    className="h-4 w-4"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  {feier.karte.label}
                  <span className="sr-only">(öffnet in neuem Tab)</span>
                </a>
              ) : (
                <p className="border-linie text-tinte-weich flex items-center gap-2 rounded-full border border-dashed px-6 py-3 text-sm">
                  <MapPin
                    className="text-silber h-4 w-4 shrink-0"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  {feier.karte.hinweisOhneLink}
                </p>
              )}
            </div>
          </div>
        </Einblenden>
      </div>
    </section>
  )
}
