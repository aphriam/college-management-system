import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await api.post('/auth/login/', { username, password })
      localStorage.setItem('access', res.data.access)
      localStorage.setItem('refresh', res.data.refresh)
      localStorage.setItem('role', res.data.role)
      navigate(`/${res.data.role}`)
    } catch (err) {
      setError('Invalid username or password')
    }
  }

    return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-600 to-white-700 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
        <h2 className="text-center text-2xl font-bold text-slate-800">College Login</h2>
        <p className="mb-6 mt-1 text-center text-sm text-slate-500">
          Sign in to your account
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="btn w-full">Login</button>
        </form>

        {error && (
          <p className="mt-4 rounded-md bg-red-50 p-3 text-center text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    </div>
  )
}
export default Login