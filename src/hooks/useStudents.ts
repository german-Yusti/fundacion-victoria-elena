import { useEffect, useState, useCallback } from 'react'
import { estudiantes as store, resolveEstudiante, generateId, now } from '@/lib/mockData'
import type { Estudiante } from '@/lib/types'

interface Filters {
  search?: string
  status?: string
  programa_id?: string
  subprograma_id?: string
}

export function useStudents(filters?: Filters) {
  const [students, setStudents] = useState<Estudiante[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(() => {
    setLoading(true)
    let result = store.map(resolveEstudiante)

    if (filters?.status) result = result.filter(s => s.status === filters.status)
    if (filters?.programa_id) result = result.filter(s => s.programa_id === filters.programa_id)
    if (filters?.subprograma_id) result = result.filter(s => s.subprograma_id === filters.subprograma_id)
    if (filters?.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(s =>
        s.nombres.toLowerCase().includes(q) ||
        s.apellidos.toLowerCase().includes(q) ||
        s.numero_documento.includes(q)
      )
    }

    result.sort((a, b) => a.apellidos.localeCompare(b.apellidos))
    setStudents(result)
    setLoading(false)
  }, [filters?.search, filters?.status, filters?.programa_id, filters?.subprograma_id])

  useEffect(() => { fetch() }, [fetch])

  const create = async (values: Record<string, any>) => {
    const newItem: Estudiante = {
      id: generateId(),
      nombres: values.nombres,
      apellidos: values.apellidos,
      tipo_documento: values.tipo_documento,
      numero_documento: values.numero_documento,
      fecha_nacimiento: values.fecha_nacimiento || null,
      fecha_ingreso: values.fecha_ingreso,
      programa_id: values.programa_id,
      subprograma_id: values.subprograma_id || null,
      acudiente_nombre: values.acudiente_nombre || null,
      acudiente_telefono: values.acudiente_telefono || null,
      status: values.status || 'activo',
      autorizacion_datos: values.autorizacion_datos ?? false,
      autorizacion_imagen: values.autorizacion_imagen ?? false,
      created_at: now(),
      updated_at: now(),
    }
    store.push(newItem)
    fetch()
    return { error: null }
  }

  const update = async (id: string, values: Record<string, any>) => {
    const idx = store.findIndex(s => s.id === id)
    if (idx >= 0) {
      store[idx] = { ...store[idx], ...values, updated_at: now() }
    }
    fetch()
    return { error: null }
  }

  return { students, loading, refetch: fetch, create, update }
}
