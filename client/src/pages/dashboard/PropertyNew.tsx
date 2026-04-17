import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../lib/api'

export default function PropertyNew() {
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    address_line1: '',
    address_line2: '',
    city: '',
    state: 'MA',
    zip_code: '',
    unit_number: '',
    property_type: 'single_family',
    monthly_rent: '',
    tenant_name: '',
    tenant_email: '',
    lease_start_date: '',
    lease_end_date: '',
    security_deposit: '',
    last_month_deposit: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const payload = {
        ...form,
        monthly_rent: parseFloat(form.monthly_rent),
        security_deposit: form.security_deposit
          ? parseFloat(form.security_deposit)
          : undefined,
        last_month_deposit: form.last_month_deposit
          ? parseFloat(form.last_month_deposit)
          : undefined,
        lease_start_date: form.lease_start_date || undefined,
        lease_end_date: form.lease_end_date || undefined,
        tenant_email: form.tenant_email || undefined,
        unit_number: form.unit_number || undefined,
        address_line2: form.address_line2 || undefined,
      }
      await api.post('/api/properties', payload)
      navigate('/dashboard/properties')
    } catch (err: any) {
      setError(
        err.response?.data?.error || 'Failed to create property'
      )
      setSaving(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add Property</h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-lg bg-white rounded-lg border border-gray-200 p-6"
      >
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <h2 className="font-semibold text-gray-800">Property Address</h2>

          <input
            name="address_line1"
            value={form.address_line1}
            onChange={handleChange}
            placeholder="Street address"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="address_line2"
            value={form.address_line2}
            onChange={handleChange}
            placeholder="Apt, suite, etc. (optional)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="grid grid-cols-4 gap-3">
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="City"
              required
              className="col-span-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="state"
              value={form.state}
              onChange={handleChange}
              placeholder="State"
              required
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="zip_code"
              value={form.zip_code}
              onChange={handleChange}
              placeholder="ZIP"
              required
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unit Number
              </label>
              <input
                name="unit_number"
                value={form.unit_number}
                onChange={handleChange}
                placeholder="Optional"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Type
              </label>
              <select
                name="property_type"
                value={form.property_type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="single_family">Single Family</option>
                <option value="multi_family">Multi Family</option>
                <option value="condo">Condo</option>
                <option value="apartment">Apartment</option>
              </select>
            </div>
          </div>

          <h2 className="font-semibold text-gray-800 mt-4">Lease Details</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Monthly Rent ($)
            </label>
            <input
              name="monthly_rent"
              type="number"
              value={form.monthly_rent}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tenant Name
              </label>
              <input
                name="tenant_name"
                value={form.tenant_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tenant Email
              </label>
              <input
                name="tenant_email"
                type="email"
                value={form.tenant_email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lease Start
              </label>
              <input
                name="lease_start_date"
                type="date"
                value={form.lease_start_date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lease End
              </label>
              <input
                name="lease_end_date"
                type="date"
                value={form.lease_end_date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Security Deposit ($)
              </label>
              <input
                name="security_deposit"
                type="number"
                value={form.security_deposit}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Month Deposit ($)
              </label>
              <input
                name="last_month_deposit"
                type="number"
                value={form.last_month_deposit}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 mt-4"
          >
            {saving ? 'Creating...' : 'Add Property'}
          </button>
        </div>
      </form>
    </div>
  )
}
