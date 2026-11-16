function BackendBanner({ error }) {
  return (
    <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
      <span className="text-xl">🔌</span>
      <div>
        <p className="font-semibold text-red-700">Cannot reach the backend</p>
        <p className="text-sm text-red-600">
          Is the backend window still running? Showing the last data received. ({error})
        </p>
      </div>
    </div>
  )
}

export default BackendBanner
