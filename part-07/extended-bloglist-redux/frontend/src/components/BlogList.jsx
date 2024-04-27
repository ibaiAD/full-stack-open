import { useSelector } from 'react-redux'
import Blog from './Blog'

const BlogList = ({ user }) => {
  const blogs = useSelector((state) => {
    return [...state.blogs].sort((a, b) => b.likes - a.likes)
  })

  return (
    <>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} user={user} />
      ))}
    </>
  )
}

export default BlogList
