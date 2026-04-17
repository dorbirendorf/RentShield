import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import ResetPassword from './pages/auth/ResetPassword'
import DashboardLayout from './components/layout/DashboardLayout'
import DashboardHome from './pages/dashboard/Home'
import Properties from './pages/dashboard/Properties'
import PropertyNew from './pages/dashboard/PropertyNew'
import PropertyDetail from './pages/dashboard/PropertyDetail'
import Memberships from './pages/dashboard/Memberships'
import MembershipDetail from './pages/dashboard/MembershipDetail'
import Payments from './pages/dashboard/Payments'
import Profile from './pages/dashboard/Profile'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<Signup />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />

        {/* Landlord Dashboard */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="properties" element={<Properties />} />
          <Route path="properties/new" element={<PropertyNew />} />
          <Route path="properties/:id" element={<PropertyDetail />} />
          <Route path="memberships" element={<Memberships />} />
          <Route path="memberships/:id" element={<MembershipDetail />} />
          <Route path="payments" element={<Payments />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
