const blogsRouter = require('express').Router()
const middleware = require('../utils/middleware')
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response, next) => {
  const { body, user } = request
  const { title, url } = body

  if (!(title && url)) {
    return response.status(400).json({ error: 'required parameter missing' })
  }

  const blog = new Blog({
    ...body,
    likes: body.likes || 0,
    user: user.id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog.id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response, next) => {
  const { user } = request

  try {
    const blog = await Blog.findById(request.params.id)

    if (!blog) {
      return response.status(204).end()
    }

    if (blog.user.toString() !== user.id.toString()) {
      return response.status(403).json({ error: 'invalid user' })
    }

    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})


blogsRouter.put('/:id', async (request, response, next) => {
  const { body, params: { id } } = request
  const { title, author, url, likes } = body

  if (!(title && url)) {
    return response.status(400).json({ error: 'required parameter missing' })
  }

  const blog = {
    title,
    author,
    url,
    likes: likes || 0
  }

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(id, blog, { new: true })

    if (!updatedBlog) {
      return response.status(404).end()
    }
    response.json(updatedBlog)
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter