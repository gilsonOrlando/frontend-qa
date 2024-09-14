import React from 'react'
import ReactDOM from 'react-dom/client'
import WrappedApp from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <WrappedApp />
    </BrowserRouter>
  </React.StrictMode>,
)
