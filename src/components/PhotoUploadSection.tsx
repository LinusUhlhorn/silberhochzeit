import { QrCode, Upload } from 'lucide-react'
import { inhalt } from '../data/content'
import { Bild } from './ui/Bild'
import { Einblenden } from './ui/Einblenden'
import { SektionsKopf } from './ui/SektionsKopf'

export function PhotoUploadSection() {
  const { fotowand } = inhalt
  const hatUploadLink = fotowand.uploadUrl.trim().length > 0

  return (
    <section
      id="fotowand"
      aria-labelledby="fotowand-titel"
      className="sektion scroll-mt-20 bg-white"
    >
      <div className="inhalt-breite">
        <div className="border-linie bg-creme rounded-3xl border p-8 md:p-12 lg:p-16">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-16">
            {/* Text */}
            <div>
              <SektionsKopf
                nummer={fotowand.nummer}
                eyebrow={fotowand.eyebrow}
                ueberschrift={fotowand.ueberschrift}
                ueberschriftId="fotowand-titel"
              />

              <div className="mt-6 space-y-4">
                {fotowand.einleitung.map((absatz, index) => (
                  <Einblenden key={index} verzoegerung={index * 0.06}>
                    <p className="text-tinte-zart text-spalte leading-[1.75]">
                      {absatz}
                    </p>
                  </Einblenden>
                ))}
              </div>

              <Einblenden verzoegerung={0.15}>
                <div className="mt-8">
                  {hatUploadLink ? (
                    <a
                      href={fotowand.uploadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-tinte inline-flex items-center gap-2.5 rounded-full px-8 py-4 text-sm text-white transition-opacity hover:opacity-90"
                    >
                      <Upload
                        className="h-4 w-4"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                      {fotowand.buttonLabel}
                      <span className="sr-only">(öffnet in neuem Tab)</span>
                    </a>
                  ) : (
                    <div className="flex flex-col items-start gap-3">
                      {/*
                        Solange kein Upload-Link hinterlegt ist, bleibt der
                        Button sichtbar, aber deaktiviert – so ist erkennbar,
                        was spaeter moeglich sein wird.
                      */}
                      <button
                        type="button"
                        disabled
                        aria-describedby="fotowand-hinweis"
                        className="border-silber text-tinte-weich inline-flex cursor-not-allowed items-center gap-2.5 rounded-full border border-dashed bg-white/60 px-8 py-4 text-sm"
                      >
                        <Upload
                          className="h-4 w-4"
                          strokeWidth={1.5}
                          aria-hidden="true"
                        />
                        {fotowand.buttonLabel}
                      </button>

                      <p
                        id="fotowand-hinweis"
                        className="text-tinte-weich text-sm"
                      >
                        {fotowand.hinweisOhneLink}
                      </p>
                    </div>
                  )}
                </div>
              </Einblenden>
            </div>

            {/* QR-Code */}
            <Einblenden verzoegerung={0.2}>
              <figure className="mx-auto w-full max-w-[16rem] lg:mx-0">
                <div className="border-linie shadow-karte rounded-2xl border bg-white p-5">
                  <Bild
                    quelle={fotowand.qrCodeBild}
                    alt={fotowand.qrCodeAlt}
                    platzhalterText="QR-Code folgt"
                    seitenverhaeltnis="1 / 1"
                    className="w-full rounded-lg"
                  />
                </div>

                <figcaption className="text-tinte-weich mt-4 flex items-center justify-center gap-2 text-center text-xs">
                  <QrCode
                    className="h-3.5 w-3.5 shrink-0"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  {fotowand.qrHinweis}
                </figcaption>
              </figure>
            </Einblenden>
          </div>
        </div>
      </div>
    </section>
  )
}
