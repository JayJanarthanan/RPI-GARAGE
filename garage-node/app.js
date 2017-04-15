var usonic = require('r-pi-usonic');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var async = require('async');
var gpio = require('rpi-gpio');
var port = process.env.PORT || 3000;

var pin = 11;


//Setup the web page and processes

app.get('/', function(req, res){
    res.sendfile(__dirname + '/index.html');
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});

// HTML static file goes in the /public folder
//app.set('port', port);
//app.use('/', express.static(__dirname + '/public'));



// Setup the functionalities

// DOOR OPERATIONS //
app.post("/api/garage/open", function(req, res) {
	OperateDoor();
});


var OperateDoor = function () {

 	console.log("Operating Garage");
	process.stdout.write("Operating Garage");

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
				//gpio.close(pin);
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


// DOOR STATUS //

//RETURNS AN ARRAY [STATUS, DISTANCE]
var getStatus = function () {
    var sensor = usonic.createSensor(24, 23, 500);
    var distance = sensor();
    var status = "Unknown";
	var openValue = 25, closedValue = 80;
    
    if (distance < openValue) {
       	status = "Open";
    }
    else if(distance > closedValue) {
        status = "Closed";
    }
     else {
		status = "Unknown";
    }
	process.stdout.write(status + " " + distance);
    return [status, distance];
  };



usonic.init(function (error) {
    if (error) {
        console.log(error);
    } else {
        //printDistance();
    }
});

// Other functions
function getTime(){
    var datetime = new Date();
    return datetime;
}


// Send current garage status to connected clients
function sendStatus() {
    var statusReport = getStatus();
    io.emit('status', { status: statusReport[0], range: statusReport[1], time: getTime() });
}

// Send current time every 5 secs
setInterval(sendStatus, 5000);
