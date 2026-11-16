// The handling profile chosen on the tag: fragile or not, and the temperature mode with its alert limits
const MODE_NAMES = {
  cold: 'Cold',
  room: 'Room temp',
  medication: 'Medication',
}

function ProfileBadge({ profile }) {
  if (!profile) {
    return <div className="text-xl text-gray-400">No profile sent yet</div>
  }

  return (
    <div className="flex flex-wrap gap-3">
      <span
        className={`rounded-full px-4 py-1 text-xl font-semibold ${
          profile.fragile ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-700'
        }`}
      >
        {profile.fragile ? 'Fragile' : 'Not fragile'}
      </span>
      <span className="rounded-full bg-blue-100 px-4 py-1 text-xl font-semibold text-blue-800">
        {MODE_NAMES[profile.temp_mode] ?? profile.temp_mode} {profile.temp_min_c}–{profile.temp_max_c} °C
      </span>
    </div>
  )
}

export default ProfileBadge
