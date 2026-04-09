import { useEffect, useState, useCallback } from 'react'
import { evidencias as store, resolveEvidencia, generateId, now } from '@/lib/mockData'
import type { Evidencia } from '@/lib/types'

export function useEvidence() {
  const [evidences, setEvidences] = useState<Evidencia[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(() => {
    setLoading(true)
    const resolved = store.map(resolveEvidencia).sort((a, b) => b.created_at.localeCompare(a.created_at))
    setEvidences(resolved)
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const create = async (values: { actividad_id: string; tipo: string; url: string; comentario?: string; subido_por: string }) => {
    store.push({
      id: generateId(),
      actividad_id: values.actividad_id,
      tipo: values.tipo as any,
      url: values.url,
      comentario: values.comentario || null,
      subido_por: values.subido_por,
      status: 'activa',
      created_at: now(),
    })
    fetch()
    return { error: null }
  }

  return { evidences, loading, refetch: fetch, create }
}
