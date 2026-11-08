import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import api from '../../api/axios'

function StudentDashboard() {
    const [rows, setRows] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const withPercent = rows.filter((r) => r.attendance_percent !== null)
    const overall = withPercent.length
        ? (withPercent.reduce((sum, r) => sum + r.attendance_percent, 0) / withPercent.length).toFixed(1)
        : null

    useEffect(() => {
        api
            .get('/student/summary/')
            .then((res) => setRows(res.data))
            .catch(() => setError('Could not load your data'))
            .finally(() => setLoading(false))
    }, [])

      return (
    <div className="min-h-screen bg-slate-50">
      <Navbar title="Student Dashboard" />
      <main className="mx-auto max-w-5xl p-4 md:p-8">
        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <div className="card">
            <p className="text-sm text-slate-500">Enrolled courses</p>
            <p className="text-3xl font-bold text-slate-800">{rows.length}</p>
          </div>
          <div className="card">
            <p className="text-sm text-slate-500">Average attendance</p>
            <p className={`text-3xl font-bold ${overall !== null && overall < 75 ? 'text-red-600' : 'text-green-600'}`}>
              {overall !== null ? `${overall}%` : '-'}
            </p>
          </div>
        </div>

        <h2 className="mb-4 text-xl font-semibold text-slate-800">My Courses</h2>

        {loading && <p className="text-slate-500">Loading...</p>}
        {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</p>}
        {!loading && !error && rows.length === 0 && (
          <p className="text-slate-500">You are not enrolled in any course yet.</p>
        )}

        {rows.length > 0 && (
          <div className="table-wrap">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="th">Code</th>
                  <th className="th">Course</th>
                  <th className="th">Teacher</th>
                  <th className="th">Marks</th>
                  <th className="th">Attendance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((r) => (
                  <tr key={r.course_id} className="hover:bg-slate-50">
                    <td className="td font-medium">{r.code}</td>
                    <td className="td">{r.name}</td>
                    <td className="td">{r.teacher || '-'}</td>
                    <td className="td">
                      {r.score !== null ? `${r.score} / ${r.max_score}` : 'Not entered'}
                    </td>
                    <td className="td">
                      {r.attendance_percent === null ? (
                        '-'
                      ) : (
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            r.attendance_percent < 75
                              ? 'bg-red-100 text-red-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {r.attendance_percent}% ({r.present}/{r.total_classes})
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}

export default StudentDashboard