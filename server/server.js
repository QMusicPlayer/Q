var port = process.env.PORT || 3000;
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());



////////////////////////////////////////////////
require('./routes.js');
app.use(express.static(__dirname + '/public'));
////////////////////////////////////////////////

// Start server
var server = app.listen(port, function () {
  console.log('Server listening at port ', port);
});


