import { faultText, isFault } from '../format'
import HolderTag from './HolderTag'
import { LevelIcon } from './Icons'

// One liable person: WHO comes from the API's liable list,
// WHY is written from that person's non-expected warning/severe events.
function LiableRow({ entry, events }) {
  const faults = events.filter((e) => isFault(e) && e.holder?.badge_id === entry.badge_id)
  const reasons = [...new Set(faults.map(faultText))]
  const holder = faults[0]?.holder

  return (
    <li className="flex flex-wrap items-center gap-x-3 gap-y-1 text-2xl">
      {holder ? <HolderTag holder={holder} className="text-2xl" /> : <span className="font-semibold">{entry.name}</span>}
      <span className="text-red-950">— {reasons.length ? reasons.join(', ') : entry.reason}</span>
    </li>
  )
}

function LiabilityCard({ liable, events }) {
  const unassignedFaults = events.filter((e) => isFault(e) && !e.holder).length

  if (liable.length === 0) {
    return (
      <section className="flex items-center gap-4 rounded-2xl border-2 border-green-700 bg-green-50 p-5 text-green-900">
        <LevelIcon level="ok" className="h-12 w-12" />
        <div>
          <h2 className="text-3xl font-bold">No fault recorded</h2>
          {unassignedFaults > 0 && (
            <p className="text-xl">
              {unassignedFaults} problem(s) happened before anyone took the box (unassigned).
            </p>
          )}
        </div>
      </section>
    )
  }

  return (
    <section className="flex gap-4 rounded-2xl border-2 border-red-700 bg-red-50 p-5">
      <LevelIcon level="severe" className="h-12 w-12 text-red-700" />
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold uppercase tracking-wide text-red-800">Liable</h2>
        <ul className="flex flex-col gap-2">
          {liable.map((entry) => (
            <LiableRow key={entry.badge_id} entry={entry} events={events} />
          ))}
        </ul>
        {unassignedFaults > 0 && (
          <p className="text-lg text-slate-700">
            Plus {unassignedFaults} problem(s) before anyone took the box (unassigned).
          </p>
        )}
      </div>
    </section>
  )
}

export default LiabilityCard
