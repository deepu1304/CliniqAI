import UrgencyBadge from './UrgencyBadge'
import type { LivePrediction } from '../types/triage'

interface Props {
  prediction: LivePrediction
  status: 'idle' | 'connecting' | 'connected' | 'error' | 'closed'
}

function Skeleton({ width = '100%' }: { width?: string }) {
  return (
    <div
      className="h-4 rounded animate-pulse"
      style={{ width, background: 'rgba(255,255,255,0.07)' }}
    />
  )
}

export default function PredictionStream({ prediction, status }: Props) {
  const isStreaming = status === 'connected' || status === 'connecting'

  if (status === 'idle') return null

  return (
    <div className="space-y-4">

      {/* Urgency level */}
      <div
        className="rounded-xl p-4"
        style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.08)' }}
      >
        <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider">Urgency level</p>
        {prediction.urgency_level ? (
          <div className="flex items-center gap-3">
            <UrgencyBadge level={prediction.urgency_level} size="lg" />
            {prediction.confidence && (
              <span className="text-xs text-slate-400">
                {(prediction.confidence * 100).toFixed(1)}% confidence
              </span>
            )}
          </div>
        ) : (
          <Skeleton width="180px" />
        )}
      </div>

      {/* Top conditions */}
      <div
        className="rounded-xl p-4"
        style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.08)' }}
      >
        <p className="text-xs text-slate-500 mb-3 uppercase tracking-wider">Possible conditions</p>
        {prediction.conditions.length > 0 ? (
          <div className="space-y-2">
            {prediction.conditions.map((c, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-sm text-slate-300 w-40 truncate">{c.name}</span>
                <div className="flex-1 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(c.probability * 100).toFixed(0)}%`,
                      background: 'linear-gradient(90deg, #2563eb, #10b981)',
                    }}
                  />
                </div>
                <span className="text-xs text-slate-500 w-10 text-right">
                  {(c.probability * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        ) : isStreaming ? (
          <div className="space-y-2">
            <Skeleton /><Skeleton width="80%" /><Skeleton width="60%" />
          </div>
        ) : null}
      </div>

      {/* SHAP explanations */}
      {(prediction.shap_values.length > 0 || isStreaming) && (
        <div
          className="rounded-xl p-4"
          style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.08)' }}
        >
          <p className="text-xs text-slate-500 mb-3 uppercase tracking-wider">
            Why this prediction? (SHAP)
          </p>
          {prediction.shap_values.length > 0 ? (
            <div className="space-y-2">
              {prediction.shap_values.slice(0, 6).map((s, i) => {
                const isPositive = s.contribution > 0
                const barWidth = Math.min(Math.abs(s.contribution) * 100, 100)
                return (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 w-36 truncate">{s.symptom}</span>
                    <div className="flex-1 flex items-center gap-1">
                      {/* Centered bar: positive goes right (red=increases urgency), negative goes left (green=decreases) */}
                      <div className="flex-1 flex justify-end">
                        {!isPositive && (
                          <div
                            className="h-1.5 rounded-full"
                            style={{ width: `${barWidth}%`, background: '#10b981' }}
                          />
                        )}
                      </div>
                      <div className="w-px h-3 bg-slate-700" />
                      <div className="flex-1">
                        {isPositive && (
                          <div
                            className="h-1.5 rounded-full"
                            style={{ width: `${barWidth}%`, background: '#ef4444' }}
                          />
                        )}
                      </div>
                    </div>
                    <span
                      className="text-xs w-12 text-right"
                      style={{ color: isPositive ? '#f87171' : '#6ee7b7' }}
                    >
                      {isPositive ? '+' : ''}{s.contribution.toFixed(2)}
                    </span>
                  </div>
                )
              })}
              <p className="text-xs text-slate-600 mt-2">
                Red = increases urgency · Green = decreases urgency
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <Skeleton /><Skeleton width="70%" />
            </div>
          )}
        </div>
      )}

      {/* Error state */}
      {prediction.error && (
        <div
          className="rounded-xl p-4 text-sm"
          style={{ background: 'rgba(239,68,68,0.08)', border: '0.5px solid rgba(239,68,68,0.2)', color: '#f87171' }}
        >
          Prediction error: {prediction.error}
        </div>
      )}

      {/* Completion indicator */}
      {prediction.is_complete && (
        <div
          className="rounded-xl p-3 text-xs text-center"
          style={{ background: 'rgba(16,185,129,0.06)', border: '0.5px solid rgba(16,185,129,0.2)', color: '#6ee7b7' }}
        >
          ✓ Prediction complete — logged for audit
        </div>
      )}
    </div>
  )
}