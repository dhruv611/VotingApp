var express = require('express');
var controller = require('./controller/index');

var app = express();

// app.use(express.static('./voting_app'));

controller(app);

app.listen(3000);
console.log('Listening to port:3000');
