import { useState, useEffect } from 'react'
import api from '../../lib/api'

interface Payment {
  id: string
  amount: number
  payment_type: string
  status: string
  description: string | null
  paid_at: string | null
  receipt_url: string | null
  created_at: string
}

const statusColors: Record<string, string> = {
  succeeded: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  failed: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-600',
}

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get('/api/payments/history')
      .then((res) => setPayments(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-gray-500">Loading...</p>

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Payment History</h1>

      {payments.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-500">No payments yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 bg-gray-50 border-b">
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Description</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-b last:border-0">
                  <td className="px-5 py-3 text-gray-600">
                    {p.paid_at
                      ? new Date(p.paid_at).toLocaleDateString()
                      : new Date(p.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3 text-gray-900">
                    {p.description || 'Payment'}
                  </td>
                  <td className="px-5 py-3 text-gray-600 capitalize">
                    {p.payment_type}
                  </td>
                  <td className="px-5 py-3 text-gray-900 font-medium">
                    ${p.amount}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[p.status] || 'bg-gray-100 text-gray-600'}`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
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
        </div>
      )}
    </div>
  )
}
