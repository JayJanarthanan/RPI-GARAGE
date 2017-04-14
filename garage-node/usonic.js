'use strict';
var usonic = require('r-pi-usonic');
var readline   = require('readline');
var statistics = require('math-statistics');

var print = function (distances) {
    var distance = statistics.median(distances);

    process.stdout.clearLine();
    process.stdout.cursorTo(0);

    if (distance < 0) {
        process.stdout.write('Error: Measurement timeout.\n');
    } else {
        process.stdout.write('Distance: ' + distance.toFixed(2) + ' cm');
    }
};


var initSensor = function (config) {
    var sensor = usonic.createSensor(24, 23, 500);
    var distances;

    (function measure() {
        if (!distances || distances.length === 5) {
            if (distances) {
                print(distances);
            }

            distances = [];
        }

        setTimeout(function () {
            distances.push(sensor());
            measure();
        }, 60);
    }());
};
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});




usonic.init(function (error) {
    if (error) {
        console.log(error);
    } else {
        initSensor();
    }
});
