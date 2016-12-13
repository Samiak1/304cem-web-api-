'use strict'

const request = require('request')

exports.search = function(req, res, next) {
	const cake = req.params.q
	const url = `https://api.edamam.com/search?q=${cake}&app_id=f2f2db6f&app_key=293cf1a342aba81f8c850cad959765ab`
	request.get(url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			const results = JSON.parse(body).hits
      res.send({results: results})
		}
	})
}
