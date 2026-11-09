import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/inter'
import '@fontsource-variable/jetbrains-mono'
import './index.css'
import App from './App.tsx'

// Always open at the top of the page: stop the browser restoring a previous
// scroll position on reload, unless the URL points at a #section.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
const toTop = () => {
  if (!window.location.hash) window.scrollTo(0, 0)
}
toTop()
// Some browsers restore scroll after load or when coming back from another page.
window.addEventListener('load', toTop)
window.addEventListener('pageshow', toTop)
// cmdk (the Command demos) calls scrollIntoView on its selected item as soon as
// it mounts, which scrolls the whole page down to it. Reset once React has
// rendered and cmdk has run.
requestAnimationFrame(() => requestAnimationFrame(toTop))

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
