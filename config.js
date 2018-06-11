var config = {};

config.db = {};
config.webhost = 'http://meeturl.herokuapp.com/';
config.port = process.env.PORT || 5000;

//config.db.host = 'localhost';
//config.db.name = 'url_shortener';

module.exports = config;
