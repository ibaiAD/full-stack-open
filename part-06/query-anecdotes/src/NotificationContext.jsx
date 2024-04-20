import { createContext, useContext, useReducer } from "react"

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return action.payload
    case 'CLEAR':
      return ''

    default:
      return state
  }
}

const NotificationContext = createContext()

export const NotificationContextProvider = ({ children }) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, '')

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {children}
    </NotificationContext.Provider>
  )
}

let timeoutId

export const setNotification = (dispatch, notificationText, activeTime = 5) => {
  if (timeoutId) clearTimeout(timeoutId)

  dispatch({ type: 'SET', payload: notificationText })

  timeoutId = setTimeout(() => {
    dispatch({ type: 'CLEAR' })
  }, activeTime * 1000);
}

export const useNotificationValue = () => {
  const [notification] = useContext(NotificationContext)
  return notification
}

export const useNotificationDispatch = () => {
  const [, dispatch] = useContext(NotificationContext)
  return dispatch
}

export default NotificationContext