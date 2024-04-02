import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  test('The form calls the event handler it received as props with right details', async () => {
    const createBlog = vi.fn()
    const user = userEvent.setup()

    render(
      <BlogForm createBlog={createBlog} />
    )

    const titleInput = screen.getByPlaceholderText('Title', { exact: false })
    const authorInput = screen.getByPlaceholderText('Author', { exact: false })
    const urlInput = screen.getByPlaceholderText('URL', { exact: false })

    const blog = {
      title: 'Test Blog',
      author: 'Tester',
      url: 'https://test-url.com',
    }

    await user.type(titleInput, blog.title)
    await user.type(authorInput, blog.author)
    await user.type(urlInput, blog.url)
    const sendButton = screen.getByText('create')
    await user.click(sendButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe(blog.title)
    expect(createBlog.mock.calls[0][0].author).toBe(blog.author)
    expect(createBlog.mock.calls[0][0].url).toBe(blog.url)
  })
})