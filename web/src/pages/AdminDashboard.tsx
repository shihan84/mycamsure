import { useState, useEffect } from 'react'
import { Shield, Users, DollarSign, TrendingUp, Building, AlertTriangle, BarChart3 } from 'lucide-react'
import Button from '../components/Button'
import Navbar from '../components/Navbar'

interface DashboardData {
  totalRevenue: number
  totalFranchises: number
  totalTechnicians: number
  totalJobs: number
  pendingFranchises: number
  pendingTechnicians: number
  activeDisputes: number
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'franchises' | 'technicians' | 'disputes'>('overview')
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [franchises, setFranchises] = useState([])
  const [technicians, setTechnicians] = useState([])
  const [disputes, setDisputes] = useState([])

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
          totalRevenue: 2500000,
          totalFranchises: 25,
          totalTechnicians: 150,
          totalJobs: 2500,
          pendingFranchises: 5,
          pendingTechnicians: 12,
          activeDisputes: 3,
        })
      } else if (activeTab === 'franchises') {
        setFranchises([
          { id: '1', name: 'Mumbai Central', owner: 'Rajesh Kumar', status: 'APPROVED', commission: 15, revenue: 250000 },
          { id: '2', name: 'Delhi North', owner: 'Amit Sharma', status: 'PENDING', commission: 18, revenue: 0 },
          { id: '3', name: 'Bangalore South', owner: 'Priya Reddy', status: 'APPROVED', commission: 16, revenue: 320000 },
        ])
      } else if (activeTab === 'technicians') {
        setTechnicians([
          { id: '1', name: 'Raj Kumar', phone: '+91 9876543210', franchise: 'Mumbai Central', status: 'VERIFIED', rating: 4.8, totalJobs: 45 },
          { id: '2', name: 'Amit Singh', phone: '+91 9876543211', franchise: 'Delhi North', status: 'PENDING', rating: 0, totalJobs: 0 },
          { id: '3', name: 'Priya Patel', phone: '+91 9876543212', franchise: 'Bangalore South', status: 'VERIFIED', rating: 4.5, totalJobs: 38 },
        ])
      } else if (activeTab === 'disputes') {
        setDisputes([
          { id: '1', type: 'Payment', parties: 'Customer vs Franchisee', status: 'OPEN', date: '2026-05-12', description: 'Customer claims overcharging' },
          { id: '2', type: 'Service Quality', parties: 'Customer vs Technician', status: 'IN_PROGRESS', date: '2026-05-10', description: 'Poor installation quality' },
          { id: '3', type: 'Commission', parties: 'Franchisee vs Admin', status: 'OPEN', date: '2026-05-08', description: 'Dispute over commission calculation' },
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
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">Platform-wide management and analytics</p>
        </div>

        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {['overview', 'franchises', 'technicians', 'disputes'].map((tab) => (
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
            ) : activeTab === 'franchises' ? (
              <FranchisesTab franchises={franchises} onRefresh={loadDashboardData} />
            ) : activeTab === 'technicians' ? (
              <TechniciansTab technicians={technicians} onRefresh={loadDashboardData} />
            ) : activeTab === 'disputes' ? (
              <DisputesTab disputes={disputes} onRefresh={loadDashboardData} />
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
          value={`₹${data.totalRevenue.toLocaleString()}`}
          color="green"
        />
        <StatCard
          icon={<Building className="h-6 w-6" />}
          label="Total Franchises"
          value={data.totalFranchises.toString()}
          color="blue"
        />
        <StatCard
          icon={<Users className="h-6 w-6" />}
          label="Total Technicians"
          value={data.totalTechnicians.toString()}
          color="purple"
        />
        <StatCard
          icon={<BarChart3 className="h-6 w-6" />}
          label="Total Jobs"
          value={data.totalJobs.toString()}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AlertCard
          icon={<Building className="h-6 w-6" />}
          label="Pending Franchises"
          value={data.pendingFranchises.toString()}
          color="yellow"
        />
        <AlertCard
          icon={<Users className="h-6 w-6" />}
          label="Pending Technicians"
          value={data.pendingTechnicians.toString()}
          color="yellow"
        />
        <AlertCard
          icon={<AlertTriangle className="h-6 w-6" />}
          label="Active Disputes"
          value={data.activeDisputes.toString()}
          color="red"
        />
      </div>

      <Card title="Quick Actions">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button className="w-full">Send Broadcast Notification</Button>
          <Button variant="outline" className="w-full">View Analytics Report</Button>
          <Button variant="outline" className="w-full">Export Data</Button>
        </div>
      </Card>
    </div>
  )
}

function FranchisesTab({ franchises, onRefresh }: { franchises: any[], onRefresh: () => void }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Franchises ({franchises.length})</h3>
        <Button onClick={onRefresh}>Refresh</Button>
      </div>

      {franchises.map((franchise) => (
        <div key={franchise.id} className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h4 className="font-semibold">{franchise.name}</h4>
              <p className="text-sm text-gray-600">Owner: {franchise.owner}</p>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              franchise.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {franchise.status}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm mb-3">
            <div>
              <p className="text-gray-600">Commission</p>
              <p className="font-semibold">{franchise.commission}%</p>
            </div>
            <div>
              <p className="text-gray-600">Revenue</p>
              <p className="font-semibold">₹{franchise.revenue.toLocaleString()}</p>
            </div>
          </div>
          {franchise.status === 'PENDING' && (
            <div className="flex space-x-2">
              <Button size="sm" className="flex-1">Approve</Button>
              <Button size="sm" variant="outline" className="flex-1">Reject</Button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function TechniciansTab({ technicians, onRefresh }: { technicians: any[], onRefresh: () => void }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">All Technicians ({technicians.length})</h3>
        <Button onClick={onRefresh}>Refresh</Button>
      </div>

      {technicians.map((tech) => (
        <div key={tech.id} className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h4 className="font-semibold">{tech.name}</h4>
              <p className="text-sm text-gray-600">{tech.phone}</p>
              <p className="text-sm text-gray-600">Franchise: {tech.franchise}</p>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              tech.status === 'VERIFIED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {tech.status}
            </span>
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
          </div>
        </div>
      ))}
    </div>
  )
}

function DisputesTab({ disputes, onRefresh }: { disputes: any[], onRefresh: () => void }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Active Disputes ({disputes.length})</h3>
        <Button onClick={onRefresh}>Refresh</Button>
      </div>

      {disputes.map((dispute) => (
        <div key={dispute.id} className="border border-red-200 bg-red-50 rounded-lg p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-semibold">{dispute.type} Dispute</h4>
              <p className="text-sm text-gray-600">{dispute.parties}</p>
              <p className="text-sm text-gray-600">{dispute.date}</p>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              dispute.status === 'OPEN' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {dispute.status}
            </span>
          </div>
          <p className="text-gray-700 mb-3">{dispute.description}</p>
          <div className="flex space-x-2">
            <Button size="sm">Resolve</Button>
            <Button size="sm" variant="outline">View Details</Button>
          </div>
        </div>
      ))}
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

function AlertCard({ icon, label, value, color }: { icon: any, label: string, value: string, color: string }) {
  const colorClasses = {
    yellow: 'bg-yellow-50 text-yellow-600',
    red: 'bg-red-50 text-red-600',
  }

  return (
    <div className={`border ${color === 'red' ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'} rounded-lg p-6`}>
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
