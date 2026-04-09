import type { ReactNode } from 'react'
import { clsx } from 'clsx'

interface TableProps {
  children: ReactNode
  className?: string
}

export function Table({ children, className }: TableProps) {
  return (
    <div className={clsx('overflow-x-auto', className)}>
      <table className="w-full text-sm text-left">
        {children}
      </table>
    </div>
  )
}

export function Thead({ children }: { children: ReactNode }) {
  return <thead className="bg-surface-alt border-b border-border">{children}</thead>
}

export function Th({ children, className }: TableProps) {
  return <th className={clsx('px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider', className)}>{children}</th>
}

export function Td({ children, className, colSpan }: TableProps & { colSpan?: number }) {
  return <td className={clsx('px-4 py-3 text-gray-700', className)} colSpan={colSpan}>{children}</td>
}

export function Tr({ children, className }: TableProps) {
  return <tr className={clsx('border-b border-border hover:bg-surface/50', className)}>{children}</tr>
}
