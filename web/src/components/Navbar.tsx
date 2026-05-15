import { Link } from 'react-router-dom'
import { Shield, Menu, X } from 'lucide-react'
import { useState } from 'react'
import Button from './Button'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">myCamSure</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary-600 transition-colors">
              Home
            </Link>
            <Link to="/book-service" className="text-gray-700 hover:text-primary-600 transition-colors">
              Book Service
            </Link>
            <Link to="/track-service" className="text-gray-700 hover:text-primary-600 transition-colors">
              Track Service
            </Link>
            <Link to="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link to="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-primary-600"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-4 pt-2 pb-4 space-y-2">
            <Link to="/" className="block py-2 text-gray-700 hover:text-primary-600">
              Home
            </Link>
            <Link to="/book-service" className="block py-2 text-gray-700 hover:text-primary-600">
              Book Service
            </Link>
            <Link to="/track-service" className="block py-2 text-gray-700 hover:text-primary-600">
              Track Service
            </Link>
            <Link to="/login" className="block py-2">
              <Button variant="outline" className="w-full">Login</Button>
            </Link>
            <Link to="/signup" className="block py-2">
              <Button className="w-full">Sign Up</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
