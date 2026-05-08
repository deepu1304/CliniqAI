const URGENCY_CONFIG = {
  1: { label: 'Critical',    bg: 'rgba(239,68,68,0.15)',   border: 'rgba(239,68,68,0.4)',   text: '#fca5a5' },
  2: { label: 'Emergent',    bg: 'rgba(249,115,22,0.15)',  border: 'rgba(249,115,22,0.4)',  text: '#fdba74' },
  3: { label: 'Urgent',      bg: 'rgba(234,179,8,0.15)',   border: 'rgba(234,179,8,0.4)',   text: '#fde047' },
  4: { label: 'Less urgent', bg: 'rgba(59,130,246,0.15)',  border: 'rgba(59,130,246,0.4)',  text: '#93c5fd' },
  5: { label: 'Non-urgent',  bg: 'rgba(16,185,129,0.15)',  border: 'rgba(16,185,129,0.4)',  text: '#6ee7b7' },
} as const

interface Props {
  level: number
  size?: 'sm' | 'lg'
}

export default function UrgencyBadge({ level, size = 'sm' }: Props) {
  const cfg = URGENCY_CONFIG[level as keyof typeof URGENCY_CONFIG]
  if (!cfg) return null

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-lg font-medium ${
        size === 'lg' ? 'px-4 py-2 text-base' : 'px-2.5 py-1 text-xs'
      }`}
      style={{ background: cfg.bg, border: `0.5px solid ${cfg.border}`, color: cfg.text }}
    >
      <span
        className="rounded-full font-bold"
        style={{
          background: cfg.border,
          color: cfg.text,
          width: size === 'lg' ? 28 : 20,
          height: size === 'lg' ? 28 : 20,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: size === 'lg' ? 14 : 11,
        }}
      >
        {level}
      </span>
      {cfg.label}
    </div>
  )
}