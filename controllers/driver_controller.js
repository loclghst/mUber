const Driver = require('../model/driver');

module.exports = {
	greeting(req,res){
		res.send({Hey: 'there'}); 
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