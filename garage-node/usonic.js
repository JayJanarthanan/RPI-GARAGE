var usonic = require('r-pi-usonic');
var app = require('express');


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



app.get('/', function (req, res) {
    var data = getStatus();
    res.send(data);
});

