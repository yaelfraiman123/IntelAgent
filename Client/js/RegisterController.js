(function(){
  
    var app = angular.module('intelAgent');
    
    var RegisterController = function($scope,$log){
      
    	  
		$scope.checkRegisterItems = function checkRegisterItems(email,password,confirmedPassword){
			var doRegisteration = true;
			
			if(isEmailExist(email))
			{
				doRegisteration = false;
				$log.debug("email exist log for debug");
				//create warning for user
			}
	
			if(!angular.equals(password,confirmedPassword))
			{
				doRegisteration = false;
				$log.debug("passwords not equal log for debug");
				//create warning for user
			}
			
			if(doRegisteration)
			{
				$log.debug("items are validated, Registering");
				registerUser(email,password);
			}
			

		};
		
		var isEmailExist = function isEmailExist(email)
			{
				return false;//here we will need to check if email exist in the db
			};
			
		var registerUser = function registerUser(email,password){
				//send the registeration data to db
			};
    };
    app.controller('RegisterController',RegisterController);

}());
