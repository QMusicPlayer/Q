angular.module('Q.controllers', [
'Q.services',
'Q',
'ionic',
'angularSoundManager',
])

.controller('playlistController', function($scope, $rootScope, $location, Playlist) {
  $rootScope.songs= [];  //why root scope??
  $rootScope.customPlaylist;
  // console.log('dustom playlist', $rootScope.customePlayList)

  window.socket.emit('newGuest'); // ???

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
                            waveform: tracks[i].waveform_url
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
  console.log(Playlist.isHost());
})

.controller('landingPageController', function($scope, $location, $state, Playlist, $ionicPopup, $timeout){
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
    console.log('controller side room created', roomname);
    if(roomname){
      Playlist.makeHost();
      $state.go('playlist');
    } else {
      console.log("Error creating room");
      alert("Error creating room");
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
      alert('cant log in');
      return
    }
  });

  $scope.createRoom = function(){
    // console.log("create room:", $scope.roomname);
    socket.emit("create room", $scope.roomname);

  };

  $scope.joinRoom = function(){
    // console.log("join Room:", $scope.enteredRoomName);
    console.log("joinRoom");
    socket.emit("join room", $scope.enteredRoomName);

  };

  $scope.makeGuest = function(){
    Playlist.makeGuest();
    $state.go('playlist');
  }

  $scope.attemptHost = false; //??
  $scope.createRoomPassword; //??
})
