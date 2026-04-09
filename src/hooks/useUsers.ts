import { useEffect, useState, useCallback } from 'react'
import { profiles, userRoles, programas, generateId, now } from '@/lib/mockData'
import type { Profile, UserRole } from '@/lib/types'

export interface UserWithRole extends Profile {
  user_roles: UserRole[]
}

export function useUsers() {
  const [users, setUsers] = useState<UserWithRole[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(() => {
    setLoading(true)
    const result: UserWithRole[] = profiles
      .map(p => ({
        ...p,
        user_roles: userRoles.filter(r => r.user_id === p.id),
      }))
      .sort((a, b) => a.full_name.localeCompare(b.full_name))
    setUsers(result)
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const createUser = async (email: string, _password: string, fullName: string, role: string, programaId?: string) => {
    const id = generateId()
    profiles.push({
      id,
      full_name: fullName,
      email,
      status: 'activo',
      created_at: now(),
      updated_at: now(),
    })
    userRoles.push({
      id: generateId(),
      user_id: id,
      role: role as any,
      created_at: now(),
    })
    if (role === 'profesional' && programaId) {
      const idx = programas.findIndex(p => p.id === programaId)
      if (idx >= 0) programas[idx].profesional_id = id
    }
    fetch()
    return { error: null }
  }

  return { users, loading, refetch: fetch, createUser }
}

export function useProfesionales() {
  const [profesionales, setProfesionales] = useState<Profile[]>([])

  useEffect(() => {
    const profRoles = userRoles.filter(r => r.role === 'profesional' || r.role === 'coordinacion')
    const profIds = [...new Set(profRoles.map(r => r.user_id))]
    const result = profiles.filter(p => profIds.includes(p.id))
    setProfesionales(result)
  }, [])

  return profesionales
}
