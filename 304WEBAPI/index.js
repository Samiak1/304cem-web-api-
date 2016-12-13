'use strict'

const restify = require('restify')
const server = restify.createServer()

const food = require('./Modules/food')
const favourite = require('./Modules/favourite')
const authorization = require('./Modules/authorization')
const users = require('./Modules/users')

server.use(restify.fullResponse())
server.use(restify.queryParser())
server.use(restify.bodyParser())
server.use(restify.authorizationParser())

server.get('/cakes', food.search)

server.get('/favourite', authorization.authorize, favourite.list)  // get a list of all favs
server.post('/favourite', authorization.authorize,favourite.validate, favourite.list)
server.get('/favourite/:id', authorization.authorize,favourite.list)
server.del('/favourite/:id', authorization.authorize,favourite.deleteItem)
server.put('/favourite/:id', authorization.authorize,favourite.validate, favourite.update)


server.post('/users', users.validateUser, users.add)  // add a new user to the DB (pending confirmation)
server.post('/users/confirm/:username', users.validateCode, users.confirm)  // confirm a pending user
server.del('/users/:username', authorization.authorize, users.delete) 


const port = process.env.PORT || 8080
server.listen(port, err => console.log(err || `App running on port ${port}`))
