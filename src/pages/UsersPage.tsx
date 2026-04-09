import { useState, type FormEvent } from 'react'
import { useUsers } from '@/hooks/useUsers'
import { usePrograms } from '@/hooks/usePrograms'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Table, Thead, Th, Td, Tr } from '@/components/ui/Table'
import { Badge, statusBadgeVariant } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import { PageLoader } from '@/components/ui/Spinner'
import { ROLE_LABELS } from '@/lib/constants'
import { Plus } from 'lucide-react'

export default function UsersPage() {
  const { users, loading, createUser } = useUsers()
  const { programs } = usePrograms()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ fullName: '', email: '', password: '', role: 'profesional', programaId: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    const { error } = await createUser(form.email, form.password, form.fullName, form.role, form.programaId || undefined)
    if (error) {
      setError((error as any).message || 'Error al crear usuario')
    } else {
      setOpen(false)
      setForm({ fullName: '', email: '', password: '', role: 'profesional', programaId: '' })
    }
    setSaving(false)
  }

  if (loading) return <PageLoader />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Usuarios y roles</h1>
          <p className="text-muted text-sm mt-1">Administrar usuarios del sistema</p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus size={16} /> Nuevo usuario
        </Button>
      </div>

      <Card>
        <CardContent className="!p-0">
          <Table>
            <Thead>
              <tr>
                <Th>Nombre</Th>
                <Th>Email</Th>
                <Th>Rol</Th>
                <Th>Estado</Th>
              </tr>
            </Thead>
            <tbody>
              {users.map(user => (
                <Tr key={user.id}>
                  <Td className="font-medium">{user.full_name}</Td>
                  <Td>{user.email}</Td>
                  <Td>
                    {user.user_roles.map(r => (
                      <Badge key={r.id} variant="info" className="mr-1">
                        {ROLE_LABELS[r.role] || r.role}
                      </Badge>
                    ))}
                  </Td>
                  <Td>
                    <Badge variant={statusBadgeVariant(user.status)}>
                      {user.status === 'activo' ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </Td>
                </Tr>
              ))}
              {users.length === 0 && (
                <tr><Td className="text-center text-muted !py-8" colSpan={4}>No hay usuarios registrados</Td></tr>
              )}
            </tbody>
          </Table>
        </CardContent>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Crear usuario">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-50 text-danger text-sm rounded-lg px-4 py-3">{error}</div>}
          <Input label="Nombre completo" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} required />
          <Input label="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          <Input label="Contraseña" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} minLength={6} required />
          <Select
            label="Rol"
            value={form.role}
            onChange={e => setForm({ ...form, role: e.target.value })}
            options={[
              { value: 'coordinacion', label: 'Coordinación' },
              { value: 'profesional', label: 'Profesional' },
              { value: 'estudiante', label: 'Estudiante' },
            ]}
          />
          {form.role === 'profesional' && (
            <Select
              label="Programa asociado"
              value={form.programaId}
              onChange={e => setForm({ ...form, programaId: e.target.value })}
              options={programs.map(p => ({ value: p.id, label: p.nombre }))}
              placeholder="Seleccionar programa (opcional)"
            />
          )}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={saving}>{saving ? 'Creando...' : 'Crear usuario'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
