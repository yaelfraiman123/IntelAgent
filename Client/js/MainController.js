(function() {

  var app = angular.module("intelAgent");

  var MainController = function($scope,$location,$log) {

    $scope.goToLogin = function() {
      $log.debug("Going to the login Page via Main");
      $location.path("/login");
    };

	$scope.goToRegisterPage = function goToRegisterPage(){
		$log.debug("Going to the Register Page via Login");
        $location.path("/register");
	};
  };

  app.controller("MainController", ["$scope","$location","$log",MainController]);

}());