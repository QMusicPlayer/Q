var express = require('express');
var app = express();
var http = require('http')
var server = http.createServer(app);
var morgan = require('morgan');
var response = require('response');
var io = require('socket.io')(server);
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var Sentencer = require('sentencer');


// middleware
app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat'
}))
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


app.use(express.static(__dirname + '/../client/www'));


require('./routes.js')(app, express);

var port = process.env.PORT || 3000;
server.listen(port);
console.log('listening on port...', port)
require('./socketHelpers.js')(io);
