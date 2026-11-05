function LiabilityCard({ liable }) {
  return (
    <div className="rounded-2xl border-2 border-red-300 bg-red-50 p-6">
      <h2 className="mb-3 text-2xl font-bold text-gray-900">Liability</h2>
      {liable.length === 0 ? (
        <p className="text-xl text-gray-600">No liable party</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {liable.map((entry, i) => (
            <li key={`${entry.badge_id}-${entry.reason}-${i}`} className="text-xl text-gray-800">
              <span className="font-semibold">{entry.name || 'Unknown badge'}</span> — {entry.reason}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default LiabilityCard
