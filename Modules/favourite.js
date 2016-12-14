'use strict'

const storage = require('node-persist')  // use basic file-based data persistence
const favouriteConnection = require('./database').favouriteConnection
storage.initSync()



exports.validate = function validate(req, res, next) {
	const favourite = req.body
	if (!favourite) return res.send(400, {Message: 'Need to send some data'})	// Checks if any data was sent to playlist
	if (!favourite.id || !favourite.label || !favourite.dietlabel) return res.send(400, {Message: 'id, label or dietlabel is missing'}) //Requires id,artist and track. If missing send error.
	next() //Moves to next function
}

exports.list = function list(req, res) {
	// Returns the favourites with all the items
	favouriteConnection(req, res, favourites => res.send({Favourites: favourites.values()}))
}
// ADD ITEMS \\
exports.add = function add(req, res) {

	// connect to the playlist database then saves the item
	favouriteConnection(req, res, favourites => {

		// first check that the id is not used already
		const list = req.body

		if (favourites.getItemSync(list.id)) return res.send(400, {message: 'id already exists', id: list.id})

		// Checks the data and adds to playlist

		favourites.setItem(list.id, list, err => {
			if (err) {
				console.log(err)
				return res.send(500, {message: 'Could not add to favourites', list: list})
			} else {
				return res.send(201, {message: 'Added to favourites', list: list})
			}
		})
	})
}
// GETS THE PLAYLIST \\
exports.get = function get (req, res, next) {
	// use the ID in the URL to look up a particular track
	const cakeid = req.params.id

	// connects to the playlists database and request a track
	favouriteConnection(req, res, favourite => {
		favourite.getItem(cakeid, (err, cake) => {
			if (err) return res.send(500, {message: 'Couldnt get the playlist'})

			// track will be undefined if there was no match
			if (!cake) return res.send(404, {message: 'id not found', id: cakeid})
			
			// otherwise return the tracks object
			res.send({favourite: cakeid})
		})
	})
	next()
}



																	/// UPDATING \\\
exports.update = function updateItem (req, res, next) {
	// use the ID in the URL to ensure the playlist exists, then overwrite it
	res.setHeader('content-type', 'application/json')
	res.setHeader('Allow', 'GET, PUT')
	
	favouriteConnection(req, res, favourites => {
		// removes current item and adds new one with updated data
		const list = req.body
		
		if (favourites.removeItemSync(list.id)) return res.send(400, {message: 'Favourites updated', id: list.id})
		favourites.removeItem(list.id, list, err => {
			if(err) return res.send(404, {Message: 'delete error'}, null)
		})
	})
	
		favouriteConnection(req, res, favourites => {

		const list = req.body

		favourites.setItem(list.id, list, err => {
			if (err) {
				console.log(err)
				return res.send(500, {list: list})
			} else {
				return res.send(201, {list: list})
			}
		})
	})
}






// DELETE ITEM FROM PLAYLIST \\
exports.deleteItem = function deleteItem (req, res, next) {
	// use the ID in the URL to remove a specific item from playlist
	
	favouriteConnection(req, res, favourites => {
		res.setHeader('content-type', 'application/json')
		res.setHeader('Allow', 'GET, POST, DELETE')
		const list = req.body
		
		if (favourites.removeItemSync(list.id)) return res.send(400, {message: 'Favourites deleted', id: list.id})
		// Removes a playlist 
		favourites.removeItem(list.id, list, err => {
			if(err) return res.send(404, {Message: 'favourites deleted'}, deleteItem.item)
		res.send(500, {message: 'Favourites empty'})
		res.send(JSON.parse(list)).item // Returns empty playlist
		})
	})
}