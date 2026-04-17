import { NavLink } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const landlordLinks = [
  { to: '/dashboard', label: 'Home' },
  { to: '/dashboard/properties', label: 'Properties' },
  { to: '/dashboard/memberships', label: 'Memberships' },
  { to: '/dashboard/cases', label: 'Cases' },
  { to: '/dashboard/payments', label: 'Payments' },
  { to: '/dashboard/profile', label: 'Profile' },
]

const adminLinks = [
  { to: '/admin', label: 'Overview' },
  { to: '/admin/cases', label: 'All Cases' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/memberships', label: 'Memberships' },
  { to: '/admin/financials', label: 'Financials' },
]

export default function Sidebar() {
  const { isAdmin } = useAuth()
  const links = isAdmin ? adminLinks : landlordLinks

  return (
    <aside className="w-60 bg-gray-50 border-r border-gray-200 min-h-screen p-4">
      <nav className="flex flex-col gap-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/dashboard' || link.to === '/admin'}
            className={({ isActive }) =>
              `px-3 py-2 rounded-md text-sm font-medium ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
