export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://todomotor.uy'

export const SITE_NAME = 'TodoMotor Uruguay'

export const SITE_LOGO = `${SITE_URL}/brand/todomotor-mark.svg`

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString()
}
