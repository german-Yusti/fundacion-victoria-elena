import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Profile, AppRole } from '@/lib/types'
import { profiles, userRoles, demoAccounts } from '@/lib/mockData'

interface AuthState {
  session: { user: { id: string } } | null
  user: { id: string } | null
  profile: Profile | null
  roles: AppRole[]
  loading: boolean
  isCoordinacion: boolean
  isProfesional: boolean
  isEstudiante: boolean
}

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
  loginAsRole: (role: AppRole) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function buildState(profileId: string): AuthState {
  const profile = profiles.find(p => p.id === profileId) ?? null
  const roles = userRoles.filter(r => r.user_id === profileId).map(r => r.role)
  return {
    session: profile ? { user: { id: profileId } } : null,
    user: profile ? { id: profileId } : null,
    profile,
    roles,
    loading: false,
    isCoordinacion: roles.includes('coordinacion'),
    isProfesional: roles.includes('profesional'),
    isEstudiante: roles.includes('estudiante'),
  }
}

const emptyState: AuthState = {
  session: null, user: null, profile: null, roles: [],
  loading: false, isCoordinacion: false, isProfesional: false, isEstudiante: false,
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(emptyState)

  const signIn = async (email: string, _password: string) => {
    const account = demoAccounts.find(a => a.email === email)
    if (account) {
      setState(buildState(account.profileId))
      return { error: null }
    }
    // Try matching any profile by email
    const profile = profiles.find(p => p.email === email)
    if (profile) {
      setState(buildState(profile.id))
      return { error: null }
    }
    return { error: new Error('Credenciales inválidas') }
  }

  const signUp = async (_email: string, _password: string, _fullName: string) => {
    return { error: null }
  }

  const signOut = async () => {
    setState(emptyState)
  }

  const refreshProfile = async () => {
    if (state.user) setState(buildState(state.user.id))
  }

  const loginAsRole = (role: AppRole) => {
    const account = demoAccounts.find(a => a.role === role)
    if (account) setState(buildState(account.profileId))
  }

  return (
    <AuthContext.Provider value={{ ...state, signIn, signUp, signOut, refreshProfile, loginAsRole }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
