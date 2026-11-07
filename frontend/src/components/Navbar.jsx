import { useNavigate } from 'react-router-dom'

function Navbar({ title }) {
  const navigate = useNavigate()
  const role = localStorage.getItem('role')

  const handleLogout = () => {
    localStorage.clear()
    navigate('/')
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px', background: '#222', color: 'white' }}>
      <span>{title} ({role})</span>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Navbar