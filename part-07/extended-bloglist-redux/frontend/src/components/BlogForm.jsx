import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createBlog } from '../reducers/blogReducer'
import { Box, Button, Paper, TextField, Typography } from '@mui/material'

const BlogForm = ({ blogFormRef }) => {
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogUrl, setNewBlogUrl] = useState('')
  const dispatch = useDispatch()

  const addBlog = (e) => {
    e.preventDefault()
    dispatch(
      createBlog({
        title: newBlogTitle,
        author: newBlogAuthor,
        url: newBlogUrl,
      })
    )

    setNewBlogTitle('')
    setNewBlogAuthor('')
    setNewBlogUrl('')
    blogFormRef.current.toggleVisibility()
  }

  return (
    <Paper elevation={2} sx={{ p: 3, my: 1 }}>
      <Typography variant="h5" component="h2">
        create new
      </Typography>

      <form onSubmit={addBlog}>
        <TextField
          label="title"
          value={newBlogTitle}
          onChange={({ target }) => setNewBlogTitle(target.value)}
          margin="dense"
          variant="standard"
          fullWidth
        />
        <TextField
          label="author"
          value={newBlogAuthor}
          onChange={({ target }) => setNewBlogAuthor(target.value)}
          margin="dense"
          variant="standard"
          fullWidth
        />
        <TextField
          label="url"
          value={newBlogUrl}
          onChange={({ target }) => setNewBlogUrl(target.value)}
          margin="dense"
          variant="standard"
          fullWidth
        />
        <Button
          type="submit"
          variant="outlined"
          color="success"
          sx={{ display: 'block', mx: 'auto', mt: 2 }}
        >
          create
        </Button>
      </form>
    </Paper>
  )
}

export default BlogForm
