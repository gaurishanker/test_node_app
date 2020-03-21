var express = require("express");
const bodyParser = require('body-parser');

const user = require('./routes/user.route');
var app = express();
var path = require('path');
require('dotenv').config()

// Set up mongoose connection
const mongoose = require('mongoose');
let dev_db_url = process.env.MONGODB_URI
// "mongodb+srv://admin:KJLuitiGhUNFEEz4@cluster0-nntl0.mongodb.net/test";
let mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Middlewares

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Routes added
app.use('/user', user);

app.get('/login', function(req, res){
    res.sendFile(path.join(__dirname + '/template/login.html'));
});

app.post('/auth', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/home');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

// Specify port and run application
let port =  process.env.PORT || 8000;

app.listen(port, () => {
  console.log("server running on port " + port)
});
