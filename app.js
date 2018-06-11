var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config');
var base58 = require('./base58.js');

// grab the url model
var Url = require('./models/url');

// var promise = mongoose.connect('mongodb://' + config.db.host + '/' + config.db.name, {
//   useMongoClient: true,
//   /* other options */
// });
//mongoose.connect('mongodb://' + config.db.host + '/' + config.db.name);
 mongoose.Promise = global.Promise;
 mongoose.connect('mongodb://meet:password123@ds155730.mlab.com:55730/url_shertener');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.post('/api/shorten', function(req, res){
  var longUrl = req.body.url;
  var shortUrl = '';

  // check if url already exists in database
  Url.findOne({long_url: longUrl}, function (err, doc){
    if (doc){
      shortUrl = config.webhost + base58.encode(doc._id);

      // link exists
      res.send({'shortUrl': shortUrl});
    } else {
      // if doesn't exist, create it
      var newUrl = Url({
        long_url: longUrl
      });

      // save the new link
      newUrl.save(function(err) {
        if (err){
          console.log(err);
        }

        shortUrl = config.webhost + base58.encode(newUrl._id);

        res.send({'shortUrl': shortUrl});
      });
    }

  });

});
//to get data from get request
app.get('/:encoded_id', function(req, res){

	console.log(req.params.encoded_id);

  var base58Id = req.params.encoded_id;

  var id = base58.decode(base58Id);

  // check if url already exists in database
  Url.findOne({_id: id}, function (err, doc){
    if (doc) {
      res.redirect(doc.long_url);
      //res.redirect('http://meetshah.tech');
       //res.send({'shortUrl': long_url});
    } else {
      res.redirect(config.webhost);
    }
  });

});

var server = app.listen(config.port, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});
