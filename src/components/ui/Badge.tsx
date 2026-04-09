import { clsx } from 'clsx'
import type { ReactNode } from 'react'

interface BadgeProps {
  variant?: 'success' | 'warning' | 'danger' | 'neutral' | 'info'
  children: ReactNode
  className?: string
}

const variantClasses = {
  success: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/60',
  warning: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200/60',
  danger: 'bg-red-50 text-red-700 ring-1 ring-red-200/60',
  neutral: 'bg-slate-50 text-slate-600 ring-1 ring-slate-200/60',
  info: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200/60',
}

export function Badge({ variant = 'neutral', children, className }: BadgeProps) {
  return (
    <span className={clsx('inline-flex items-center rounded-lg px-2.5 py-1 text-[11px] font-semibold tracking-wide', variantClasses[variant], className)}>
      {children}
    </span>
  )
}

export function statusBadgeVariant(status: string): BadgeProps['variant'] {
  const map: Record<string, BadgeProps['variant']> = {
    activo: 'success',
    activa: 'success',
    inactivo: 'neutral',
    inactiva: 'neutral',
    seguimiento_especial: 'warning',
    programada: 'info',
    realizada: 'success',
    cancelada: 'danger',
  }
  return map[status] || 'neutral'
}
