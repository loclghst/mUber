const express = require('express');
const routes = require('./routes/routes');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

//set mongoose to use ES6 promise
mongoose.Promise = global.Promise;

//connect to muber db if server is not run in test mode
if(process.env.NODE_ENV !== 'test')
	mongoose.connect('mongodb://localhost/muber',{useNewUrlParser: true});

//Put app.use(bodyParser.json()) before routes(app)

// app.use(bodyParser.json()) means consider all input as json and convert it to Js object

app.use(bodyParser.json());
routes(app);

module.exports = app;