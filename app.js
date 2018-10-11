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

//middle ware to handle the error in the response in case email is not provided when creating
//a new driver. The error we are taking about originates from the POST request to create a new driver
//For driver we defined email is required. So if we dont pass a email with the POST request , an error will be 
//thrown. The following middleware handles this error.

app.use((err,req,res,next) =>{
	//send an error message as response and set proper status code 
	console.log(err);
	res.status(422).send({error: err.message});
});


module.exports = app;