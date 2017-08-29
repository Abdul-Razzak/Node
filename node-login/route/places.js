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
	  var query = req.query.query;
	  var near = null
	  var cb = function(error, json) {
	  	var response = [];
	  	var venues = json.venues;
	  	for (var index in venues) {
	  		var venue = venues[index];
		  		var json = {};
		  		json.id = venue.id;
		  		json.name = venue.name;
		  		json.lat = venue.location.lat;
		  		json.lng = venue.location.lng;
		  		response.push(json);
	  	}
	  	res.send(response);

	  }
	  var venues = foursquare.Venues.search(lat, lng , null, {"query" : query}, accessToken, cb);
	})


	router.get('/venue', function (req, res) {
	  var accessToken = accessToken;
	  var id = req.query.venueId;
	  console.log(id);
	  var cb = function(error, json) {
	  	var response = {};
	  	//console.log(JSON.stringify(json));
	  	response.name = json.venue.name;
	  	if(json.venue.contact !== undefined && json.venue.contact.phone !== undefined) {
	  		response.phone = json.venue.contact.phone;
	  	}
	  	if(json.venue.location.address !== undefined) {
	  		response.location = json.venue.location.address;
	  	}
	  	if(json.venue.rating !== undefined) {
	  		response.rating = json.venue.rating;
	  	}
	  	console.log(JSON.stringify(response));
	  	res.send(response);
	  }
	  var venues = foursquare.Venues.getVenue(id, accessToken, cb);
	})



	router.post('/checkinVenue', (req, res) => {

		const name = req.query.venueId;
		const email =req.query.email;
		const bugfixvenue = req.query.venueName;
		if (!name || !email || !name.trim() || !email.trim()) {

			res.status(400).json({message: 'Invalid Request !'});

		} else {

			checkin.checkInVenue(name, email, bugfixvenue)

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

	router.get('/getComments', (req,res) => {
		const email = req.query.email;
		const venueId = req.query.venueId;


			comment.getComments(email, venueId)

			.then(result => {
				console.log(result);
				res.send(result);

			})

			.catch(err => res.status(err.status).json({ message: err.message }));

	});

	router.get('/getCheckinInfo', (req,res) => {
		const email = req.query.email;
		const venueId = req.query.venueId;


			checkin.getCheckinInfo(email, venueId)

			.then(result => {
				console.log(result);
				res.send(result);

			})

			.catch(err => res.status(err.status).json({ message: err.message }));

	});

	router.get('/getUserCheckinInfo', (req,res) => {
		const email = req.query.email;


			checkin.getUserCheckinInfo(email)

			.then(result => {
				console.log(result);
				res.send(result);

			})

			.catch(err => res.status(err.status).json({ message: err.message }));

	});



}