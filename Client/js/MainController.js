(function() {

  var app = angular.module("intelAgent");

  var MainController = function($scope,$location,$log) {

    $scope.goToLogin = function() {
      $log.debug("Going to the login Page via Main");
      $location.path("/login");
    };


  };

  app.controller("MainController", MainController);

}());