import { useNavigate } from 'react-router-dom'

function Navbar({ title }) {
  const navigate = useNavigate()
  const role = localStorage.getItem('role')

  const handleLogout = () => {
    localStorage.clear()
    navigate('/')
  }

  return (
    <header className="flex items-center justify-between bg-indigo-700 px-6 py-3 text-white shadow">
      <h1 className="text-lg font-semibold">{title}</h1>
      <div className="flex items-center gap-4">
        <span className="rounded-full bg-indigo-500 px-3 py-1 text-xs font-medium capitalize">
          {role}
        </span>
        <button
          onClick={handleLogout}
          className="rounded-md bg-white px-3 py-1.5 text-sm font-medium text-indigo-700 hover:bg-indigo-100"
        >
          Logout
        </button>
      </div>
    </header>
  )
}

export default Navbar