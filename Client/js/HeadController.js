(function() {

  var app = angular.module("intelAgent");

  var HeadController = function($scope,$location,$route,$interval,currentUser) {
		$scope.showLangOps = $location.path() === '/action';
		$scope.showLogout = false;
		
		$scope.logout = function()
		{	
			if (angular.isDefined($scope.intervalStop)) {
				$interval.cancel($scope.intervalStop);
				$scope.intervalStop = undefined;
			}
			currentUser.logout().post(currentUser.getProfile.token,
			function(data){//on Success
				console.log("logout post success");
				currentUser.clearUser();	
				$scope.showLogout = false;//Disable the logout at the header
				$location.path("/main");			
				},
				function(response){//on Failure
					console.log("logout failed");
			});
		};
		
		$scope.refresh = function()
		{
			$route.reload();
		};
  };
  
	

  app.controller("HeadController", ["$scope","$location",'$route','$interval','currentUser',HeadController]);
}());