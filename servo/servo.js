/*********************************************
 This servo module turns the servo
 1/4 of its full rotation, then
 resets it after 45 seconds, reading out position
 to the console at each movement.
 *********************************************/

var tessel = require('tessel');
var servolib = require('servo-pca9685');

var servo = servolib.use(tessel.port['C']);

// Plug in a servo at position 1
var servo1 = 1;

servo.on('ready', function () {
    var closedPosition = 0;  //  Target position of the servo between 0 (min) and 1 (max).
    var openPosition = 0.25;

    //  Set the minimum and maximum duty cycle for servo 1.
    //  If the servo doesn't move to its full extent or stalls out
    //  and gets hot, try tuning these values (0.05 and 0.12).
    //  Moving them towards each other = less movement range
    //  Moving them apart = more range, more likely to stall and burn out

    servo.read(servo1, function (err, reading){console.log("reading, ",reading);});

    servo.configure(servo1, 0.05, 0.12, function () {
        // Opens the latch!!

            var openLatch = function openLatch (cb) {
                console.log('Open sesame');
                servo.move(servo1, openPosition, cb);
            };
        // Closes the latch!!
            var closeLatch = function closeLatch (cb) {
                console.log('Close sesame');
                servo.move(servo1, closedPosition, cb);

            };

            
            openLatch(closeLatch);
            // setTimeout(closeLatch, 100);
            // setTimeout(openLatch, 0);
            // setTimeout(openLatch, 500);

    });
});