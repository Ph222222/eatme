// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

var knexInstance = require('knex')({
  client: 'pg', // or what DB you're using
  connection: {
    host     : '127.0.0.1',
    user     : 'phil',
    password : 'phil', // Scott's cat name
    database : 'eatme',
    charset  : 'utf8'
  }
});
// Initialize Bookshelf by passing the Knex instance
var bookshelf = require('bookshelf')(knexInstance); 

var Restaraunt = bookshelf.Model.extend({
  tableName: 'restaraunts'
});

var Cuisines = bookshelf.Model.extend({
  tableName: 'cuisines'
});


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8082;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);

Cuisines.where('id', 1).fetch().then(function(cuisines) {
  console.log(cuisines.toJSON());
}).catch(function(err) {
  console.error(err);
});
