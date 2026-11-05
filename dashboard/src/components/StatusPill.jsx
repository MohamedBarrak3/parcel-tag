import { LEVELS } from '../theme'
import { LevelIcon } from './Icons'

const SIZES = {
  md: { pill: 'gap-1.5 px-3 py-1 text-lg', icon: 'h-5 w-5' },
  lg: { pill: 'gap-3 px-6 py-2 text-3xl', icon: 'h-9 w-9' },
}

// Colored pill with icon + label, for a box status or an event severity
function StatusPill({ level, size = 'md' }) {
  const style = LEVELS[level] ?? LEVELS.info
  const s = SIZES[size]
  return (
    <span className={`inline-flex items-center rounded-full font-bold uppercase tracking-wide ${style.solid} ${s.pill}`}>
      <LevelIcon level={level} className={s.icon} />
      {style.label}
    </span>
  )
}

export default StatusPill
