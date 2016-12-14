'use strict'
const restify = require('restify')
const server = restify.createServer()

const cakes = require('./Modules/food')
const favourite = require('./Modules/favourite')
const authentification = require('./Modules/authorization')
const users = require('./Modules/users')
const defaultPort = 8080


server.use(restify.fullResponse())
server.use(restify.queryParser())
server.use(restify.bodyParser())
server.use(restify.authorizationParser())

server.get('/cakes', cakes.search)		//Search for item


server.get('/favourite',authentification.authorize, favourite.list)		//Get playlist
server.get('/favourite/:id',authentification.authorize, favourite.list)		//Get playlist using id
server.post('/favourite',authentification.authorize, favourite.validate,favourite.add)  // get details of a particular fav using id
server.del('/favourite/:id',authentification.authorize, favourite.deleteItem)		//Delete playlist usingid
server.put('/favourite/:id',authentification.authorize, favourite.validate, favourite.update)	//Update playlist using id


server.post('/users', users.validateUser, users.add)  // add a new user to the DB (pending confirmation)
server.post('/users/confirm/:username', users.validateCode, users.confirm)	//Confirm user using confirmation code
server.del('/users/:username', authentification.authorize, users.delete)  // delete a user

const port = process.env.port || defaultPort
server.listen(port, err => console.log(err || `App running on port ${port}`))

