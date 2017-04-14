var usonic = require('r-pi-usonic');


var printDistance = function () {
    var sensor = usonic.createSensor(24, 23, 500);
    var distance = sensor();
    var statusText = 'Distance: ' + distance.toFixed(2) + ' cm';
    
    if (distance < 25) {
        process.stdout.write("OPEN " + statusText);
    }
    else if(distance > 80) {
          process.stdout.write("CLOSED " + statusText);
    }
     else {
          process.stdout.write("UNKNOWN "+ statusText);
    }
    
};


usonic.init(function (error) {
    if (error) {
        console.log(error);
    } else {
        printDistance();
    }
});
