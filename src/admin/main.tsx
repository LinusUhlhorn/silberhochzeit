import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AdminApp from './AdminApp.tsx'
import '../index.css'

const wurzel = document.getElementById('root')

if (!wurzel) {
  throw new Error('Element #root wurde nicht gefunden.')
}

createRoot(wurzel).render(
  <StrictMode>
    <AdminApp />
  </StrictMode>,
)
