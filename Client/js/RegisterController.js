(function(){
  
    var app = angular.module('intelAgent');
    
    var RegisterController = function($scope,$log,$location,userAccount,currentUser){
		
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
						$scope.message = "Registartion...";
						$scope.goToLogin();
						},
						function(response){//on Failure
							$scope.isLoggedIn = false;
							$scope.message = response.statusText + "/r/n";
							if(response.data.exceptionMessage )
								$scope.message += response.data.exceptionMessage;
							
							if(response.data.modelState){
								for(var key in response.data.modelState){
									$scope.message += response.data.modelState[key] + "/r/n";
								}
							}
						});
			};
			
		$scope.goToLogin = function() {
			$log.debug("Going to the login Page");
			$location.path("/login");
		};

		$scope.$parent.showLangOps = false;//disables the Lang option in the header
    };
    app.controller('RegisterController',["$scope","$log","$location",'userAccount',"currentUser",RegisterController]);//required dependencies

}());
