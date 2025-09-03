import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { AppThemeProvider } from './theme/ThemeProvider'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppThemeProvider>
      <App />
    </AppThemeProvider>
  </React.StrictMode>,
)
