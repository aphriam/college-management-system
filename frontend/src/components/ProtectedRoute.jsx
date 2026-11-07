import { Navigate } from 'react-router-dom'

function ProtectedRoute({ allowedRole, children }) {
  const token = localStorage.getItem('access')
  const role = localStorage.getItem('role')

  if (!token) {
    return <Navigate to="/" replace />
  }

  if (role !== allowedRole) {
    return <Navigate to={`/${role}`} replace />
  }

  return children
}

export default ProtectedRoute