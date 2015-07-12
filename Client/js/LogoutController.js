(function() {

  var app = angular.module("intelAgent");

  var LogoutController = function($scope,currentUser) {
		$scope.profile = currentUser.getProfile();
		$scope.showLogout = profile.isLoggedIn;
  };

  app.controller("LogoutController", ["$scope",'currentUser',LogoutController]);
}());