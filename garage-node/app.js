var usonic = require('r-pi-usonic');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var async = require('async');
var gpio = require('rpi-gpio');
var fs = require('fs');

var spawn = require('child_process').spawn;
var proc;

var port = process.env.PORT || 3000;
var pin = 11;


//Setup the web page and processes

http.listen(port, function(){
  console.log('listening on *:' + port);
});
// HTML static file goes in the /public folder
app.use('/', express.static(__dirname + '/public'));


var sockets = {};
//Setup the Camera connection
io.on('connection', function(socket) {
 
  sockets[socket.id] = socket;
  console.log("Total clients connected : ", Object.keys(sockets).length);
 
  socket.on('disconnect', function() {
    delete sockets[socket.id];
 
    // no more sockets, kill the stream
    if (Object.keys(sockets).length == 0) {
      app.set('watchingFile', false);
      if (proc) proc.kill();
      fs.unwatchFile('./public/cam.jpg');
    }
  });
 
  socket.on('start-stream', function() {
    startStreaming(io);
  });
 
});


function stopStreaming() {
  if (Object.keys(sockets).length == 0) {
    app.set('watchingFile', false);
    if (proc) proc.kill();
    fs.unwatchFile('./public/cam.jpg');
  }
}
 
function startStreaming(io) {
 
  if (app.get('watchingFile')) {
    io.sockets.emit('liveStream', 'cam.jpg?_t=' + (Math.random() * 100000));
    return;
  }
 
  var args = ["-vf", "-hf", "-w", "640", "-h", "480", "-o", "./public/cam.jpg", "-t", "999999999", "-tl", "100"];
  proc = spawn('raspistill', args);
 
  console.log('Watching for changes...');
 
  app.set('watchingFile', true);
 
  fs.watchFile('./public/cam.jpg', function(current, previous) {
    io.sockets.emit('liveStream', 'cam.jpg?_t=' + (Math.random() * 100000));
  })
 
}








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

	if(distance < 0){
		return["UNKNOWN", distance];
	}
    
    if (distance < openValue) {
       	status = "Open";
    }
    else if(distance > closedValue) {
        status = "Closed";
    }
     else {
		status = "Unknown";
    }
	//process.stdout.write(status + " " + distance);
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
