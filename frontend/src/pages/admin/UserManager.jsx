import { useState, useEffect } from 'react'
import api from '../../api/axios'

function UserManager({ role }) {
    const [users, setUsers] = useState([])
    const [error, setError] = useState('')
    const [form, setForm] = useState({
        username: '', password: '', first_name: '', email: '',
    })
    const [submitting, setSubmitting] = useState(false)


    const loadUsers = async () => {
        try {
            const res = await api.get(`/auth/users/?role=${role}`)
            setUsers(res.data)
        } catch {
            setError('Could not load users')
        }
    }

    useEffect(() => {
        loadUsers()
    }, [role])

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (submitting) return
        setSubmitting(true)
        setError('')
        try {
            await api.post('/auth/users/', { ...form, role })
            setForm({ username: '', password: '', first_name: '', email: '' })
            loadUsers()
        } catch (err) {
            const data = err.response?.data
            setError(data?.username?.[0] || data?.detail || 'Could not add user')
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this user?')) return
        await api.delete(`/auth/users/${id}/`)
        loadUsers()
    }

    return (
        <div>
            <h2 className="mb-4 text-xl font-semibold capitalize text-slate-800">{role}s</h2>

            <form onSubmit={handleSubmit} className="card mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                <input name="username" placeholder="Username" className="input" value={form.username} onChange={handleChange} required />
                <input name="password" type="password" placeholder="Password" className="input" value={form.password} onChange={handleChange} required />
                <input name="first_name" placeholder="Name" className="input" value={form.first_name} onChange={handleChange} />
                <input name="email" type="email" placeholder="Email" className="input" value={form.email} onChange={handleChange} />
                <button type="submit" disabled={submitting} className="btn capitalize disabled:opacity-50">
                    {submitting ? 'Adding...' : `Add ${role}`}
                </button>      </form>

            {error && (
                <p className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</p>
            )}

            <div className="table-wrap">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="th">ID</th>
                            <th className="th">Username</th>
                            <th className="th">Name</th>
                            <th className="th">Email</th>
                            <th className="th">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {users.map((u) => (
                            <tr key={u.id} className="hover:bg-slate-50">
                                <td className="td">{u.id}</td>
                                <td className="td font-medium">{u.username}</td>
                                <td className="td">{u.first_name}</td>
                                <td className="td">{u.email}</td>
                                <td className="td">
                                    <button onClick={() => handleDelete(u.id)} className="btn-danger">Delete</button>
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && (
                            <tr><td colSpan="5" className="td text-center text-slate-400">No {role}s yet</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
export default UserManager