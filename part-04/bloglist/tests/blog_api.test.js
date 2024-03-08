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

describe('addition of a new blog', () => {
  test('succeeds with status code 201 with valid data', async () => {
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

  test('if likes prop is missing it will default to 0', async () => {
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

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
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

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
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

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
  })
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

    const titles = blogsAtEnd.map(b => b.title)
    assert(!titles.includes(blogToDelete.title))
  })

  test('succeeds with status code 204 if id non exists', async () => {
    const nonExistingId = await helper.nonExistingId()

    await api
      .delete(`/api/blogs/${nonExistingId}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('fails with status code 400 if id is malformatted', async () => {
    const nonExistingId = '123'

    await api
      .delete(`/api/blogs/${nonExistingId}`)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })
})

describe('update of a blog', () => {
  test('succeeds with status code 200 if id is valid and has required params', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    const updatedBlog = {
      ...blogToUpdate,
      likes: 20
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    assert.strictEqual(blogsAtEnd.find(({ id }) => id === blogToUpdate.id).likes, updatedBlog.likes)
  })

  test('fails with status 404 if id non exists', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    const nonExistingId = await helper.nonExistingId()

    await api
      .put(`/api/blogs/${nonExistingId}`)
      .send(blogToUpdate)
      .expect(404)
  })

  test('fails with status code 400 if id is malformatted', async () => {
    const nonExistingId = '123'

    await api
      .put(`/api/blogs/${nonExistingId}`)
      .expect(400)
  })
})

after(async () => {
  await mongoose.connection.close()
})