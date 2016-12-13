'use strict'
/*istanbul ignore next*/
/* global expect */

var storage = require('node-persist')
 
 
storage.initSync()
 
exports.getItem = function (data) {
	const playlist = storage.values()
	storage.getItemSync(data.id, data)
	if (playlist.length) return false
	return true
}
 
exports.addItem = function(data) {
	if (storage.getItemSync(data.id) !== undefined) {
		return false
	} else {
		storage.setItemSync(data.id, data)
		return true
	}
}
 
exports.removeItem = function (data) {
	if (storage.getItemSync(data.id)) {
		return false
	} else {
		storage.removeItem(data.id, data)
		return true
	}
}
 
exports.updateItem = function (data) {
	if(storage.getItemSync(data.id) !== undefined) {
		return false
	} else {
		storage.updateItem(data.id, data)
		return false
	}
}