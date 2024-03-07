const { describe, test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const app = require('../app')
const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

test('all blogs are returned as json', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('unique identifier property of the blog posts is named id', async () => {
  const blogs = await helper.blogsInDb()
  const firstBlog = blogs[0]

  assert('id' in firstBlog)
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: "test3",
    author: "Test Tester",
    url: "http://someurl.com/three",
    likes: 3,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map(blog => blog.title)
  assert(titles.includes(newBlog.title))
})

test('when adding a blog, if likes prop is missing it will default to 0', async () => {
  const newBlog = {
    title: "test4",
    author: "Test Tester",
    url: "http://someurl.com/four",
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)

  assert.strictEqual(response.body.likes, 0)
})

describe('status 400 when required parameters missing', () => {
  test('title', async () => {
    const newBlog = {
      author: "Test Tester",
      url: "http://someurl.com/five",
      likes: 5
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })

  test('url', async () => {
    const newBlog = {
      title: "test6",
      author: "Test Tester",
      likes: 6
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })

  test('title and url', async () => {
    const newBlog = {
      author: "Test Tester",
      likes: 7
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })
})

after(async () => {
  await mongoose.connection.close()
})