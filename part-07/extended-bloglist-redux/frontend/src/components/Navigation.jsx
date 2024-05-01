import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { logoutUser } from '../reducers/loginReducer'

const Navigation = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.login)

  const navStyle = {
    display: 'flex',
    justifyContent: 'space-evenly',
    backgroundColor: '#AAA',
  }

  const handleLogout = () => {
    dispatch(logoutUser())
  }

  return (
    <nav style={navStyle}>
      <ul style={{ display: 'flex', listStyle: 'none', gap: '1em' }}>
        <li>
          <Link to="/">blogs</Link>
        </li>
        <li>
          <Link to="/users">users</Link>
        </li>
      </ul>
      <p>
        <span>{user.name} logged in</span>
        &nbsp;
        <button onClick={handleLogout}>logout</button>
      </p>
    </nav>
  )
}

export default Navigation
