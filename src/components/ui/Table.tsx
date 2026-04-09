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
  return <thead className="bg-slate-50/80 border-b border-slate-100">{children}</thead>
}

export function Th({ children, className }: TableProps) {
  return <th className={clsx('px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider', className)}>{children}</th>
}

export function Td({ children, className, colSpan }: TableProps & { colSpan?: number }) {
  return <td className={clsx('px-5 py-3.5 text-slate-700', className)} colSpan={colSpan}>{children}</td>
}

export function Tr({ children, className }: TableProps) {
  return <tr className={clsx('border-b border-slate-100 hover:bg-blue-50/30 transition-colors duration-150', className)}>{children}</tr>
}
