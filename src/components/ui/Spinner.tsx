export function Spinner({ className = '' }: { className?: string }) {
  return (
    <div className={`inline-block h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent ${className}`} role="status">
      <span className="sr-only">Cargando...</span>
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <Spinner className="h-8 w-8" />
      <p className="text-sm text-slate-400 font-medium">Cargando...</p>
    </div>
  )
}
