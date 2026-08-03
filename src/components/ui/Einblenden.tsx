import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useBewegungReduziert } from '../../hooks/useBewegungReduziert'

interface EinblendenProps {
  children: ReactNode
  /** Verzoegerung in Sekunden – fuer gestaffelte Reihen. */
  verzoegerung?: number
  className?: string
  /** HTML-Element, das gerendert wird. Standard: div */
  as?: 'div' | 'li' | 'article' | 'section' | 'figure'
}

/**
 * Blendet Inhalte beim Hineinscrollen weich ein.
 *
 * Bewusst nur EINMAL (`once: true`) – wiederholtes Ein- und Ausblenden
 * beim Zurueckscrollen wirkt auf einer langen Seite unruhig.
 *
 * Bei „Bewegung reduzieren“ bleibt nur eine kurze Deckkraft-Blende,
 * ohne Versatz.
 */
export function Einblenden({
  children,
  verzoegerung = 0,
  className,
  as = 'div',
}: EinblendenProps) {
  const bewegungReduziert = useBewegungReduziert()
  const Komponente = motion[as]

  return (
    <Komponente
      className={className}
      initial={{ opacity: 0, y: bewegungReduziert ? 0 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -80px 0px' }}
      transition={{
        duration: bewegungReduziert ? 0.2 : 0.6,
        delay: bewegungReduziert ? 0 : verzoegerung,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </Komponente>
  )
}
