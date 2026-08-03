import { useEffect, useState } from 'react'

/**
 * Ermittelt, welcher Abschnitt gerade im Blickfeld ist.
 *
 * Wird von der Navigation genutzt, um den aktuellen Menuepunkt dezent
 * hervorzuheben. Umgesetzt mit IntersectionObserver statt mit einem
 * Scroll-Listener – das ist deutlich sparsamer und ruckelt nicht.
 *
 * @param ankerListe IDs der zu beobachtenden Abschnitte
 */
export function useAktiveSektion(ankerListe: readonly string[]): string {
  const [aktiv, setAktiv] = useState<string>(ankerListe[0] ?? '')

  useEffect(() => {
    if (ankerListe.length === 0) return

    const elemente = ankerListe
      .map((anker) => document.getElementById(anker))
      .filter((element): element is HTMLElement => element !== null)

    if (elemente.length === 0) return

    // Sichtbarkeit pro Abschnitt merken; aktiv ist der oberste sichtbare.
    const sichtbarkeit = new Map<string, number>()

    const beobachter = new IntersectionObserver(
      (eintraege) => {
        for (const eintrag of eintraege) {
          sichtbarkeit.set(eintrag.target.id, eintrag.intersectionRatio)
        }

        let besterAnker = ''
        let besterWert = 0

        for (const element of elemente) {
          const wert = sichtbarkeit.get(element.id) ?? 0
          if (wert > besterWert) {
            besterWert = wert
            besterAnker = element.id
          }
        }

        if (besterAnker) setAktiv(besterAnker)
      },
      {
        // Oberer Rand knapp unter der Navbar, unterer Rand hoch gezogen:
        // dadurch gilt der Abschnitt als aktiv, sobald er den oberen
        // Bildschirmbereich fuellt.
        rootMargin: '-80px 0px -55% 0px',
        threshold: [0, 0.15, 0.3, 0.5, 0.75, 1],
      },
    )

    elemente.forEach((element) => beobachter.observe(element))
    return () => beobachter.disconnect()
  }, [ankerListe])

  return aktiv
}
