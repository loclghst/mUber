const mongoose = require('mongoose');

//connect to the following db if we are in test environment

// we do not need to place an if statement to check if we are in the test environment,
//because if the test_helper file is executed it means we are in the test environment

// the reason we placed the connection string inside the test_helper file and not in the app.js
// to make sure our test suite runs only when the connection has been made to the test_db.
// if we put the connection string in app.js, it may happen that mocha starts running test 
// before the connection to test_db is made , which will result in all kinds of errors

//also we get this done() helper only in mocha world , call to which will makse sure that the tests run only 
// after connection to test db is successfully made

// before means execute this before you start running the tests

before(done => {
	mongoose.connect('mongodb://localhost/muber_test',{useNewUrlParser: true});
	mongoose.connection
			.once('open',() => done())
			.on('error',(err) => {console.warn('Warning :' + err)});
});

//beforeEach means run this before each test
beforeEach(done =>{
	//store Driver collection out of mongo in a variable
	const {drivers} = mongoose.connection.collections;
	drivers.drop()
	//the following then() is to ensure that the geometry.coordinates index remain when the query is executed
	//this is essential for the geoNear test to return correct results. The ensureIndex immediately recreates the index
	//after the drivers collection is dropped.
		   .then(() => drivers.ensureIndex({'geometry.coordinates' : '2dsphere'}))
		   .then(() => done())
		   .catch(() => done());
	//the reason we put a catch statement here is because the first time test runs there will be no driver 
	//collection to drop which will throw an error and we dont care about it and want to continue with the tests


});

//Now in theory we have complete seperation between our development environment and our test environment.