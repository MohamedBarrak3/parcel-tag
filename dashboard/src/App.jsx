import { useState } from 'react'
import { USING_MOCK } from './api'
import BoxDetail from './components/BoxDetail'
import BoxList from './components/BoxList'

function App() {
  const [selectedBoxId, setSelectedBoxId] = useState(null)

  return (
    <>
      {selectedBoxId ? (
        <BoxDetail key={selectedBoxId} boxId={selectedBoxId} onBack={() => setSelectedBoxId(null)} />
      ) : (
        <BoxList onSelect={setSelectedBoxId} />
      )}
      {USING_MOCK && (
        <div className="fixed right-4 bottom-4 rounded-lg bg-purple-700 px-3 py-1 text-sm font-bold tracking-wide text-white shadow">
          MOCK DATA
        </div>
      )}
    </>
  )
}

export default App
