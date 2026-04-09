import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { demoAccounts } from '@/lib/mockData'
import { ROLE_LABELS } from '@/lib/constants'
import { UserCog, Briefcase, GraduationCap } from 'lucide-react'

const roleIcons = {
  coordinacion: UserCog,
  profesional: Briefcase,
  estudiante: GraduationCap,
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
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary">Fundaci&oacute;n Victoria Elena</h1>
          <p className="text-muted mt-1">Iniciar sesi&oacute;n</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-border p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-danger text-sm rounded-lg px-4 py-3">
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
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Ingresando...' : 'Iniciar sesión'}
            </Button>
          </form>
          <p className="text-center text-sm text-muted mt-4">
            ¿No tienes cuenta?{' '}
            <Link to="/registro" className="text-accent hover:underline">
              Regístrate
            </Link>
          </p>
        </div>

        {/* Quick Demo Access */}
        <div className="mt-6">
          <p className="text-center text-xs font-semibold uppercase tracking-wider text-muted mb-3">
            Acceso rápido de demostración
          </p>
          <div className="space-y-2">
            {demoAccounts.map(account => {
              const Icon = roleIcons[account.role]
              return (
                <button
                  key={account.role}
                  onClick={() => handleQuickLogin(account.role)}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-white rounded-lg border border-border hover:border-accent hover:bg-blue-50/50 transition-colors cursor-pointer text-left"
                >
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{account.name}</p>
                    <p className="text-xs text-muted">{ROLE_LABELS[account.role]} &middot; {account.email}</p>
                  </div>
                  <span className="text-xs text-accent font-medium">Entrar →</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
