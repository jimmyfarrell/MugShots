'use strict';
var router = require('express').Router();
var fs = require('fs');
var Firebase = require('firebase');
module.exports = router;

router.use('/tutorial', require('./tutorial'));
router.use('/members', require('./members'));

router.post('/pic', function(req, res, next) {
    var body = new Buffer(0);

    req.on('data', function (data) {
        body = Buffer.concat([body, new Buffer(data)]);
    });

    req.on('end', function () {
        var base64Image = body.toString('base64');
        var fbRef = new Firebase('https://mug-shots.firebaseio.com/');
        fbRef.push({base64: base64Image, timestamp: Date.now(), userId: 'Rachel'})
    });
});

// Make sure this is after all of
// the registered routes!
router.use(function (req, res) {
    res.status(404).end();
});
