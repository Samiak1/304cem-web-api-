'use strict'

const usersConnection = require('./database').usersConnection

exports.authorize = function authorize(req, res, next) {
	const auth = req.authorization
// CHecks if basic authorization is selected
	if (!auth || !auth.basic) return res.send(401, {message: 'Need basic authorization header'})

	const username = auth.basic.username
	const password = auth.basic.password
// Connects to user database and checks if username, password and confirmation is valid
	usersConnection(res, usersDB => {
		const users = usersDB.values()

		for (let i = 0; i < users.length; i++) {
			if (users[i].username === username && users[i].password === password && users[i].confirmed === true) return next()
		}
		return res.send(401, {message: 'Username or password incorrect, or registration not confirmed'})
	})

}