import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'

const MockupApp = lazy(() => import('./mockup/MockupApp'))

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-wasabi-dark flex items-center justify-center">
      <div className="text-center">
        <img src="/wasabi-landing/wasabilogo.png" alt="WASABI" className="w-16 h-16 mx-auto mb-4 animate-pulse-soft" />
        <p className="text-gray-400 text-sm">Loading WASABI Demo...</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/try/*"
        element={
          <Suspense fallback={<LoadingScreen />}>
            <MockupApp />
          </Suspense>
        }
      />
    </Routes>
  )
}
