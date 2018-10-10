const Driver = require('../model/driver');

module.exports = {
	greeting(req,res){
		res.send({Hey: 'there'}); 
	},

	create(req,res){
		const driverProps = req.body;
		Driver.create(driverProps)
			  .then(driver => res.send(driver)); 
	}
}