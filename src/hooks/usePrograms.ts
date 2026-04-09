import { useEffect, useState, useCallback } from 'react'
import { programas as store, resolvePrograma, generateId, now } from '@/lib/mockData'
import type { Programa } from '@/lib/types'

export function usePrograms() {
  const [programs, setPrograms] = useState<Programa[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(() => {
    setLoading(true)
    const resolved = store.map(resolvePrograma).sort((a, b) => a.nombre.localeCompare(b.nombre))
    setPrograms(resolved)
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const create = async (values: { nombre: string; descripcion?: string; profesional_id?: string; status: string }) => {
    const newItem: Programa = {
      id: generateId(),
      nombre: values.nombre,
      descripcion: values.descripcion || null,
      profesional_id: values.profesional_id || null,
      status: values.status as any,
      created_at: now(),
      updated_at: now(),
    }
    store.push(newItem)
    fetch()
    return { error: null }
  }

  const update = async (id: string, values: Partial<Programa>) => {
    const idx = store.findIndex(p => p.id === id)
    if (idx >= 0) {
      store[idx] = { ...store[idx], ...values, updated_at: now() }
    }
    fetch()
    return { error: null }
  }

  return { programs, loading, refetch: fetch, create, update }
}
