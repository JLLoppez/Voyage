import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ ok: true, data }, { status })
}

export function created<T>(data: T) {
  return ok(data, 201)
}

export function error(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status })
}

export function validationError(err: ZodError) {
  const fields: Record<string, string> = {}
  err.issues.forEach(issue => {
    const key = issue.path.join('.')
    if (!fields[key]) fields[key] = issue.message
  })
  return NextResponse.json(
    { ok: false, error: 'Validation failed', fields },
    { status: 422 }
  )
}

export function unauthorized(message = 'Unauthorised') {
  return error(message, 401)
}

export function forbidden(message = 'Forbidden') {
  return error(message, 403)
}

export function notFound(message = 'Not found') {
  return error(message, 404)
}

export function tooManyRequests(resetAt: number) {
  const retryAfter = Math.ceil((resetAt - Date.now()) / 1000)
  return NextResponse.json(
    { ok: false, error: 'Too many requests. Please try again later.' },
    { status: 429, headers: { 'Retry-After': String(retryAfter) } }
  )
}

export function serverError(message = 'Internal server error') {
  return error(message, 500)
}
