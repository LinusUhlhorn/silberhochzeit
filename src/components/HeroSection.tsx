import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { inhalt } from '../data/content'
import { asset } from '../lib/assets'
import { scrolleZu } from '../lib/scrollen'
import { useBewegungReduziert } from '../hooks/useBewegungReduziert'

export function HeroSection() {
  const { hero } = inhalt
  const bewegungReduziert = useBewegungReduziert()

  // Gestaffelter Auftritt der Textzeilen beim Laden der Seite.
  const auftritt = (verzoegerung: number) => ({
    initial: { opacity: 0, y: bewegungReduziert ? 0 : 20 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: bewegungReduziert ? 0.3 : 0.8,
      delay: bewegungReduziert ? 0 : verzoegerung,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  })

  return (
    <section
      id="start"
      aria-label={`${hero.namen} – ${hero.untertitel}`}
      className="auf-dunkel relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-[#1c1c1c]"
    >
      {/* Hintergrundbild */}
      <div className="absolute inset-0">
        <motion.img
          src={asset(hero.bild)}
          alt={hero.bildAlt}
          fetchPriority="high"
          decoding="async"
          initial={{ scale: bewegungReduziert ? 1 : 1.06 }}
          animate={{ scale: 1 }}
          transition={{ duration: bewegungReduziert ? 0 : 1.6, ease: 'easeOut' }}
          onError={(event) => {
            // Fehlt das Foto, bleibt der dunkle Verlauf stehen –
            // die Seite sieht dadurch trotzdem vollstaendig aus.
            event.currentTarget.style.display = 'none'
          }}
          className="h-full w-full object-cover object-center"
        />

        {/* Dezenter Verlauf: sorgt fuer lesbaren Text auf jedem Foto */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/25"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent"
        />
      </div>

      {/* Inhalt */}
      <div className="inhalt-breite relative z-10 pb-24 md:pb-28 lg:pb-32">
        <div className="max-w-4xl">
          <motion.p
            {...auftritt(0.1)}
            className="eyebrow text-white/80"
            style={{ color: 'rgb(255 255 255 / 0.8)' }}
          >
            {hero.eyebrow}
          </motion.p>

          <motion.h1
            {...auftritt(0.25)}
            className="mt-5 text-[3.25rem] leading-[0.95] font-light text-white sm:text-[4.5rem] md:text-[6rem] lg:text-[7.5rem]"
          >
            {hero.namen}
          </motion.h1>

          <motion.div
            {...auftritt(0.4)}
            className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2"
          >
            <span className="font-display text-2xl text-white/90 md:text-3xl">
              {hero.untertitel}
            </span>
            <span
              aria-hidden="true"
              className="bg-champagner/60 hidden h-px w-10 sm:block"
            />
            <span className="text-sm tracking-[0.18em] text-white/70 uppercase">
              {hero.ort}
            </span>
          </motion.div>

          <motion.p
            {...auftritt(0.55)}
            className="font-display mt-8 max-w-2xl text-xl leading-snug text-white/85 md:text-2xl"
          >
            {hero.botschaft}
          </motion.p>

          <motion.div {...auftritt(0.7)} className="mt-10">
            <button
              type="button"
              onClick={() => scrolleZu(hero.ctaZiel)}
              className="group inline-flex items-center gap-3 rounded-full border border-white/35 px-6 py-3.5 text-sm text-white transition-colors duration-300 hover:border-white/70 hover:bg-white/10"
            >
              {hero.ctaLabel}
              <ChevronDown
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </button>
          </motion.div>
        </div>
      </div>

      {/* Scroll-Hinweis */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: bewegungReduziert ? 0 : 1.4, duration: 0.8 }}
        className="absolute inset-x-0 bottom-6 flex justify-center"
      >
        <motion.span
          animate={bewegungReduziert ? undefined : { y: [0, 7, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          className="block h-8 w-px bg-gradient-to-b from-transparent via-white/50 to-white/70"
        />
      </motion.div>
    </section>
  )
}
