angular.module('Q.controllers', [
'Q.services',
'Q',
'ionic',
'angularSoundManager',
])

//:::::::::::::::::::CONTROLLER FOR PLAYLIST::::::::::::::::::::::::::::::::::::::::

.controller('playlistController', function($scope, $rootScope, $location, Playlist, Rooms, User, $state, $ionicPopup, $stateParams, $window) {
  
  // rootScope variables made available to all controllers
  $rootScope.isUserAHost;
  $rootScope.songs= [];  
  $rootScope.customPlaylist;
  $rootScope.listenerCount;
  $rootScope.roomName = $stateParams.roomName;
  $rootScope.room_name = $rootScope.roomName.split('_').join(' ');
  $rootScope.location;
  $rootScope.refreshed; // variable to check if page was accessed without going through create or join room (for refresh)
  
  // if page was refreshed, user is taken back to landing page
  if($rootScope.refreshed === undefined) {
    $state.go('landing');
  }

  
  // when playlistController is initialized, we must check if that user is a host of the room
  User.isUserAHost($rootScope.roomName, socket.id).then(function(isHost) {
    console.log(isHost, 'host test')
    $rootScope.isUserAHost = isHost;
    if($rootScope.isUserAHost) {
      console.log("initalized playlist controller as host");
    } else {
      // socket.emit('newGuest', $scope.roomName)
      console.log("initalized playlist controller as guest");  
    }
  });
  // initializing playistController for host or guest
  

  //search song function (soundcloud)
  $scope.searchSong = function (){
    $rootScope.songs= [];
    if($scope.query === '') {
      return;
    } else {
      return Playlist.searchSongs($scope.query).then(function(tracks){
        for(var i = 0;i<tracks.length;i++){
          var track = {
            id: tracks[i].id,
            title: tracks[i].title,
            artist: tracks[i].user.permalink,
            url: tracks[i].stream_url + "?client_id=f270bdc572dc8380259d38d8015bdbe7",
            waveform: tracks[i].waveform_url,
            votes: 0
          };
          if(tracks[i].artwork_url === null){
              track.image = '../img/notavailable.png';
          } else {
              track.image = tracks[i].artwork_url
          }
          $rootScope.$apply(function(){  
            $rootScope.songs.push(track);
          });         
        }
      });
    }    
  }


  
  // clears search results
  $scope.clearResults = function (){
    $scope.query = '';
    $rootScope.songs = [];
  }

  // used for templating (ng-show) to serve host or guest template
  $scope.isHost = function(){
    return $rootScope.isUserAHost;
  }


  socket.on('updateUserCount', function() {
    Rooms.getListenerCount($rootScope.roomName).then(function(response) {
      console.log(response)
      $rootScope.listenerCount = response.data;
    }).catch(function(error) {
      console.log('error getting listener count', error);
    });
  })

  socket.on('deleteSongFromQueue', function (target) {
    Rooms.deleteSong($rootScope.roomName, target).then(function(response){
      socket.emit('deleteSongsFromGuests', Number(response.data));
    });
  })
})


//:::::::::::::::::::CONTROLLER FOR LANDING PAGE::::::::::::::::::::::::::::::::::::::::


.controller('landingPageController', function($scope, $location, $state, Playlist, Rooms, User, $ionicPopup, $timeout, $state, $rootScope){
  console.log("INITIALIZED LANDING PAGE CONTROLLER");

  // set geo location for user 
  navigator.geolocation.getCurrentPosition(function(position){
    $rootScope.location = position;
  })


  socket.on('addUser', function(){
    User.addUser(socket.id).then(function(response){
      console.log('successfully added user', response);
    }).catch(function(error){
      console.log('error adding user', error);
    })
  })

  // createRoom function (initiated when Create Room button is clicked on landing page)
  $scope.createRoom = function(){
    console.log('attempting to create new room for', socket.id);
    Rooms.createRoom($rootScope.location).then(function(response){
      console.log('successfully created room: ', response.data.name);
      $rootScope.roomName = response.data.name;
      User.makeHost($rootScope.roomName, socket.id).then(function(response){
        console.log('successfully added host')
        Rooms.getListenerCount($rootScope.roomName).then(function(response) {
          $rootScope.listenerCount = response.data;
          socket.emit("create_room", $rootScope.roomName);
          $state.go('playlist', {roomName: $rootScope.roomName}, {location: true});
          $rootScope.refreshed = false;
        }).catch(function(error) {
          console.log('error getting listener count', error);
        });
      }).catch(function(error){
        console.log('error making user a host', error)
      });
    }).catch(function(error){
      console.log('failed to create room', error)
    });    
  };
})

//:::::::::::::::::::CONTROLLER FOR ROOM FINDER PAGE::::::::::::::::::::::::::::::::::::::::

.controller('roomFinderController', function($scope, $location, $state, Playlist, Rooms, User, $ionicPopup, $timeout, $state, $rootScope){
  console.log('initializing roomFinder controller')
  // Get list of rooms
  $rootScope.rooms;
  Rooms.getRooms().then(function(response){
    $rootScope.rooms = response.data.map(function(element){
      return element.name.split('_').join(' ');
    })
    
  });

  // joinRooom function (initated when Join Room is clicked on roomFinder page)
  $scope.joinRoom = function(roomName){
    $rootScope.roomName = roomName.split(' ').join('_');
    console.log("attempting to join room " + roomName);
    User.makeGuest($rootScope.roomName, socket.id).then(function(response) {
      console.log(response)
      if(response.status === 'guest') {
        console.log('successfully made user guest');
        Rooms.changeListenerCount($rootScope.roomName, 1).then(function(response){
          $rootScope.listenerCount = response.data;
        }).catch(function(error) {
          console.log('error changing listener count', error);
        })
      } 
      else if(response.status === 'relinquishing host') {
        Rooms.changeListenerCount($rootScope.roomName, 1).then(function(response){
          $rootScope.listenerCount = response.data;
        }).catch(function(error) {
          console.log('error changing listener count', error);
        })
        // TODO: notify guests of previous room of host leaving
      } 

      else if (response.status === 'already guest') {
        console.log('user already guest');
      } else {
        console.log('user not found')
      }

      if(response.previousRoom){
        Rooms.changeListenerCount(response.previousRoom, -1).then(function(count){
          socket.emit("leaveRoom", response.previousRoom);
        }).catch(function(error) {
          console.log('error changing listener count', error);
        })
      }

      socket.emit("join_room", $rootScope.roomName);
      $state.go('playlist', {roomName: $rootScope.roomName}, {location: true});          
      $rootScope.refreshed = false;
      
    }).catch(function(error) {
      console.log('error making guest', error)
    })
  };

  // createRoom function (initiated when Create Room button is clicked on roomFinder page)
  $scope.createRoom = function(){
      console.log('attempting to create new room for', socket.id);
      Rooms.createRoom($rootScope.location).then(function(response){
        console.log('successfully created room: ', response.data.name);
        $rootScope.roomName = response.data.name;
        User.makeHost($rootScope.roomName, socket.id).then(function(response){
          console.log('successfully added host')
          socket.emit("create_room", $rootScope.roomName);
          $state.go('playlist', {roomName: $rootScope.roomName}, {location: true});
          $rootScope.refreshed = false;
        }).catch(function(error){
          console.log('error making user a host', error)
        });
      }).catch(function(error){
        console.log('failed to create room', error)
      });    
  };
})