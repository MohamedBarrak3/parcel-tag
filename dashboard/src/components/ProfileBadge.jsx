// The handling profile chosen on the tag: fragile or not, and the temperature mode with its alert limits
const MODE_NAMES = {
  cold: 'Cold chain',
  room: 'Room temperature',
  medication: 'Medication',
}

function ProfileBadge({ profile, size = 'md' }) {
  const text = size === 'sm' ? 'text-sm' : 'text-base'

  if (!profile) {
    return <span className={`${text} text-slate-400`}>Handling profile not received yet</span>
  }

  return (
    <div className="flex flex-wrap gap-2">
      <span
        title={profile.fragile ? 'Every drop and every hit is an alert' : 'Only drops of 0.30 m or more are alerts'}
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-medium ${text} ${
          profile.fragile ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'
        }`}
      >
        {profile.fragile ? '⚠️ Fragile' : 'Not fragile'}
      </span>
      <span
        title={`An alert is raised below ${profile.temp_min_c} °C or above ${profile.temp_max_c} °C`}
        className={`inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-3 py-1 font-medium text-sky-700 ${text}`}
      >
        🌡️ {MODE_NAMES[profile.temp_mode] ?? profile.temp_mode} · {profile.temp_min_c}–{profile.temp_max_c} °C
      </span>
    </div>
  )
}

export default ProfileBadge
