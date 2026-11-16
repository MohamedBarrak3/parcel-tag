import { useState } from 'react'
import { USING_MOCK } from './api'
import BoxDetail from './components/BoxDetail'
import BoxList from './components/BoxList'

function App() {
  const [selectedBoxId, setSelectedBoxId] = useState(null)

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <button type="button" onClick={() => setSelectedBoxId(null)} className="text-left">
            <div className="text-xl font-bold text-slate-900">Parcel Custody</div>
            <div className="text-sm text-slate-500">Who held each box, and what happened to it</div>
          </button>
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            Live · updates every 2 s
          </span>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">
        {selectedBoxId ? (
          <BoxDetail key={selectedBoxId} boxId={selectedBoxId} onBack={() => setSelectedBoxId(null)} />
        ) : (
          <BoxList onSelect={setSelectedBoxId} />
        )}
      </main>
      {USING_MOCK && (
        <div className="fixed right-4 bottom-4 rounded-lg bg-purple-700 px-3 py-1 text-sm font-bold tracking-wide text-white shadow">
          MOCK DATA
        </div>
      )}
    </div>
  )
}

export default App
