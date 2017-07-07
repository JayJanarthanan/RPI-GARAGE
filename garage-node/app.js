var express = require('express');
var app = express();
var async = require('async');
var datetime = require('node-datetime');
var spawn = require('child_process').spawn;
var fs = require('fs');
var http = require('http').Server(app);
var Gpio = require('pigpio').Gpio;
var PythonShell = require('python-shell');
var helper = require('sendgrid').mail;
var io = require('socket.io')(http);

/////// Variables //////////

var proc;

var port = process.env.PORT || 80; //Port 80 for prod, 3000 for test
var doorPin = 11; // the Board GPIO Pin to control the relay for door

var sensor;



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

// Called to end stream and stop wasting valuable memory
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



// Door Functionality just use python
var OperateDoor = function () {
  var process = spawn('python',["door.py"]);
};


// DOOR STATUS //

//RETURNS AN ARRAY status
var getStatus = function (distance) {

  var status = "UNKNOWN";
	var openValue = 25, closedValue = 80;
	var emailSent = false; //false when garage is open and no email, true when email sent.

		if(distance < 0)
		{
			return "ERROR";
		}
    else if (distance < openValue) {
			status = "OPEN";
			if(Boolean(emailSent)) // Check if email has already been sent.
			{
				//emailSent = true; //set that the email has been sent
				//sendEmail();	
			}

    }
    else if(distance > closedValue) 
		{
      status = "CLOSED";
			emailSent = false; //reset email sent notification
    }
    else 
		{
			status = "UNKNOWN";
    }
		//process.stdout.write(status + " " + distance);
    return status;
}



function sendStatus()
{
  trigger = new Gpio(23, {mode: Gpio.OUTPUT}),
  echo = new Gpio(24, {mode: Gpio.INPUT, alert: true});

  // The number of microseconds it takes sound to travel 1cm at 20 degrees celcius
  var MICROSECDONDS_PER_CM = 1e6/34321;
  trigger.trigger(10, 1); 
  var startTick;

  echo.on('alert', function (level, tick) {
    var endTick, diff;

    if (level == 1) {
      startTick = tick;
    } else {
      endTick = tick;
      diff = (endTick >> 0) - (startTick >> 0); // Unsigned 32 bit arithmetic
      finalDistance = diff / 2 / MICROSECDONDS_PER_CM
      finalDistance = finalDistance.toFixed(2);
      trigger.digitalWrite(0); // Make sure trigger is low

      var statusReport = getStatus(finalDistance); //Get the humanised info
      // Send the details to the HTML site
      io.emit('status', { status: statusReport, range: finalDistance, time: getTime() });
    }
  });

}

// Other functions
// Need to work on this
function getTime(){
  var dt = dateTime.create();
  var formatted = dt.format('H:M:S d-m-Y');
  return formatted;
}



// Send current status of the garage every 5 seconds
setInterval(sendStatus, 5000);






/////////////////////// EXTRA CODE FOR FUTURE USE ////////////////////////////////////////



function sendEmail(){
// from SendGrid v3 Docs

	var API_KEY = '<INSERT_HERE>'

	from_email = new helper.Email("notify@appavate.com");
	to_email = new helper.Email("support@appavate.com");
	subject = "JANA GARAGE - OPEN";
	content = new helper.Content("text/plain", "Hi There, The Raspberry Pi in your garage has detected your garage is open at this time. Thanks, Jay");
	mail = new helper.Mail(from_email, subject, to_email, content);


	var sg = require('sendgrid')(API_KEY);
	var request = sg.emptyRequest({
		method: 'POST',
		path: '/v3/mail/send',
		body: mail.toJSON()
	});

	sg.API(request, function(error, response) {
		if(response.statusCode == 202)
		{
		console.log("Email successfully sent.");
		}
	});


}


///// CREDITS /////////////

// Camera Stuff: http://thejackalofjavascript.com/rpi-live-streaming/500ms
