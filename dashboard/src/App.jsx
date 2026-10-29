import { useState } from 'react'
import BoxDetail from './components/BoxDetail'
import BoxList from './components/BoxList'

function App() {
  const [selectedBoxId, setSelectedBoxId] = useState(null)

  if (selectedBoxId) {
    return <BoxDetail boxId={selectedBoxId} onBack={() => setSelectedBoxId(null)} />
  }

  return <BoxList onSelect={setSelectedBoxId} />
}

export default App
