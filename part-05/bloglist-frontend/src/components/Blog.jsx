import { useState } from "react"

const Blog = ({ blog, updateBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [visible, setVisible] = useState(false)
  const showWhenVisible = { display: visible ? '' : 'none' }

  const handleLike = async () => {
    const blogObject = {
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url,
    }

    await updateBlog(blog.id, blogObject)
  }

  return (
    <div style={blogStyle}>
      <section>
        {blog.title} {blog.author}
        &nbsp;
        <button onClick={() => setVisible(!visible)}>view</button>
      </section>
      <section style={showWhenVisible}>
        <article>{blog.url}</article>
        <article>
          likes {blog.likes}
          &nbsp;
          <button onClick={handleLike}>like</button>
        </article>
        <article>{blog.user?.name}</article>
      </section>
    </div>
  )
}

export default Blog