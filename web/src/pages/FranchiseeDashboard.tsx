import { useState, useEffect } from 'react'
import { Shield, Users, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react'
import Button from '../components/Button'
import Navbar from '../components/Navbar'

interface DashboardData {
  franchise: {
    id: string
    name: string
    commissionRate: number
  }
  earnings: {
    totalRevenue: number
    totalCommission: number
    thisMonthRevenue: number
    thisMonthCommission: number
  }
  jobs: {
    total: number
    completed: number
    pending: number
  }
}

interface Technician {
  id: string
  user: {
    name: string
    phone: string
  }
  isVerified: string
  rating: number
  totalJobs: number
  available: boolean
}

export default function FranchiseeDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'technicians' | 'complaints'>('overview')
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [technicians, setTechnicians] = useState<Technician[]>([])
  const [complaints, setComplaints] = useState([])

  useEffect(() => {
    loadDashboardData()
  }, [activeTab])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      // TODO: Implement actual API calls
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (activeTab === 'overview') {
        setDashboardData({
          franchise: { id: '1', name: 'Mumbai Central', commissionRate: 15 },
          earnings: {
            totalRevenue: 250000,
            totalCommission: 37500,
            thisMonthRevenue: 45000,
            thisMonthCommission: 6750,
          },
          jobs: { total: 150, completed: 120, pending: 30 },
        })
      } else if (activeTab === 'technicians') {
        setTechnicians([
          { id: '1', user: { name: 'Raj Kumar', phone: '+91 9876543210' }, isVerified: 'VERIFIED', rating: 4.8, totalJobs: 45, available: true },
          { id: '2', user: { name: 'Amit Singh', phone: '+91 9876543211' }, isVerified: 'VERIFIED', rating: 4.5, totalJobs: 32, available: false },
          { id: '3', user: { name: 'Priya Patel', phone: '+91 9876543212' }, isVerified: 'PENDING', rating: 0, totalJobs: 0, available: true },
        ])
      } else if (activeTab === 'complaints') {
        setComplaints([
          { id: '1', customer: 'John Doe', rating: 2, comment: 'Technician arrived late', date: '2026-05-10' },
          { id: '2', customer: 'Jane Smith', rating: 1, comment: 'Poor quality work', date: '2026-05-08' },
        ])
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Franchisee Dashboard</h1>
          <p className="text-gray-600">Manage your franchise operations</p>
        </div>

        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {['overview', 'technicians', 'complaints'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : activeTab === 'overview' && dashboardData ? (
              <OverviewTab data={dashboardData} />
            ) : activeTab === 'technicians' ? (
              <TechniciansTab technicians={technicians} onRefresh={loadDashboardData} />
            ) : activeTab === 'complaints' ? (
              <ComplaintsTab complaints={complaints} />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

function OverviewTab({ data }: { data: DashboardData }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          icon={<DollarSign className="h-6 w-6" />}
          label="Total Revenue"
          value={`₹${data.earnings.totalRevenue.toLocaleString()}`}
          color="green"
        />
        <StatCard
          icon={<TrendingUp className="h-6 w-6" />}
          label="This Month Revenue"
          value={`₹${data.earnings.thisMonthRevenue.toLocaleString()}`}
          color="blue"
        />
        <StatCard
          icon={<Shield className="h-6 w-6" />}
          label="Total Commission"
          value={`₹${data.earnings.totalCommission.toLocaleString()}`}
          color="purple"
        />
        <StatCard
          icon={<Users className="h-6 w-6" />}
          label="Total Jobs"
          value={data.jobs.total.toString()}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Job Status">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Completed</span>
              <span className="font-bold text-green-600">{data.jobs.completed}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{ width: `${(data.jobs.completed / data.jobs.total) * 100}%` }}
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Pending</span>
              <span className="font-bold text-orange-600">{data.jobs.pending}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-orange-600 h-2 rounded-full"
                style={{ width: `${(data.jobs.pending / data.jobs.total) * 100}%` }}
              />
            </div>
          </div>
        </Card>

        <Card title="Commission Details">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Commission Rate</span>
              <span className="font-bold">{data.franchise.commissionRate}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">This Month Earnings</span>
              <span className="font-bold text-green-600">₹{data.earnings.thisMonthCommission.toLocaleString()}</span>
            </div>
            <Button className="w-full">Withdraw Earnings</Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

function TechniciansTab({ technicians, onRefresh }: { technicians: Technician[], onRefresh: () => void }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Technicians ({technicians.length})</h3>
        <Button onClick={onRefresh}>Refresh</Button>
      </div>

      {technicians.map((tech) => (
        <div key={tech.id} className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h4 className="font-semibold">{tech.user.name}</h4>
              <p className="text-sm text-gray-600">{tech.user.phone}</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                tech.isVerified === 'VERIFIED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {tech.isVerified}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                tech.available ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {tech.available ? 'Available' : 'Busy'}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Rating</p>
              <p className="font-semibold">{tech.rating > 0 ? tech.rating.toFixed(1) : 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-600">Total Jobs</p>
              <p className="font-semibold">{tech.totalJobs}</p>
            </div>
            <div className="flex space-x-2">
              {tech.isVerified === 'PENDING' && (
                <>
                  <Button size="sm" className="flex-1">Approve</Button>
                  <Button size="sm" variant="outline" className="flex-1">Reject</Button>
                </>
              )}
              {tech.isVerified === 'VERIFIED' && (
                <Button size="sm" variant="outline" className="flex-1">Suspend</Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function ComplaintsTab({ complaints }: { complaints: any[] }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Customer Complaints ({complaints.length})</h3>

      {complaints.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <AlertTriangle className="h-12 w-12 mx-auto mb-2 text-gray-400" />
          <p>No complaints to review</p>
        </div>
      ) : (
        complaints.map((complaint) => (
          <div key={complaint.id} className="border border-red-200 bg-red-50 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-semibold">{complaint.customer}</h4>
                <p className="text-sm text-gray-600">{complaint.date}</p>
              </div>
              <div className="flex items-center space-x-1 text-red-600">
                <AlertTriangle className="h-4 w-4" />
                <span className="font-bold">{complaint.rating}/5</span>
              </div>
            </div>
            <p className="text-gray-700">{complaint.comment}</p>
            <div className="mt-3 flex space-x-2">
              <Button size="sm">Resolve</Button>
              <Button size="sm" variant="outline">Contact Customer</Button>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

function StatCard({ icon, label, value, color }: { icon: any, label: string, value: string, color: string }) {
  const colorClasses = {
    green: 'bg-green-50 text-green-600',
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className={`inline-flex p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
        {icon}
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-600">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  )
}

function Card({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {children}
    </div>
  )
}
