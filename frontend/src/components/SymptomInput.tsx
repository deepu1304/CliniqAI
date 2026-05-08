import { useState, type KeyboardEvent } from 'react'

interface Props {
  symptoms: string[]
  onChange: (symptoms: string[]) => void
  disabled?: boolean
}

export default function SymptomInput({ symptoms, onChange, disabled }: Props) {
  const [input, setInput] = useState('')

  const add = (value: string) => {
    const trimmed = value.trim().toLowerCase()
    if (trimmed && !symptoms.includes(trimmed)) {
      onChange([...symptoms, trimmed])
    }
    setInput('')
  }

  const remove = (symptom: string) => {
    onChange(symptoms.filter((s) => s !== symptom))
  }

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      add(input)
    }
    // Backspace on empty input removes last tag
    if (e.key === 'Backspace' && !input && symptoms.length > 0) {
      remove(symptoms[symptoms.length - 1])
    }
  }

  return (
    <div
      className="min-h-[80px] rounded-lg p-2 flex flex-wrap gap-1.5 cursor-text"
      style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.1)' }}
      onClick={() => document.getElementById('symptom-input')?.focus()}
    >
      {symptoms.map((s) => (
        <span
          key={s}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium"
          style={{ background: 'rgba(37,99,235,0.2)', border: '0.5px solid rgba(37,99,235,0.4)', color: '#93c5fd' }}
        >
          {s}
          {!disabled && (
            <button
              onClick={(e) => { e.stopPropagation(); remove(s) }}
              className="opacity-60 hover:opacity-100 ml-0.5"
              style={{ color: '#93c5fd' }}
            >
              ×
            </button>
          )}
        </span>
      ))}

      {!disabled && (
        <input
          id="symptom-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          onBlur={() => input && add(input)}
          placeholder={symptoms.length === 0 ? 'Type a symptom, press Enter...' : ''}
          className="flex-1 min-w-[160px] bg-transparent outline-none text-sm text-slate-200 placeholder:text-slate-600 py-1 px-1"
        />
      )}
    </div>
  )
}