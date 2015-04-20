(function(){
  
    var app = angular.module('intelAgent');
    
    var RegisterController = function($scope,$log,userAccount,currentUser){
		
		$scope.isLoggedIn = function(){
			return currentUser.getProfile().isLoggedIn;
		};
    	$scope.message = "";
		$scope.userData = {
				username: '',
				email: '',
				password: '',
				confirmPassword: ''
				};
		
			
		$scope.registerUser = function (){
				//send the registeration data to db using our webAPI
				userAccount.registration.registerUser($scope.userData,
					function(data){//on Success
						$scope.confirmPassword = "";
						$scope.message = "Registartion...";
						$scope.login();
						},
						function(response){//on Failure
							$scope.isLoggedIn = false;
							$scope.message = response.statusText + "/r/n";
							if(response.data && response.data.exceptionMessage )
								$scope.message += response.data.exceptionMessage;
							
							if(response.data && response.data.modelState){
								for(var key in response.data.modelState){
									$scope.message += response.data.modelState[key] + "/r/n";
								}
							}
						});
			};
		$scope.login = function(){
			$scope.userData.grant_type = "password";
			$scope.userData.userName = $scope.userData.email;

			userAccount.login.loginUser($scope.userData,
				function(data){//on Success
					$scope.message = "";
					$scope.password = "";
					currentUser.setProfile($scope.userData.email,token,true);//init current user profile
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
		}
    };
    app.controller('RegisterController',["$scope","$log",'userAccount',"currentUser",RegisterController]);//required dependencies

}());
