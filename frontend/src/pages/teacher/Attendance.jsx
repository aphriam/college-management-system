import { useState, useEffect } from 'react'
import api from '../../api/axios'

function Attendance() {
    const [courses, setCourses] = useState([])
    const [courseId, setCourseId] = useState('')
    const [date, setDate] = useState(new Date().toLocaleDateString('en-CA'))
    const [students, setStudents] = useState([])
    const [status, setStatus] = useState({})
    const [message, setMessage] = useState('')

    useEffect(() => {
        api.get('/teacher/courses/').then((res) => setCourses(res.data))
    }, [])

    useEffect(() => {
        if (!courseId || !date) {
            setStudents([])
            setStatus({})
            return
        }
        const course = courses.find((c) => c.id === Number(courseId))
        const list = course ? course.students : []
        setStudents(list)

        api
            .get(`/teacher/attendance/?course=${courseId}&date=${date}`)
            .then((res) => {
                const map = {}
                list.forEach((s) => {
                    map[s.id] = 'present'
                })
                res.data.forEach((r) => {
                    map[r.student] = r.status
                })
                setStatus(map)
            })
    }, [courseId, date, courses])

    const toggle = (studentId) => {
        setStatus({
            ...status,
            [studentId]: status[studentId] === 'present' ? 'absent' : 'present',
        })
    }

    const handleSave = async () => {
        const records = students.map((s) => ({
            student: s.id,
            status: status[s.id] || 'present',
        }))
        try {
            const res = await api.post('/teacher/attendance/', {
                course: Number(courseId),
                date,
                records,
            })
            setMessage(`Saved attendance for ${res.data.saved} student(s)`)
        } catch (err) {
            setMessage(JSON.stringify(err.response?.data))
        }
    }

    return (
        <div>
            <h2 className="mb-4 text-xl font-semibold text-slate-800">Attendance</h2>

            <div className="flex flex-wrap gap-3">
                <select className="input max-w-xs" value={courseId} onChange={(e) => setCourseId(e.target.value)}>
                    <option value="">-- Select course --</option>
                    {courses.map((c) => (
                        <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
                    ))}
                </select>
                <input
                    type="date"
                    className="input max-w-xs"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
            </div>

            {message && (
                <p className="mt-4 rounded-md bg-slate-100 p-3 text-sm text-slate-700">{message}</p>
            )}

            {courseId && (
                <div className="mt-6">
                    <div className="table-wrap">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="th">Student</th>
                                    <th className="th">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {students.map((s) => (
                                    <tr key={s.id}>
                                        <td className="td font-medium">{s.first_name || s.username}</td>
                                        <td className="td">
                                            <label className="flex cursor-pointer items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    className="h-4 w-4 accent-indigo-600"
                                                    checked={status[s.id] === 'present'}
                                                    onChange={() => toggle(s.id)}
                                                />
                                                <span
                                                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${status[s.id] === 'present'
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-red-100 text-red-700'
                                                        }`}
                                                >
                                                    {status[s.id] === 'present' ? 'Present' : 'Absent'}
                                                </span>
                                            </label>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <button onClick={handleSave} className="btn mt-4">Save attendance</button>
                </div>
            )}
        </div>
    )
}

export default Attendance