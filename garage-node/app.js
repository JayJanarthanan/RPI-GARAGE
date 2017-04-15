var usonic = require('r-pi-usonic');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var async = require('async');
var gpio = require('rpi-gpio');
var fs = require('fs');
var sendgrid = require('sendgrid')('azure_ea3d41ccd1bc355acf2d8cfc85de84e1@azure.com', sendgrid_password);

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

    socket.on('operate-garage', function() {
		console.log('Operate Door command received');
    	OperateDoor();
  });
 
});

// Caled to end stream and stop wasting valuable memory
function stopStreaming() {
	console.log('Killing stream');
  if (Object.keys(sockets).length == 0) {
    app.set('watchingFile', false);
    if (proc) proc.kill();
    fs.unwatchFile('./public/cam.jpg');
  }
}

//Called when we want to start streaming.
 
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



// Door Functionality

//This thing refuses to work
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
// Hold for 500ms
function delayedWrite(pin, value, callback) {
    setTimeout(function() {
        gpio.write(pin, value, callback);
    }, 500);
}


// DOOR STATUS //

//RETURNS AN ARRAY [STATUS, DISTANCE]
var getStatus = function () {
    var sensor = usonic.createSensor(24, 23, 500);
    var distance = sensor();
	distance = distance.toFixed(2);

    var status = "Unknown";
	var openValue = 25, closedValue = 80;

	if(distance < 0){
		return["UNKNOWN", distance];
	}
    
    if (distance < openValue) {
       	status = "Open";

		   //check time and triggeer
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


// Initalise the Ultrasonic sensor, once and only once
usonic.init(function (error) {
    if (error) {
        console.log(error);
    } else {
        //printDistance();
    }
});

// Other functions
function getTime(){
  var a = new Date();
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  return time;
}


// Send current garage status to connected clients
function sendStatus() {
    var statusReport = getStatus();
    io.emit('status', { status: statusReport[0], range: statusReport[1], time: getTime() });
}

// Send current status of the garage every 5 seconds
setInterval(sendStatus, 5000);





function sendEmail(){
// https://docs.microsoft.com/en-us/azure/store-sendgrid-nodejs-how-to-send-email

var email = new sendgrid.Email({
    to: 'john@contoso.com',
    from: 'notify@appavate.com',
    subject: 'JANA GARAGE - TEST',
    text: 'This email is a test email'
});


sendgrid.send(email, function(err, json){
    if(err) { return console.error(err); }
    console.log(json);
});


}





///// CREDITS /////////////

// Camera Stuff: http://thejackalofjavascript.com/rpi-live-streaming/500ms
