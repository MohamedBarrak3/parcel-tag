import { useEffect } from 'react'

function OfflineBanner({ error }) {
  // Keep the real cause in the browser console for debugging
  useEffect(() => {
    console.warn('Refresh failed:', error)
  }, [error])

  const text =
    error.status === 0
      ? 'Backend offline, retrying…'
      : `Backend error (HTTP ${error.status}), retrying…`

  return (
    <div role="alert" className="flex items-center gap-3 bg-red-700 px-6 py-3 text-2xl font-bold text-white">
      <svg viewBox="0 0 24 24" className="h-8 w-8 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
        <path d="M12 3 2 21h20L12 3z" strokeLinejoin="round" />
        <path d="M12 10v5M12 18v.5" strokeLinecap="round" />
      </svg>
      {text}
      <span className="ml-auto text-lg font-medium text-red-100">Showing the last data received</span>
    </div>
  )
}

export default OfflineBanner
