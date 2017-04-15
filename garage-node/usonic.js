var usonic = require('r-pi-usonic');
var http = require('http'),
    fs = require('fs'),
    // NEVER use a Sync function except at start-up!
    index = fs.readFileSync(__dirname + '/index.html');


// Send index.html to all requests
var app = http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(index);
});



// Socket.io server listens to our app
var io = require('socket.io').listen(app);


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
    return status;
  };

usonic.init(function (error) {
    if (error) {
        console.log(error);
    } else {
        //printDistance();
    }
});


// Send current garage status to connected clients
function sendStatus() {
    io.emit('status', { status: getStatus() });
}

// Send current time every 5 secs
setInterval(sendStatus, 5000);



app.listen(3000);