// Small inline SVG icons (24x24, drawn with lines, take the text color)

function Svg({ className = 'h-6 w-6', children }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`shrink-0 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

const EVENT_PATHS = {
  // badge card
  tap: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="9" cy="11" r="2" />
      <path d="M6 16c.6-1.5 1.7-2 3-2s2.4.5 3 2M15 10h3M15 13h3" />
    </>
  ),
  // arrow falling onto the ground
  drop: <path d="M12 3v12M6.5 10 12 15.5 17.5 10M4 20h16" />,
  // burst
  impact: <path d="m12 2 2 6 6-2-3 5 5 3-6 1 1 6-5-4-5 4 1-6-6-1 5-3-3-5 6 2z" />,
  // two arrows swapping top and bottom
  upside_down: <path d="M7 4v15M3.5 15.5 7 19l3.5-3.5M17 20V5M13.5 8.5 17 5l3.5 3.5" />,
  // open padlock = lid opened
  tamper: (
    <>
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 7.6-1.7M12 15v2" />
    </>
  ),
  // thermometer
  temp_breach: (
    <>
      <path d="M14 14.8V4.5a2 2 0 0 0-4 0v10.3a4 4 0 1 0 4 0z" />
      <path d="M12 9v7" />
    </>
  ),
}

export function EventIcon({ type, className }) {
  return <Svg className={className}>{EVENT_PATHS[type] ?? <circle cx="12" cy="12" r="4" />}</Svg>
}

const ROLE_PATHS = {
  warehouse: <path d="M3 21V9l9-5 9 5v12M7 21v-8h10v8M7 17h10" />,
  driver: (
    <>
      <path d="M2 6h12v10H2zM14 9h4l3 3.5V16h-7" />
      <circle cx="6" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </>
  ),
  client: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" />
    </>
  ),
}

// role null (unknown badge) shows a question mark
export function RoleIcon({ role, className }) {
  return (
    <Svg className={className}>
      {ROLE_PATHS[role] ?? (
        <>
          <circle cx="12" cy="12" r="9.5" />
          <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7M12 17v.5" />
        </>
      )}
    </Svg>
  )
}

const LEVEL_PATHS = {
  ok: (
    <>
      <circle cx="12" cy="12" r="9.5" />
      <path d="m7.5 12 3 3 6-6" />
    </>
  ),
  warning: <path d="M12 3 2 20.5h20L12 3zM12 10v4.5M12 17.5v.5" />,
  severe: <path d="M7.9 2h8.2L22 7.9v8.2L16.1 22H7.9L2 16.1V7.9zM15 9l-6 6M9 9l6 6" />,
  info: (
    <>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M12 11v6M12 7.5v.5" />
    </>
  ),
}

// For box status (ok/warning/severe) and event severity (info/warning/severe)
export function LevelIcon({ level, className }) {
  return <Svg className={className}>{LEVEL_PATHS[level] ?? LEVEL_PATHS.info}</Svg>
}
