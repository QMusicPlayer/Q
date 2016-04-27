angular.module('Q.controllers', [
'Q.services',
'Q',
'ionic',
'angularSoundManager',
])

//:::::::::::::::::::CONTROLLER FOR PLAYLIST::::::::::::::::::::::::::::::::::::::::

.controller('playlistController', function($scope, $rootScope, $location, Playlist, Rooms, Host, $state, $ionicPopup, $stateParams) {
  
  // rootScope variables made available to all controllers
  $rootScope.isUserAHost;
  $rootScope.songs= [];  
  $rootScope.customPlaylist;
  $rootScope.friendCount;
  $rootScope.roomName = $stateParams.roomName;
  $rootScope.room_name = $rootScope.roomName.split('_').join(' ');
  $rootScope.location;
  $rootScope.refreshed = false; // variable to check if page was accessed without going through create or join room (for refresh)
  
  // if page was refreshed, user is taken back to landing page
  if(!$rootScope.refresh) {
    $state.go('landing');
  }

  // when playlistController is initialized, we must check if that user is a host of the room
  Host.isUserAHost($rootScope.roomName).then(function(isHost) {
    $rootScope.isUserAHost = isHost;
  });

  // initializing playistController for host or guest
  if($rootScope.isUserAHost) {
    console.log("initalized playlist controller as host");
  } else {
    socket.emit('newGuest', $scope.roomName)
    console.log("initalized playlist controller as guest");  
  }

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

})


//:::::::::::::::::::CONTROLLER FOR LANDING PAGE::::::::::::::::::::::::::::::::::::::::


.controller('landingPageController', function($scope, $location, $state, Playlist, Rooms, $ionicPopup, $timeout, $state, $rootScope){
  console.log("INITIALIZED LANDING PAGE CONTROLLER");

  // set geo location for user 
  navigator.geolocation.getCurrentPosition(function(position){
    $rootScope.location = position;
  })

  socket.on('userCount', function(friendCount) {
    console.log('created, here i am...', friendCount);
    $rootScope.friendCount = friendCount;
  
  });

  // createRoom function (initiated when Create Room button is clicked on landing page)
  $rootScope.createRoom = function(){
    console.log('attempting to create new room for', socket.id);
    // Rooms.doesUserBelongToOtherRoom()
    Rooms.createRoom(socket.id, $rootScope.location).then(function(response){
      console.log('successfully created room: ', response.data.name);
      $rootScope.roomName = response.data.name;
      socket.emit("create_room", $rootScope.roomName);
      $rootScope.refresh = true;
      $state.go('playlist', {roomName: $rootScope.roomName}, {location: true});
    }).catch(function(error){
      console.log('failed to create room', error)
    });    
  };
})

//:::::::::::::::::::CONTROLLER FOR ROOM FINDER PAGE::::::::::::::::::::::::::::::::::::::::

.controller('roomFinderController', function($scope, $location, $state, Playlist, Rooms, $ionicPopup, $timeout, $state, $rootScope){
  console.log('initializing roomFinder controller')
  // Get list of rooms
  $rootScope.rooms;
  Rooms.getRooms().then(function(response){
    console.log(response.data)
    $rootScope.rooms = response.data.map(function(element){
      return element.name.split('_').join(' ');
    })
    
  });

  // joinRooom function (initated when Join Room is clicked on roomFinder page)
  $scope.joinRoom = function(roomName){
    roomName = roomName.split(' ').join('_');
    console.log("attempting to join room " + roomName);
    Rooms.joinRoom(roomName, socket.id).then(function(response) {
      if (response.data === 'room does not exist') {
        $rootScope.showAlert('Room does not exist');
      } 
      else if (response.data === 'successfully joined room as guest') {
        $rootScope.roomName =  roomName;
        socket.emit("join_room", roomName);
        $rootScope.refresh = true;
        $state.go('playlist', {roomName: roomName}, {location: true});          
      }
      else if (response.data === 'user is a host') {
        $rootScope.roomName = roomName;
        socket.emit("join_room", roomName);
        $rootScope.refresh = true;
        $state.go('playlist', {roomName: roomName}, {location: true});  
      }
    });
  };

  // createRoom function (initiated when Create Room button is clicked on roomFinder page)
  $scope.createRoom = function(){
    console.log('attempting to create new room for', socket.id);
    Rooms.createRoom(socket.id, $rootScope.location).then(function(response){
      console.log('successfully created room: ', response.data.name);
      $rootScope.roomName = response.data.name;
      socket.emit("create_room", $rootScope.roomName);
      $rootScope.refresh = true;
      $state.go('playlist', {roomName: $rootScope.roomName}, {location: true});
    }).catch(function(error){
      console.log('failed to create room', error)
    });    
  };
})