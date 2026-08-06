import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Check,
  ImagePlus,
  Loader2,
  QrCode,
  Quote,
  RefreshCw,
  Send,
  X,
} from 'lucide-react'
import { inhalt } from '../data/content'
import type { GastBeitrag } from '../data/content'
import {
  beitraegeLaden,
  beitragSenden,
  bildUrl,
  neueVorgangsKennung,
} from '../lib/api'
import { Bild } from './ui/Bild'
import { Einblenden } from './ui/Einblenden'
import { SektionsKopf } from './ui/SektionsKopf'
import { ImageLightbox } from './ImageLightbox'
import type { LightboxBild } from './ImageLightbox'
import { useBewegungReduziert } from '../hooks/useBewegungReduziert'

const MAX_BILDER = 5
const MAX_GROESSE = 12 * 1024 * 1024
const ERLAUBTE_TYPEN = ['image/jpeg', 'image/png', 'image/webp']

/** Zeigt „vor 5 Minuten“ statt eines nackten Zeitstempels. */
function relativeZeit(sekunden: number): string {
  const diff = Math.max(0, Math.floor(Date.now() / 1000) - sekunden)

  if (diff < 60) return 'gerade eben'
  if (diff < 3600) {
    const m = Math.floor(diff / 60)
    return `vor ${m} Minute${m === 1 ? '' : 'n'}`
  }
  if (diff < 86400) {
    const h = Math.floor(diff / 3600)
    return `vor ${h} Stunde${h === 1 ? '' : 'n'}`
  }

  return new Date(sekunden * 1000).toLocaleDateString('de-DE', {
    day: 'numeric',
    month: 'long',
  })
}

/* ==========================================================================
   FORMULAR
   ========================================================================== */

interface FormularProps {
  beiErfolg: () => void
}

function BeitragsFormular({ beiErfolg }: FormularProps) {
  const t = inhalt.gaestewand.formular
  const bewegungReduziert = useBewegungReduziert()

  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [code, setCode] = useState('')
  const [bilder, setBilder] = useState<File[]>([])
  const [fehler, setFehler] = useState('')
  const [sendet, setSendet] = useState(false)
  const [fortschritt, setFortschritt] = useState(0)
  const [fertig, setFertig] = useState<null | { wartet: boolean }>(null)
  const [codeNoetig, setCodeNoetig] = useState(false)

  const dateiRef = useRef<HTMLInputElement>(null)

  /**
   * Die Vorgangskennung wird EINMAL je Beitrag erzeugt und bleibt über
   * Wiederholungsversuche hinweg gleich. Genau das verhindert doppelte
   * Beiträge: Der Server erkennt den zweiten Versuch und legt nichts
   * Neues an.
   */
  const vorgangRef = useRef<string>(neueVorgangsKennung())

  // Vorschau-URLs werden aus der Dateiliste abgeleitet, nicht in einem
  // Effekt gesetzt. Der Effekt raeumt sie nur wieder auf – ohne das
  // belegen die Objekt-URLs dauerhaft Speicher.
  const vorschauen = useMemo(
    () => bilder.map((b) => URL.createObjectURL(b)),
    [bilder],
  )
  useEffect(
    () => () => vorschauen.forEach((u) => URL.revokeObjectURL(u)),
    [vorschauen],
  )

  const dateienHinzufuegen = (liste: FileList | null) => {
    if (!liste) return
    setFehler('')

    const neu: File[] = []
    for (const datei of Array.from(liste)) {
      if (!ERLAUBTE_TYPEN.includes(datei.type)) {
        setFehler(`„${datei.name}“ ist kein JPG-, PNG- oder WebP-Bild.`)
        continue
      }
      if (datei.size > MAX_GROESSE) {
        setFehler(`„${datei.name}“ ist größer als 12 MB.`)
        continue
      }
      // Dieselbe Datei nicht zweimal aufnehmen.
      const schonDa = bilder.some(
        (b) => b.name === datei.name && b.size === datei.size,
      )
      if (!schonDa) neu.push(datei)
    }

    const zusammen = [...bilder, ...neu].slice(0, MAX_BILDER)
    if (bilder.length + neu.length > MAX_BILDER) {
      setFehler(`Es sind höchstens ${MAX_BILDER} Bilder möglich.`)
    }
    setBilder(zusammen)

    // Zurücksetzen, damit dieselbe Datei erneut gewählt werden kann.
    if (dateiRef.current) dateiRef.current.value = ''
  }

  const bildEntfernen = (index: number) => {
    setBilder((vorher) => vorher.filter((_, i) => i !== index))
  }

  const absenden = async (event: React.FormEvent) => {
    event.preventDefault()

    // Doppeltes Absenden schon im Browser abfangen – der Server hat
    // zusätzlich seine eigene Sperre.
    if (sendet) return

    if (name.trim() === '') {
      setFehler('Bitte einen Namen angeben.')
      return
    }
    if (text.trim() === '' && bilder.length === 0) {
      setFehler('Bitte einen Gruß schreiben oder ein Foto auswählen.')
      return
    }

    setFehler('')
    setSendet(true)
    setFortschritt(0)

    try {
      const ergebnis = await beitragSenden(
        {
          name: name.trim(),
          text: text.trim(),
          bilder,
          code: code.trim(),
          vorgang: vorgangRef.current,
        },
        setFortschritt,
      )

      setFertig({ wartet: ergebnis.wartet })
      beiErfolg()
    } catch (e) {
      const meldung =
        e instanceof Error ? e.message : 'Der Beitrag konnte nicht gesendet werden.'
      setFehler(meldung)

      // Bei falschem Code das Codefeld einblenden.
      if (e instanceof Error && 'code' in e && e.code === 'code') {
        setCodeNoetig(true)
      }
    } finally {
      setSendet(false)
    }
  }

  const neuerBeitrag = () => {
    // Neue Kennung – dies ist bewusst ein anderer Vorgang.
    vorgangRef.current = neueVorgangsKennung()
    setName('')
    setText('')
    setBilder([])
    setFehler('')
    setFortschritt(0)
    setFertig(null)
  }

  /* ---------- Danke-Ansicht ---------- */

  if (fertig) {
    return (
      <motion.div
        initial={{ opacity: 0, y: bewegungReduziert ? 0 : 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-linie shadow-karte rounded-2xl border bg-white p-8 text-center"
      >
        <span className="bg-champagner/40 mx-auto flex h-14 w-14 items-center justify-center rounded-full">
          <Check className="text-tinte h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
        </span>

        <h3 className="text-tinte mt-5 text-[1.6rem]">{t.dankeTitel}</h3>
        <p className="text-tinte-weich mx-auto mt-2 max-w-sm text-[0.975rem]">
          {fertig.wartet ? t.dankeWartetText : t.dankeText}
        </p>

        <button
          type="button"
          onClick={neuerBeitrag}
          className="border-tinte text-tinte hover:bg-tinte mt-7 rounded-full border px-7 py-3 text-sm transition-colors hover:text-white"
        >
          {t.nochEinerLabel}
        </button>
      </motion.div>
    )
  }

  /* ---------- Formular ---------- */

  return (
    <form
      onSubmit={absenden}
      className="border-linie shadow-karte rounded-2xl border bg-white p-6 md:p-8"
      noValidate
    >
      <h3 className="text-tinte text-[1.4rem]">{t.titel}</h3>

      {/* Name */}
      <label htmlFor="gw-name" className="text-tinte mt-6 block text-sm font-medium">
        {t.nameLabel}
      </label>
      <input
        id="gw-name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={t.namePlatzhalter}
        maxLength={60}
        required
        autoComplete="name"
        disabled={sendet}
        className="border-linie focus:border-silber mt-2 w-full rounded-xl border px-4 py-3 text-[1rem] transition-colors outline-none disabled:opacity-60"
      />

      {/* Text */}
      <label htmlFor="gw-text" className="text-tinte mt-5 block text-sm font-medium">
        {t.textLabel}
      </label>
      <textarea
        id="gw-text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t.textPlatzhalter}
        maxLength={1000}
        rows={4}
        disabled={sendet}
        className="border-linie focus:border-silber mt-2 w-full resize-y rounded-xl border px-4 py-3 text-[1rem] leading-relaxed transition-colors outline-none disabled:opacity-60"
      />
      <p className="text-tinte-weich mt-1 text-right text-xs tabular-nums">
        {text.length} / 1000
      </p>

      {/* Bilder */}
      <span className="text-tinte mt-4 block text-sm font-medium">
        {t.bilderLabel}
      </span>

      {vorschauen.length > 0 ? (
        <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
          {vorschauen.map((url, i) => (
            <li key={url} className="relative">
              <img
                src={url}
                alt=""
                className="border-linie aspect-square w-full rounded-lg border object-cover"
              />
              <button
                type="button"
                onClick={() => bildEntfernen(i)}
                disabled={sendet}
                className="bg-tinte absolute -top-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full text-white shadow-md"
              >
                <span className="sr-only">Bild {i + 1} entfernen</span>
                <X className="h-3 w-3" strokeWidth={2.5} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {bilder.length < MAX_BILDER ? (
        <>
          <input
            ref={dateiRef}
            id="gw-bilder"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            disabled={sendet}
            onChange={(e) => dateienHinzufuegen(e.target.files)}
            className="sr-only"
          />
          <label
            htmlFor="gw-bilder"
            className="border-linie hover:border-silber text-tinte-weich mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-4 text-sm transition-colors"
          >
            <ImagePlus className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
            Fotos auswählen
          </label>
        </>
      ) : null}

      <p className="text-tinte-weich mt-2 text-xs">{t.bilderHinweis}</p>

      {/* Zugangscode – nur wenn der Server ihn verlangt */}
      {codeNoetig ? (
        <>
          <label htmlFor="gw-code" className="text-tinte mt-5 block text-sm font-medium">
            {t.codeLabel}
          </label>
          <input
            id="gw-code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={t.codePlatzhalter}
            disabled={sendet}
            className="border-linie focus:border-silber mt-2 w-full rounded-xl border px-4 py-3 text-[1rem] transition-colors outline-none"
          />
        </>
      ) : null}

      {/* Bot-Falle: für Menschen unsichtbar, Bots füllen sie aus. */}
      <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden">
        <label htmlFor="gw-website">Website (bitte frei lassen)</label>
        <input id="gw-website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {/* Fehler */}
      <div aria-live="polite">
        {fehler ? (
          <p className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {fehler}
          </p>
        ) : null}
      </div>

      {/* Fortschritt */}
      {sendet && fortschritt > 0 ? (
        <div className="mt-5">
          <div className="bg-linie h-1 w-full overflow-hidden rounded-full">
            <div
              className="bg-champagner-tief h-full rounded-full transition-[width] duration-200"
              style={{ width: `${fortschritt}%` }}
            />
          </div>
          <p className="text-tinte-weich mt-1.5 text-xs tabular-nums">
            {fortschritt}% übertragen
          </p>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={sendet}
        className="bg-tinte mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-8 py-4 text-sm text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {sendet ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} aria-hidden="true" />
            {t.sendetLabel}
          </>
        ) : (
          <>
            <Send className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
            {t.absendenLabel}
          </>
        )}
      </button>
    </form>
  )
}

/* ==========================================================================
   BEITRAGSLISTE
   ========================================================================== */

function BeitragsListe({
  beitraege,
  zustand,
  beiNeuLaden,
  beiBildKlick,
}: {
  beitraege: GastBeitrag[]
  zustand: 'laedt' | 'fertig' | 'fehler'
  beiNeuLaden: () => void
  beiBildKlick: (beitrag: GastBeitrag, index: number) => void
}) {
  const t = inhalt.gaestewand.liste

  if (zustand === 'laedt') {
    return (
      <p className="text-tinte-weich flex items-center justify-center gap-2 py-12 text-sm">
        <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} aria-hidden="true" />
        {t.ladeText}
      </p>
    )
  }

  if (zustand === 'fehler') {
    return (
      <div className="py-12 text-center">
        <p className="text-tinte-weich text-sm">{t.fehlerText}</p>
        <button
          type="button"
          onClick={beiNeuLaden}
          className="border-linie text-tinte hover:border-silber mt-4 inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
          {t.erneutLabel}
        </button>
      </div>
    )
  }

  if (beitraege.length === 0) {
    return (
      <div className="border-linie rounded-2xl border border-dashed py-14 text-center">
        <Quote className="text-silber mx-auto h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
        <p className="text-tinte mt-4 text-lg">{t.leerTitel}</p>
        <p className="text-tinte-weich mt-1 text-sm">{t.leerText}</p>
      </div>
    )
  }

  return (
    <ul className="gap-5 md:columns-2 lg:columns-3">
      {beitraege.map((beitrag, index) => (
        <Einblenden
          as="li"
          key={beitrag.id}
          verzoegerung={Math.min(index, 5) * 0.05}
          className="mb-5 break-inside-avoid"
        >
          <article className="border-linie shadow-karte hover:shadow-karte-hover bg-creme overflow-hidden rounded-2xl border transition-shadow duration-300">
            {beitrag.bilder.length > 0 ? (
              <div
                className={
                  beitrag.bilder.length === 1
                    ? ''
                    : 'grid grid-cols-2 gap-0.5'
                }
              >
                {beitrag.bilder.map((bild, bildIndex) => (
                  <button
                    key={bild.name}
                    type="button"
                    onClick={() => beiBildKlick(beitrag, bildIndex)}
                    className="group relative block w-full overflow-hidden"
                  >
                    <img
                      src={bildUrl(bild.vorschau)}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      width={bild.breite}
                      height={bild.hoehe}
                      className="ease-sanft w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      style={{
                        aspectRatio:
                          beitrag.bilder.length === 1
                            ? `${bild.breite} / ${bild.hoehe}`
                            : '1 / 1',
                      }}
                    />
                    <span className="sr-only">
                      {inhalt.gaestewand.liste.bildOeffnen}
                    </span>
                  </button>
                ))}
              </div>
            ) : null}

            <div className="p-6">
              {beitrag.text ? (
                <blockquote>
                  {/* whitespace-pre-line erhält Absätze des Gastes.
                      React setzt Text niemals als HTML ein – eingegebene
                      Zeichen wie < oder > erscheinen deshalb als Zeichen
                      und können keinen Code ausführen. */}
                  <p className="text-tinte-zart text-[0.975rem] leading-[1.75] whitespace-pre-line">
                    {beitrag.text}
                  </p>
                </blockquote>
              ) : null}

              <div className={beitrag.text ? 'mt-5' : ''}>
                <div aria-hidden="true" className="bg-linie mb-3 h-px w-10" />
                <p className="text-tinte text-sm font-medium">{beitrag.name}</p>
                <p className="text-tinte-weich mt-0.5 text-xs">
                  {relativeZeit(beitrag.zeit)}
                </p>
              </div>
            </div>
          </article>
        </Einblenden>
      ))}
    </ul>
  )
}

/* ==========================================================================
   ABSCHNITT
   ========================================================================== */

export function GuestWallSection() {
  const { gaestewand } = inhalt

  const [beitraege, setBeitraege] = useState<GastBeitrag[]>([])
  const [zustand, setZustand] = useState<'laedt' | 'fertig' | 'fehler'>('laedt')
  const [lightbox, setLightbox] = useState<{
    bilder: LightboxBild[]
    index: number
  } | null>(null)

  /**
   * Erstes Laden beim Aufbau der Seite.
   *
   * Die Zustandsaenderungen stehen bewusst in den Promise-Rueckrufen und
   * nicht direkt im Effektkoerper – ein synchrones setState im Effekt
   * loeste eine ueberfluessige zweite Renderrunde aus. Der Anfangszustand
   * ist ohnehin schon 'laedt'.
   */
  useEffect(() => {
    const abbruch = new AbortController()

    beitraegeLaden(abbruch.signal)
      .then((daten) => {
        setBeitraege(daten)
        setZustand('fertig')
      })
      .catch((e: unknown) => {
        // Ein Abbruch beim Verlassen der Seite ist kein Fehler.
        if (e instanceof DOMException && e.name === 'AbortError') return
        setZustand('fehler')
      })

    return () => abbruch.abort()
  }, [])

  /** Fuer Knopfdruck und nach dem Absenden: Ladeanzeige zeigen und neu holen. */
  const neuLaden = useCallback(() => {
    setZustand('laedt')
    beitraegeLaden()
      .then((daten) => {
        setBeitraege(daten)
        setZustand('fertig')
      })
      .catch(() => setZustand('fehler'))
  }, [])

  const bildOeffnen = (beitrag: GastBeitrag, index: number) => {
    setLightbox({
      bilder: beitrag.bilder.map((b, i) => ({
        id: `${beitrag.id}-${i}`,
        quelle: bildUrl(b.name),
        alt: `Foto von ${beitrag.name}`,
        unterschrift: beitrag.text || undefined,
      })),
      index,
    })
  }

  return (
    <section
      id="gaestewand"
      aria-labelledby="gaestewand-titel"
      className="sektion bg-creme scroll-mt-20"
    >
      <div className="inhalt-breite">
        <SektionsKopf
          nummer={gaestewand.nummer}
          eyebrow={gaestewand.eyebrow}
          ueberschrift={gaestewand.ueberschrift}
          ueberschriftId="gaestewand-titel"
        />

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_22rem] lg:items-start lg:gap-14">
          {/* Text und Formular */}
          <div className="lg:order-2">
            <div className="space-y-4">
              {gaestewand.einleitung.map((absatz, i) => (
                <Einblenden key={i} verzoegerung={i * 0.06}>
                  <p className="text-tinte-zart leading-[1.75]">{absatz}</p>
                </Einblenden>
              ))}
            </div>

            <Einblenden verzoegerung={0.12}>
              <div className="mt-7">
                <BeitragsFormular beiErfolg={neuLaden} />
              </div>
            </Einblenden>

            {/* QR-Code */}
            <Einblenden verzoegerung={0.18}>
              <figure className="mx-auto mt-8 w-full max-w-[13rem]">
                <div className="border-linie rounded-2xl border bg-white p-4">
                  <Bild
                    quelle={gaestewand.qrCodeBild}
                    alt={gaestewand.qrCodeAlt}
                    platzhalterText="QR-Code folgt"
                    seitenverhaeltnis="1 / 1"
                    className="w-full rounded-lg"
                  />
                </div>
                <figcaption className="text-tinte-weich mt-3 flex items-center justify-center gap-2 text-center text-xs">
                  <QrCode className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                  {gaestewand.qrHinweis}
                </figcaption>
              </figure>
            </Einblenden>
          </div>

          {/* Beiträge */}
          <div className="lg:order-1">
            <h3 className="text-tinte text-[1.4rem] md:text-[1.6rem]">
              {gaestewand.liste.titel}
            </h3>
            <div aria-hidden="true" className="bg-linie mt-4 mb-7 h-px w-12" />

            <AnimatePresence mode="wait">
              <motion.div
                key={zustand}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <BeitragsListe
                  beitraege={beitraege}
                  zustand={zustand}
                  beiNeuLaden={neuLaden}
                  beiBildKlick={bildOeffnen}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <ImageLightbox
        bilder={lightbox?.bilder ?? []}
        index={lightbox?.index ?? null}
        beiSchliessen={() => setLightbox(null)}
        beiWechsel={(i) => setLightbox((v) => (v ? { ...v, index: i } : v))}
        platzhalterText="Bild nicht verfügbar"
      />
    </section>
  )
}
