const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: "test1",
    author: "Test Tester",
    url: "http://someurl.com/one",
    likes: 1,
  },
  {
    title: "test2",
    author: "Test Tester",
    url: "http://someurl.com/two",
    likes: 2,
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, blogsInDb
}