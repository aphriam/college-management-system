import { useState, useEffect } from 'react'
import api from '../../api/axios'

function Marks() {
  const [courses, setCourses] = useState([])
  const [courseId, setCourseId] = useState('')
  const [students, setStudents] = useState([])
  const [scores, setScores] = useState({})
  const [message, setMessage] = useState('')

  // 1. Load the teacher's courses once
  useEffect(() => {
    api.get('/teacher/courses/').then((res) => setCourses(res.data))
  }, [])

  // 2. When a course is chosen, load its students and existing marks
  useEffect(() => {
    if (!courseId) {
      setStudents([])
      setScores({})
      return
    }
    const course = courses.find((c) => c.id === Number(courseId))
    setStudents(course ? course.students : [])

    api.get(`/teacher/courses/${courseId}/marks/`).then((res) => {
      const map = {}
      res.data.forEach((m) => {
        map[m.student] = m.score
      })
      setScores(map)
    })
  }, [courseId, courses])

  const saveMark = async (studentId) => {
    const score = scores[studentId]
    if (score === undefined || score === '') return
    try {
      await api.post('/teacher/marks/', {
        course: Number(courseId),
        student: studentId,
        score: Number(score),
      })
      setMessage('Saved')
    } catch (err) {
      setMessage(JSON.stringify(err.response?.data))
    }
  }

   return (
    <div>
      <h2 className="mb-4 text-xl font-semibold text-slate-800">Marks</h2>

      <select className="input max-w-xs" value={courseId} onChange={(e) => setCourseId(e.target.value)}>
        <option value="">-- Select course --</option>
        {courses.map((c) => (
          <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
        ))}
      </select>

      {message && (
        <p className="mt-4 rounded-md bg-slate-100 p-3 text-sm text-slate-700">{message}</p>
      )}

      {courseId && (
        <div className="table-wrap mt-6">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="th">Student</th>
                <th className="th">Score (out of 100)</th>
                <th className="th">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((s) => (
                <tr key={s.id}>
                  <td className="td font-medium">{s.first_name || s.username}</td>
                  <td className="td">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      className="input w-28"
                      value={scores[s.id] ?? ''}
                      onChange={(e) => setScores({ ...scores, [s.id]: e.target.value })}
                    />
                  </td>
                  <td className="td">
                    <button onClick={() => saveMark(s.id)} className="btn">Save</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Marks