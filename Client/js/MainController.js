(function() {

  var app = angular.module("intelAgent");

  var MainController = function($scope,$location,$log,alert) {
		
    $scope.goToLogin = function() {
      $log.debug("Going to the login Page via Main");
      $location.path("/login");
    };

	$scope.goToRegisterPage = function goToRegisterPage(){
		$log.debug("Going to the Register Page via Login");
        $location.path("/register");
	};
	
	$scope.$parent.showLangOps = false;//disables the Lang option in the header
  };

  app.controller("MainController", ["$scope","$location","$log",'alert',MainController]);

}());