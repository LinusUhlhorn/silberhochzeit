import { motion, useScroll, useSpring } from 'framer-motion'
import { useBewegungReduziert } from '../hooks/useBewegungReduziert'

/**
 * Feiner Fortschrittsbalken am oberen Bildschirmrand.
 *
 * Zeigt, wie weit man auf der Seite schon gescrollt ist – bei einer
 * langen One-Page-Website eine hilfreiche Orientierung.
 * Rein dekorativ, deshalb vor Screenreadern verborgen.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const bewegungReduziert = useBewegungReduziert()

  // Ohne Feder wirkt der Balken bei Trackpads nervoes.
  const weicherFortschritt = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 40,
    restDelta: 0.001,
  })

  return (
    <motion.div
      aria-hidden="true"
      className="bg-champagner-tief fixed inset-x-0 top-0 z-[60] h-[2px] origin-left"
      style={{
        scaleX: bewegungReduziert ? scrollYProgress : weicherFortschritt,
      }}
    />
  )
}
