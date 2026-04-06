import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Dashboard from './pages/Dashboard'
import InterviewPrep from './pages/InterviewPrep'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import { AnimatePresence } from 'framer-motion'

const App = () => {
  return (
    <Router>
      {/* Background Mesh */}
      <div className="bg-mesh">
        <div className="mesh-blob blob-1" />
        <div className="mesh-blob blob-2" />
        <div className="mesh-blob blob-3" />
      </div>
      
      {/* Noise Texture - Using a more reliable data URL to prevent 403 errors */}
      <div 
        className="noise opacity-[0.03] pointer-events-none fixed inset-0 z-0" 
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />

      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: 'rgba(30, 41, 59, 0.7)',
            backdropFilter: 'blur(20px)',
            color: '#f8fafc',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '20px',
            fontSize: '0.9rem',
            fontWeight: '600'
          }
        }}
      />
      
      <div className="relative z-10 selection:bg-indigo-500/30">
        <Navbar />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/interview-prep/:id" element={<ProtectedRoute><InterviewPrep /></ProtectedRoute>} />
            {/* Fallback to home */}
            <Route path="*" element={<LandingPage />} />
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  )
}

export default App