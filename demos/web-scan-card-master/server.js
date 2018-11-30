var express = require('express');
var path = require('path');
var app = express();

app.use("/", express.static(path.join(__dirname, '')));

app.listen(3000);

console.log('Server listens on port:3000');
