'use strict';

const express    = require('express');        
const app        = express();                
const bodyParser = require('body-parser');
const logger 	   = require('morgan');
const router 	   = express.Router();
const port 	   = process.env.PORT || 3000;
var config = {
    'secrets' : {
        'clientId' : '42GW252KX3YS4AGGFQN2IKF0JDQMYSDBBPOQYDQRZGU3KLZH',
        'clientSecret' : '5DPKWXGF4WA31FUPY1GP0DMYKQQWZ50P1IA2O4R5XR2EF4HS',
        'redirectUrl' : 'http://ec2-18-220-91-102.us-east-2.compute.amazonaws.com:3000/callback' // This should also be set in your OAuth profile.
    }
};
var foursquare = require('./lib/node-foursquare')(config);

app.use(bodyParser.json());
app.use(logger('dev'));

require('./route/userRoutes')(router);
require('./route/places')(router, foursquare, config);

app.use('/', router);

app.listen(port);

console.log(`App Runs on ${port}`);