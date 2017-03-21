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
router.route('/cuisines/:id')
  // fetch user
  .get(function (req, res) {
    Cuisines.forge({id: req.params.id})
    .fetch()
    .then(function (user) {
      if (!user) {
        res.status(404).json({error: true, data: {}});
      }
      else {
        res.json({error: false, data: user.toJSON()});
      }
    })
    .catch(function (err) {
      res.status(500).json({error: true, data: {message: err.message}});
    });
  })

router.route('/cuisines')

    .post(function (req, res) {
      console.log (req.body.name );
      Cuisines.forge({
        name: req.body.name 
      })
      .save()
      .then(function (user) {
        res.json({error: false, data: {id: user.get('id')}});
      })
      .catch(function (err) {
        res.status(500).json({error: true, data: {message: err.message}});
      }); 
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
