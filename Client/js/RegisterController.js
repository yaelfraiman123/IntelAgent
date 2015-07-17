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
			
		var userInfo ={
			grant_type: "password",
			password: $scope.userData.password,
			username: $scope.userData.email
			};
			
			//Delete info if another registration will take place soon.
			$scope.message = "";
			$scope.userData.email ="";
			$scope.userData.confirmPassword = "";
			$scope.userData.password = "";
			
			userAccount.login.loginUser(userInfo,
				function(data){//on Success
					currentUser.login(userInfo.username,data.access_token);//init current user profile
					$scope.$parent.showLogout = true;//enables the logout button at the header
					alert('success', 'שלום!','טוב שחזרת ' + userInfo.username ,false, 5000);
					$location.path("/action");
				},
				function(response){//on Failure
					$scope.error = response.data.error_description + " ";

				});
		};

		$scope.$parent.showLangOps = false;//disables the Lang option in the header
    };
    app.controller('RegisterController',["$scope","$log","$location",'userAccount',"currentUser",RegisterController]);//required dependencies

}());
