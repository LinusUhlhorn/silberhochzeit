/**
 * Baut den korrekten Pfad zu einer Datei im Ordner `public/`.
 *
 * Hintergrund: Die Seite kann unter einer Domain (https://beispiel.de/)
 * oder in einem Unterordner (https://beispiel.de/silberhochzeit/) liegen.
 * Vite stellt den konfigurierten Basispfad ueber `import.meta.env.BASE_URL`
 * bereit. Alle Bildpfade laufen deshalb durch diese Funktion – dadurch
 * funktionieren sie in beiden Faellen.
 *
 * In `content.ts` stehen die Pfade daher OHNE fuehrenden Schraegstrich,
 * z. B. "images/hero.jpg".
 */
export function asset(pfad: string): string {
  if (!pfad) return ''

  // Absolute URLs und Data-URLs bleiben unveraendert.
  if (/^(https?:)?\/\//i.test(pfad) || pfad.startsWith('data:')) {
    return pfad
  }

  const basis = import.meta.env.BASE_URL || '/'
  const basisNormalisiert = basis.endsWith('/') ? basis : `${basis}/`
  const pfadNormalisiert = pfad.startsWith('/') ? pfad.slice(1) : pfad

  return `${basisNormalisiert}${pfadNormalisiert}`
}

/**
 * true, waehrend `npm run dev` laeuft.
 * Wird genutzt, um Entwurfs-Hinweise nur bei der Entwicklung anzuzeigen.
 */
export const istEntwicklung = import.meta.env.DEV
