const driver_controller = require('../controllers/driver_controller');


module.exports = (app) =>{
	app.get('/api', driver_controller.greeting);
}