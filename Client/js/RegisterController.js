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
				//send the registration data to the db using our webAPI
				userAccount.registration.registerUser($scope.userData,
					function(data){//on Success
						$scope.goToLogin();
						},
						function(response){//on Failure
							$scope.isLoggedIn = false;
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
			
		$scope.goToLogin = function() {
			$log.debug("Going to the login Page");
			$location.path("/login");
		};

		$scope.$parent.showLangOps = false;//disables the Lang option in the header
    };
    app.controller('RegisterController',["$scope","$log","$location",'userAccount',"currentUser",RegisterController]);//required dependencies

}());
