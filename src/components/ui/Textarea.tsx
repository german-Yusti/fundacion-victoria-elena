import type { TextareaHTMLAttributes } from 'react'
import { clsx } from 'clsx'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export function Textarea({ label, error, className, id, ...props }: TextareaProps) {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={textareaId} className="block text-sm font-semibold text-slate-700">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={clsx(
          'w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-all duration-200 focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10',
          error && 'border-red-300 focus:border-red-400 focus:ring-red-500/10',
          className
        )}
        rows={3}
        {...props}
      />
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  )
}
