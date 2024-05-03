import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { likeBlog } from '../reducers/blogReducer'
import BlogComments from './BlogComments'
import { Box, IconButton, Link, Typography } from '@mui/material'
import { FavoriteBorder } from '@mui/icons-material'

const BlogInfo = () => {
  const dispatch = useDispatch()
  const { id } = useParams()
  const blog = useSelector((state) =>
    state.blogs.find((blog) => blog.id === id)
  )

  if (!blog) return null

  const handleLike = async () => {
    const blogObject = {
      ...blog,
      user: blog.user.id,
      likes: blog.likes + 1,
    }

    dispatch(likeBlog(blogObject))
  }

  return (
    <>
      <Typography variant="h5" component="h3">
        {blog.title} - {blog.author}
      </Typography>
      <Link href={blog.url} variant="body1">
        {blog.url}
      </Link>
      <Box sx={{ my: 1 }}>
        <Typography component="span" variant="body1">
          Likes:
        </Typography>
        <IconButton aria-label="like" color="error" onClick={handleLike}>
          <Typography component="span" variant="body1">
            {blog.likes}
          </Typography>
          <FavoriteBorder />
        </IconButton>
      </Box>
      <Box>
        <Typography
          component="span"
          variant="body2"
          sx={{ fontWeight: 'bold', mr: 1 }}
        >
          added by:
        </Typography>
        <Typography component="span" variant="body1">
          {blog?.user?.name}
        </Typography>
      </Box>
      <BlogComments />
    </>
  )
}

export default BlogInfo
