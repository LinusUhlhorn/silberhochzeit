/**
 * Scrollt sanft zu einem Abschnitt.
 *
 * Beruecksichtigt die Systemeinstellung „Bewegung reduzieren“: In dem Fall
 * wird ohne Animation gesprungen.
 *
 * Zusaetzlich wird der Zielabschnitt kurzzeitig fokussierbar gemacht und
 * fokussiert. Das ist wichtig fuer die Tastatur- und Screenreader-Bedienung:
 * ohne diesen Schritt bliebe der Fokus oben in der Navigation haengen und die
 * naechste Tab-Taste wuerde wieder ins Menue springen statt in den Abschnitt.
 */
export function scrolleZu(anker: string): void {
  const ziel = document.getElementById(anker)
  if (!ziel) return

  const bewegungReduziert =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  ziel.scrollIntoView({
    behavior: bewegungReduziert ? 'auto' : 'smooth',
    block: 'start',
  })

  const hatteTabindex = ziel.hasAttribute('tabindex')
  if (!hatteTabindex) ziel.setAttribute('tabindex', '-1')

  ziel.focus({ preventScroll: true })

  if (!hatteTabindex) {
    // Attribut wieder entfernen, sobald der Fokus den Abschnitt verlaesst –
    // sonst saehe der Abschnitt dauerhaft wie ein Bedienelement aus.
    ziel.addEventListener('blur', () => ziel.removeAttribute('tabindex'), {
      once: true,
    })
  }
}
