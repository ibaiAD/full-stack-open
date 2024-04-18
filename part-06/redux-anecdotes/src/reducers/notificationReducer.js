import { createSlice } from "@reduxjs/toolkit";

const initialState = ''

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    changeNotification(_, action) {
      return action.payload
    },
    clearNotification() {
      return ''
    }
  }
})

export const { changeNotification, clearNotification } = notificationSlice.actions

let timeoutId

export const setNotification = (notificationText, activeTime = 5) => {
  return dispatch => {
    if (timeoutId) clearTimeout(timeoutId)

    dispatch(changeNotification(notificationText))

    timeoutId = setTimeout(() => {
      dispatch(clearNotification())
    }, activeTime * 1000);
  }
}

export default notificationSlice.reducer