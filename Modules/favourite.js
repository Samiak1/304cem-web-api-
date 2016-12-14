'use strict'

const storage = require('node-persist')  // use basic file-based data persistence
const favouriteConnection = require('./database').favouriteConnection

exports.validate = function validate(req, res, next) {
	const favourite = req.body
	if (!favourite) return res.send(400, {Message: 'Need to send some data'})
	if (!favourite.id) return res.send(400, {Message: 'id are missing'})

	// TODO: you would also want to ensure no *extra* fields are sent (or ignore them in the methods below)

	next()
}

exports.list = function list(req, res) {
	// Returns the favourites with all the items
	favouriteConnection(req, res, favourite => res.send({Favourites: favourite.values()}))
}

exports.add = function add(req, res) {

	// connect to the favourites DB and save the cake
	favouriteConnection(req, res, favourite => {

		// Check if id is used
		const list = req.body

		if (favourite.getItemSync(list.id)) return res.send(400, {message: 'id already exists', id: list.id})

		favourite.setItem(list.id, list, err => {
			if (err) {
				console.log(err)
				return res.send(500, {message: 'Could not add to favourites', list: list})
			} else {
				return res.send(201, {message: 'Added to favourites', list: list})
			}
		})
		res.send(JSON.parse(list))
	})
}

exports.get = function get (req, res, next) {
	// use the ID in the URL to look up a particular favourite
	const cakeid = req.params.id

	// connect to the favourites DB then get the requested item
	favouriteConnection(req, res, favourite => {
		favourite.getItem(cakeid, (err, cake) => {
			if (err) return res.send(500, {message: 'Couldnt get the favourites list'})

			// cake will be undefined if there was no match
			if (!cake) return res.send(404, {message: 'cake id not found', id: cakeid})
			
			// otherwise return the cake object
			res.send({favourite: cakeid})
		})
	})
}


// UPDATE THE FAVOURITES
exports.update = function updateItem (req, res, next) {
	// use the ID in the URL to ensure the fav exists, then overwrite it
	res.setHeader('content-type', 'application/json')
	res.setHeader('Allow', 'GET, PUT')
	
	favouriteConnection(req, res, favourite => {
		// removes current item and adds new one with updated data
		const list = req.body
		
		if (favourite.removeItemSync(list.id)) return res.send(400, {message: 'Favourites updated', id: list.id})
		favourite.removeItem(list.id, list, err => {
			if(err) return res.send(404, {Message: 'delete error'}, null)
		})
	})
	
		favouriteConnection(req, res, favourite => {

		const list = req.body

		// TODO: omit the fields you don't want to save from book, before saving

		favourite.setItem(list.id, list, err => {
			if (err) {
				console.log(err)
				return res.send(500, {list: list})
			} else {
				return res.send(201, {list: list})
			}
		})
	})
	
}


exports.deleteItem = function deleteItem (req, res, next) {
	// use the ID in the URL to remove a specific favourite
	res.setHeader('content-type', 'application/json')
	res.setHeader('Allow', 'GET, POST, DELETE')
	
	
	favouriteConnection(req, res, favourite => {
		// first check that the id is not used already
		
		const list = req.body
		// Deletes favourites
		if (favourite.removeItemSync(list.id)) return res.send(400, {message: 'Favourites deleted', id: list.id})
		favourite.removeItem(list.id, list, err => {
			if(err) return res.send(404, {Message: 'Favourites deleted'}, deleteItem.item)
			//Return empty favourites list
		res.send(500, {message: 'Favourite is empty'})
		res.send(JSON.parse(list)).item
		})
	})
}