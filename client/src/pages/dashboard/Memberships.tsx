import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import api from '../../lib/api'

interface Membership {
  id: string
  status: string
  premium_amount: number
  coverage_start_date: string | null
  coverage_end_date: string | null
  created_at: string
  properties: {
    address_line1: string
    unit_number: string | null
    city: string
    state: string
    monthly_rent: number
  }
}

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  expired: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-600',
}

export default function Memberships() {
  const [memberships, setMemberships] = useState<Membership[]>([])
  const [loading, setLoading] = useState(true)
  const [searchParams] = useSearchParams()
  const justPurchased = searchParams.get('success') === 'true'

  useEffect(() => {
    api
      .get('/api/memberships')
      .then((res) => setMemberships(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-gray-500">Loading...</p>

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Memberships</h1>

      {justPurchased && (
        <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6 border border-green-200">
          Payment successful! Your membership is now active.
        </div>
      )}

      {memberships.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-500 mb-4">No memberships yet.</p>
          <Link
            to="/dashboard/properties"
            className="text-blue-600 hover:underline"
          >
            Go to properties to purchase coverage
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {memberships.map((m) => (
            <Link
              key={m.id}
              to={`/dashboard/memberships/${m.id}`}
              className="bg-white rounded-lg border border-gray-200 p-5 hover:border-blue-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {m.properties.address_line1}
                    {m.properties.unit_number &&
                      `, Unit ${m.properties.unit_number}`}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {m.properties.city}, {m.properties.state}
                  </p>
                  {m.coverage_start_date && m.coverage_end_date && (
                    <p className="text-sm text-gray-500 mt-1">
                      {m.coverage_start_date} to {m.coverage_end_date}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[m.status] || 'bg-gray-100 text-gray-600'}`}
                  >
                    {m.status.charAt(0).toUpperCase() + m.status.slice(1)}
                  </span>
                  <p className="text-sm text-gray-500 mt-1">
                    Premium: ${m.premium_amount}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
