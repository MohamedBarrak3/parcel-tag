import { holderName, ROLE_LABELS } from '../format'
import { ROLE_STYLES } from '../theme'
import { RoleIcon } from './Icons'

// Small chip with the role icon and label ("Driver")
export function RoleBadge({ role, className = '' }) {
  if (!role) return null
  return (
    <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-base font-semibold ${ROLE_STYLES[role]} ${className}`}>
      <RoleIcon role={role} className="h-4 w-4" />
      {ROLE_LABELS[role]}
    </span>
  )
}

// Who holds the box: name + role badge,
// grey dashed "Unknown badge" or "Unassigned" otherwise
function HolderTag({ holder, className = 'text-xl' }) {
  if (!holder || !holder.role) {
    return (
      <span className={`inline-flex items-center gap-2 rounded-md border-2 border-dashed border-slate-400 bg-slate-100 px-2 py-0.5 font-semibold text-slate-600 ${className}`}>
        {holder && <RoleIcon role={null} className="h-5 w-5" />}
        {holderName(holder)}
      </span>
    )
  }
  return (
    <span className={`inline-flex flex-wrap items-center gap-2 font-semibold ${className}`}>
      {holder.name}
      <RoleBadge role={holder.role} />
    </span>
  )
}

export default HolderTag
