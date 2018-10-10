module.exports = {
	greeting(req,res){
		res.send({Hey: 'there'}); 
	},

	create(req,res){
		console.log(req.body);
		res.send({Hey: 'there'}); 
	}
}