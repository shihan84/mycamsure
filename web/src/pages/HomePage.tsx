import { Link } from 'react-router-dom'
import { Shield, Clock, MapPin, Star, ArrowRight, CheckCircle } from 'lucide-react'
import Button from '../components/Button'
import Navbar from '../components/Navbar'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Professional CCTV Installation & Maintenance
              </h1>
              <p className="text-xl mb-8 text-primary-100">
                Get verified technicians at your doorstep. Book installation, repair, or maintenance services in minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/book-service">
                  <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                    Book a Service
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/track-service">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    Track Service
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold">500+</div>
                    <div className="text-sm">Technicians</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold">10K+</div>
                    <div className="text-sm">Jobs Completed</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold">4.8</div>
                    <div className="text-sm">Average Rating</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold">24/7</div>
                    <div className="text-sm">Support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <Shield className="h-12 w-12 text-primary-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">CCTV Installation</h3>
              <p className="text-gray-600 mb-4">Professional installation of CCTV cameras with proper configuration and setup.</p>
              <div className="text-2xl font-bold text-primary-600">Starting ₹1,500</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <Clock className="h-12 w-12 text-primary-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Repair Services</h3>
              <p className="text-gray-600 mb-4">Quick diagnosis and repair of broken cameras, wiring issues, and system faults.</p>
              <div className="text-2xl font-bold text-primary-600">Starting ₹500</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <CheckCircle className="h-12 w-12 text-primary-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">AMC Plans</h3>
              <p className="text-gray-600 mb-4">Annual maintenance contracts for regular checkups and priority support.</p>
              <div className="text-2xl font-bold text-primary-600">Custom Plans</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
              <h3 className="font-semibold mb-2">Book Service</h3>
              <p className="text-gray-600 text-sm">Select service type and schedule a convenient time</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
              <h3 className="font-semibold mb-2">Technician Assigned</h3>
              <p className="text-gray-600 text-sm">Verified technician assigned based on your location</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
              <h3 className="font-semibold mb-2">Service Delivery</h3>
              <p className="text-gray-600 text-sm">Technician arrives and completes the service</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">4</div>
              <h3 className="font-semibold mb-2">Rate & Pay</h3>
              <p className="text-gray-600 text-sm">Rate the service and make secure payment</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold">Verified Technicians</h3>
                <p className="text-gray-600 text-sm">All technicians are background verified and certified</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <MapPin className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold">Live Tracking</h3>
                <p className="text-gray-600 text-sm">Track technician location in real-time</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Star className="h-6 w-6 text-yellow-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold">Transparent Pricing</h3>
                <p className="text-gray-600 text-sm">No hidden charges, pay only for what you get</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Clock className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold">Quick Service</h3>
                <p className="text-gray-600 text-sm">Same-day service availability in most areas</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-primary-100">Book your first service today and experience hassle-free CCTV maintenance</p>
          <Link to="/book-service">
            <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
              Book Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="h-6 w-6" />
                <span className="font-bold">myCamSure</span>
              </div>
              <p className="text-gray-400 text-sm">Professional CCTV services at your fingertips</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Installation</li>
                <li>Repair</li>
                <li>Maintenance</li>
                <li>AMC Plans</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>About Us</li>
                <li>Careers</li>
                <li>Partner with Us</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Help Center</li>
                <li>FAQs</li>
                <li>Terms of Service</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            © 2026 myCamSure. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
