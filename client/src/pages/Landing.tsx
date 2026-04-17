import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-5xl mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl font-bold mb-4">RentShield</h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Guaranteed rent. Even when tenants stop paying. Protect your rental
            income with annual coverage for Massachusetts landlords.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/auth/signup"
              className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50"
            >
              Get Started
            </Link>
            <Link
              to="/auth/login"
              className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10"
            >
              Log In
            </Link>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              1
            </div>
            <h3 className="text-lg font-semibold mb-2">Sign Up & Add Property</h3>
            <p className="text-gray-600">
              Create your account and add your rental property details.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              2
            </div>
            <h3 className="text-lg font-semibold mb-2">Pay One Month's Rent</h3>
            <p className="text-gray-600">
              A single annual premium equal to one month's rent. No monthly fees.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              3
            </div>
            <h3 className="text-lg font-semibold mb-2">We Handle the Rest</h3>
            <p className="text-gray-600">
              If your tenant stops paying, file a claim and we manage the entire
              eviction process.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
