import { reasonText } from '../labels'

// Who is responsible, grouped by person: "Driver B — a drop of 0.8 m, opening the lid"
function LiabilityCard({ liable }) {
  if (liable.length === 0) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
        <span className="text-2xl">✅</span>
        <div>
          <h2 className="font-semibold text-emerald-800">Nobody is responsible for damage</h2>
          <p className="text-sm text-emerald-700">No problem was recorded while anyone held this box.</p>
        </div>
      </div>
    )
  }

  const people = []
  for (const entry of liable) {
    let p = people.find((x) => x.badge_id === entry.badge_id)
    if (!p) {
      p = { badge_id: entry.badge_id, name: entry.name || 'Unknown badge', reasons: [] }
      people.push(p)
    }
    // the backend joins one person's problems with commas: "drop 0.8 m, tamper, temp_breach"
    for (const r of (entry.reason || '').split(',')) {
      if (r.trim()) p.reasons.push(reasonText(r.trim()))
    }
  }

  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
      <h2 className="mb-1 flex items-center gap-2 font-semibold text-red-800">
        <span className="text-xl">⚖️</span> Responsible
      </h2>
      <p className="mb-3 text-sm text-red-700">The person holding the box when each problem happened.</p>
      <ul className="flex flex-col gap-2">
        {people.map((p) => (
          <li key={p.badge_id} className="rounded-xl bg-white/70 px-4 py-3">
            <span className="font-semibold text-slate-900">{p.name}</span>
            <span className="text-slate-500"> · {p.reasons.length} problem{p.reasons.length > 1 ? 's' : ''}: </span>
            <span className="text-slate-700">{p.reasons.join(', ')}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default LiabilityCard
