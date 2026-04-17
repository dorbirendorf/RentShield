import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../lib/api'

interface Property {
  id: string
  address_line1: string
  unit_number: string | null
  city: string
  state: string
  zip_code: string
  monthly_rent: number
  property_type: string
  tenant_name: string | null
  memberships: { id: string; status: string; coverage_end_date: string }[]
}

export default function Properties() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get('/api/properties')
      .then((res) => setProperties(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-gray-500">Loading...</p>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
        <Link
          to="/dashboard/properties/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
        >
          Add Property
        </Link>
      </div>

      {properties.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-500 mb-4">No properties yet.</p>
          <Link
            to="/dashboard/properties/new"
            className="text-blue-600 hover:underline"
          >
            Add your first property
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {properties.map((property) => {
            const activeMembership = property.memberships?.find(
              (m) => m.status === 'active'
            )
            return (
              <Link
                key={property.id}
                to={`/dashboard/properties/${property.id}`}
                className="bg-white rounded-lg border border-gray-200 p-5 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {property.address_line1}
                      {property.unit_number && `, Unit ${property.unit_number}`}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {property.city}, {property.state} {property.zip_code}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      ${property.monthly_rent}/mo
                      {property.tenant_name && ` — ${property.tenant_name}`}
                    </p>
                  </div>
                  <div>
                    {activeMembership ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Protected
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        Unprotected
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
