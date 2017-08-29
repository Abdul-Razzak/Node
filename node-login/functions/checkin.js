'use strict';

const entry = require('../models/checkin');

exports.checkInVenue = (name, email, venueName) => 

	new Promise((resolve,reject) => {


		const checkinEntry = new entry({

			venue_id: name,
			email: email,
			created_at: new Date(),
			venue_name: venueName
		});

		checkinEntry.save()

		.then(() => resolve({ status: 201, message: 'User Registered Sucessfully !' }))

		.catch(err => {

			if (err.code == 11000) {
						
				reject({ status: 409, message: 'User Already Registered !' });

			} else {

				reject({ status: 500, message: 'Internal Server Error !' });
			}
		});
	});


exports.getCheckinInfo = (email, venueId) => 
	
	new Promise((resolve,reject) => {

		entry.find({ email: email, venue_id: venueId }, { email: 1, venue_id: 1 })

		.then(entries => resolve(entries))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

	});

exports.getUserCheckinInfo = (email) => 
	
	new Promise((resolve,reject) => {

		entry.find({ email: email}, { email: 1, venue_id: 1, created_at : 1})

		.then(entries => resolve(entries))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

	});
