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

.controller('landingPageController', function($scope, $location, $state, Playlist){
  $scope.makeHost = function(){

    // Note: this is a temporary fix for the demo, and should not be used as actual authentication
    if($scope.createRoomPassword === "test"){
      Playlist.makeHost();
      $state.go('playlist');
    }
  }

  $scope.createRoom = function(){
    console.log("create room:", $scope.roomname);

    socket.emit("create room", $scope.roomname);
    socket.on('room created', function(roomname){
      console.log('controller side room created', roomname);
      socket.emit('newGuest')
    });

    Playlist.makeHost();
    $state.go('playlist');
  };

  $scope.joinRoom = function(){
    console.log("join Room:", $scope.enteredRoomName);
    socket.emit("join room", $scope.enteredRoomName);

    socket.on('room joined', function(roomname){
      console.log('roomjoined...', roomname);
      if(roomname){
        console.log('succesfful room join')
        socket.emit('newGuest')
        Playlist.makeGuest();
        $state.go('playlist');
      } else {
        alert('cant log in')
      }

    });
  };

  $scope.makeGuest = function(){
    Playlist.makeGuest();
    $state.go('playlist');
  }

  $scope.attemptHost = false; //??
  $scope.createRoomPassword; //??
})
