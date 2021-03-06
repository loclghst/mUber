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

	it('handles a PUT request to /api/drivers/:id - Edits the driver with the passed id', (done) =>{
		//to make this test, we will create a driver --> save it to db --> pull it back from db -->
		//--> make a PUT request to make some changes to it --> then assert that the changes were successfully made
		const newDriver = new Driver({email: 't@t.com', driving: false});
		newDriver.save()
				 .then(() =>{
				 	request(app)
				 		.put(`/api/driver/${newDriver._id}`)
				 		.send({driving: true})
				 		.end(() =>{
				 			Driver.findOne({email: 't@t.com'})
				 				  .then((driver) =>{
				 				  	assert(driver.driving === true);
				 				  	done();
				 				  });
				 		});
				 });

	});

	it('handles a delete request to /api/driver/:id - Deletes a particular driver', (done) =>{
		const newDriver = new Driver({email: 'a@b.com', driving:false});
		// newDriver.save()
		// 		 .then(() =>{
		// 		 	Driver.count()
		// 		 		  .then(count =>{
		// 		 		  	request(app)
		// 		 		  		.delete(`/api/driver/${newDriver._id}`)
		// 		 		  		.end(() => {
		// 		 		  			Driver.count()
		// 		 		  				  .then(newCount =>{
		// 		 		  				  	assert(newCount === count -1);
		// 		 		  				  	done();
		// 		 		  				  });
		// 		 		  		});
		// 		 		  });
		// 		 });
		// Alternate approach

		newDriver.save()
				 .then(() =>{
				 	request(app)
				 		.delete(`/api/driver/${newDriver._id}`)
				 		.end(() =>{
				 			Driver.findOne({email: 'a@b.com'})
				 				  .then(driver =>{
				 				  	assert(driver === null);
				 				  	done();
				 				  });
				 		});
				 });
	});
	//test for the geoNear query

	it('handles GET request to /api/driver, finds drivers near me', (done) =>{
		//we only want drivers that are within the maxDistance, So will will create two drivers at very different
		//locations and see which gets returned. This is how we will make the assertion

		const delhiDriver = new Driver ({
			email: 'delhi@test.com',
			geometry: {type:'Point', coordinates: [-122.475, 47.614]}
		});
		const bangaloreDriver = new Driver({
			email: 'bangalore@test.com',
			geometry: {type: 'Point', coordinates: [-80.253,25.791 ]}
		});

		Promise.all([delhiDriver.save(), bangaloreDriver.save()])
			   .then(() => {
			   		request(app)
			   			.get('/api/driver?lng=-80&lat=25')
			   			.end((err,response) => {
			   				console.log(response);
			   				done();
			   			});
			   });

	});

	//The above test doesnt give the required results.
	//when we inspect the db by RoboMongo we will see that for the muber_test db , there is no index for 
	//geometry coordinates which is essential to perform any geoNear queries.

	// This is because before any test is executed we drop the colelction and with it we drop the index of geometry.coordinates
	// this si because the indexes are created only one time at the beginning when the schema is created
	// to resolve this error we have to make sure that the index remains when we perform the test.
	 
});



