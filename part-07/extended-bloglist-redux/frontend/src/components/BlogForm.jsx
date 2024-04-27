import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createBlog } from '../reducers/blogReducer'

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
    <div>
      <h2>create new</h2>

      <form onSubmit={addBlog}>
        <div>
          title
          <input
            type="text"
            value={newBlogTitle}
            onChange={({ target }) => setNewBlogTitle(target.value)}
            placeholder="Title of the new blog..."
          />
        </div>
        <div>
          author
          <input
            type="text"
            value={newBlogAuthor}
            onChange={({ target }) => setNewBlogAuthor(target.value)}
            placeholder="Author of the new blog..."
          />
        </div>
        <div>
          url
          <input
            type="text"
            value={newBlogUrl}
            onChange={({ target }) => setNewBlogUrl(target.value)}
            placeholder="URL of the new blog..."
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm
