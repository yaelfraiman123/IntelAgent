(function() {
	"use strict";
	
    var moduleRef = angular.module("services");					
	var currentUser = function(appSettings,$resource,$http,alert){
		var profile = {
				isLoggedIn: false,
				username: "",
				token: "as",
				transactions: []
		};
		
		var setTransactions = function(transactions)
		{
			profile.transactions = transactions;
		}
		var setProfile = function(username1,token1,isLoggedIn1)
		{
				profile.username = username1;
				profile.token = token1;
				profile.isLoggedIn = isLoggedIn1;
		};
		
		var clearUser = function()
		{	
			setProfile("","",false);
			profile.transactions = [];
			localStorage["intelToken"] = "";
			localStorage["intelUser"] = "";
			
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
		
		var login = function(username,token)
		{
			setProfile(username,token,true);
			localStorage["intelToken"] = token;
			localStorage["intelUser"] = username;
		}
		
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
			login: login,			
			getUserInfo: getUserInfo,
			clearUser: clearUser
		};
		
	}
	
	moduleRef.factory("currentUser", ["appSettings","$resource","$http",'alert',currentUser]);//use this dependencies
}()); 