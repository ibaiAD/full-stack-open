import { useSelector } from 'react-redux'

export const Notification = () => {
  const notification = useSelector((state) => state.notification)
  const { message, type } = notification

  if (message === null) return

  const generalStyle = {
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }

  const errorStyle = {
    color: 'red',
  }

  const successStyle = {
    color: 'green',
  }

  const style =
    type === 'error'
      ? { ...generalStyle, ...errorStyle }
      : type === 'success'
        ? { ...generalStyle, ...successStyle }
        : { ...generalStyle }

  return (
    <div style={style} className={type}>
      {message}
    </div>
  )
}
