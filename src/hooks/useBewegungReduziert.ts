import { useEffect, useState } from 'react'

/**
 * Liest die Systemeinstellung „Bewegung reduzieren“ aus.
 *
 * Nutzerinnen und Nutzer, die diese Einstellung aktiviert haben, bekommen
 * auf der gesamten Seite nur noch weiche Ein-/Ausblendungen statt
 * Bewegungen. Der Wert reagiert live auf Aenderungen der Einstellung.
 */
export function useBewegungReduziert(): boolean {
  const [reduziert, setReduziert] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return

    const abfrage = window.matchMedia('(prefers-reduced-motion: reduce)')
    const beiAenderung = (event: MediaQueryListEvent) => {
      setReduziert(event.matches)
    }

    abfrage.addEventListener('change', beiAenderung)
    return () => abfrage.removeEventListener('change', beiAenderung)
  }, [])

  return reduziert
}
