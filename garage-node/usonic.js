var usonic = require('r-pi-usonic');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;



app.get('/', function(req, res){
    res.sendfile(__dirname + '/index.html');
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});


//RETURNS AN ARRAY [STATUS, DISTANCE]
var getStatus = function () {
    var sensor = usonic.createSensor(24, 23, 500);
    var distance = sensor();
    var statusText = 'Distance: ' + distance.toFixed(2) + ' cm';
    var status = "Unknown";
    
    if (distance < 25) {
        process.stdout.write("OPEN " + statusText);
        status = "Open";
    }
    else if(distance > 80) {
        process.stdout.write("CLOSED " + statusText);
        status = "Closed";
    }
     else {
        process.stdout.write("UNKNOWN "+ statusText);
         status = "Unknown";
    }
    return [status, distance];
  };



usonic.init(function (error) {
    if (error) {
        console.log(error);
    } else {
        //printDistance();
    }
});

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
