import { describe, it, expect } from 'vitest'
import { today, clamp, buildQuery, escapeRegex, pluralise } from '@/lib/utils'

describe('today()', () => {
  it('returns a string in YYYY-MM-DD format', () => {
    expect(today()).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
  it('returns today\'s date', () => {
    const d = new Date().toISOString().split('T')[0]
    expect(today()).toBe(d)
  })
})

describe('clamp()', () => {
  it('returns value when within range',   () => expect(clamp(5, 1, 10)).toBe(5))
  it('returns min when value is too low', () => expect(clamp(0, 1, 10)).toBe(1))
  it('returns max when value is too high',() => expect(clamp(15,1, 10)).toBe(10))
  it('handles equal min and max',         () => expect(clamp(5, 5, 5)).toBe(5))
})

describe('buildQuery()', () => {
  it('builds a valid query string', () => {
    const q = buildQuery({ from: 'JFK', to: 'Manhattan', pax: 2 })
    expect(q).toContain('from=JFK')
    expect(q).toContain('to=Manhattan')
    expect(q).toContain('pax=2')
  })
  it('handles special characters', () => {
    const q = buildQuery({ from: 'New York, USA' })
    expect(decodeURIComponent(q)).toContain('New York, USA')
  })
})

describe('escapeRegex()', () => {
  it('escapes special regex chars', () => {
    expect(escapeRegex('a.b*c')).toBe('a\\.b\\*c')
    expect(escapeRegex('(test)')).toBe('\\(test\\)')
    expect(escapeRegex('hello')).toBe('hello')
  })
  it('produces a valid regex', () => {
    const pattern = escapeRegex('1+1=2')
    expect(() => new RegExp(pattern)).not.toThrow()
  })
})

describe('pluralise()', () => {
  it('returns singular for count=1', () => expect(pluralise(1, 'passenger')).toBe('passenger'))
  it('returns plural  for count=0', () => expect(pluralise(0, 'passenger')).toBe('passengers'))
  it('returns plural  for count>1', () => expect(pluralise(3, 'passenger')).toBe('passengers'))
  it('uses custom plural',          () => expect(pluralise(2, 'person', 'people')).toBe('people'))
})
