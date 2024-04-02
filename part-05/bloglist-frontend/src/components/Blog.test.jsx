import { render } from '@testing-library/react'
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
})