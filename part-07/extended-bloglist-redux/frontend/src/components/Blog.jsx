import { Paper, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

const Blog = ({ blog }) => {
  return (
    <Paper
      elevation={2}
      component={Link}
      to={`/blogs/${blog.id}`}
      sx={{ py: 1, px: 2, textDecoration: 'none' }}
    >
      <Typography variant="h6" component="span" color="primary">
        {blog.title} - {blog.author}
      </Typography>
    </Paper>
  )
}

export default Blog
