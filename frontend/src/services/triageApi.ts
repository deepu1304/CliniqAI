import api from './api'
import type { CreateSessionPayload, TriageSession } from '../types/triage'

export const triageApi = {
  createSession: (payload: CreateSessionPayload) =>
    api.post<TriageSession>('/triage/session', payload),

  getSession: (id: string) =>
    api.get<TriageSession>(`/triage/session/${id}`),
}