import { useCallback, useEffect, useState } from 'react'
import {
  Archive,
  Check,
  Eye,
  Loader2,
  LogOut,
  RefreshCw,
  Trash2,
  Undo2,
} from 'lucide-react'
import {
  abmelden,
  adminBildUrl,
  anmelden,
  beitragAktion,
  liste,
  status,
} from './adminApi'
import type { AdminBeitrag, Aktion } from './adminApi'

type Filter = 'sichtbar' | 'archiviert' | 'wartet' | 'alle'

function zeitText(sekunden: number): string {
  return new Date(sekunden * 1000).toLocaleString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/* ==========================================================================
   ANMELDUNG
   ========================================================================== */

function Anmeldung({
  beiErfolg,
  eingerichtet,
}: {
  beiErfolg: (token: string) => void
  eingerichtet: boolean
}) {
  const [passwort, setPasswort] = useState('')
  const [fehler, setFehler] = useState('')
  const [laeuft, setLaeuft] = useState(false)

  const absenden = async (e: React.FormEvent) => {
    e.preventDefault()
    if (laeuft) return

    setLaeuft(true)
    setFehler('')

    try {
      const { token } = await anmelden(passwort)
      beiErfolg(token)
    } catch (err) {
      setFehler(err instanceof Error ? err.message : 'Anmeldung fehlgeschlagen.')
      setPasswort('')
    } finally {
      setLaeuft(false)
    }
  }

  if (!eingerichtet) {
    return (
      <div className="border-linie shadow-karte w-full max-w-md rounded-2xl border bg-white p-8">
        <h1 className="text-tinte text-[1.6rem]">Noch nicht eingerichtet</h1>
        <p className="text-tinte-zart mt-3 text-[0.95rem] leading-relaxed">
          Es wurde noch kein Admin-Passwort vergeben. Die Einrichtung läuft
          einmalig über <code className="bg-creme rounded px-1.5 py-0.5">api/setup.php</code>.
        </p>
        <p className="text-tinte-weich mt-3 text-sm">
          Aus Sicherheitsgründen muss dafür zuerst im Ordner{' '}
          <code className="bg-creme rounded px-1.5 py-0.5">daten/</code> eine leere
          Datei namens{' '}
          <code className="bg-creme rounded px-1.5 py-0.5">SETUP-ERLAUBT</code>{' '}
          angelegt werden. Die Anleitung steht auf der Seite selbst.
        </p>
        <a
          href="./api/setup.php"
          className="bg-tinte mt-6 inline-block rounded-full px-6 py-3 text-sm text-white"
        >
          Zur Einrichtung
        </a>
      </div>
    )
  }

  return (
    <form
      onSubmit={absenden}
      className="border-linie shadow-karte w-full max-w-md rounded-2xl border bg-white p-8"
    >
      <h1 className="text-tinte text-[1.6rem]">Verwaltung</h1>
      <p className="text-tinte-weich mt-1 text-sm">Gästewand Britta &amp; Lutz</p>

      <label htmlFor="pw" className="text-tinte mt-7 block text-sm font-medium">
        Passwort
      </label>
      <input
        id="pw"
        type="password"
        value={passwort}
        onChange={(e) => setPasswort(e.target.value)}
        autoComplete="current-password"
        required
        autoFocus
        disabled={laeuft}
        className="border-linie focus:border-silber mt-2 w-full rounded-xl border px-4 py-3 outline-none"
      />

      <div aria-live="polite">
        {fehler ? (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {fehler}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={laeuft}
        className="bg-tinte mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm text-white disabled:opacity-60"
      >
        {laeuft ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : null}
        Anmelden
      </button>
    </form>
  )
}

/* ==========================================================================
   BEITRAGSKARTE
   ========================================================================== */

function BeitragsKarte({
  beitrag,
  beiAktion,
  laeuftGerade,
}: {
  beitrag: AdminBeitrag
  beiAktion: (aktion: Aktion, beitrag: AdminBeitrag) => void
  laeuftGerade: boolean
}) {
  return (
    <li
      className={`border-linie rounded-2xl border bg-white p-5 transition-opacity ${
        beitrag.archiviert ? 'opacity-60' : ''
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-tinte font-medium">{beitrag.name}</p>
          <p className="text-tinte-weich text-xs tabular-nums">
            {zeitText(beitrag.zeit)}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {beitrag.wartet ? (
            <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs text-amber-800">
              wartet auf Freigabe
            </span>
          ) : null}
          {beitrag.archiviert ? (
            <span className="bg-creme text-tinte-weich rounded-full px-2.5 py-1 text-xs">
              archiviert
            </span>
          ) : null}
          {!beitrag.archiviert && !beitrag.wartet ? (
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs text-emerald-800">
              sichtbar
            </span>
          ) : null}
        </div>
      </div>

      {beitrag.text ? (
        <p className="text-tinte-zart mt-3 text-[0.95rem] leading-relaxed whitespace-pre-line">
          {beitrag.text}
        </p>
      ) : null}

      {beitrag.bilder.length > 0 ? (
        <ul className="mt-4 flex flex-wrap gap-2">
          {beitrag.bilder.map((bild) => (
            <li key={bild.name}>
              <a
                href={adminBildUrl(bild.name)}
                target="_blank"
                rel="noopener noreferrer"
                title="In voller Größe öffnen"
              >
                <img
                  src={adminBildUrl(bild.vorschau)}
                  alt=""
                  loading="lazy"
                  className="border-linie h-24 w-24 rounded-lg border object-cover"
                />
              </a>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="border-linie mt-4 flex flex-wrap gap-2 border-t pt-4">
        {beitrag.wartet ? (
          <button
            type="button"
            disabled={laeuftGerade}
            onClick={() => beiAktion('freigeben', beitrag)}
            className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2 text-xs text-white disabled:opacity-50"
          >
            <Check className="h-3.5 w-3.5" aria-hidden="true" />
            Freigeben
          </button>
        ) : null}

        {beitrag.archiviert ? (
          <button
            type="button"
            disabled={laeuftGerade}
            onClick={() => beiAktion('wiederherstellen', beitrag)}
            className="border-linie text-tinte hover:border-silber inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs disabled:opacity-50"
          >
            <Undo2 className="h-3.5 w-3.5" aria-hidden="true" />
            Wieder anzeigen
          </button>
        ) : (
          <button
            type="button"
            disabled={laeuftGerade}
            onClick={() => beiAktion('archivieren', beitrag)}
            className="border-linie text-tinte hover:border-silber inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs disabled:opacity-50"
          >
            <Archive className="h-3.5 w-3.5" aria-hidden="true" />
            Archivieren
          </button>
        )}

        <button
          type="button"
          disabled={laeuftGerade}
          onClick={() => beiAktion('loeschen', beitrag)}
          className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-red-200 px-4 py-2 text-xs text-red-700 hover:bg-red-50 disabled:opacity-50"
        >
          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
          Endgültig löschen
        </button>
      </div>
    </li>
  )
}

/* ==========================================================================
   VERWALTUNG
   ========================================================================== */

function Verwaltung({ token, beiAbmelden }: { token: string; beiAbmelden: () => void }) {
  const [beitraege, setBeitraege] = useState<AdminBeitrag[]>([])
  const [zustand, setZustand] = useState<'laedt' | 'fertig' | 'fehler'>('laedt')
  const [filter, setFilter] = useState<Filter>('sichtbar')
  const [aktiv, setAktiv] = useState<string | null>(null)
  const [meldung, setMeldung] = useState('')

  const holen = useCallback(() => {
    liste()
      .then((d) => {
        setBeitraege(d.eintraege)
        setZustand('fertig')
      })
      .catch(() => setZustand('fehler'))
  }, [])

  useEffect(() => {
    liste()
      .then((d) => {
        setBeitraege(d.eintraege)
        setZustand('fertig')
      })
      .catch(() => setZustand('fehler'))
  }, [])

  const ausfuehren = async (aktion: Aktion, beitrag: AdminBeitrag) => {
    if (aktion === 'loeschen') {
      const sicher = window.confirm(
        `Beitrag von „${beitrag.name}“ endgültig löschen?\n\n` +
          'Die Bilder werden mit gelöscht. Das lässt sich nicht rückgängig machen.',
      )
      if (!sicher) return
    }

    setAktiv(beitrag.id)
    setMeldung('')

    try {
      await beitragAktion(aktion, beitrag.id, token)

      if (aktion === 'loeschen') {
        setBeitraege((v) => v.filter((b) => b.id !== beitrag.id))
        setMeldung('Beitrag gelöscht.')
      } else {
        setBeitraege((v) =>
          v.map((b) =>
            b.id === beitrag.id
              ? {
                  ...b,
                  archiviert: aktion === 'archivieren',
                  wartet: aktion === 'freigeben' ? false : b.wartet,
                }
              : b,
          ),
        )
        setMeldung(
          aktion === 'archivieren'
            ? 'Beitrag archiviert – er erscheint nicht mehr auf der Website.'
            : aktion === 'wiederherstellen'
              ? 'Beitrag ist wieder sichtbar.'
              : 'Beitrag freigegeben.',
        )
      }
    } catch (e) {
      setMeldung(e instanceof Error ? e.message : 'Die Aktion ist fehlgeschlagen.')
    } finally {
      setAktiv(null)
    }
  }

  const gefiltert = beitraege.filter((b) => {
    if (filter === 'alle') return true
    if (filter === 'archiviert') return b.archiviert
    if (filter === 'wartet') return b.wartet && !b.archiviert
    return !b.archiviert && !b.wartet
  })

  const zahl = {
    sichtbar: beitraege.filter((b) => !b.archiviert && !b.wartet).length,
    wartet: beitraege.filter((b) => b.wartet && !b.archiviert).length,
    archiviert: beitraege.filter((b) => b.archiviert).length,
    alle: beitraege.length,
  }

  const filterKnopf = (wert: Filter, text: string, anzahl: number) => (
    <button
      key={wert}
      type="button"
      onClick={() => setFilter(wert)}
      aria-pressed={filter === wert}
      className={`rounded-full px-4 py-2 text-sm transition-colors ${
        filter === wert
          ? 'bg-tinte text-white'
          : 'border-linie text-tinte-weich hover:border-silber border bg-white'
      }`}
    >
      {text} <span className="tabular-nums opacity-70">({anzahl})</span>
    </button>
  )

  return (
    <div className="inhalt-breite py-10">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-tinte text-[1.8rem]">Gästewand verwalten</h1>
          <p className="text-tinte-weich text-sm">
            Archivierte Beiträge erscheinen nicht auf der Website.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={holen}
            className="border-linie text-tinte hover:border-silber inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2.5 text-sm"
          >
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            Aktualisieren
          </button>
          <button
            type="button"
            onClick={beiAbmelden}
            className="border-linie text-tinte hover:border-silber inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2.5 text-sm"
          >
            <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
            Abmelden
          </button>
        </div>
      </header>

      <div className="mb-6 flex flex-wrap gap-2">
        {filterKnopf('sichtbar', 'Sichtbar', zahl.sichtbar)}
        {zahl.wartet > 0 ? filterKnopf('wartet', 'Wartet', zahl.wartet) : null}
        {filterKnopf('archiviert', 'Archiviert', zahl.archiviert)}
        {filterKnopf('alle', 'Alle', zahl.alle)}
      </div>

      <div aria-live="polite">
        {meldung ? (
          <p className="border-linie bg-creme text-tinte mb-5 rounded-xl border px-4 py-3 text-sm">
            {meldung}
          </p>
        ) : null}
      </div>

      {zustand === 'laedt' ? (
        <p className="text-tinte-weich flex items-center gap-2 py-16 text-sm">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          Beiträge werden geladen …
        </p>
      ) : zustand === 'fehler' ? (
        <p className="py-16 text-sm text-red-700">
          Die Beiträge konnten nicht geladen werden.
        </p>
      ) : gefiltert.length === 0 ? (
        <div className="border-linie rounded-2xl border border-dashed py-16 text-center">
          <Eye className="text-silber mx-auto h-6 w-6" aria-hidden="true" />
          <p className="text-tinte-weich mt-3 text-sm">
            Hier ist gerade nichts.
          </p>
        </div>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {gefiltert.map((b) => (
            <BeitragsKarte
              key={b.id}
              beitrag={b}
              beiAktion={ausfuehren}
              laeuftGerade={aktiv === b.id}
            />
          ))}
        </ul>
      )}
    </div>
  )
}

/* ==========================================================================
   WURZEL
   ========================================================================== */

export default function AdminApp() {
  const [token, setToken] = useState<string | null>(null)
  const [eingerichtet, setEingerichtet] = useState(true)
  const [geprueft, setGeprueft] = useState(false)

  // Beim Laden prüfen, ob noch eine gültige Sitzung besteht.
  useEffect(() => {
    status()
      .then((s) => {
        setEingerichtet(s.eingerichtet)
        if (s.angemeldet && s.token) setToken(s.token)
        setGeprueft(true)
      })
      .catch(() => setGeprueft(true))
  }, [])

  const abmeldenUndZurueck = () => {
    void abmelden().finally(() => setToken(null))
  }

  if (!geprueft) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="text-silber h-6 w-6 animate-spin" aria-hidden="true" />
      </div>
    )
  }

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <Anmeldung beiErfolg={setToken} eingerichtet={eingerichtet} />
      </div>
    )
  }

  return <Verwaltung token={token} beiAbmelden={abmeldenUndZurueck} />
}
