import { useState } from 'react'
import { getEverything } from './api'
import BoxDetail from './components/BoxDetail'
import BoxGone from './components/BoxGone'
import BoxList from './components/BoxList'
import OfflineBanner from './components/OfflineBanner'
import TopBar from './components/TopBar'
import { markArrivals } from './newEvents'
import { usePolling } from './usePolling'

// Every 2 s: boxes + all timelines, with new events marked
async function loadDashboard() {
  return markArrivals(await getEverything())
}

function Content({ data, error, selectedBoxId, onSelect }) {
  if (!data) {
    return (
      <p className="text-2xl text-slate-600">
        {error ? 'Waiting for the backend…' : 'Loading…'}
      </p>
    )
  }

  if (!selectedBoxId) {
    return <BoxList boxes={data.boxes} timelines={data.timelines} onSelect={onSelect} />
  }

  const box = data.boxes.find((b) => b.box_id === selectedBoxId)
  const timeline = data.timelines[selectedBoxId]
  if (!box || !timeline) return <BoxGone onBack={() => onSelect(null)} />
  return <BoxDetail box={box} timeline={timeline} onBack={() => onSelect(null)} />
}

function App() {
  const [selectedBoxId, setSelectedBoxId] = useState(null)
  const { data, error, lastRefresh } = usePolling(loadDashboard)

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <TopBar lastRefresh={lastRefresh} offline={Boolean(error)} />
      {error && <OfflineBanner error={error} />}
      <main className="mx-auto max-w-7xl px-6 py-5">
        <Content data={data} error={error} selectedBoxId={selectedBoxId} onSelect={setSelectedBoxId} />
      </main>
    </div>
  )
}

export default App
