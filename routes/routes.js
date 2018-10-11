const driver_controller = require('../controllers/driver_controller');


module.exports = (app) =>{
	app.get('/api', driver_controller.greeting);

	app.post('/api/driver', driver_controller.create);

	//Route for editing a driver
	app.put('/api/driver/:id', driver_controller.edit);
}