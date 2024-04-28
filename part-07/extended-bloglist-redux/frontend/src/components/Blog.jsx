import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteBlog, likeBlog } from '../reducers/blogReducer'

const Blog = ({ blog }) => {
  const dispatch = useDispatch()

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const [visible, setVisible] = useState(false)
  const showWhenVisible = { display: visible ? '' : 'none' }
  const user = useSelector((state) => state.login)

  const handleLike = async () => {
    const blogObject = {
      ...blog,
      user: blog.user.id,
      likes: blog.likes + 1,
    }

    dispatch(likeBlog(blogObject))
  }

  const handleRemove = () => {
    if (!window.confirm('delete?')) return
    dispatch(deleteBlog(blog.id))
  }

  return (
    <div style={blogStyle}>
      <section className="mainContent">
        {blog.title} {blog.author}
        &nbsp;
        <button onClick={() => setVisible(!visible)}>
          {visible ? 'hide' : 'view'}
        </button>
      </section>
      <section style={showWhenVisible} className="togglableContent">
        <article>{blog.url}</article>
        <article>
          likes {blog.likes}
          &nbsp;
          <button onClick={handleLike}>like</button>
        </article>
        <article>{blog.user?.name}</article>
        {user?.name === blog.user?.name && (
          <button style={{ backgroundColor: '#4286f6' }} onClick={handleRemove}>
            remove
          </button>
        )}
      </section>
    </div>
  )
}

export default Blog
