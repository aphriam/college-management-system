import DashboardLayout from '../../components/DashboardLayout'

const links = [
  { to: '/teacher', label: 'My Courses', end: true },
  { to: '/teacher/marks', label: 'Marks' },
  { to: '/teacher/attendance', label: 'Attendance' },
]

function TeacherLayout() {
  return <DashboardLayout title="Teacher Panel" links={links} />
}

export default TeacherLayout