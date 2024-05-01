import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Routes, Route, Link } from 'react-router-dom'

import Togglable from './components/Togglable'
import { Notification } from './components/Notification'
import BlogForm from './components/BlogForm'
import BlogList from './components/BlogList'
import Users from './components/Users'
import { initializeBlogs } from './reducers/blogReducer'
import { initializeUser, loginUser, logoutUser } from './reducers/loginReducer'
import { initializeUsers } from './reducers/userReducer'
import UserInfo from './components/UserInfo'
import BlogInfo from './components/BlogInfo'
import Navigation from './components/Navigation'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const user = useSelector((state) => state.login)

  const dispatch = useDispatch()

  const blogFormRef = useRef()

  useEffect(() => {
    dispatch(initializeBlogs())
    dispatch(initializeUser())
    dispatch(initializeUsers())
  }, [dispatch])

  const handleLogin = async (e) => {
    e.preventDefault()
    dispatch(loginUser({ username, password }))
    setUsername('')
    setPassword('')
  }

  const handleLogout = () => {
    dispatch(logoutUser())
  }

  const loginForm = () => (
    <div>
      <h2>log in to application</h2>
      <Notification />
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            value={username}
            name="Username"
            data-testid="username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            name="Password"
            data-testid="password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )

  const BlogsView = () => (
    <>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm blogFormRef={blogFormRef} />
      </Togglable>
      <BlogList />
    </>
  )

  return (
    <div>
      {!user && loginForm()}
      {user && (
        <div>
          <Navigation />
          <h2>blog app</h2>
          <Notification />
          <Routes>
            <Route path="/users" element={<Users />} />
            <Route path="/users/:id" element={<UserInfo />} />
            <Route path="/blogs/:id" element={<BlogInfo />} />
            <Route path="/" element={<BlogsView />} />
          </Routes>
        </div>
      )}
    </div>
  )
}

export default App
