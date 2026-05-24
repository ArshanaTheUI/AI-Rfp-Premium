import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@tabler/icons-webfont/dist/tabler-icons.css';
import './index.css'
import App from './App.jsx'
import "./styles/global.css"
import "./styles/button.css"
import "./styles/pageCard.css"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
