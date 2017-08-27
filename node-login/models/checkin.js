'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const checkinSchema = mongoose.Schema({ 

	venue_id 			: String,
	email			: String, 
	created_at		: String
	
});

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://admin:admin@ds031947.mlab.com:31947/tkpraktikum');

module.exports = mongoose.model('checkin', checkinSchema);        