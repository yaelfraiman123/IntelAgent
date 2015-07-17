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
		
		var clearUser = function()
		{	
			setProfile("","",false);
			profile.transactions = [];
			localStorage["intelToken"] = "";
		}
				
		var logout = function()
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
			getUserInfo: getUserInfo,
			clearUser: clearUser
		};
		
	}
	
	moduleRef.factory("currentUser", ["appSettings","$resource","$http",currentUser]);//use this dependencies
}()); 