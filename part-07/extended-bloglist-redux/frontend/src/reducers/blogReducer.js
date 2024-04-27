import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import { setNotification } from './notificationReducer'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    addLike(state, action) {
      const { id } = action.payload
      return state.map((blog) => (blog.id !== id ? blog : action.payload))
    },
    appendBlog(state, action) {
      state.push(action.payload)
    },
    setBlogs(_, action) {
      return action.payload
    },
  },
})

export const { appendBlog, setBlogs } = blogSlice.actions

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = (blog) => {
  return async (dispatch) => {
    try {
      const newBlog = await blogService.create(blog)
      dispatch(appendBlog(newBlog))
      const succesMessage = `a new blog ${newBlog.title} by ${newBlog.author} added`
      dispatch(setNotification({ message: succesMessage, type: 'success' }, 3))
    } catch (exception) {
      const errorMessage = exception?.response?.data?.error
      dispatch(
        setNotification({ message: errorMessage || 'error', type: 'error' }, 3)
      )
    }
  }
}

export default blogSlice.reducer
