import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { likeBlog } from '../reducers/blogReducer'

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
      <h2>
        {blog.title} {blog.author}
      </h2>
      <a href={blog.url}>{blog.url}</a>
      <div>
        <span>{blog.likes} likes</span>
        <button onClick={handleLike}>like</button>
      </div>
      <div>added by {blog?.user?.name}</div>
    </>
  )
}

export default BlogInfo
