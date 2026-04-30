/** Returns today's date as an ISO string (YYYY-MM-DD). */
export function today(): string {
  return new Date().toISOString().split('T')[0]
}

/** Pluralise a word based on count. */
export function pluralise(count: number, singular: string, plural = `${singular}s`): string {
  return count === 1 ? singular : plural
}

/** Build a URLSearchParams string from a plain record. */
export function buildQuery(params: Record<string, string | number>): string {
  return new URLSearchParams(
    Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)]))
  ).toString()
}

/** Clamp a number between min and max (inclusive). */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/** Escape special regex characters in a string. */
export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
