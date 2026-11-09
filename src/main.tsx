import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/inter'
import '@fontsource-variable/jetbrains-mono'
import './index.css'
import App from './App.tsx'

// Always open at the top of the page: stop the browser restoring a previous
// scroll position on reload, unless the URL points at a #section.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
if (!window.location.hash) window.scrollTo(0, 0)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
