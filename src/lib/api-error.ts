/**
 * Turning backend failures into something a person can act on.
 *
 * The API answers with free-form English prose in `error` ("Payment service not
 * configured", "limit: must be between 1 and 50"), and the classifieds client
 * used to render that verbatim — wrapped in `API Error (503): …` — straight
 * into the UI of an all-Spanish site.
 *
 * `ApiError` keeps the original text for logs while carrying the status code,
 * and `translateApiError` maps that status onto Spanish. Mapping by status is
 * the ceiling until the API exposes stable error codes; until then the caller's
 * `fallback` supplies the context that the status alone cannot ("Error al
 * guardar" vs "Error al subir la foto").
 */
export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

const BY_STATUS: Record<number, string> = {
  401: 'Se cerró tu sesión. Iniciá sesión de nuevo y reintentá.',
  403: 'No tenés permiso para hacer esto.',
  404: 'No encontramos esta publicación. Puede que la hayan eliminado.',
  409: 'Alguien más modificó esto mientras trabajabas. Recargá la página.',
  413: 'El archivo pesa demasiado.',
  429: 'Hiciste demasiados intentos seguidos. Esperá un momento.',
}

/** Returns a message safe to show to the user. Never leaks backend prose. */
export function translateApiError(err: unknown, fallback: string): string {
  if (err instanceof ApiError) {
    const mapped = BY_STATUS[err.status]
    if (mapped) return mapped
    if (err.status >= 500) {
      return 'El servicio no está disponible en este momento. Probá de nuevo en unos minutos.'
    }
    return fallback
  }

  // fetch() rejects with a TypeError when the request never reached the server.
  if (err instanceof TypeError) {
    return 'No pudimos conectarnos. Revisá tu conexión e intentá otra vez.'
  }

  return fallback
}
