import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Clock, MapPin, Shield, CheckCircle, AlertCircle } from 'lucide-react'
import Navbar from '../components/Navbar'
import { getServiceRequest } from '../lib/api'

export default function TrackServicePage() {
  const { id } = useParams()
  const [serviceRequest, setServiceRequest] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchServiceRequest = async () => {
      try {
        const response = await getServiceRequest(id!)
        if (response.success) {
          setServiceRequest(response.data)
        }
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load service details')
      } finally {
        setLoading(false)
      }
    }

    fetchServiceRequest()
  }, [id])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'CANCELLED':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-blue-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading service details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !serviceRequest) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600">{error || 'Service request not found'}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Track Service</h1>
        
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold">{serviceRequest.typeDisplay}</h2>
              <p className="text-gray-600">Booking ID: {serviceRequest.id}</p>
            </div>
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${getStatusColor(serviceRequest.status)}`}>
              {getStatusIcon(serviceRequest.status)}
              <span className="font-medium">{serviceRequest.statusDisplay}</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Scheduled Time</p>
                  <p className="font-medium">{new Date(serviceRequest.scheduledAt).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Service Address</p>
                  <p className="font-medium">{serviceRequest.address}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="font-medium text-xl">₹{serviceRequest.totalAmount}</p>
                </div>
              </div>
              {serviceRequest.technician && (
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Assigned Technician</p>
                    <p className="font-medium">{serviceRequest.technician.name}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Live Tracking Placeholder */}
        {serviceRequest.status === 'ASSIGNED' || serviceRequest.status === 'TECHNICIAN_EN_ROUTE' ? (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-semibold mb-4">Live Technician Tracking</h3>
            <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MapPin className="h-12 w-12 mx-auto mb-2" />
                <p>Map integration coming soon</p>
                <p className="text-sm">Technician is on the way to your location</p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

function Calendar({ className }: { className: string }) {
  return <Clock className={className} />
}
