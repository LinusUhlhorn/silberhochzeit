import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { inhalt } from '../data/content'
import { useBewegungReduziert } from '../hooks/useBewegungReduziert'

const SICHTBAR_AB = 800

export function BackToTopButton() {
  const [sichtbar, setSichtbar] = useState(false)
  const bewegungReduziert = useBewegungReduziert()

  useEffect(() => {
    const beiScroll = () => setSichtbar(window.scrollY > SICHTBAR_AB)
    beiScroll()
    window.addEventListener('scroll', beiScroll, { passive: true })
    return () => window.removeEventListener('scroll', beiScroll)
  }, [])

  const nachOben = () => {
    window.scrollTo({
      top: 0,
      behavior: bewegungReduziert ? 'auto' : 'smooth',
    })
  }

  return (
    <AnimatePresence>
      {sichtbar ? (
        <motion.button
          type="button"
          onClick={nachOben}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: bewegungReduziert ? 0.15 : 0.25 }}
          className="border-linie text-tinte shadow-karte hover:shadow-karte-hover fixed right-5 bottom-5 z-40 flex h-12 w-12 items-center justify-center rounded-full border bg-white/90 backdrop-blur transition-shadow md:right-8 md:bottom-8"
        >
          <span className="sr-only">{inhalt.navigationLabels.nachOben}</span>
          <ArrowUp className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
        </motion.button>
      ) : null}
    </AnimatePresence>
  )
}
