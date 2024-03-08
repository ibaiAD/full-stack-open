const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const { body } = request
  const { title, url } = body

  if (!(title && url)) {
    return response.status(400).json({ error: 'required parameter missing' })
  }

  const blog = new Blog({
    ...body,
    likes: body.likes || 0
  })

  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
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