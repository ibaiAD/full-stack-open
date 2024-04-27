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
    removeBlog(state, action) {
      return state.filter((blog) => blog.id !== action.payload)
    },
  },
})

export const { addLike, appendBlog, setBlogs, removeBlog } = blogSlice.actions

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

export const likeBlog = (blog) => {
  return async (dispatch) => {
    const updatedBlog = await blogService.update(blog.id, blog)
    dispatch(addLike(updatedBlog))
  }
}

export const deleteBlog = (blogId) => {
  return async (dispatch) => {
    try {
      await blogService.remove(blogId)
      dispatch(removeBlog(blogId))
    } catch (exception) {
      console.error(exception)
      const errorMessage = exception?.response?.data?.error
      dispatch(
        setNotification({ message: errorMessage || 'error', type: 'error' }, 3)
      )
    }
  }
}

export default blogSlice.reducer
