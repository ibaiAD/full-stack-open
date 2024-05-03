import { useSelector } from 'react-redux'
import Blog from './Blog'
import { Stack } from '@mui/material'

const BlogList = () => {
  const blogs = useSelector((state) => {
    return [...state.blogs].sort((a, b) => b.likes - a.likes)
  })

  return (
    <Stack spacing={1}>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </Stack>
  )
}

export default BlogList
