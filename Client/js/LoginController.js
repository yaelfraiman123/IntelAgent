(function() {

  var app = angular.module("intelAgent");

  var LoginController = function($scope,$location,$log) {

    $scope.login = function(username,password) {
      console.log("username: " + username + " Password: " +password);
      $log.debug("Going to the Action Page via Login");
      $location.path("/action");
    };


  };

  app.controller("LoginController", LoginController);

}()); 