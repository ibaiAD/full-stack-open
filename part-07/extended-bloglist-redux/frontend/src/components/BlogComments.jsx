import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { createComment } from '../reducers/blogReducer'
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from '@mui/material'

const BlogComments = () => {
  const dispatch = useDispatch()
  const { id } = useParams()
  const blog = useSelector((state) =>
    state.blogs.find((blog) => blog.id === id)
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    const content = e.target.comment.value
    dispatch(createComment(id, content))
    e.target.comment.value = ''
  }

  return (
    <Box sx={{ my: 2 }}>
      <Typography component="h4" variant="h5">
        comments
      </Typography>
      {blog?.comments?.length > 0 && (
        <Paper variant="outlined" sx={{ my: 1 }}>
          <List dense sx={{ p: 0 }}>
            {blog.comments.map((comment, i, arr) => (
              <ListItem key={comment.id} divider={i < arr.length - 1}>
                <ListItemText primary={comment.content} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
      <form onSubmit={handleSubmit}>
        <TextField name="comment" rows={3} multiline fullWidth />
        <Button type="submit" variant="contained" fullWidth color="success">
          add comment
        </Button>
      </form>
    </Box>
  )
}

export default BlogComments
