import { configureStore } from '@reduxjs/toolkit'
import notificationReducer from './reducers/notificationReducer'
import blogReducer from './reducers/blogReducer'
import loginReducer from './reducers/loginReducer'
import userReducer from './reducers/userReducer'

export const store = configureStore({
  reducer: {
    blogs: blogReducer,
    login: loginReducer,
    users: userReducer,
    notification: notificationReducer,
  },
})
