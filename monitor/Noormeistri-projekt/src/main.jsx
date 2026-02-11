import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './index.css'
import Setup from './pages/Setup.jsx'

createRoot(root).render(
  <BrowserRouter>
    <Routes>
      <Route index element={<Setup />} />
    </Routes>
  </BrowserRouter>
)
