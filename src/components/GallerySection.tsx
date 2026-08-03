import { useState } from 'react'
import { Expand } from 'lucide-react'
import { inhalt } from '../data/content'
import { Bild } from './ui/Bild'
import { Einblenden } from './ui/Einblenden'
import { EntwurfHinweis } from './ui/EntwurfHinweis'
import { SektionsKopf } from './ui/SektionsKopf'
import { ImageLightbox } from './ImageLightbox'

/** Seitenverhaeltnis je Bildformat – verhindert Layout-Spruenge. */
const VERHAELTNIS: Record<string, string> = {
  hoch: '4 / 5',
  quer: '3 / 2',
  quadrat: '1 / 1',
}

export function GallerySection() {
  const { galerie } = inhalt
  const [offenerIndex, setOffenerIndex] = useState<number | null>(null)

  return (
    <section
      id="galerie"
      aria-labelledby="galerie-titel"
      className="sektion scroll-mt-20 bg-white"
    >
      <div className="inhalt-breite">
        <SektionsKopf
          nummer={galerie.nummer}
          eyebrow={galerie.eyebrow}
          ueberschrift={galerie.ueberschrift}
          einleitung={galerie.einleitung}
          ueberschriftId="galerie-titel"
        />

        {/*
          Mehrspaltiges Layout statt Raster: Die Bilder behalten ihr echtes
          Seitenverhaeltnis und stapeln sich luecklos. Ein Raster wuerde bei
          gemischten Hoch-, Quer- und Quadratformaten ausgefranste Reihen
          mit grossen Luecken erzeugen.
        */}
        <ul className="mt-14 gap-3 sm:gap-4 md:columns-3 lg:columns-4 [column-count:2]">
          {galerie.bilder.map((bild, index) => (
            <Einblenden
              as="li"
              key={bild.id}
              verzoegerung={Math.min(index, 8) * 0.05}
              className="mb-3 break-inside-avoid sm:mb-4"
            >
              <button
                type="button"
                onClick={() => setOffenerIndex(index)}
                className="group shadow-karte hover:shadow-karte-hover relative block w-full overflow-hidden rounded-xl transition-shadow duration-300"
              >
                <Bild
                  quelle={bild.quelle}
                  alt={bild.alt}
                  // Bewusst NICHT die Bildunterschrift: die steht schon
                  // unter der Kachel und wuerde sich sonst doppeln.
                  platzhalterText={
                    bild.jahr
                      ? `${galerie.hinweisLeer} · ${bild.jahr}`
                      : galerie.hinweisLeer
                  }
                  seitenverhaeltnis={VERHAELTNIS[bild.format] ?? '1 / 1'}
                  className="h-full w-full rounded-xl"
                  bildKlasse="transition-transform duration-[900ms] ease-sanft group-hover:scale-[1.04]"
                />

                {/* Overlay beim Ueberfahren / Fokussieren */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 flex items-end justify-between gap-2 bg-gradient-to-t from-black/60 via-black/5 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                >
                  <span className="text-left text-xs leading-snug text-white/90">
                    {bild.jahr}
                  </span>
                  <Expand
                    className="h-4 w-4 shrink-0 text-white/90"
                    strokeWidth={1.5}
                  />
                </span>

                <span className="sr-only">
                  Bild vergrößern: {bild.alt}
                  {bild.jahr ? `, ${bild.jahr}` : ''}
                </span>
              </button>

              {bild.unterschrift ? (
                <p className="text-tinte-weich mt-2 px-0.5 text-[0.8rem] leading-snug italic">
                  {bild.unterschrift}
                  <EntwurfHinweis wenn={bild.entwurf} />
                </p>
              ) : null}
            </Einblenden>
          ))}
        </ul>
      </div>

      <ImageLightbox
        bilder={galerie.bilder}
        index={offenerIndex}
        beiSchliessen={() => setOffenerIndex(null)}
        beiWechsel={setOffenerIndex}
        platzhalterText={galerie.hinweisLeer}
      />
    </section>
  )
}
