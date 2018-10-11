const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//creating a  schema for geoJSON type point
//We will embedd it as a sub document

const PointSchema = new Schema({
	type:{ type: String, default:'Point'},
	coordinates : {type: [Number], index: '2dsphere'}
	//the index property here is what tells mongoDB that its
	//a very special coordinate system or a very special 
	//property right here of which mongoDB should keep track of
	//and consider to be an index for geoJSON type queries

});

//we have defined the PointSchema, now we can embedd it as a 
//subdocument inside the DriverSchema

const DriverSchema = new Schema({
	email: {
		type: String,
		required: true
	},
	driving:{
		type: Boolean,
		default: false
	},
	//embedding PointSchema as a subdocument
	geometry: PointSchema
});


const Driver = mongoose.model('driver', DriverSchema);

module.exports = Driver;