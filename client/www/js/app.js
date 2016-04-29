// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('Q', [
  'ionic',
  'Q.services',
  'Q.controllers',
  'angularSoundManager'
])

.run(function($ionicPlatform, $rootScope, $window, $ionicPopup) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });

  window.onbeforeunload = function (evt) {
    var message = 'Are you sure you want to leave? If you leave your session will be destroyed and you will no longer be a host or guest of any room you are currently in.';
    
    if (typeof evt == 'undefined') {
      evt = window.event;
    }
    if (evt) {
      evt.returnValue = message;
    }
    return message;

   
  }
 

})
.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('playlist', {
          url: '/playlist/:roomName',
          templateUrl:'../templates/playlist.html',
          controller:'playlistController'
        })
        .state('landing', {
          url: '/landing',
          templateUrl: '../templates/landingPage.html',
          controller: 'landingPageController'
        })
        .state('roomFinder', {
          url:'/roomFinder',
          templateUrl: '../templates/roomFinder.html',
          controller: 'roomFinderController'
        })
    $urlRouterProvider.otherwise('/landing');
});
