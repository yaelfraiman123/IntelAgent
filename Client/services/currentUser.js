(function() {
	"use strict";
	
    var moduleRef = angular.module("services");					
	var currentUser = function(appSettings,$resource,$http){
		var profile = {
				isLoggedIn: false,
				username: "",
				token: "",
				transactions: []
		};
		
		var setTransactions = function(transactions)
		{
			profile.transactions = transactions;
		}
		var setProfile = function(username,token,isLoggedIn)
		{
				profile.username = username;
				profile.token = token;
				profile.isLoggedIn = isLoggedIn;
		};
		
		var logout = function()
		{	
			if(profile.isLoggedIn)
			{	
				console.log("logging out " + profile.username);
				logoutFunc().post(profile.token,
					function(data){//on Success
						console.log("logout post success");
						setProfile("","",false);
						profile.transactions = [];
						
						},
						function(response){//on Failure
							console.log("post success");
				});
						

			}
		}
				
		var logoutFunc = function()
		{
			return $resource(appSettings.serverURL + "/api/Account/Logout?access_token=:access_token", {access_token: profile.token},
			{

				'post':{
					method: 'POST',
					headers: {'Authorization': 'Bearer ' + profile.token}
				}
			});
		};
		
		var getProfile = function()
		{
			return profile;
		};
			

		var getUserInfo = function(){
		return $resource(appSettings.serverURL + "/api/Account/UserInfo?access_token=" + profile.token,null,
			{

				'get':{
					method: 'GET',
					headers: {'Authorization': 'Bearer ' + profile.token}
				}
			});
		};
		
		return{
			setProfile: setProfile,
			getProfile: getProfile,
			setTransactions: setTransactions,
			logout: logout,
			getUserInfo: getUserInfo
		};
		
	}
	
	moduleRef.factory("currentUser", ["appSettings","$resource","$http",currentUser]);//use this dependencies
}()); 