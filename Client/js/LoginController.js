(function() {

  var app = angular.module("intelAgent");

  var LoginController = function($scope,$location,userAccount,currentUser) {
		
		$scope.profile = currentUser.getProfile();
		
		$scope.login = function(){
			$scope.userData.grant_type = "password";
			
			userAccount.login.loginUser($scope.userData,
				function(data){//on Success
					$scope.message = "";
					$scope.password = "";
					currentUser.setProfile($scope.userData.username,data.access_token,true);//init current user profile
					$location.path("/action");
				},
				function(response){//on Failure
					$scope.userData.password ="";
					currentUser.logout();//reset current user
					$scope.error = response.data.error_description + " ";

				});
		};
		
		$scope.logout = function()
		{
			var info = currentUser.getUserInfo().get(null,
				function(data){//on Success
					console.log("current username " + data.Email);
					},
					function(response){//on Failure
						console.log("get info fail ");
			});
				currentUser.logout();
		}
		$scope.$parent.showLangOps = false;//disables the Lang option in the header
	};


  app.controller("LoginController", ["$scope","$location",'userAccount','currentUser',LoginController]);

}()); 