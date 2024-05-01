import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { createComment } from '../reducers/blogReducer'

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
    <>
      <h3>comments</h3>
      <form onSubmit={handleSubmit}>
        <input name="comment" />
        <button type="submit">add comment</button>
      </form>
      <ul>
        {blog.comments.map((comment) => (
          <li key={comment.id}>{comment.content}</li>
        ))}
      </ul>
    </>
  )
}

export default BlogComments
