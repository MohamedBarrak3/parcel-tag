function BackendBanner({ error }) {
  return (
    <div className="mb-8 rounded-2xl border-2 border-red-500 bg-red-100 p-6">
      <p className="text-2xl font-bold text-red-700">Cannot reach the backend</p>
      <p className="mt-1 text-lg text-red-600">{error}</p>
    </div>
  )
}

export default BackendBanner
