const collection = require('lodash/collection')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => sum + item.likes

  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const maxLikes = Math.max(...blogs.map((blog) => blog.likes))
  return blogs.find((blog) => blog.likes === maxLikes)
}

const mostBlogs = (blogs) => {
  const authorBlogs = collection.countBy(blogs, (blog) => blog.author)
  const maxBlogs = Math.max(...Object.values(authorBlogs))

  return {
    author: Object.keys(authorBlogs).find(
      (author) => authorBlogs[author] === maxBlogs
    ),
    blogs: maxBlogs,
  }
}

const mostLikes = (blogs) => {
  const groupedByAuthor = collection.groupBy(blogs, (blog) => blog.author)

  const authorLikes = Object.entries(groupedByAuthor).map(([author, blogs]) => {
    return {
      author,
      likes: blogs.reduce((acc, curr) => acc + curr.likes, 0),
    }
  })
  const maxLikes = Math.max(...authorLikes.map((item) => item.likes))

  return authorLikes.find((item) => item.likes === maxLikes)
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
