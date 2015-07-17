(function() {

  var app = angular.module("intelAgent");

  var LoginController = function($scope,$location,userAccount,currentUser) {
		
		//alert('success', 'יש עדכון!','אחד או יותר מהעברות שלך עודכנו' , 5000);
		
		$scope.profile = currentUser.getProfile();
		
		$scope.login = function(){
			$scope.userData.grant_type = "password";
			
			userAccount.login.loginUser($scope.userData,
				function(data){//on Success
					$scope.message = "";
					$scope.password = "";
					currentUser.setProfile($scope.userData.username,data.access_token,true);//init current user profile
					$scope.$parent.showLogout = true;//enables the logout button at the header
					localStorage["intelToken"] = data.access_token;
					localStorage["intelUser"] = $scope.userData.username;
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
			
			currentUser.logout().post(currentUser.getProfile.token,
			function(data){//on Success
				console.log("logout post success");
				currentUser.clearUser();	
				$scope.$parent.showLogout = false;//Disable the logout at the header
				$location.path("/main");
				},
				function(response){//on Failure
					console.log("logout failed");
		});
		}
		$scope.$parent.showLangOps = false;//disables the Lang option in the header
	};


  app.controller("LoginController", ["$scope","$location",'userAccount','currentUser',LoginController]);

}()); 