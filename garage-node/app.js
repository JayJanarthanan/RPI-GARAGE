var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var async = require('async');
var fs = require('fs');
var helper = require('sendgrid').mail;
var gpio = require('pigpio').Gpio;



/////////////////


var spawn = require('child_process').spawn;
var proc;

var port = process.env.PORT || 3000;
var pin = 11;

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



// Door Functionality
// REDOING with piggpio
var OperateDoor = function () {


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

	process.stdout.write("HC-SO4: " + distance);

  var status = "Unknown";
	var openValue = 25, closedValue = 80;
	var emailSent = false; //false when garage is open and no email, true when email sent.

		if(distance < 0)
		{
			return["UNKNOWN", distance];
		}
    else if (distance < openValue) {
			status = "Open";
			if(Boolean(emailSent)) // Check if email has already been sent.
			{
				emailSent = true; //set that the email has been sent
				sendEmail();
				
			}

    }
    else if(distance > closedValue) 
		{
      status = "Closed";
			emailSent = false; //reset email sent notification
    }
    else 
		{
			status = "Unknown";
    }
		//process.stdout.write(status + " " + distance);
    return [status, distance];
}



function getDistance()
{
  trigger = new Gpio(23, {mode: Gpio.OUTPUT}),
  echo = new Gpio(24, {mode: Gpio.INPUT, alert: true});

  // The number of microseconds it takes sound to travel 1cm at 20 degrees celcius
  var MICROSECDONDS_PER_CM = 1e6/34321;
  var finalDistance = 0;
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
      trigger.digitalWrite(0); // Make sure trigger is low



    }
  });

}

// Other functions
// Need to work on this
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
