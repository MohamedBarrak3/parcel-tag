import { useEffect, useState } from 'react'
import { getBoxes } from './api'

function App() {
  const [boxes, setBoxes] = useState([])

  useEffect(() => {
    getBoxes().then(setBoxes)
  }, [])

  return (
    <ul>
      {boxes.map((box) => (
        <li key={box.box_id}>
          {box.box_id} - {box.status} - {box.current_holder ? box.current_holder.name : 'unassigned'}
        </li>
      ))}
    </ul>
  )
}

export default App
