import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import BookServicePage from './pages/BookServicePage'
import TrackServicePage from './pages/TrackServicePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import FranchiseeDashboard from './pages/FranchiseeDashboard'
import AdminDashboard from './pages/AdminDashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/book-service" element={<BookServicePage />} />
        <Route path="/track-service/:id" element={<TrackServicePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/franchisee/dashboard" element={<FranchiseeDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
