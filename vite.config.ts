import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Die Seite kann entweder direkt unter einer Domain (https://beispiel.de/)
 * oder in einem Unterordner (https://beispiel.de/silberhochzeit/) liegen.
 *
 * Gesteuert wird das ueber die Umgebungsvariable VITE_BASE_PATH.
 * Standardwert ist "/" – also direkt unter der Domain.
 *
 * Beispiel fuer einen Unterordner:
 *   VITE_BASE_PATH=/silberhochzeit/ npm run build
 *
 * Wichtig: Der Wert muss mit "/" beginnen UND enden.
 */
function normalizeBasePath(value: string | undefined): string {
  const raw = (value ?? '').trim()
  if (raw === '' || raw === '/') return '/'

  const withLeadingSlash = raw.startsWith('/') ? raw : `/${raw}`
  return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`
}

export default defineConfig(({ mode }) => {
  // Laedt .env-Dateien UND uebernimmt VITE_*-Variablen aus der Umgebung
  // (wichtig fuer GitHub Actions, wo der Wert als env gesetzt wird).
  const env = loadEnv(mode, process.cwd(), '')
  const base = normalizeBasePath(process.env.VITE_BASE_PATH ?? env.VITE_BASE_PATH)

  return {
    base,
    plugins: [react(), tailwindcss()],
    build: {
      outDir: 'dist',
      // Etwas hoehere Warnschwelle: Framer Motion ist der groesste Brocken
      // und laesst sich bei einer One-Page-Site nicht sinnvoll aufteilen.
      chunkSizeWarningLimit: 700,
      rollupOptions: {
        output: {
          // Bibliotheken in eigene Dateien auslagern: aendert sich spaeter
          // nur ein Text, muessen Besucher nicht alles neu laden.
          manualChunks(id) {
            if (!id.includes('node_modules')) return
            if (id.includes('framer-motion') || id.includes('motion-dom')) {
              return 'motion'
            }
            if (id.includes('/react-dom/') || id.includes('/react/')) {
              return 'react'
            }
          },
        },
      },
    },
    server: {
      port: 5173,
      open: false,
    },
    preview: {
      port: 4173,
    },
  }
})
