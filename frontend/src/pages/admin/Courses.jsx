import { Fragment, useState, useEffect } from 'react'
import api from '../../api/axios'

function Courses() {
  const [courses, setCourses] = useState([])
  const [teachers, setTeachers] = useState([])
  const [students, setStudents] = useState([])
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ name: '', code: '', teacher: '', students: [] })

  // editing an existing course
  const [editingId, setEditingId] = useState(null)
  const [editTeacher, setEditTeacher] = useState('')
  const [editStudents, setEditStudents] = useState([])

  const loadAll = async () => {
    try {
      const [c, t, s] = await Promise.all([
        api.get('/courses/'),
        api.get('/auth/users/?role=teacher'),
        api.get('/auth/users/?role=student'),
      ])
      setCourses(c.data)
      setTeachers(t.data)
      setStudents(s.data)
    } catch {
      setError('Could not load data')
    }
  }

  useEffect(() => {
    loadAll()
  }, [])

  // add the id if missing, remove it if present
  const toggleId = (list, id) =>
    list.includes(id) ? list.filter((x) => x !== id) : [...list, id]

  const errorText = (err) => {
    const data = err.response?.data
    if (!data) return 'Something went wrong'
    if (data.detail) return data.detail
    return Object.values(data).flat().join(' ')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    setError('')
    try {
      await api.post('/courses/', { ...form, teacher: form.teacher || null })
      setForm({ name: '', code: '', teacher: '', students: [] })
      loadAll()
    } catch (err) {
      setError(errorText(err))
    } finally {
      setSubmitting(false)
    }
  }

  const startEdit = (c) => {
    setEditingId(c.id)
    setEditTeacher(c.teacher ?? '')
    setEditStudents(c.students)
  }

  const saveEdit = async () => {
    setError('')
    try {
      await api.patch(`/courses/${editingId}/`, {
        teacher: editTeacher || null,
        students: editStudents,
      })
      setEditingId(null)
      loadAll()
    } catch (err) {
      setError(errorText(err))
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course?')) return
    await api.delete(`/courses/${id}/`)
    loadAll()
  }

  const studentLabel = (s) => s.first_name ? `${s.first_name} (${s.username})` : s.username

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold text-slate-800">Courses</h2>

      {/* Create form */}
      <form onSubmit={handleSubmit} className="card mb-6 grid gap-3 sm:grid-cols-2">
        <input
          placeholder="Course name"
          className="input"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          placeholder="Code (e.g. CS201)"
          className="input"
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
          required
        />
        <select
          className="input"
          value={form.teacher}
          onChange={(e) => setForm({ ...form, teacher: e.target.value })}
        >
          <option value="">-- Teacher --</option>
          {teachers.map((t) => (
            <option key={t.id} value={t.id}>{t.username}</option>
          ))}
        </select>

        <div className="max-h-32 overflow-y-auto rounded-md border border-slate-300 p-2">
          <p className="mb-1 text-xs font-semibold text-slate-500">Students</p>
          {students.length === 0 && (
            <p className="text-xs text-slate-400">No students created yet.</p>
          )}
          {students.map((s) => (
            <label key={s.id} className="flex cursor-pointer items-center gap-2 py-0.5 text-sm">
              <input
                type="checkbox"
                className="accent-indigo-600"
                checked={form.students.includes(s.id)}
                onChange={() => setForm({ ...form, students: toggleId(form.students, s.id) })}
              />
              {studentLabel(s)}
            </label>
          ))}
        </div>

        <button type="submit" disabled={submitting} className="btn sm:col-span-2 sm:w-40 disabled:opacity-50">
          {submitting ? 'Adding...' : 'Add course'}
        </button>
      </form>

      {error && (
        <p className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</p>
      )}

      {/* Course table */}
      <div className="table-wrap">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="th">Code</th>
              <th className="th">Name</th>
              <th className="th">Teacher</th>
              <th className="th">Students</th>
              <th className="th">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {courses.map((c) => (
              <Fragment key={c.id}>
                <tr className="hover:bg-slate-50">
                  <td className="td font-medium">{c.code}</td>
                  <td className="td">{c.name}</td>
                  <td className="td">{c.teacher_name || '-'}</td>
                  <td className="td">{c.student_count}</td>
                  <td className="td space-x-2">
                    <button onClick={() => startEdit(c)} className="btn">Manage</button>
                    <button onClick={() => handleDelete(c.id)} className="btn-danger">Delete</button>
                  </td>
                </tr>

                {editingId === c.id && (
                  <tr className="bg-indigo-50">
                    <td colSpan="5" className="px-4 py-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <p className="mb-1 text-xs font-semibold text-slate-500">Teacher</p>
                          <select
                            className="input"
                            value={editTeacher}
                            onChange={(e) => setEditTeacher(e.target.value)}
                          >
                            <option value="">-- No teacher --</option>
                            {teachers.map((t) => (
                              <option key={t.id} value={t.id}>{t.username}</option>
                            ))}
                          </select>
                        </div>
                        <div className="max-h-40 overflow-y-auto rounded-md border border-slate-300 bg-white p-2">
                          <p className="mb-1 text-xs font-semibold text-slate-500">Enrolled students</p>
                          {students.map((s) => (
                            <label key={s.id} className="flex cursor-pointer items-center gap-2 py-0.5 text-sm">
                              <input
                                type="checkbox"
                                className="accent-indigo-600"
                                checked={editStudents.includes(s.id)}
                                onChange={() => setEditStudents(toggleId(editStudents, s.id))}
                              />
                              {studentLabel(s)}
                            </label>
                          ))}
                        </div>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <button onClick={saveEdit} className="btn">Save changes</button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="rounded-md bg-white px-4 py-2 text-sm font-medium text-slate-600 ring-1 ring-slate-300 hover:bg-slate-100"
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Courses