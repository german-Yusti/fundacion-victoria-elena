import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { demoAccounts } from '@/lib/mockData'
import { ROLE_LABELS } from '@/lib/constants'
import { UserCog, Briefcase, GraduationCap, Shield, ArrowRight } from 'lucide-react'

const roleIcons = {
  coordinacion: UserCog,
  profesional: Briefcase,
  estudiante: GraduationCap,
}

const roleColors = {
  coordinacion: 'from-blue-500 to-blue-600',
  profesional: 'from-purple-500 to-purple-600',
  estudiante: 'from-emerald-500 to-emerald-600',
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn, loginAsRole } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await signIn(email, password)
    if (error) {
      setError('Credenciales inválidas. Verifica tu email y contraseña.')
      setLoading(false)
    } else {
      navigate('/', { replace: true })
    }
  }

  const handleQuickLogin = (role: 'coordinacion' | 'profesional' | 'estudiante') => {
    loginAsRole(role)
    navigate('/', { replace: true })
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[540px] bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white flex-col justify-between p-12 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Shield size={24} />
            </div>
          </div>
          <h1 className="text-3xl font-bold mt-6 leading-tight">
            Fundación<br />Victoria Elena
          </h1>
          <p className="text-blue-200/70 mt-4 text-base leading-relaxed max-w-sm">
            Sistema de gestión integral para el seguimiento de estudiantes, programas y actividades de la fundación.
          </p>
        </div>

        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3 text-sm text-blue-200/60">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
              <span className="text-base">📊</span>
            </div>
            <span>Dashboard ejecutivo con indicadores clave</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-blue-200/60">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
              <span className="text-base">👥</span>
            </div>
            <span>Gestión de estudiantes y programas</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-blue-200/60">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
              <span className="text-base">📋</span>
            </div>
            <span>Seguimiento de asistencia y participación</span>
          </div>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex-1 flex items-center justify-center bg-slate-50 px-6">
        <div className="w-full max-w-[420px]">
          {/* Mobile brand */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Shield size={20} className="text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Fundación Victoria Elena</h1>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Bienvenido</h2>
            <p className="text-slate-500 mt-1">Ingresa tus credenciales para acceder al sistema</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-200/60 p-7">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 font-medium border border-red-100">
                  {error}
                </div>
              )}
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                required
              />
              <Input
                label="Contraseña"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Tu contraseña"
                required
              />
              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? 'Ingresando...' : 'Iniciar sesión'}
              </Button>
            </form>
            <p className="text-center text-sm text-slate-500 mt-5">
              ¿No tienes cuenta?{' '}
              <Link to="/registro" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">
                Regístrate
              </Link>
            </p>
          </div>

          {/* Quick Demo Access */}
          <div className="mt-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 bg-slate-200" />
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                Demo rápido
              </p>
              <div className="h-px flex-1 bg-slate-200" />
            </div>
            <div className="space-y-2.5">
              {demoAccounts.map(account => {
                const Icon = roleIcons[account.role]
                const gradient = roleColors[account.role]
                return (
                  <button
                    key={account.role}
                    onClick={() => handleQuickLogin(account.role)}
                    className="w-full flex items-center gap-4 px-5 py-4 bg-white rounded-2xl border border-slate-200/60 hover:border-blue-300 hover:shadow-md hover:shadow-blue-500/5 transition-all duration-200 cursor-pointer text-left group"
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-sm`}>
                      <Icon size={18} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800">{account.name}</p>
                      <p className="text-xs text-slate-400">{ROLE_LABELS[account.role]} &middot; {account.email}</p>
                    </div>
                    <ArrowRight size={16} className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
