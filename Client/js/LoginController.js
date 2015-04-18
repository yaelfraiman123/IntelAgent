(function() {

  var app = angular.module("intelAgent");

  var LoginController = function($scope,$location,$log) {

    $scope.login = function(username,password) {
      console.log("username: " + username + " Password: " +password);
      $log.debug("Going to the Action Page via Login");
      $location.path("/action");
    };

	$scope.goToRegisterPage = function goToRegisterPage(){
		$log.debug("Going to the Register Page via Login");
        $location.path("/register");
	};
  };

  app.controller("LoginController", LoginController);

}()); 