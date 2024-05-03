import {
  Box,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

const UserInfo = () => {
  const { id } = useParams()
  const user = useSelector((state) =>
    state.users.find((user) => user.id === id)
  )

  if (!user) return null

  return (
    <>
      <Typography component="h3" variant="h4">
        {user.name}
      </Typography>
      <Box sx={{ my: 2 }}>
        <Typography component="h4" variant="h5">
          added blogs
        </Typography>
        <Paper variant="outlined" sx={{ my: 1 }}>
          <List dense sx={{ p: 0 }}>
            {user.blogs.map((blog, i, arr) => (
              <ListItem key={blog.id} divider={i < arr.length - 1}>
                <ListItemText primary={blog.title} />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
    </>
  )
}

export default UserInfo
