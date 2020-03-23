process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var mongoose = require('./config/mongoose');
var express = require('./config/express');
var db = mongoose();
var app = express();
const port = process.env.port || 3001
app.listen(port);
module.exports = app;
console.log(`Server running at http://localhost:${port}/`);