angular.module('Q.controllers', [
'Q.services',
'Q',
'ionic',
'angularSoundManager',
])

.controller('playlistController', function($scope, $rootScope, $location, Playlist, $state, $ionicPopup, $stateParams) {
  $rootScope.songs= [];  //why root scope??
  $rootScope.customPlaylist;
  $rootScope.friendCount;
  // console.log('dustom playlist', $rootScope.customePlayList)
  console.log("INIT PLAYLIST CONTROLLER");
  if(localStorage.getItem('qHost') === localStorage.getItem('qRoom')){
    Playlist.makeHost();
  }
  if(!Playlist.isRoomEntered()){

    if(localStorage.getItem('qRoom')){
      console.log(localStorage.getItem('qRoom'));
      console.log("join room emitted");
      console.log(localStorage.getItem('qHost'), localStorage.getItem('qRoom'));


      socket.emit("join room", localStorage.getItem('qRoom'));
      socket.on('roomjoined', function(roomname){
        if(roomname){
          console.log('succesful room join on', roomname);
          window.socket.emit('newGuest');

        } else {
          console.log("no such room");
          $scope.showAlert('Room does not exist');
          return
        }
      });
    }
  } else {
    window.socket.emit('newGuest');
  }

  $scope.logOut = function() {
    localStorage.removeItem('qHost');
    localStorage.removeItem('qRoom');
    $state.go('landing')
  }

  $scope.searchSong = function (){
    $rootScope.songs= [];
  
    if($scope.query === ''){
      return;
    } else{
      return Playlist.searchSongs($scope.query).then(function(tracks){
        // console.log('tracks', tracks)
        for(var i = 0;i<tracks.length;i++){
          // console.log('track', tracks[i])
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

          $rootScope.$apply(function(){  // ??? why root scope?
            $rootScope.songs.push(track);
          })
         // console.log('rootscope songs', $rootScope.songs) ???
         
        }

      })

    }
    
  }

  $scope.clearResults = function (){
    $scope.query = '';
    $rootScope.songs = [];
  }

  $scope.isHost = function(){
      return Playlist.isHost();
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

  $scope.onHold = function(title) {
    $scope.viewSong(title)
  }
  
  console.log(Playlist.isHost());
})

.controller('landingPageController', function($scope, $location, $state, Playlist, $ionicPopup, $timeout, $state, $rootScope){
  console.log("INIT LANDING PAGE CONTROLLER");
  localStorage.removeItem('qRoom');

  socket.on('userCount', function(friendCount) {
    console.log('created, here i am...', friendCount);
    $rootScope.friendCount = friendCount;
  
  });

  $scope.showAlert = function(alertMessage){
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

  socket.on('roomcreated', function(roomname){
    // console.log('controller side room created', roomname);
    if(roomname){
      Playlist.makeHost();
      $state.go('playlist');
    } else {
      console.log("Error creating room");
      $scope.showAlert("Room already exists");
    }
  });

  socket.on('roomjoined', function(roomname){
    console.log('roomjoined...', roomname);
    if(roomname){
      
      console.log('succesful room join on', roomname) ;
      Playlist.makeGuest();
      $state.go('playlist');
    } else {
      console.log("no such room");
      $scope.showAlert('Room does not exist');
      return
    }
  });

  $scope.createRoom = function(){
    // console.log("create room:", $scope.roomname);
    localStorage.setItem("qRoom", $scope.roomname);
    localStorage.setItem('qHost', $scope.roomname);
    socket.emit("create room", $scope.roomname);
    Playlist.enterRoom();

  };

  $scope.joinRoom = function(){
    // console.log("join Room:", $scope.enteredRoomName);
    console.log("joinRoom");
    socket.emit("join room", $scope.enteredRoomName);
    localStorage.setItem("qRoom", $scope.enteredRoomName);
    Playlist.enterRoom();

  };

  $scope.makeGuest = function(){
    Playlist.makeGuest();
    $state.go('playlist');
  }

  $scope.attemptHost = false; //??
  $scope.createRoomPassword; //??
})
