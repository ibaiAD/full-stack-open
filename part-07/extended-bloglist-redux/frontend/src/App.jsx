import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Routes, Route } from 'react-router-dom'
import { Box, Container, Typography } from '@mui/material'

import Togglable from './components/Togglable'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import BlogList from './components/BlogList'
import Users from './components/Users'
import { initializeBlogs } from './reducers/blogReducer'
import { initializeUser } from './reducers/loginReducer'
import { initializeUsers } from './reducers/userReducer'
import UserInfo from './components/UserInfo'
import BlogInfo from './components/BlogInfo'
import Navigation from './components/Navigation'
import LoginForm from './components/LoginForm'

const App = () => {
  const user = useSelector((state) => state.login)
  const dispatch = useDispatch()

  const blogFormRef = useRef()

  useEffect(() => {
    dispatch(initializeBlogs())
    dispatch(initializeUser())
    dispatch(initializeUsers())
  }, [dispatch])

  const BlogsView = () => (
    <>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm blogFormRef={blogFormRef} />
      </Togglable>
      <BlogList />
    </>
  )

  return (
    <Container maxWidth="md" sx={{ minHeight: '100vh' }}>
      {!user && <LoginForm />}
      {user && (
        <Box>
          <Navigation />
          <Typography variant="h3" component="h2" sx={{ mt: 1, mb: 2 }}>
            Blog app
          </Typography>
          <Notification />
          <Routes>
            <Route path="/users" element={<Users />} />
            <Route path="/users/:id" element={<UserInfo />} />
            <Route path="/blogs/:id" element={<BlogInfo />} />
            <Route path="/" element={<BlogsView />} />
          </Routes>
        </Box>
      )}
    </Container>
  )
}

export default App
