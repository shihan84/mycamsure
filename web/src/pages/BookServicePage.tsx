import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, Clock, CheckCircle, Calendar, MapPin } from 'lucide-react'
import Button from '../components/Button'
import Input from '../components/Input'
import Navbar from '../components/Navbar'
import { createServiceRequest } from '../lib/api'

type ServiceType = 'INSTALLATION' | 'REPAIR' | 'MAINTENANCE' | 'AMC_VISIT'

export default function BookServicePage() {
  const navigate = useNavigate()
  const [selectedService, setSelectedService] = useState<ServiceType>('REPAIR')
  const [formData, setFormData] = useState({
    scheduledAt: '',
    address: '',
    description: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const services = [
    { type: 'INSTALLATION' as ServiceType, name: 'CCTV Installation', price: 1500, icon: Shield, description: 'New camera setup and configuration' },
    { type: 'REPAIR' as ServiceType, name: 'Repair Service', price: 500, icon: Clock, description: 'Fix broken cameras or wiring issues' },
    { type: 'MAINTENANCE' as ServiceType, name: 'Maintenance', price: 300, icon: CheckCircle, description: 'Regular checkup and cleaning' },
    { type: 'AMC_VISIT' as ServiceType, name: 'AMC Visit', price: 0, icon: Calendar, description: 'Scheduled visit under your AMC plan' },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await createServiceRequest({
        type: selectedService,
        scheduledAt: formData.scheduledAt,
        address: formData.address,
        description: formData.description || undefined,
      })

      if (response.success) {
        navigate(`/track-service/${response.data.id}`)
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to book service. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const selectedServiceData = services.find(s => s.type === selectedService)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Book a Service</h1>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Service Type Selection */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Select Service Type</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {services.map((service) => {
                const Icon = service.icon
                return (
                  <button
                    key={service.type}
                    type="button"
                    onClick={() => setSelectedService(service.type)}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      selectedService === service.type
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`h-8 w-8 mb-3 ${selectedService === service.type ? 'text-primary-600' : 'text-gray-600'}`} />
                    <h3 className="font-semibold mb-1">{service.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                    <div className="text-lg font-bold text-primary-600">
                      {service.price === 0 ? 'Covered under AMC' : `₹${service.price}`}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Date & Time */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Schedule Date & Time</h2>
            <Input
              type="datetime-local"
              value={formData.scheduledAt}
              onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
              min={new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString().slice(0, 16)}
              required
            />
          </div>

          {/* Address */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Service Address</h2>
            <div className="space-y-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  className="pl-10"
                  placeholder="Enter your complete address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                  minLength={10}
                />
              </div>
              <p className="text-sm text-gray-500">Minimum 10 characters required</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Description (Optional)</h2>
            <textarea
              className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 min-h-[100px]"
              placeholder="Describe the issue or any specific requirements"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              maxLength={500}
            />
            <p className="text-sm text-gray-500 mt-1">{formData.description.length}/500 characters</p>
          </div>

          {/* Price Summary */}
          <div className="bg-primary-50 rounded-xl p-6">
            <h3 className="font-semibold mb-4">Price Summary</h3>
            <div className="flex justify-between items-center">
              <span>Service Charge</span>
              <span className="font-bold text-xl">
                {selectedServiceData?.price === 0 ? 'Covered under AMC' : `₹${selectedServiceData?.price}`}
              </span>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Submit */}
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? 'Booking...' : 'Book Service'}
          </Button>
        </form>
      </div>
    </div>
  )
}
