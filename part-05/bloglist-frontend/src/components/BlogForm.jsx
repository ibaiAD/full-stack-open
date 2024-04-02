import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogUrl, setNewBlogUrl] = useState('')

  const addBlog = (e) => {
    e.preventDefault()
    createBlog({
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogUrl,
    })

    setNewBlogTitle('')
    setNewBlogAuthor('')
    setNewBlogUrl('')
  }

  return (
    <div>
      <h2>create new</h2>

      <form onSubmit={addBlog}>
        <div>
          title
          <input
            type='text'
            value={newBlogTitle}
            onChange={({ target }) => setNewBlogTitle(target.value)}
            placeholder='Title of the new blog...'
          />
        </div>
        <div>
          author
          <input
            type='text'
            value={newBlogAuthor}
            onChange={({ target }) => setNewBlogAuthor(target.value)}
            placeholder='Author of the new blog...'
          />
        </div>
        <div>
          url
          <input
            type='text'
            value={newBlogUrl}
            onChange={({ target }) => setNewBlogUrl(target.value)}
            placeholder='URL of the new blog...'
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm