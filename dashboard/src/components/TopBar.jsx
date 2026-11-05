import { useState } from 'react'
import { MOCK_MODE, resetDemo } from '../api'

function LiveIndicator({ lastRefresh, offline }) {
  if (offline) {
    return (
      <span className="flex items-center gap-2 text-lg font-semibold text-red-700">
        <span className="h-3 w-3 rounded-full bg-red-600" />
        Offline
      </span>
    )
  }
  return (
    <span className="flex items-center gap-2 text-lg font-semibold text-green-800">
      <span className="h-3 w-3 animate-pulse rounded-full bg-green-600" />
      {MOCK_MODE ? 'Mock data' : 'Live'}
      {lastRefresh && (
        <span className="font-normal text-slate-600">· updated {lastRefresh.toLocaleTimeString()}</span>
      )}
    </span>
  )
}

function ResetButton() {
  const [busy, setBusy] = useState(false)
  const [failed, setFailed] = useState(false)

  if (MOCK_MODE) {
    return (
      <button type="button" disabled className="cursor-not-allowed rounded-lg border-2 border-slate-300 px-4 py-2 text-lg text-slate-500">
        Mock mode: nothing to reset
      </button>
    )
  }

  async function handleClick() {
    if (!window.confirm('Reset the demo? This deletes every recorded event.')) return
    setBusy(true)
    setFailed(false)
    try {
      await resetDemo()
    } catch {
      setFailed(true)
    }
    setBusy(false)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy}
      className="rounded-lg border-2 border-slate-400 bg-white px-4 py-2 text-lg font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-50"
    >
      {busy ? 'Resetting…' : failed ? 'Reset failed, try again' : 'Reset demo'}
    </button>
  )
}

function TopBar({ lastRefresh, offline }) {
  return (
    <header className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b-2 border-slate-200 bg-white px-6 py-3">
      <h1 className="text-3xl font-extrabold tracking-tight">Parcel Custody</h1>
      <LiveIndicator lastRefresh={lastRefresh} offline={offline} />
      <div className="ml-auto">
        <ResetButton />
      </div>
    </header>
  )
}

export default TopBar
