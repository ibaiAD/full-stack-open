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
  }

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