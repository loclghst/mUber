const assert = require('assert');
const request = require('supertest');
const app = require('../../app');
const mongoose = require('mongoose');

const Driver = mongoose.model('driver');
// we are not using require() becaue mongoose, mocha and express dont work so well together
// if we used require it would give an error

describe('driver controller test', ()=>{
	it('handles a POST request to /api/driver', (done) =>{
		
		// To make assertion we will see how many drivers are there in db before and after we make the request 
		// and assert that newCount === oldCount +1 ie one new driver has been added to db.
		
		Driver.count()
			  .then((count) =>{
					request(app)
					.post('/api/driver')
					//post request require some data to be sent to the server. In test we do it using .send().
					.send({email:'test@test.com'}) 
					.end(() =>{
						//COUNT DRIVER AGAIN
						Driver.count()
							  .then((newCount) =>{
							  		assert(newCount === count + 1);
							  		done();
							  });
			});	  	
		})
		
	});
});



