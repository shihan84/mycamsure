import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Shield } from 'lucide-react'
import Button from '../components/Button'
import Input from '../components/Input'
import Navbar from '../components/Navbar'
import { RecaptchaVerifier, getAuth } from 'firebase/auth'
import { sendOtp, verifyOtp } from '../lib/firebase'

export default function LoginPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [confirmationResult, setConfirmationResult] = useState<any>(null)
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null)
  const auth = getAuth()

  useEffect(() => {
    // Initialize reCAPTCHA verifier
    if (!recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      })
    }
  }, [auth])

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!recaptchaVerifierRef.current) {
        throw new Error('reCAPTCHA not initialized')
      }

      const result = await sendOtp(phone, recaptchaVerifierRef.current)
      if (!result.success) throw new Error(result.error)
      
      setConfirmationResult(result.confirmationResult)
      setStep('otp')
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await verifyOtp(confirmationResult, otp)
      if (!result.success) throw new Error(result.error)
      
      // Token is automatically handled by Firebase
      navigate('/')
    } catch (err: any) {
      setError(err.message || 'Invalid OTP')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <Shield className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold">Welcome Back</h1>
            <p className="text-gray-600 mt-2">Sign in with your phone number</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {step === 'phone' ? (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <Input
                  type="tel"
                  placeholder="+91 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Sending...' : 'Send OTP'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Enter OTP</label>
                <Input
                  type="text"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  maxLength={6}
                />
                <p className="text-sm text-gray-500 mt-2">OTP sent to {phone}</p>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify OTP'}
              </Button>
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="w-full text-sm text-primary-600 hover:underline"
              >
                Change phone number
              </button>
            </form>
          )}

          <div className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary-600 hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
      
      {/* Hidden reCAPTCHA container */}
      <div id="recaptcha-container" className="hidden"></div>
    </div>
  )
}
