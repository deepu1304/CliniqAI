import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/Login'
import TriagePage from './pages/TriagePage'
import DoctorDashboard from './pages/DoctorDashboard'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/triage" element={<TriagePage />} />
        <Route path="/dashboard" element={<DoctorDashboard />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)