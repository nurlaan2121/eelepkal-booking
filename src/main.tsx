import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './app/styles/global.css'
import App from './App.tsx'

// TODO: To enable API mocking for local development:
// 1. Run: npm install msw --save-dev
// 2. Run: npx msw init public/ --save
// 3. Uncomment the code below

/*
async function enableMocking() {
  if (import.meta.env.MODE !== 'development') {
    return
  }

  const { worker } = await import('./mocks/browser')

  // `worker.start()` returns a Promise that resolves once the Service Worker is up and running.
  return worker.start()
}
*/

// enableMocking().then(() => {
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
// })
