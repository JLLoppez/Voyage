'use client'

import { useState, useEffect, useCallback } from 'react'

export interface FetchState<T> {
  data:    T | null
  loading: boolean
  error:   string | null
  refetch: () => void
}

export function useAdminFetch<T>(url: string): FetchState<T> {
  const [data,    setData]    = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(url, { credentials: 'include' })
      if (res.status === 401) { window.location.href = '/admin/login'; return }
      if (res.status === 403) { setError('You do not have permission to view this.'); return }
      if (!res.ok) { setError(`Failed to load data (${res.status})`); return }
      const json = await res.json()
      setData(json.data)
    } catch {
      setError('Network error — please check your connection.')
    } finally {
      setLoading(false)
    }
  }, [url])

  useEffect(() => { void load() }, [load])

  return { data, loading, error, refetch: load }
}
