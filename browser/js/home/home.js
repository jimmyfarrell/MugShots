'use strict';
app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: 'HomeCtrl'
    });
});

app.controller('HomeCtrl', function($scope, $firebaseObject) {

    var fbRef = new Firebase('https://mug-shots.firebaseio.com/');

    var fbObj = $firebaseObject(fbRef);

    fbObj.$bindTo($scope, 'firebase');

});
