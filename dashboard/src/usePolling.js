import { useEffect, useState } from 'react'

// Calls fetcher() now, then again 2 s after each answer.
// If a call fails, the last good data stays on screen and `error` is set.
export function usePolling(fetcher, intervalMs = 2000) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [lastRefresh, setLastRefresh] = useState(null)

  useEffect(() => {
    let stopped = false
    let timer

    async function tick() {
      try {
        const result = await fetcher()
        if (stopped) return
        setData(result)
        setError(null)
        setLastRefresh(new Date())
      } catch (err) {
        if (stopped) return
        setError(err)
      }
      timer = setTimeout(tick, intervalMs)
    }

    tick()
    return () => {
      stopped = true
      clearTimeout(timer)
    }
  }, [fetcher, intervalMs])

  return { data, error, lastRefresh }
}
