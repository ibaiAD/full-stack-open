import { Box, Button, TextField, Typography } from '@mui/material'
import Notification from './Notification'
import { useDispatch } from 'react-redux'
import { loginUser } from '../reducers/loginReducer'
import { useState } from 'react'

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()

  const handleLogin = async (e) => {
    e.preventDefault()
    dispatch(loginUser({ username, password }))
  }

  return (
    <Box maxWidth="sm" sx={{ mx: 'auto', '& button': { my: 2 } }}>
      <Typography
        variant="h4"
        component="h2"
        textAlign="center"
        marginBottom={2}
      >
        log in to application
      </Typography>
      <Notification />
      <form onSubmit={handleLogin}>
        <TextField
          label="username"
          value={username}
          name="Username"
          data-testid="username"
          onChange={({ target }) => setUsername(target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="password"
          type="password"
          value={password}
          name="Password"
          data-testid="password"
          onChange={({ target }) => setPassword(target.value)}
          fullWidth
          margin="normal"
        />
        <Button
          type="submit"
          variant="contained"
          color="success"
          fullWidth
          size="large"
        >
          login
        </Button>
      </form>
    </Box>
  )
}

export default LoginForm
