import { inhalt } from '../data/content'

export function Footer() {
  const { footer } = inhalt

  return (
    <footer className="bg-[#1c1c1c] text-white">
      <div className="inhalt-breite">
        <div className="h-px w-full bg-white/10" />

        <div className="flex flex-col items-center gap-3 py-12 text-center md:flex-row md:justify-between md:gap-6 md:py-14 md:text-left">
          <p className="font-display text-lg text-white/90">{footer.titel}</p>

          <p className="text-xs tracking-[0.18em] text-white/50 uppercase">
            {footer.ortJahr}
          </p>

          <p className="text-sm text-white/50 italic">{footer.hinweis}</p>
        </div>

        {footer.zusatz ? (
          <p className="border-t border-white/10 py-6 text-center text-xs text-white/40">
            {footer.zusatz}
          </p>
        ) : null}
      </div>
    </footer>
  )
}
