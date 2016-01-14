angular.module('Q.services', [
'ionic'
])


.factory('Playlist', function($http){
  var getSongs = function(){
      return $http ({
        method: 'GET',
        url: '/'
      }).then(function(response){
        return response.data;
      })
  }

  var addSong = function (song){
    console.log("adding song: " + song);
    return $http ({
      method: 'POST',
      url: '/',
      data: song
    })
  }

  var searchSongs = function(query){
    SC.initialize({
      client_id: 'f270bdc572dc8380259d38d8015bdbe7'
    });

    return SC.get('/tracks', {
      q: query,
    }).then(function(tracks) {
      return tracks;
    });
  }

  // isHostData in factory stores whether or not
  // the current user is the host
  
  var isHostData = false;

  var isHost = function(){
    return isHostData;
  }

  var makeHost = function () {
    isHostData = true;
  }

  var makeGuest = function(){
    isHostData = false;
  }

  return {
    getSongs: getSongs,
    addSong: addSong,
    searchSongs: searchSongs,
    makeHost: makeHost,
    makeGuest: makeGuest,
    isHost: isHost
  }
})
