import DashboardLayout from '../../components/DashboardLayout'

const links = [
  { to: '/admin', label: 'Home', end: true },
  { to: '/admin/teachers', label: 'Teachers' },
  { to: '/admin/students', label: 'Students' },
  { to: '/admin/courses', label: 'Courses' },
]

function AdminLayout() {
  return <DashboardLayout title="Admin Panel" links={links} />
}

export default AdminLayout