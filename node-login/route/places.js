'use strict';
var accessToken;
const checkin = require('../functions/checkin');
const comment = require('../functions/comment');



module.exports = (router, foursquare, config) => {

	router.get('/api', function(req, res) {
  		res.writeHead(303, { 'location': foursquare.getAuthClientRedirectUrl() });
  		res.end();
	});


	router.get('/callback', function (req, res) {
	  foursquare.getAccessToken({
	    code: req.query.code
	  }, function (error, accessToken) {
	    if(error) {
	      res.send('An error was thrown: ' + error.message);
	    }
	    else {
	       accessToken = accessToken;
	       res.redirect('/places?token='+accessToken);
	    }
	  });
	});

	router.get('/hello', function (req, res) {
	  res.send('Hello World!')
	  console.log('I received')
	})

	router.get('/places', function (req, res) {
	  var accessToken = accessToken;
	  var lat = req.query.lat;
	  var lng = req.query.lng;
	  var near = null
	  var cb = function(error, json) {
	  	var response = [];
	  	var groups = json.groups;
	  	for (var group in groups) {
	  		var items = groups[group].items;
		  	for (var item in items) {
		  		var json = {};
		  		json.id = items[item].venue.id;
		  		json.name = items[item].venue.name;
		  		json.lat = items[item].venue.location.lat;
		  		json.lng = items[item].venue.location.lng;
		  		response.push(json);
		  	}
	  	}
	  	res.send(response);

	  }
	  var venues = foursquare.Venues.explore(lat, lng, near, config, accessToken, cb);
	})


	router.get('/venue', function (req, res) {
	  var accessToken = accessToken;
	  var id = req.query.venueId;
	  console.log(id);
	  var cb = function(error, json) {
	  	var response = {};
	  	//console.log(JSON.stringify(json));
	  	response.name = json.venue.name;
	  	res.send(response);
	  }
	  var venues = foursquare.Venues.getVenue(id, accessToken, cb);
	})



	router.post('/checkinVenue', (req, res) => {

		const name = req.query.venueId;
		const email =req.query.email;

		if (!name || !email || !name.trim() || !email.trim()) {

			res.status(400).json({message: 'Invalid Request !'});

		} else {

			checkin.checkInVenue(name, email)

			.then(result => {

				res.setHeader('Location', '/users/'+email);
				res.status(result.status).json({ message: result.message })
			})

			.catch(err => res.status(err.status).json({ message: err.message }));
		}
	});

	router.post('/addComment', (req, res) => {

		const name = req.query.venueId;
		const email =req.query.email;
		const tips = req.query.tips; 
		if (!name || !email || !name.trim() || !email.trim()) {

			res.status(400).json({message: 'Invalid Request !'});

		} else {

			comment.putComment(name, email, tips)

			.then(result => {

				res.setHeader('Location', '/users/'+email);
				res.status(result.status).json({ message: result.message })
			})

			.catch(err => res.status(err.status).json({ message: err.message }));
		}
	});



}