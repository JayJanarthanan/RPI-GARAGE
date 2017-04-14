//Load Javascript modules
// Based off https://github.com/brentnycum/garage-node

var express = require('express'),
	async = require('async'),
	gpio = require('rpi-gpio'),
	app = express(),
	pin = 11;



//Operate on Port 3000 for testing

app.set('port', process.env.PORT || 3000);

// HTML static file goes in the /public folder

app.use('/', express.static(__dirname + '/public'));

app.post("/api/garage/open", function(req, res) {
	OperateDoor();
});


var OperateDoor = function () {

 	console.log("Operating Garage");

	async.series([
		function(callback) {
			// Open pin for output
			gpio.setup(pin, gpio.DIR_OUT);
			console.log("SETUP");

		},
		function(callback) {
			// Turn the relay on
			gpio.write(pin, 1, callback);
			console.log("GO HIGH");
		},
		function(callback) {
			// Turn the relay off after delay to simulate button press
			delayedWrite(pin, 0, callback);
			console.log("GO LOW SLOW");
		},

		function(callback) {
			// Turn the relay on
			gpio.write(pin, 1, callback);
			console.log("GO HIGH");
		},
		function(callback) {
			gpio.destroy();
			console.log("DESTROY");
		},
		function(err, results) {
			setTimeout(function() {
				console.log("ERROR");
				// Close pin from further writing
				gpio.close(pin);
				// Return json
				res.json("ok");
			}, 500);
		}
	]);

	return;

};

function delayedWrite(pin, value, callback) {
    setTimeout(function() {
        gpio.write(pin, value, callback);
    }, 50);
}



//console.log("Listening on port 3000");
//app.listen(app.get('port'));
gpio.destroy();
OperateDoor();
