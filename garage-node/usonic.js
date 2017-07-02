var Gpio = require('pigpio').Gpio

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
      console.log(finalDistance);
      trigger.digitalWrite(0); // Make sure trigger is low
    }
  });

}

var distance = getDistance();
console.log(distance);