const express = require('express');
const routes = require('./routes/routes');
const bodyParser = require('body-parser');
const app = express();


//Put app.use(bodyParser.json()) before routes(app)

// app.use(bodyParser.json()) means consider all input as json and convert it to Js object

app.use(bodyParser.json());
routes(app);

module.exports = app;