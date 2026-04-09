import { useEffect, useState, useCallback } from 'react'
import { subprogramas as store, resolveSubprograma, generateId, now } from '@/lib/mockData'
import type { Subprograma } from '@/lib/types'

export function useSubprograms() {
  const [subprograms, setSubprograms] = useState<Subprograma[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(() => {
    setLoading(true)
    const resolved = store.map(resolveSubprograma).sort((a, b) => a.nombre.localeCompare(b.nombre))
    setSubprograms(resolved)
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const create = async (values: { nombre: string; descripcion?: string; programa_id: string; status: string }) => {
    const newItem: Subprograma = {
      id: generateId(),
      nombre: values.nombre,
      descripcion: values.descripcion || null,
      programa_id: values.programa_id,
      status: values.status as any,
      created_at: now(),
      updated_at: now(),
    }
    store.push(newItem)
    fetch()
    return { error: null }
  }

  const update = async (id: string, values: Partial<Subprograma>) => {
    const idx = store.findIndex(s => s.id === id)
    if (idx >= 0) {
      store[idx] = { ...store[idx], ...values, updated_at: now() }
    }
    fetch()
    return { error: null }
  }

  return { subprograms, loading, refetch: fetch, create, update }
}
