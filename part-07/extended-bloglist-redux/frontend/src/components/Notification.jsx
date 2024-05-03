import { Alert } from '@mui/material'
import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector((state) => state.notification)
  const { message, type } = notification

  if (message === null) return

  const types = {
    success: 'success',
    error: 'error',
    default: 'info',
  }

  return <Alert severity={types[type] || types.default}>{message}</Alert>
}

export default Notification
