(function() {

  var app = angular.module("intelAgent");

  var HeadController = function($scope,$location,$route,currentUser) {
		$scope.showLangOps = $location.path() === '/action';
		$scope.showLogout = false;
		
		$scope.logout = function()
		{
			
			var info = currentUser.getUserInfo().get(null,
				function(data){//on Success
					console.log("current username " + data.Email);
					},
					function(response){//on Failure
						console.log("get info fail ");
			});
			
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
  
	

  app.controller("HeadController", ["$scope","$location",'$route','currentUser',HeadController]);
}());