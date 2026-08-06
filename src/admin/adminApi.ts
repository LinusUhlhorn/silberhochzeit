import { asset } from '../lib/assets'

/**
 * Schnittstelle zum Admin-Endpunkt.
 *
 * Alle Aufrufe gehen per POST an api/admin.php und tragen eine `aktion`.
 * Zustandsändernde Aktionen brauchen zusätzlich das CSRF-Token, das beim
 * Anmelden zurückkommt.
 */

export interface AdminBild {
  name: string
  vorschau: string
  breite: number
  hoehe: number
}

export interface AdminBeitrag {
  id: string
  name: string
  text: string
  bilder: AdminBild[]
  zeit: number
  archiviert: boolean
  wartet: boolean
}

export class AdminFehler extends Error {
  readonly code: string
  readonly status: number

  constructor(meldung: string, code = '', status = 0) {
    super(meldung)
    this.name = 'AdminFehler'
    this.code = code
    this.status = status
  }
}

async function senden<T>(felder: Record<string, string>): Promise<T> {
  const formular = new FormData()
  for (const [schluessel, wert] of Object.entries(felder)) {
    formular.set(schluessel, wert)
  }

  let antwort: Response
  try {
    antwort = await fetch(asset('api/admin.php'), {
      method: 'POST',
      body: formular,
      // Sitzungscookie muss mitgeschickt werden.
      credentials: 'same-origin',
      headers: { Accept: 'application/json' },
    })
  } catch {
    throw new AdminFehler('Keine Verbindung zum Server.', 'netz')
  }

  let daten: Record<string, unknown>
  try {
    daten = (await antwort.json()) as Record<string, unknown>
  } catch {
    throw new AdminFehler('Der Server hat unerwartet geantwortet.', 'parse', antwort.status)
  }

  if (!antwort.ok || daten.ok !== true) {
    throw new AdminFehler(
      typeof daten.fehler === 'string' ? daten.fehler : 'Es ist ein Fehler aufgetreten.',
      typeof daten.code === 'string' ? daten.code : '',
      antwort.status,
    )
  }

  return daten as T
}

export interface StatusAntwort {
  angemeldet: boolean
  token: string
  eingerichtet: boolean
  vorabfreigabe: boolean
}

export function status(): Promise<StatusAntwort> {
  return senden<StatusAntwort>({ aktion: 'status' })
}

export function anmelden(passwort: string): Promise<{ token: string }> {
  return senden<{ token: string }>({ aktion: 'login', passwort })
}

export function abmelden(): Promise<unknown> {
  return senden({ aktion: 'logout' })
}

export function liste(): Promise<{ eintraege: AdminBeitrag[]; vorabfreigabe: boolean }> {
  return senden<{ eintraege: AdminBeitrag[]; vorabfreigabe: boolean }>({ aktion: 'liste' })
}

export type Aktion = 'archivieren' | 'wiederherstellen' | 'freigeben' | 'loeschen'

export function beitragAktion(
  aktion: Aktion,
  id: string,
  token: string,
): Promise<unknown> {
  return senden({ aktion, id, token })
}

export function adminBildUrl(dateiname: string): string {
  return asset(`uploads/bilder/${dateiname}`)
}
