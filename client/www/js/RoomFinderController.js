(function() {
  angular.module("Q")
  .controller('RoomFinderController', function($scope, $location, $state, Playlist, Rooms, User, $ionicPopup, $timeout, $state, $rootScope) {
    console.log('initializing roomFinder controller')
    // Get list of rooms
    $rootScope.roomNames;
    Rooms.getRooms().then(function(response){
      console.log(response.data)
      $rootScope.rooms = response.data;
      $rootScope.roomNames = response.data.map(function(element){
        return element.name.split('_').join(' ');
      })
      
    });

    // joinRooom function (initated when Join Room is clicked on roomFinder page)
    $scope.joinRoom = function(roomName){
      $rootScope.roomName = roomName.split(' ').join('_');
      console.log("attempting to join room " + roomName);
      User.makeGuest($rootScope.roomName, socket.id).then(function(response) {
        if(response.status === 'guest') {
          console.log('successfully made user guest in db');
          Rooms.changeListenerCount($rootScope.roomName, 1).then(function(response){
            $rootScope.listenerCount = response.data;
          }).catch(function(error) {
            console.log('error changing listener count', error);
          });
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
          console.log('user already guest in db');
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
  });
})();