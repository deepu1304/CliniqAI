export type ChunkType = 'urgency' | 'condition' | 'shap' | 'done' | 'error'

export interface PredictionChunk {
  chunk_type: ChunkType
  data: string        
  confidence: number
  urgency_level: number
}

export interface Condition {
  name: string
  probability: number
}

export interface ShapValue {
  symptom: string
  contribution: number  
}

export interface LivePrediction {
  urgency_level: number | null
  confidence: number | null
  conditions: Condition[]
  shap_values: ShapValue[]
  is_complete: boolean
  error: string | null
}

export interface TriageSession {
  id: string
  patient_id: string
  doctor_id: string
  symptoms_raw: string
  symptoms_json: string[]
  status: 'pending' | 'processing' | 'completed'
  created_at: string
}

export interface CreateSessionPayload {
  patient_id: string
  symptoms: string[]
  raw_text: string
}