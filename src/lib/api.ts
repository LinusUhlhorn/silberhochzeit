import type { GastBeitrag } from '../data/content'
import { asset } from './assets'

/**
 * Schmale Hülle um die PHP-Schnittstelle.
 *
 * Die API liegt neben der Website unter `api/`. Der Pfad läuft durch
 * `asset()`, damit er auch funktioniert, wenn die Seite in einem
 * Unterordner liegt.
 */

export class ApiError extends Error {
  /** Kurzkennung des Fehlers, z. B. 'code', 'limit', 'netz'. */
  readonly code: string
  /** HTTP-Status, 0 bei Netzwerkfehlern. */
  readonly status: number

  constructor(meldung: string, code = '', status = 0) {
    super(meldung)
    this.name = 'ApiError'
    this.code = code
    this.status = status
  }
}

function apiPfad(datei: string): string {
  return asset(`api/${datei}`)
}

/** Wertet eine Antwort aus und wirft bei Fehlern einen lesbaren Text. */
async function auswerten<T>(antwort: Response): Promise<T> {
  let daten: unknown = null

  try {
    daten = await antwort.json()
  } catch {
    throw new ApiError(
      'Der Server hat unerwartet geantwortet. Bitte später noch einmal versuchen.',
      'parse',
      antwort.status,
    )
  }

  const objekt = daten as Record<string, unknown>

  if (!antwort.ok || objekt?.ok !== true) {
    throw new ApiError(
      typeof objekt?.fehler === 'string'
        ? objekt.fehler
        : 'Es ist ein Fehler aufgetreten.',
      typeof objekt?.code === 'string' ? objekt.code : '',
      antwort.status,
    )
  }

  return daten as T
}

/** Holt alle sichtbaren Gästebeiträge. */
export async function beitraegeLaden(signal?: AbortSignal): Promise<GastBeitrag[]> {
  const antwort = await fetch(apiPfad('entries.php'), {
    method: 'GET',
    signal,
    headers: { Accept: 'application/json' },
    // Nicht aus dem Browser-Zwischenspeicher – sonst sähen Gäste ihren
    // eigenen Beitrag nach dem Absenden nicht sofort.
    cache: 'no-store',
  })

  const daten = await auswerten<{ eintraege: GastBeitrag[] }>(antwort)
  return Array.isArray(daten.eintraege) ? daten.eintraege : []
}

export interface UploadErgebnis {
  id: string
  wartet: boolean
  /** true = dieser Vorgang wurde schon einmal gesendet */
  wiederholung: boolean
}

export interface UploadDaten {
  name: string
  text: string
  bilder: File[]
  code: string
  /**
   * Einmalige Kennung dieses Absendevorgangs.
   *
   * Bleibt über Wiederholungsversuche hinweg gleich. Dadurch erkennt der
   * Server einen doppelt gesendeten Beitrag und legt ihn nur einmal an –
   * wichtig bei langsamer Verbindung, wo Menschen zweimal tippen.
   */
  vorgang: string
}

/** Erzeugt eine zufällige Vorgangskennung (32 Hex-Zeichen). */
export function neueVorgangsKennung(): string {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

/** Sendet einen Beitrag. Meldet Fortschritt für die Anzeige. */
export function beitragSenden(
  daten: UploadDaten,
  beiFortschritt?: (prozent: number) => void,
): Promise<UploadErgebnis> {
  const formular = new FormData()
  formular.set('vorgang', daten.vorgang)
  formular.set('name', daten.name)
  formular.set('text', daten.text)
  formular.set('code', daten.code)
  // Bot-Falle: bleibt bei echten Menschen leer.
  formular.set('website', '')

  for (const bild of daten.bilder) {
    formular.append('bilder[]', bild)
  }

  // XMLHttpRequest statt fetch, weil nur damit der Upload-Fortschritt
  // gemeldet wird. Bei langsamer Verbindung ist genau das entscheidend:
  // ohne Rückmeldung tippen Leute ein zweites Mal auf Senden.
  return new Promise<UploadErgebnis>((erfuellen, ablehnen) => {
    const anfrage = new XMLHttpRequest()
    anfrage.open('POST', apiPfad('upload.php'))
    anfrage.responseType = 'json'
    anfrage.timeout = 180_000

    if (beiFortschritt) {
      anfrage.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable && e.total > 0) {
          beiFortschritt(Math.round((e.loaded / e.total) * 100))
        }
      })
    }

    anfrage.addEventListener('load', () => {
      const antwort = anfrage.response as Record<string, unknown> | null

      if (anfrage.status >= 200 && anfrage.status < 300 && antwort?.ok === true) {
        erfuellen({
          id: typeof antwort.id === 'string' ? antwort.id : '',
          wartet: antwort.wartet === true,
          wiederholung: antwort.wiederholung === true,
        })
        return
      }

      ablehnen(
        new ApiError(
          typeof antwort?.fehler === 'string'
            ? antwort.fehler
            : 'Der Beitrag konnte nicht gesendet werden.',
          typeof antwort?.code === 'string' ? antwort.code : '',
          anfrage.status,
        ),
      )
    })

    anfrage.addEventListener('error', () => {
      ablehnen(
        new ApiError(
          'Keine Verbindung zum Server. Bitte Internetverbindung prüfen.',
          'netz',
        ),
      )
    })

    anfrage.addEventListener('timeout', () => {
      ablehnen(
        new ApiError(
          'Das Senden hat zu lange gedauert. Bei langsamer Verbindung hilft es, weniger Bilder auf einmal zu senden.',
          'timeout',
        ),
      )
    })

    anfrage.send(formular)
  })
}

/** Baut die öffentliche URL eines hochgeladenen Bildes. */
export function bildUrl(dateiname: string): string {
  return asset(`uploads/bilder/${dateiname}`)
}
