(function() {
  angular.module("Q")
  .controller('PlaylistController', function($scope, $rootScope, $location, Playlist, Rooms, User, $state, $ionicPopup, $stateParams, $window) {
    // rootScope variables made available to all controllers
    $rootScope.isUserAHost; 
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
      console.log('is user the host?', isHost)
      $rootScope.isUserAHost = isHost;
      if($rootScope.isUserAHost) {
        console.log("initalized playlist controller as host");
      } else {
        // socket.emit('newGuest', $scope.roomName)
        console.log("initalized playlist controller as guest");  
      }
    });  

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


    // socket listeners
    socket.on('updateUserCount', function() {
      Rooms.getListenerCount($rootScope.roomName).then(function(response) {
        console.log('listener count: ', response.data)
        $rootScope.listenerCount = response.data;
      }).catch(function(error) {
        console.log('error getting listener count', error);
      });
    })

    socket.on('deleteSongFromQueue', function (target) {
      Playlist.deleteSong($rootScope.roomName, target).then(function(response){
        socket.emit('deleteSongsFromGuests', Number(response.data));
      });
    })

    socket.on('updateVotesInDb', function(songData) {
      Playlist.updateVotes($rootScope.roomName, songData, socket.id).then(function(response) {
        console.log('contrklsad', response.data)
        socket.emit('updateVotesToAllClients', response.data);
      })
    })
  });
})();
