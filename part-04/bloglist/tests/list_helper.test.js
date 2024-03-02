const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  test('of empty list is zero', () => {
    assert.strictEqual(listHelper.totalLikes([]), 0)
  })

  test('when list has only one blog equals the likes of that', () => {
    const blogs = [{
      "_id": "5a422a851b54a676234d17f7",
      "title": "test",
      "author": "Test Tester",
      "url": "http://someurl.com",
      "likes": 2,
      "__v": 0
    }]

    assert.strictEqual(listHelper.totalLikes(blogs), blogs[0].likes)
  })

  test('of a bigger list is calculated right', () => {
    const blogs = [{
      "_id": "5a422a851b54a676234d17f8",
      "title": "test1",
      "author": "Test Tester",
      "url": "http://someurl.com",
      "likes": 1,
      "__v": 0
    },
    {
      "_id": "5a422a851b54a676234d17f9",
      "title": "test2",
      "author": "Test Tester",
      "url": "http://someurl.com",
      "likes": 2,
      "__v": 0
    },
    {
      "_id": "5a422a851b54a676234d17fa",
      "title": "test3",
      "author": "Test Tester",
      "url": "http://someurl.com",
      "likes": 3,
      "__v": 0
    },
    {
      "_id": "5a422a851b54a676234d17fb",
      "title": "test4",
      "author": "Test Tester",
      "url": "http://someurl.com",
      "likes": 4,
      "__v": 0
    }
    ]

    assert.strictEqual(listHelper.totalLikes(blogs), 10)
  })
})