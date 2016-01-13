angular.module('Q.controllers', [
'Q.services',
'Q',
'ionic',
'angularSoundManager',
])

.controller('playlistController', function($scope, $rootScope, $location, Playlist) {
 $rootScope.songs= [];
 $rootScope.customPlaylist;
  window.socket.emit('newGuest');

$scope.searchSong = function (){
    $rootScope.songs= [];
    if($scope.query === ''){
      return;
    } else{
      return Playlist.searchSongs($scope.query).then(function(tracks){
        console.log(tracks)
        for(var i = 0;i<tracks.length;i++){
          console.log(tracks[i].artwork_url)
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
          $rootScope.$apply(function(){
            $rootScope.songs.push(track);
          })
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
    socket.emit("join room", $scope.roomname);
    socket.on('hello', function(roomname){
      console.log(roomname);
    });
    Playlist.makeHost();
    $state.go('playlist');
  };

  $scope.joinRoom = function(){
    console.log("Join Room:", $scope.roomname);
    socket.emit("join room", $scope.roomname);
    socket.on('hello', function(roomname){
      console.log(roomname);
    });
    Playlist.makeGuest();
    $state.go('playlist');
  };

  $scope.makeGuest = function(){
    Playlist.makeGuest();
    $state.go('playlist');
  }

  $scope.attemptHost = false;
  $scope.createRoomPassword;
})