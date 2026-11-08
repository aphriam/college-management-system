import { NavLink, Outlet } from 'react-router-dom'
import Navbar from './Navbar'

function DashboardLayout({ title, links }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar title={title} />
      <div className="flex flex-col md:flex-row">
        <nav className="flex gap-1 overflow-x-auto border-b border-slate-200 bg-white p-3 md:min-h-[calc(100vh-56px)] md:w-56 md:flex-col md:border-b-0 md:border-r">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium ${
                  isActive
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-100'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout