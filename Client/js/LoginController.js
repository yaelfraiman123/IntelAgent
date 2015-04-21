(function() {

  var app = angular.module("intelAgent");

  var LoginController = function($scope,$location,$log,userAccount) {

		$scope.login = function(){
			$scope.userData.grant_type = "password";

			userAccount.login.loginUser($scope.userData,
				function(data){//on Success
					$scope.message = "";
					$scope.password = "";
					currentUser.setProfile($scope.userData.username,token,true);//init current user profile
					$log.debug("Going to the Action Page via Login");
					$location.path("/action");
				},
				function(response){//on Failure
					$scope.password ="";
					currentUser.setProfile("","",false);//reset current user
					$scope.message = response.statusText + "/r/n";
					if(response.data.exceptionMessage)
						$scope.message += response.data.exceptionMessage + "/r/n" ;
					if(response.data.error)
						$scope.message += response.data.error + "/r/n";
				});
		};
		
		$scope.goToRegisterPage = function goToRegisterPage(){
			$log.debug("Going to the Register Page via Login");
			$location.path("/register");
		};
	};


  app.controller("LoginController", ["$scope","$location","$log",'userAccount',LoginController]);

}()); 