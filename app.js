const express = require('express');
const app = express();

app.get('/api', (req,res)=>{
	res.send({Hi: 'there'});
});

module.exports = app;