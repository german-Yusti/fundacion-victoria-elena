import { useEffect, useState, useCallback } from 'react'
import { actividades as store, resolveActividad, generateId, now } from '@/lib/mockData'
import type { Actividad } from '@/lib/types'

interface Filters {
  search?: string
  status?: string
  programa_id?: string
}

export function useActivities(filters?: Filters) {
  const [activities, setActivities] = useState<Actividad[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(() => {
    setLoading(true)
    let result = store.map(resolveActividad)

    if (filters?.status) result = result.filter(a => a.status === filters.status)
    if (filters?.programa_id) result = result.filter(a => a.programa_id === filters.programa_id)
    if (filters?.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(a => a.nombre.toLowerCase().includes(q))
    }

    result.sort((a, b) => b.fecha.localeCompare(a.fecha))
    setActivities(result)
    setLoading(false)
  }, [filters?.search, filters?.status, filters?.programa_id])

  useEffect(() => { fetch() }, [fetch])

  const create = async (values: Record<string, any>) => {
    const newItem: Actividad = {
      id: generateId(),
      nombre: values.nombre,
      programa_id: values.programa_id,
      subprograma_id: values.subprograma_id || null,
      profesional_id: values.profesional_id,
      fecha: values.fecha,
      lugar: values.lugar || null,
      status: values.status || 'programada',
      created_at: now(),
      updated_at: now(),
    }
    store.push(newItem)
    fetch()
    return { error: null }
  }

  const update = async (id: string, values: Record<string, any>) => {
    const idx = store.findIndex(a => a.id === id)
    if (idx >= 0) {
      store[idx] = { ...store[idx], ...values, updated_at: now() }
    }
    fetch()
    return { error: null }
  }

  return { activities, loading, refetch: fetch, create, update }
}
