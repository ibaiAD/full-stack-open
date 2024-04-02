import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  let container

  const blog = {
    title: 'Test Blog',
    author: 'Tester',
    url: 'https://test-url.com',
    likes: 3,
    user: {
      id: '123id456',
      name: 'TestUser',
      username: 'tester'
    }
  }

  describe('<Blog blog={blog} />', () => {
    beforeEach(() => {
      container = render(
        <Blog blog={blog} />
      ).container
    })

    test('by default displays title and author but not url and likes', () => {
      const mainContent = container.querySelector('.mainContent')
      const togglableContent = container.querySelector('.togglableContent')

      expect(mainContent).not.toHaveStyle('display: none')
      expect(mainContent).toHaveTextContent(
        `${blog.title} ${blog.author}`
      )
      expect(togglableContent).toHaveStyle('display: none')
    })

    test('url and number of likes are shown when the button has been clicked', async () => {
      const user = userEvent.setup()
      const button = screen.getByText('view')
      await user.click(button)

      const togglableContent = container.querySelector('.togglableContent')
      expect(togglableContent).not.toHaveStyle('display: none')
      expect(togglableContent).toHaveTextContent(blog.url)
      expect(togglableContent).toHaveTextContent(`likes ${blog.likes}`)
    })
  })

  describe('<Blog blog={blog} updateBlog={updateBlog} />', () => {
    test('updateBlog is called twice when like button is clicked twice', async () => {
      const mockHandler = vi.fn()

      container = render(
        <Blog blog={blog} updateBlog={mockHandler} />
      ).container

      const user = userEvent.setup()
      const button = screen.getByText('like')
      await user.click(button)
      await user.click(button)

      expect(mockHandler.mock.calls).toHaveLength(2)
    })
  })

})