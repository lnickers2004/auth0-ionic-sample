angular.module('starter.controllers', [])
.controller('LoginCtrl', function($scope, auth, $state, store) {
  function doAuth() {
    auth.signin({
      closable: false,
      // This asks for the refresh token
      // So that the user never has to log in again
      authParams: {
        scope: 'openid offline_access'
      }
    }, function(profile, idToken, accessToken, state, refreshToken) {
      store.set('profile', profile);
      store.set('token', idToken);
      store.set('refreshToken', refreshToken);
      $state.go('tab.dash');
    }, function(error) {
      console.log("There was an error logging in", error);
    });
  }

  $scope.$on('$ionic.reconnectScope', function() {
    doAuth();
  });

  doAuth();
  
  
})

.controller('DashCtrl', function($scope, $http, $state) {
  $scope.callApi = function() {
    // Just call the API as you'd do using $http
    $http({
      //url: 'http://auth0-nodejsapi-sample.herokuapp.com/secured/ping',
      url: 'http://192.168.0.2:3001/secured/ping',
      method: 'GET'
    }).then(function(response) {
      alert("Yo Man!!! We got the secured data successfully... from localhost!!!!\n" +
      'http://localhost:3001/secured/ping\n' + response.data.text);
      console.log(JSON.stringify(response));
    }, function() {
      //BEGIN LEN DEBUG
      // THIS WORKED!!!
      //alert("Please download the API seed so that you can call it.");
      $state.go('login');
      //END LEN DEBUG
    });
  };

})

.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope, auth, store, $state) {
  $scope.logout = function() {
    auth.signout();
    store.remove('token');
    store.remove('profile');
    store.remove('refreshToken');
    $state.go('login', {}, {reload: true});
  };
});
