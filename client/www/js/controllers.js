angular.module('Q.controllers', [
'Q.services',
'Q',
'ionic',
'angularSoundManager',
])

.controller('playlistController', function($scope, $rootScope, $location, Playlist, Host, $state, $ionicPopup, $stateParams) {
  
 
  $rootScope.isUserAHost;
  $rootScope.songs= [];  
  $rootScope.customPlaylist;
  $rootScope.friendCount;
  $rootScope.roomName = $stateParams.roomName;
  $rootScope.room_name = $rootScope.roomName.split('_').join(' ');
  $rootScope.location;
  $rootScope.refreshed = false;
  if(!$rootScope.refresh) {
    $state.go('landing');
  }
  Host.isUserAHost($rootScope.roomName).then(function(isHost) {
    $rootScope.isUserAHost = isHost;
  });
  if($rootScope.isUserAHost) {
    console.log("initalized playlist controller as host");
  } else {
    socket.emit('newGuest', $scope.roomName)
    console.log("initalized playlist controller as guest");  
  }


  // checks if user is host of entered room
  // if(localStorage.getItem('qHost') === localStorage.getItem('qRoom')){
  //   $rootScope.isUserAHost = Playlist.makeHost();
  // }

  // if(!Playlist.isRoomEntered()){

  //   if(localStorage.getItem('qRoom')){
  //     // console.log(localStorage.getItem('qRoom'));
  //     // console.log("join room emitted");
  //     // console.log(localStorage.getItem('qHost'), localStorage.getItem('qRoom'));


  //     socket.emit("join room", localStorage.getItem('qRoom'));
  //     socket.on('roomjoined', function(roomname){
  //       if(roomname){
  //         console.log('succesful room join on', roomname);
  //         window.socket.emit('newGuest');

  //       } else {
  //         console.log("no such room");
  //         $scope.showAlert('Room does not exist');
  //         return
  //       }
  //     });
  //   }
  // } else {
  //   window.socket.emit('newGuest');
  // }

  $scope.logOut = function() {
    localStorage.removeItem('qHost');
    localStorage.removeItem('qRoom');
    $state.go('landing')
  }

  //search song function
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

  $scope.clearResults = function (){
    $scope.query = '';
    $rootScope.songs = [];
  }

  $scope.isHost = function(){
    return $rootScope.isUserAHost;
  }

  $scope.clearResults = function (){
    $scope.query = '';
    $rootScope.songs = [];
  }

  $scope.showAlert = function(alertMessage){
    var alertPopup = $ionicPopup.alert({
      title: 'sorry...',
      template: alertMessage
    });
    alertPopup.then(function(res){
      console.log('thanks for trying')
    });
  }

  $scope.viewSong = function(alertMessage){
    var alertPopup = $ionicPopup.alert({
      title: 'Song title:',
      template: alertMessage
    });

  }

  $scope.showSong = function(title) {
    $scope.viewSong(title)
  }

})

.controller('landingPageController', function($scope, $location, $state, Playlist, $ionicPopup, $timeout, $state, $rootScope){
  console.log("INIT LANDING PAGE CONTROLLER");
  navigator.geolocation.getCurrentPosition(function(position){
    $rootScope.location = position;
  })
  localStorage.removeItem('qRoom');
  socket.on('userCount', function(friendCount) {
    console.log('created, here i am...', friendCount);
    $rootScope.friendCount = friendCount;
  
  });

  $rootScope.showAlert = function(alertMessage){
    var alertPopup = $ionicPopup.alert({
      title: 'sorry...',
      template: alertMessage
    });
    alertPopup.then(function(res){
      console.log('thanks for trying')
    });
  }

  $scope.makeHost = function(){

    // Note: this is a temporary fix for the demo, and should not be used as actual authentication
    if($scope.createRoomPassword === "test"){
      Playlist.makeHost();
      $state.go('playlist');
    }
  }

  // socket.on('roomcreated', function(roomname){
  //   // console.log('controller side room created', roomname);
  //   if(roomname){
  //     $rootScope.roomName = roomname;
  //     Playlist.makeHost();
  //     $state.go('playlist');
  //   } else {
  //     console.log("Error creating room");
  //     $scope.showAlert("Room already exists");
  //   }
  // });
 
  socket.on('roomjoined', function(roomName){
    // if(roomName){
    //   console.log('succesfully joined room', roomName) ;
    //   $rootScope.roomName = roomName;
    //   $rootScope.isUserAHost = Playlist.makeGuest();
    //   $state.go('playlist');
    //   Playlist.getQueue(roomName);
    // } else {
    //   console.log("no such room");
    //   $scope.showAlert('Room does not exist');
    //   return
    // }
  });

  // createRoom function (initiated when Create Room button is clicked on landing page)
  $scope.createRoom = function(){
      console.log('attempting to create new room for', socket.id);
    Playlist.createRoom(socket.id, $rootScope.location).then(function(response){
      
      console.log('successfully created room: ', response.data.name);
      $rootScope.roomName = response.data.name;
      // localStorage.setItem("qRoom", $rootScope.roomName);
      // localStorage.setItem('qHost', $rootScope.roomName);
      socket.emit("create_room", $rootScope.roomName);
      // socket.disconnect();
      $rootScope.refresh = true;
      $state.go('playlist', {roomName: $rootScope.roomName}, {location: true});
      // $rootScope.isUserAHost = true;    

      // Playlist.enterRoom();
    }).catch(function(error){
      console.log('failed to create room', error)
    });    
  };

  

  $scope.navToFindRoom = function () {
    console.log('nav to find room page')
    $state.go('roomFinder'); 
  }

  $scope.makeGuest = function(){
    Playlist.makeGuest();
    $state.go('playlist');
  }

  $scope.attemptHost = false; //??
  $scope.createRoomPassword; //??
})
.controller('roomFinderController', function($scope, $location, $state, Rooms, $ionicPopup, $timeout, $state, $rootScope){
  console.log('initializing roomFinder controller')
  $rootScope.rooms;
  Rooms.getRooms().then(function(response){
    console.log(response.data)
    $rootScope.rooms = response.data.map(function(element){
      return element.name.split('_').join(' ');
    })
    
  });

  // joinRooom function (initated when Join Room is clicked on landing page)
  $scope.joinRoom = function(roomName){
    roomName = roomName.split(' ').join('_');
    console.log("attempting to join room " + roomName);
    Rooms.joinRoom(roomName, socket.id).then(function(response) {
      console.log(response, 'repsonse')
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
})