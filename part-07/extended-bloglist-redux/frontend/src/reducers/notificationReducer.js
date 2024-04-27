import { createSlice } from '@reduxjs/toolkit'

const initialState = { message: null, type: null }

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    changeNotification(_, action) {
      return action.payload
    },
    clearNotification() {
      return initialState
    },
  },
})

export const { changeNotification, clearNotification } =
  notificationSlice.actions

let timeoutId

export const setNotification = (notification, activeTime = 5) => {
  return (dispatch) => {
    if (timeoutId) clearTimeout(timeoutId)

    dispatch(changeNotification(notification))

    timeoutId = setTimeout(() => {
      dispatch(clearNotification())
    }, activeTime * 1000)
  }
}

export default notificationSlice.reducer
