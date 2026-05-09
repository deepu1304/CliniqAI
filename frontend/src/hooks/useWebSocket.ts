import { useEffect, useRef, useCallback, useState } from 'react'
import type { PredictionChunk, LivePrediction } from '../types/triage'


type WSStatus = 'idle' | 'connecting' | 'connected' | 'error' | 'closed'

const WS_BASE = import.meta.env.VITE_WS_URL ?? 'ws://localhost:8000'

const EMPTY_PREDICTION: LivePrediction = {
  urgency_level: null,
  confidence: null,
  conditions: [],
  shap_values: [],
  is_complete: false,
  error: null,
}

export function useWebSocket(sessionId: string | null) {
  const wsRef = useRef<WebSocket | null>(null)
  const [status, setStatus] = useState<WSStatus>('idle')
  const [prediction, setPrediction] = useState<LivePrediction>(EMPTY_PREDICTION)

  const connect = useCallback(() => {
    if (!sessionId) return
    if (wsRef.current?.readyState === WebSocket.OPEN) return

    setStatus('connecting')
    setPrediction(EMPTY_PREDICTION)

    const ws = new WebSocket(`${WS_BASE}/ws/triage/${sessionId}`)
    wsRef.current = ws

    ws.onopen = () => {
      setStatus('connected')
    }

    ws.onmessage = (event) => {
      try {
        const chunk: PredictionChunk = JSON.parse(event.data)

        setPrediction((prev) => {
    
          switch (chunk.chunk_type) {
            case 'urgency':
              return {
                ...prev,
                urgency_level: chunk.urgency_level,
                confidence: chunk.confidence,
              }
            case 'condition': {
              const condition = JSON.parse(chunk.data)
              return {
                ...prev,
                conditions: [...prev.conditions, condition],
              }
            }
            case 'shap': {
              const shap = JSON.parse(chunk.data)
              return {
                ...prev,
                shap_values: [...prev.shap_values, shap],
              }
            }
            case 'done':
              return { ...prev, is_complete: true }
            case 'error':
              return { ...prev, error: chunk.data }
            default:
              return prev
          }
        })
      } catch {
        console.warn('Unparseable WS message:', event.data)
      }
    }

    ws.onerror = () => setStatus('error')

    // 'closed' fires after both clean close and errors
    ws.onclose = () => setStatus('closed')
  }, [sessionId])

  const disconnect = useCallback(() => {
    wsRef.current?.close()
    wsRef.current = null
  }, [])

  useEffect(() => {
    if (sessionId) connect()
    return () => disconnect()
  }, [sessionId, connect, disconnect])

  return { prediction, status, connect, disconnect }
}