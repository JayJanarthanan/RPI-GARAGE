//Load Javascript modules

var express = require('express'),
	path = require('path'),
	async = require('async'),
	gpio = require('rpi-gpio'),
	usonic = require('r-pi-usonic'),
	app = express();

//Operate on Port 3000 for testing

app.set('port', process.env.PORT || 3000);

// HTML static file goes in the /public folder

app.use('/', express.static(__dirname + '/public'));


// Initalise the Ultrasonic sensor, once and only once
usonic.init(function (error) {
    if (error) {

    } else {
       
    }
});

// The ultrasonic sensor code?
var sensor = usonic.createSensor(24, 23, 450);
var distance = sensor();



// All of this stuff should be to operate the garage door
function delayPinWrite(pin, value, callback) {
	setTimeout(function() {gpio.write(pin, value, callback);}, 500);
}

app.get("/api/ping", function(req, res) {
	res.json("pong");
});


app.post("/api/garage/right", function(req, res) {
	async.series([
		function(callback) {
			// Open pin for output
			gpio.open(14, "output", callback);
		},
		function(callback) {
			// Turn the relay on
			gpio.write(14, 0, callback);
		},
		function(callback) {
			// Turn the relay off after delay to simulate button press
			delayPinWrite(14, 1, callback);
		},
		function(err, results) {
			setTimeout(function() {
				// Close pin from further writing
				gpio.close(14);
				// Return json
				res.json("ok");
			}, 500);
		}
	]);
});

app.listen(app.get('port'));
