(function() {
  angular.module("Q")
  .controller('LandingPageController', function($scope, $location, $state, Playlist, Rooms, User, $ionicPopup, $timeout, $state, $rootScope) {
    console.log("INITIALIZED LANDING PAGE CONTROLLER");

    // set geo location for user 

    socket.on('addUser', function(){

      navigator.geolocation.getCurrentPosition(function(position){
        console.log(position, 'position found')
        $rootScope.location = position;
        User.addUser(socket.id).then(function(response){
          console.log('successfully added user', response);
        }).catch(function(error){
          console.log('error adding user', error);
        })
      })

    })

    // createRoom function (initiated when Create Room button is clicked on landing page)
    $scope.createRoom = function(){
      console.log('attempting to create new room for', socket.id);
      Rooms.createRoom($rootScope.location).then(function(response){
        console.log('successfully created room: ', response.data.name);
        $rootScope.roomName = response.data.name;
        User.makeHost($rootScope.roomName, socket.id).then(function(response){
           console.log(response.data, 'in controllers')
          if(response.data.status === 'host of another room' && response.data.previousRoom) {
            Rooms.changeListenerCount(response.data.previousRoom, -1).then(function(count){
              socket.emit("leaveRoom", response.data.previousRoom);
              // TODO send message to room to take over host control
            }).catch(function(error) {
              console.log('error changing listener count', error);
            });
          }

          else if (response.data.status === 'guest of another room' && response.data.previousRoom) {
            Rooms.changeListenerCount(response.data.previousRoom, -1).then(function(count){
              socket.emit("leaveRoom", response.data.previousRoom);
              // TODO send message to room to take over host control
            }).catch(function(error) {
              console.log('error changing listener count', error);
            });
          }
          console.log('successfully added host in db')
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
  });
})();