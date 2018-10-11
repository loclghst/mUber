const Driver = require('../model/driver');

module.exports = {
	greeting(req,res){
		res.send({Hey: 'there'}); 
	},

	index(req, res, next){

		//the centre point of the query should be the current position
		//of the user, so we will expect the req- onject to contain
		//the current location of the user i.e the req object will
		//supply the lng and lat paramentes to coordinates property

		//But this will be a GET request, and get request do not contain 
		//the req body. so rather than looking at req.body, we 
		//will get the lng and lat from the query string as follows

		const {lng, lat} = req.query;



		//to get nearby drivers we run a geoNear() query
		//geoNear() query takes a geoJSON object as first paramete
		//A geoJSON object is a object which has type and coordinates property
		//Second parameter is Options
		Driver.geoNear(
			//first parameter- geoJSON object
			{type:'Point',coordinates:[lng,lat]},
			//second parameter - Options
			//spherical: true means we are telling mongo that the query
			//is made on a spherical object
			//maxDistance specifies the maximum distance over which to return results
			{spherical: true,maxDistance: 200000}
		)
		//this returns a promise so we will cahin a .then()
		.then((drivers) => res.send(drivers))
		.catch(done);
	},

	create(req,res,next){
		const driverProps = req.body;
		Driver.create(driverProps)
			  .then(driver => res.send(driver))
			  .catch(next); 
	},

	edit(req,res,next){
		const driverId = req.params.id;
		const driverProps = req.body;

		Driver.findByIdAndUpdate({_id: driverId}, driverProps)
		//findByIdAndUpdate behaves a bit differently than other mongo operations. We'd expect it to return 
		//the driver that is just updates but instead it returns some statistics about the updated driver, not 
		//the driver itself
			  .then(() => Driver.findById({_id : driverId}))
			  .then((driver) => res.send(driver))
			  .catch(next); 
	},

	delete(req,res,next){
		const driverId = req.params.id;

		Driver.findByIdAndRemove({_id: driverId})
		//findByIdAndRemove() send back the driver that is removed
			  .then((driver) => res.status(204).send(driver)) //Status of 204 means the record was successfully deleted
			  .catch(next);
	}
}