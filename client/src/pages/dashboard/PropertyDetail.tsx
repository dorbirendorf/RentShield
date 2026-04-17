import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../../lib/api'

interface Membership {
  id: string
  status: string
  coverage_start_date: string
  coverage_end_date: string
  premium_amount: number
}

interface Property {
  id: string
  address_line1: string
  address_line2: string | null
  unit_number: string | null
  city: string
  state: string
  zip_code: string
  property_type: string
  monthly_rent: number
  tenant_name: string | null
  tenant_email: string | null
  lease_start_date: string | null
  lease_end_date: string | null
  security_deposit: number | null
  last_month_deposit: number | null
  memberships: Membership[]
}

export default function PropertyDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)

  useEffect(() => {
    api
      .get(`/api/properties/${id}`)
      .then((res) => setProperty(res.data))
      .catch(() => navigate('/dashboard/properties'))
      .finally(() => setLoading(false))
  }, [id, navigate])

  const handleProtect = async () => {
    setPurchasing(true)
    try {
      const res = await api.post('/api/payments/create-checkout', {
        propertyId: id,
      })
      // Redirect to Stripe Checkout
      window.location.href = res.data.checkoutUrl
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to start checkout')
      setPurchasing(false)
    }
  }

  const handleArchive = async () => {
    if (!confirm('Are you sure you want to archive this property?')) return
    await api.delete(`/api/properties/${id}`)
    navigate('/dashboard/properties')
  }

  if (loading) return <p className="text-gray-500">Loading...</p>
  if (!property) return null

  const activeMembership = property.memberships?.find(
    (m) => m.status === 'active'
  )
  const propertyTypeLabels: Record<string, string> = {
    single_family: 'Single Family',
    multi_family: 'Multi Family',
    condo: 'Condo',
    apartment: 'Apartment',
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link
            to="/dashboard/properties"
            className="text-sm text-blue-600 hover:underline"
          >
            &larr; Back to properties
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">
            {property.address_line1}
            {property.unit_number && `, Unit ${property.unit_number}`}
          </h1>
          <p className="text-gray-500">
            {property.city}, {property.state} {property.zip_code}
          </p>
        </div>
        <div className="flex gap-2">
          {!activeMembership && (
            <button
              onClick={handleProtect}
              disabled={purchasing}
              className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
            >
              {purchasing
                ? 'Redirecting...'
                : `Protect — $${property.monthly_rent}`}
            </button>
          )}
          <button
            onClick={handleArchive}
            className="text-red-600 border border-red-200 px-4 py-2 rounded-lg hover:bg-red-50 text-sm"
          >
            Archive
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Property Details */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Property Details</h2>
          <dl className="grid grid-cols-2 gap-y-3 text-sm">
            <dt className="text-gray-500">Type</dt>
            <dd className="text-gray-900">
              {propertyTypeLabels[property.property_type] || property.property_type}
            </dd>
            <dt className="text-gray-500">Monthly Rent</dt>
            <dd className="text-gray-900">${property.monthly_rent}</dd>
            <dt className="text-gray-500">Security Deposit</dt>
            <dd className="text-gray-900">
              {property.security_deposit
                ? `$${property.security_deposit}`
                : '—'}
            </dd>
            <dt className="text-gray-500">Last Month Deposit</dt>
            <dd className="text-gray-900">
              {property.last_month_deposit
                ? `$${property.last_month_deposit}`
                : '—'}
            </dd>
          </dl>
        </div>

        {/* Tenant & Lease */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Tenant & Lease</h2>
          <dl className="grid grid-cols-2 gap-y-3 text-sm">
            <dt className="text-gray-500">Tenant</dt>
            <dd className="text-gray-900">{property.tenant_name || '—'}</dd>
            <dt className="text-gray-500">Tenant Email</dt>
            <dd className="text-gray-900">{property.tenant_email || '—'}</dd>
            <dt className="text-gray-500">Lease Start</dt>
            <dd className="text-gray-900">
              {property.lease_start_date || '—'}
            </dd>
            <dt className="text-gray-500">Lease End</dt>
            <dd className="text-gray-900">{property.lease_end_date || '—'}</dd>
          </dl>
        </div>

        {/* Membership Status */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 md:col-span-2">
          <h2 className="font-semibold text-gray-800 mb-4">
            Coverage Status
          </h2>
          {activeMembership ? (
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Protected
              </span>
              <span className="text-sm text-gray-600">
                Coverage: {activeMembership.coverage_start_date} to{' '}
                {activeMembership.coverage_end_date}
              </span>
              <Link
                to={`/dashboard/memberships`}
                className="text-sm text-blue-600 hover:underline ml-auto"
              >
                View membership details &rarr;
              </Link>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-gray-500">
                This property is not currently protected.
              </p>
              <button
                onClick={handleProtect}
                disabled={purchasing}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm"
              >
                {purchasing
                  ? 'Redirecting...'
                  : `Protect for $${property.monthly_rent}/year`}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
