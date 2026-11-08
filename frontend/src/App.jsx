import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import AdminDashboard from './pages/admin/AdminDashboard'
import TeacherDashboard from './pages/teacher/TeacherDashboard'
import StudentDashboard from './pages/student/StudentDashboard'
import AdminLayout from './pages/admin/AdminLayout'
import UserManager from './pages/admin/UserManager'
import Courses from './pages/admin/Courses'
import TeacherLayout from './pages/teacher/TeacherLayout'
import Marks from './pages/teacher/Marks'
import Attendance from './pages/teacher/Attendance'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="teachers" element={<UserManager key="teacher" role="teacher" />} />
          <Route path="students" element={<UserManager key="student" role="student" />} />
          <Route path="courses" element={<Courses />} />
        </Route>
        <Route
          path="/teacher"
          element={
            <ProtectedRoute allowedRole="teacher">
              <TeacherLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<TeacherDashboard />} />
          <Route path="marks" element={<Marks />} />
          <Route path="attendance" element={<Attendance />} />
        </Route>
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App