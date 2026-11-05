// Colors and labels for box status and event severity.
// Color is never used alone: every place also shows an icon and the label.

export const LEVELS = {
  ok: {
    label: 'OK',
    solid: 'bg-green-700 text-white',
    soft: 'border-green-700 bg-green-50 text-green-900',
    dot: 'bg-green-700',
  },
  warning: {
    label: 'Warning',
    solid: 'bg-amber-400 text-slate-900',
    soft: 'border-amber-500 bg-amber-50 text-amber-900',
    dot: 'bg-amber-500',
  },
  severe: {
    label: 'Severe',
    solid: 'bg-red-700 text-white',
    soft: 'border-red-700 bg-red-50 text-red-900',
    dot: 'bg-red-700',
  },
  info: {
    label: 'Info',
    solid: 'bg-slate-500 text-white',
    soft: 'border-slate-300 bg-white text-slate-800',
    dot: 'bg-slate-400',
  },
}

export const ROLE_STYLES = {
  warehouse: 'bg-indigo-100 text-indigo-900 border-indigo-300',
  driver: 'bg-sky-100 text-sky-900 border-sky-300',
  client: 'bg-violet-100 text-violet-900 border-violet-300',
}
