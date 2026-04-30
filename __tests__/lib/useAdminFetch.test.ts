import { describe, it, expect, vi, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useAdminFetch } from '@/lib/useAdminFetch'

afterEach(() => vi.restoreAllMocks())

describe('useAdminFetch()', () => {
  it('returns data on success', async () => {
    const mockData = [{ id: '1', name: 'Test' }]
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true, status: 200,
      json: async () => ({ data: mockData }),
    }))

    const { result } = renderHook(() => useAdminFetch('/api/admin/test'))
    expect(result.current.loading).toBe(true)
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.data).toEqual(mockData)
    expect(result.current.error).toBeNull()
  })

  it('sets error on non-ok response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false, status: 500,
      json: async () => ({}),
    }))

    const { result } = renderHook(() => useAdminFetch('/api/admin/test'))
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.data).toBeNull()
    expect(result.current.error).toMatch(/500/)
  })

  it('sets error on network failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')))

    const { result } = renderHook(() => useAdminFetch('/api/admin/test'))
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.error).toMatch(/network/i)
  })
})
