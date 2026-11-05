// Shown when the open box was deleted (demo reset)
function BoxGone({ onBack }) {
  return (
    <div className="flex flex-col items-start gap-6 rounded-2xl border-2 border-slate-300 bg-white p-10">
      <p className="text-3xl font-bold">This box no longer exists (demo was reset)</p>
      <button
        type="button"
        onClick={onBack}
        className="rounded-lg bg-slate-900 px-6 py-3 text-2xl font-semibold text-white hover:bg-slate-700"
      >
        &larr; Back to all boxes
      </button>
    </div>
  )
}

export default BoxGone
