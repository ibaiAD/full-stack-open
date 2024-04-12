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
export default notificationSlice.reducer