import { useState, useEffect } from 'react'
import api from '../../api/axios'

function TeacherDashboard() {
  const [courses, setCourses] = useState([])

  useEffect(() => {
    api.get('/teacher/courses/').then((res) => setCourses(res.data))
  }, [])

    return (
    <div>
      <h2 className="mb-4 text-xl font-semibold text-slate-800">My Courses</h2>
      {courses.length === 0 && <p className="text-slate-500">No courses assigned yet.</p>}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {courses.map((c) => (
          <div key={c.id} className="card">
            <span className="rounded bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700">
              {c.code}
            </span>
            <h3 className="mt-2 text-lg font-semibold text-slate-800">{c.name}</h3>
            <p className="mb-2 text-sm text-slate-500">{c.students.length} student(s)</p>
            <ul className="list-inside list-disc text-sm text-slate-700">
              {c.students.map((s) => (
                <li key={s.id}>{s.first_name || s.username}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TeacherDashboard