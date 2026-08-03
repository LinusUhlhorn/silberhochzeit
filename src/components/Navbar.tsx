import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { inhalt } from '../data/content'
import { scrolleZu } from '../lib/scrollen'
import { useAktiveSektion } from '../hooks/useAktiveSektion'
import { useModalVerhalten } from '../hooks/useModalVerhalten'
import { useBewegungReduziert } from '../hooks/useBewegungReduziert'

/** Ab dieser Scrolltiefe bekommt die Navigation einen Hintergrund. */
const SCROLL_SCHWELLE = 80

export function Navbar() {
  const { navigation, navigationLabels, meta } = inhalt
  const [gescrollt, setGescrollt] = useState(false)
  const [menueOffen, setMenueOffen] = useState(false)
  const bewegungReduziert = useBewegungReduziert()

  const ankerListe = navigation.map((punkt) => punkt.anker)
  const aktiveSektion = useAktiveSektion(ankerListe)
  const menueRef = useModalVerhalten(menueOffen, () => setMenueOffen(false))

  useEffect(() => {
    const beiScroll = () => setGescrollt(window.scrollY > SCROLL_SCHWELLE)
    beiScroll()
    window.addEventListener('scroll', beiScroll, { passive: true })
    return () => window.removeEventListener('scroll', beiScroll)
  }, [])

  // Menue schliessen, sobald auf Desktop-Breite gewechselt wird –
  // sonst bliebe die Scroll-Sperre bei einer Drehung des Geraets aktiv.
  useEffect(() => {
    if (!menueOffen) return
    const abfrage = window.matchMedia('(min-width: 768px)')
    const beiAenderung = () => {
      if (abfrage.matches) setMenueOffen(false)
    }
    abfrage.addEventListener('change', beiAenderung)
    return () => abfrage.removeEventListener('change', beiAenderung)
  }, [menueOffen])

  const springeZu = (anker: string) => {
    setMenueOffen(false)
    // Kurz warten, bis die Scroll-Sperre des Menues aufgehoben ist.
    window.setTimeout(() => scrolleZu(anker), 10)
  }

  return (
    <>
      <a
        href="#begruessung"
        onClick={(event) => {
          event.preventDefault()
          scrolleZu('begruessung')
        }}
        className="bg-tinte focus-visible:outline-creme sr-only rounded-full px-5 py-2 text-sm text-white focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-[100]"
      >
        {navigationLabels.zumInhalt}
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          gescrollt || menueOffen
            ? 'border-linie/80 border-b bg-[rgb(248_247_243/0.88)] backdrop-blur-md'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <nav
          aria-label="Hauptnavigation"
          className="inhalt-breite flex h-16 items-center justify-between md:h-20"
        >
          {/* Marke – springt zurueck zum Anfang */}
          <a
            href="#start"
            onClick={(event) => {
              event.preventDefault()
              scrolleZu('start')
            }}
            className={`font-display text-lg tracking-[0.2em] transition-colors md:text-xl ${
              gescrollt || menueOffen ? 'text-tinte' : 'text-white'
            }`}
          >
            {navigationLabels.marke}
            <span className="sr-only">
              {' '}
              – {meta.namen}, Silberhochzeit. Zurück zum Anfang.
            </span>
          </a>

          {/* Desktop-Navigation */}
          <ul className="hidden items-center gap-7 md:flex lg:gap-9">
            {navigation.map((punkt) => {
              const istAktiv = aktiveSektion === punkt.anker
              return (
                <li key={punkt.anker}>
                  <a
                    href={`#${punkt.anker}`}
                    onClick={(event) => {
                      event.preventDefault()
                      springeZu(punkt.anker)
                    }}
                    aria-current={istAktiv ? 'true' : undefined}
                    className={`relative py-2 text-sm transition-colors ${
                      gescrollt
                        ? istAktiv
                          ? 'text-tinte'
                          : 'text-tinte-weich hover:text-tinte'
                        : istAktiv
                          ? 'text-white'
                          : 'text-white/75 hover:text-white'
                    }`}
                  >
                    {punkt.label}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-0 -bottom-0.5 h-px origin-left transition-transform duration-300 ${
                        gescrollt ? 'bg-champagner-tief' : 'bg-champagner'
                      } ${istAktiv ? 'scale-x-100' : 'scale-x-0'}`}
                    />
                  </a>
                </li>
              )
            })}
          </ul>

          {/* Hamburger */}
          <button
            type="button"
            onClick={() => setMenueOffen((offen) => !offen)}
            aria-expanded={menueOffen}
            aria-controls="mobilmenue"
            className={`-mr-2 flex h-11 w-11 items-center justify-center rounded-full transition-colors md:hidden ${
              gescrollt || menueOffen
                ? 'text-tinte hover:bg-linie/60'
                : 'text-white hover:bg-white/10'
            }`}
          >
            <span className="sr-only">
              {menueOffen
                ? navigationLabels.menueSchliessen
                : navigationLabels.menueOeffnen}
            </span>
            {menueOffen ? (
              <X className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
            )}
          </button>
        </nav>

        {/* Mobiles Menue */}
        <AnimatePresence>
          {menueOffen ? (
            <motion.div
              id="mobilmenue"
              ref={menueRef}
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              aria-label={navigationLabels.menueOeffnen}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: bewegungReduziert ? 0.15 : 0.3 }}
              className="border-linie overflow-hidden border-t bg-[rgb(248_247_243/0.98)] md:hidden"
            >
              <ul className="inhalt-breite flex flex-col py-3">
                {navigation.map((punkt) => {
                  const istAktiv = aktiveSektion === punkt.anker
                  return (
                    <li key={punkt.anker} className="border-linie/70 border-b last:border-0">
                      <a
                        href={`#${punkt.anker}`}
                        onClick={(event) => {
                          event.preventDefault()
                          springeZu(punkt.anker)
                        }}
                        aria-current={istAktiv ? 'true' : undefined}
                        className={`flex items-center gap-3 py-4 text-base ${
                          istAktiv ? 'text-tinte' : 'text-tinte-weich'
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className={`h-px transition-all duration-300 ${
                            istAktiv
                              ? 'bg-champagner-tief w-6'
                              : 'bg-linie w-3'
                          }`}
                        />
                        {punkt.label}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </header>
    </>
  )
}
