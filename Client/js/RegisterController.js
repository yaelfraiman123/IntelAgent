(function(){
  
    var app = angular.module('intelAgent');
    
    var RegisterController = function($scope,$log,$location,userAccount,currentUser){
				
    	$scope.message = "";
		$scope.userData = {
				username: '',
				email: '',
				password: '',
				confirmPassword: ''
				};
		
			
		$scope.registerUser = function (){
				//send the registration data to the db using our webAPI
				userAccount.registration.registerUser($scope.userData,
					function(data){//on Success
						$scope.login();
						},
						function(response){//on Failure
							$scope.message = "";
							$scope.userData.confirmPassword = "";
							$scope.userData.password = "";
							
							if(response.data.ModelState){
								for(var key in response.data.ModelState){
									$scope.message += response.data.ModelState[key][0] + "\r \n";
								}
							}
						});
			};
			
		$scope.login = function(){
			$scope.userData.grant_type = "password";
			
			userAccount.login.loginUser($scope.userData,
				function(data){//on Success
					currentUser.setProfile($scope.userData.username,data.access_token,true);//init current user profile
					$scope.$parent.showLogout = true;//enables the logout button at the header
					localStorage["intelToken"] = data.access_token;
					localStorage["intelUser"] = $scope.userData.username;
					$location.path("/action");
				},
				function(response){//on Failure
					$scope.message = "";
					$scope.password = "";
					$scope.userData.password ="";
					$scope.error = response.data.error_description + " ";

				});
		};

		$scope.$parent.showLangOps = false;//disables the Lang option in the header
    };
    app.controller('RegisterController',["$scope","$log","$location",'userAccount',"currentUser",RegisterController]);//required dependencies

}());
