var express = require('express');
var app = express();
const bodyParser= require('body-parser');
const cors = require('cors');

const publicweb = process.env.PUBLICWEB || './dist';

app.use(cors());
app.use(express.static(publicweb));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var UserController = require('./controllers/UserController');
app.use('/api/user', UserController);

var DeviceController = require('./controllers/DeviceController');
app.use('/api/device', DeviceController);

var ServerController = require('./controllers/ServerController');
app.use('/api/server', ServerController);

var TypeController = require('./controllers/TypeController');
app.use('/api/type', TypeController);

module.exports = app;