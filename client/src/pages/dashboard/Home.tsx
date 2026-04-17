import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import api from '../../lib/api'

interface Stats {
  properties: number
  activeMemberships: number
  openCases: number
}

export default function DashboardHome() {
  const { profile } = useAuth()
  const [stats, setStats] = useState<Stats>({
    properties: 0,
    activeMemberships: 0,
    openCases: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get('/api/dashboard/stats')
      .then((res) => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Welcome{profile?.full_name ? `, ${profile.full_name}` : ''}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link
          to="/dashboard/properties"
          className="bg-white rounded-lg border border-gray-200 p-6 hover:border-blue-300 transition-colors"
        >
          <p className="text-sm text-gray-500">Properties</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">
            {loading ? '—' : stats.properties}
          </p>
        </Link>
        <Link
          to="/dashboard/memberships"
          className="bg-white rounded-lg border border-gray-200 p-6 hover:border-blue-300 transition-colors"
        >
          <p className="text-sm text-gray-500">Active Memberships</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">
            {loading ? '—' : stats.activeMemberships}
          </p>
        </Link>
        <Link
          to="/dashboard/cases"
          className="bg-white rounded-lg border border-gray-200 p-6 hover:border-blue-300 transition-colors"
        >
          <p className="text-sm text-gray-500">Open Cases</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">
            {loading ? '—' : stats.openCases}
          </p>
        </Link>
      </div>

      {stats.properties === 0 && !loading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">
            Get started
          </h2>
          <p className="text-blue-700 mb-4">
            Add your first property to start protecting your rental income.
          </p>
          <Link
            to="/dashboard/properties/new"
            className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
          >
            Add Property
          </Link>
        </div>
      )}
    </div>
  )
}
