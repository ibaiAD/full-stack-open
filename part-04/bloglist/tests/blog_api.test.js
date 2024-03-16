const { describe, test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const app = require('../app')
const api = supertest(app)

beforeEach(async () => {
  // Users
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', passwordHash })

  await user.save()

  const [userInDB] = await helper.usersInDb()

  // Blogs
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs.map(blog => {
    const blogModel = new Blog(blog)
    blogModel.user = userInDB.id
    return blogModel
  })
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

describe('Blogs', () => {
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
    let token

    beforeEach(async () => {
      const response = await api
        .post('/api/login')
        .send({ username: 'root', password: 'sekret' })

      token = response.body.token
    })

    test('succeeds with status code 201 with valid data', async () => {
      const newBlog = {
        title: "test3",
        author: "Test Tester",
        url: "http://someurl.com/three",
        likes: 3,
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
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
        .set('Authorization', `Bearer ${token}`)
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
          .set('Authorization', `Bearer ${token}`)
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
          .set('Authorization', `Bearer ${token}`)
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
          .set('Authorization', `Bearer ${token}`)
          .send(newBlog)
          .expect(400)

        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
      })
    })

    test('fails with status code 401 if a token is not provided', async () => {
      const newBlog = {
        title: "test8",
        author: "Test Tester",
        url: "http://someurl.com/three",
        likes: 8,
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)

      const titles = blogsAtEnd.map(blog => blog.title)
      assert(!titles.includes(newBlog.title))
    })
  })

  describe('deletion of a blog', () => {
    let token

    beforeEach(async () => {
      const response = await api
        .post('/api/login')
        .send({ username: 'root', password: 'sekret' })

      token = response.body.token
    })

    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
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
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('fails with status code 400 if id is malformatted', async () => {
      const nonExistingId = '123'

      await api
        .delete(`/api/blogs/${nonExistingId}`)
        .set('Authorization', `Bearer ${token}`)
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
})

describe('Users', () => {
  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'username',
      name: 'User Name',
      password: '1234',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  describe('creation fails with proper statuscode and message if', () => {
    test('username is shorter than 3', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'us',
        name: 'User Name',
        password: '1234',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
      assert(result.body.error.includes('shorter than the minimum allowed length (3)'))
    })

    test('username already exists', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'root',
        name: 'Superuser',
        password: '1234',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
      assert(result.body.error.includes('expected `username` to be unique'))
    })

    test('password is missing', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'username',
        name: 'User Name',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
      assert(result.body.error.includes('password is required'))
    })

    test('password is shorter than 3', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'username',
        name: 'User Name',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
      assert(result.body.error.includes('minimum length of 3'))
    })
  })

})

after(async () => {
  await mongoose.connection.close()
})