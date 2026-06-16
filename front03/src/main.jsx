import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './global.css'
import Routs from './Routes/index.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Routs />
  </StrictMode>,
)
