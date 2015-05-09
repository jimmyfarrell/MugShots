var http = require('http');
// var fs = require("fs");
var tessel = require('tessel');

var rfidlib = require('rfid-pn532');
var servolib = require('servo-pca9685');
var cameralib = require('camera-vc0706');
// var accellib = require('accel-mma84');

var rfid = rfidlib.use(tessel.port['A']); 
var servo = servolib.use(tessel.port['C']);
var camera = cameralib.use(tessel.port['B']);
// var accel = accellib.use(tessel.port['B']);
var servo1 = 1;

//RFID STUFF
rfid.setPollPeriod( 500, function (err) {console.log(err);});
//sets polling time to 500 milliseconds (which is default)

rfid.on('ready', function (version) {
  console.log('Ready to read RFID card');

  var logPic = function (image){
  	console.log('GOT A PIC, ', image);
  };

  rfid.on('data', function(card) {
  	if (card.uid){
  		takePic(logPic);

  		// //Opens the latch!!
  			var closedPosition = 0;  //  Target position of the servo between 0 (min) and 1 (max).
		    var openPosition = 0.75;
            var openLatch = function openLatch (cb) {
            	servo.configure(servo1, 0.05, 0.12, function () {
	                servo.move(servo1, openPosition, cb);
	                console.log('Open sesame');

            	})
            };
        // Closes the latch!!

            var closeLatch = function closeLatch (cb) {
            	servo.configure(servo1, 0.05, 0.12, function () {
	                servo.move(servo1, closedPosition, cb);
	                console.log('Close sesame');
            	})

            };
            var position = 0;
            // servo.configure(servo1, 0.05, 0.12, function () {
	           //      servo.move(servo1, position+=.1,function(err){
	           //      	console.log("ERROR:",err)
	           //      });
	           //      console.log('Open sesame');
	           //      if(position>1) position = 0;
            // 	})

            openLatch(function(){
            	console.log("servo opening");
            	setTimeout(closeLatch,10000)
            })
  	}
    console.log('UID:', card.uid.toString('hex'));
  });
});

rfid.on('error', function (err) {
  console.error(err);
});


//CAMERA STUFF
var notificationLED = tessel.led[3]; // Set up an LED to notify when we're taking a picture

  // Define the take picture function
var takePic = function(cb){
	console.log("entered takepic function");

	// return cameraAsync.takePictureAsync()
	// 	.then(function(image) {
	// 		notificationLED.low();
	// 		base64Image = new Buffer(image).toString("base64");
	// 		camera.disable();
	// 		return base64Image;
	// 	})
	// 	.catch(function(err){
	// 		console.log("ERROR,", err);
	// 	});

	camera.takePicture(function(err, image) {
		console.log("entered takepic callback",  image);
		if (err) {
		  console.log('error taking image', err);
		}


		// var postData = image;

		var options = {
		    hostname: '192.168.1.28',
		    port: 1337,
		    path: '/api/pic',
		    method: 'POST',
		    headers: {
		        'Content-Type': 'image/jpg'
		    }
		};

		var req = http.request(options);

		req.on('error', function(e) {
		    console.log('problem with request: ' + e.message);
		});

		// write data to request body
		req.write(image);
		req.end();
		  //cb(base64Image);
		  // camera.disable();
		
	});
};


// Wait for the camera module to say it's ready
camera.on('ready', function() {
  notificationLED.high();
  
});

camera.on('error', function(err) {
  console.error(err);
});


//SERVO STUFF

// Plug in a servo at position 1
// var servo1 = 1;

// servo.on('ready', function () {
//     var closedPosition = 0;  //  Target position of the servo between 0 (min) and 1 (max).
//     var openPosition = 0.25;

//     //  Set the minimum and maximum duty cycle for servo 1.
//     //  If the servo doesn't move to its full extent or stalls out
//     //  and gets hot, try tuning these values (0.05 and 0.12).
//     //  Moving them towards each other = less movement range
//     //  Moving them apart = more range, more likely to stall and burn out

//     servo.read(servo1, function (err, reading){console.log("reading, ",reading);});

//     servo.configure(servo1, 0.05, 0.12, function () {
//         // Opens the latch!!

//             var openLatch = function openLatch (cb) {
//                 console.log('Open sesame');
//                 servo.move(servo1, openPosition, cb);
//             };
//         // Closes the latch!!
//             var closeLatch = function closeLatch (cb) {
//                 console.log('Close sesame');
//                 servo.move(servo1, closedPosition, cb);

//             };

            
//             openLatch(closeLatch);
//             // setTimeout(closeLatch, 100);
//             // setTimeout(openLatch, 0);
//             // setTimeout(openLatch, 500);

//     });
// });

// // ACCEL STUFF
// // Initialize the accelerometer.
// accel.on('ready', function () {
//     // Stream accelerometer data
//     accel.setOutputRate(1, function rateSet() {
// 	  accel.on('data', function (xyz) {
// 	    console.log('x:', xyz[0].toFixed(2),
// 	      'y:', xyz[1].toFixed(2),
// 	      'z:', xyz[2].toFixed(2));
// 	  });
// 	});
// });

// accel.on('error', function(err){
//   console.log('Error:', err);
// });