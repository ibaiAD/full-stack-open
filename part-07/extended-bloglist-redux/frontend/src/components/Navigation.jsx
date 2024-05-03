import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { logoutUser } from '../reducers/loginReducer'
import {
  AppBar,
  Box,
  Button,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'
import AccountCircle from '@mui/icons-material/AccountCircle'
import { useState } from 'react'

const Navigation = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.login)
  const [anchorElUser, setAnchorElUser] = useState(false)

  const handleLogout = () => {
    dispatch(logoutUser())
  }

  const handleOpenMenu = (e) => {
    setAnchorElUser(e.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorElUser(null)
  }

  return (
    <AppBar position="static" component="nav">
      <Toolbar>
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            gap: 2,
          }}
        >
          <Button component={Link} to="/" sx={{ color: 'inherit' }}>
            blogs
          </Button>
          <Button component={Link} to="/users" sx={{ color: 'inherit' }}>
            users
          </Button>
        </Box>
        <Box sx={{ flexGrow: 0 }}>
          <Tooltip title={user.name}>
            <IconButton color="inherit" onClick={handleOpenMenu}>
              <AccountCircle />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorElUser}
            open={Boolean(anchorElUser)}
            onClose={handleCloseMenu}
            keepMounted
          >
            <MenuItem onClick={handleCloseMenu}>
              <Typography component="span">{user.name}</Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <Typography color="error">logout</Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Navigation
