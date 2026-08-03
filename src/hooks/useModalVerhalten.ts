import { useEffect, useRef } from 'react'

const FOKUSSIERBAR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

/**
 * Regelt alles, was ein Dialog (Lightbox, Mobilmenue) braucht:
 *
 * 1. Seitenhintergrund laesst sich nicht mehr scrollen
 *    (ohne Layout-Sprung durch die verschwindende Scrollleiste)
 * 2. Der Tastaturfokus bleibt im Dialog gefangen (Tab / Shift+Tab)
 * 3. Beim Oeffnen bekommt der Dialog den Fokus
 * 4. Beim Schliessen kehrt der Fokus zum ausloesenden Element zurueck
 *
 * @param offen    ob der Dialog gerade sichtbar ist
 * @param beiEscape wird aufgerufen, wenn Escape gedrueckt wird
 */
export function useModalVerhalten(offen: boolean, beiEscape: () => void) {
  const behaelterRef = useRef<HTMLDivElement | null>(null)
  const vorherFokussiert = useRef<HTMLElement | null>(null)
  const escapeRef = useRef(beiEscape)

  // Callback in einer Ref halten, damit der Effekt nicht bei jedem
  // Render neu aufgesetzt werden muss.
  useEffect(() => {
    escapeRef.current = beiEscape
  }, [beiEscape])

  useEffect(() => {
    if (!offen) return

    vorherFokussiert.current = document.activeElement as HTMLElement | null

    /* --- Scroll-Sperre ohne Layout-Sprung --- */
    const scrollleistenBreite =
      window.innerWidth - document.documentElement.clientWidth
    const vorherOverflow = document.body.style.overflow
    const vorherPadding = document.body.style.paddingRight

    document.body.style.overflow = 'hidden'
    if (scrollleistenBreite > 0) {
      document.body.style.paddingRight = `${scrollleistenBreite}px`
    }

    /* --- Fokus in den Dialog setzen --- */
    const behaelter = behaelterRef.current
    if (behaelter) {
      const erstes = behaelter.querySelector<HTMLElement>(FOKUSSIERBAR)
      ;(erstes ?? behaelter).focus({ preventScroll: true })
    }

    /* --- Tastatur --- */
    const beiTaste = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        escapeRef.current()
        return
      }

      if (event.key !== 'Tab') return

      const aktuellerBehaelter = behaelterRef.current
      if (!aktuellerBehaelter) return

      const elemente = Array.from(
        aktuellerBehaelter.querySelectorAll<HTMLElement>(FOKUSSIERBAR),
      ).filter((element) => element.offsetParent !== null)

      if (elemente.length === 0) {
        event.preventDefault()
        return
      }

      const erstes = elemente[0]
      const letztes = elemente[elemente.length - 1]
      if (!erstes || !letztes) return

      if (event.shiftKey && document.activeElement === erstes) {
        event.preventDefault()
        letztes.focus()
      } else if (!event.shiftKey && document.activeElement === letztes) {
        event.preventDefault()
        erstes.focus()
      }
    }

    document.addEventListener('keydown', beiTaste)

    return () => {
      document.removeEventListener('keydown', beiTaste)
      document.body.style.overflow = vorherOverflow
      document.body.style.paddingRight = vorherPadding
      vorherFokussiert.current?.focus({ preventScroll: true })
    }
  }, [offen])

  return behaelterRef
}
