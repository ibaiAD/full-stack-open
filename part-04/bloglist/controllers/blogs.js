const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

blogsRouter.post('/', async (request, response, next) => {
  let decodedToken

  try {
    decodedToken = jwt.verify(request.token, process.env.SECRET)
  } catch (error) {
    return next(error)
  }

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const { body } = request
  const { title, url } = body

  if (!(title && url)) {
    return response.status(400).json({ error: 'required parameter missing' })
  }

  const user = await User.findById(decodedToken.id)

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

blogsRouter.delete('/:id', async (request, response, next) => {
  let decodedToken

  try {
    decodedToken = jwt.verify(request.token, process.env.SECRET)
  } catch (error) {
    return next(error)
  }

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  try {
    const blog = await Blog.findById(request.params.id)

    if (!blog) {
      return response.status(204).end()
    }

    if (blog.user.toString() !== decodedToken.id.toString()) {
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