const logger = require('./logger')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const errorHandler = (error, _, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'expected `username` to be unique' })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  next(error)
}

const tokenExtractor = (request, _, next) => {
  const authorization = request.get('authorization')

  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
    return next()
  }

  request.token = null
  next()
}

const userExtractor = async (request, _, next) => {
  const authorization = request.get('authorization')
  let token = null

  if (authorization && authorization.startsWith('Bearer ')) {
    token = authorization.replace('Bearer ', '')
  }

  let decodedToken = {}

  try {
    decodedToken = jwt.verify(token, process.env.SECRET)
  } catch (error) {
    return next(error)
  }

  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const user = await User.findById(decodedToken.id)

  if (!user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  request.user = user
  next()
}

const unknownEndpoint = (_, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

module.exports = {
  errorHandler,
  tokenExtractor,
  userExtractor,
  unknownEndpoint,
}
