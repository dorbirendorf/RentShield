import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import api from '../../lib/api'

interface Payment {
  id: string
  amount: number
  status: string
  paid_at: string | null
  receipt_url: string | null
}

interface MembershipData {
  id: string
  status: string
  premium_amount: number
  coverage_start_date: string | null
  coverage_end_date: string | null
  deductible_days: number
  coverage_start_month: number
  created_at: string
  properties: {
    address_line1: string
    unit_number: string | null
    city: string
    state: string
    zip_code: string
    monthly_rent: number
    tenant_name: string | null
  }
  payments: Payment[]
}

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  expired: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-600',
}

export default function MembershipDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [membership, setMembership] = useState<MembershipData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get(`/api/memberships/${id}`)
      .then((res) => setMembership(res.data))
      .catch(() => navigate('/dashboard/memberships'))
      .finally(() => setLoading(false))
  }, [id, navigate])

  if (loading) return <p className="text-gray-500">Loading...</p>
  if (!membership) return null

  return (
    <div>
      <Link
        to="/dashboard/memberships"
        className="text-sm text-blue-600 hover:underline"
      >
        &larr; Back to memberships
      </Link>

      <div className="flex items-center gap-3 mt-2 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {membership.properties.address_line1}
          {membership.properties.unit_number &&
            `, Unit ${membership.properties.unit_number}`}
        </h1>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[membership.status]}`}
        >
          {membership.status.charAt(0).toUpperCase() +
            membership.status.slice(1)}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Coverage Details */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Coverage Details</h2>
          <dl className="grid grid-cols-2 gap-y-3 text-sm">
            <dt className="text-gray-500">Premium Paid</dt>
            <dd className="text-gray-900">${membership.premium_amount}</dd>
            <dt className="text-gray-500">Coverage Start</dt>
            <dd className="text-gray-900">
              {membership.coverage_start_date || 'Pending'}
            </dd>
            <dt className="text-gray-500">Coverage End</dt>
            <dd className="text-gray-900">
              {membership.coverage_end_date || 'Pending'}
            </dd>
            <dt className="text-gray-500">Deductible</dt>
            <dd className="text-gray-900">
              {membership.deductible_days} days
            </dd>
            <dt className="text-gray-500">Rent Guarantee Starts</dt>
            <dd className="text-gray-900">
              Month {membership.coverage_start_month}
            </dd>
          </dl>
        </div>

        {/* Property & Tenant */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Property Info</h2>
          <dl className="grid grid-cols-2 gap-y-3 text-sm">
            <dt className="text-gray-500">Address</dt>
            <dd className="text-gray-900">
              {membership.properties.address_line1},{' '}
              {membership.properties.city}, {membership.properties.state}{' '}
              {membership.properties.zip_code}
            </dd>
            <dt className="text-gray-500">Monthly Rent</dt>
            <dd className="text-gray-900">
              ${membership.properties.monthly_rent}
            </dd>
            <dt className="text-gray-500">Tenant</dt>
            <dd className="text-gray-900">
              {membership.properties.tenant_name || '—'}
            </dd>
          </dl>
        </div>

        {/* Payment History */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 md:col-span-2">
          <h2 className="font-semibold text-gray-800 mb-4">Payments</h2>
          {membership.payments.length === 0 ? (
            <p className="text-gray-500 text-sm">No payments recorded.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-2">Amount</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2">Date</th>
                  <th className="pb-2"></th>
                </tr>
              </thead>
              <tbody>
                {membership.payments.map((p) => (
                  <tr key={p.id} className="border-b last:border-0">
                    <td className="py-2 text-gray-900">${p.amount}</td>
                    <td className="py-2">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          p.status === 'succeeded'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="py-2 text-gray-600">
                      {p.paid_at
                        ? new Date(p.paid_at).toLocaleDateString()
                        : '—'}
                    </td>
                    <td className="py-2">
                      {p.receipt_url && (
                        <a
                          href={p.receipt_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Receipt
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
