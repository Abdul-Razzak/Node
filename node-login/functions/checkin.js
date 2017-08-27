'use strict';

const entry = require('../models/checkin');

exports.checkInVenue = (name, email) => 

	new Promise((resolve,reject) => {


		const checkinEntry = new entry({

			venue_id: name,
			email: email,
			created_at: new Date()
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


