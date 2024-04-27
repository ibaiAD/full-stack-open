import { useState, useEffect, useRef } from 'react'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import { Notification } from './components/Notification'
import BlogForm from './components/BlogForm'
import { setNotification } from './reducers/notificationReducer'
import { useDispatch } from 'react-redux'
import { initializeBlogs } from './reducers/blogReducer'
import BlogList from './components/BlogList'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const dispatch = useDispatch()

  const blogFormRef = useRef()

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.error(exception)
      const errorMessage = exception?.response?.data?.error
      dispatch(
        setNotification({ message: errorMessage || 'error', type: 'error' }, 3)
      )
    }
  }

  /*
  const updateBlog = async (id, blogObject) => {
    const returnedBlog = await blogService.update(id, blogObject)
    setBlogs(
      blogs
        .map((b) => (b.id !== id ? b : returnedBlog))
        .sort((a, b) => b.likes - a.likes)
    )
  }
  */

  /*
  const deleteBlog = async (id) => {
    try {
      await blogService.remove(id)
      setBlogs(blogs.filter((b) => b.id !== id))
    } catch (exception) {
      console.error(exception)
      const errorMessage = exception?.response?.data?.error
      dispatch(
        setNotification({ message: errorMessage || 'error', type: 'error' }, 3)
      )
    }
  }
  */

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
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

  return (
    <div>
      {!user && loginForm()}
      {user && (
        <div>
          <h2>blogs</h2>
          <Notification />
          <p>
            {user.name} logged in
            <button onClick={handleLogout}>logout</button>
          </p>
          <Togglable buttonLabel="new blog" ref={blogFormRef}>
            <BlogForm blogFormRef={blogFormRef} />
          </Togglable>
          <BlogList />
        </div>
      )}
    </div>
  )
}

export default App
