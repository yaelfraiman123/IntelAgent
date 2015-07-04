(function() {
	"use strict";
	
	angular.module("services")
				.factory("currentUser",currentUser)
					
	function currentUser(){
		var profile = {
				isLoggedIn: false,
				username: "",
				token: ""
		};
		
		
		var setProfile = function(username,token,isLoggedIn)
		{
				profile.username = username;
				profile.token = token;
				profile.isLoggedIn = isLoggedIn;
		};
		
		var getProfile = function()
		{
			return profile;
		};
		
		return{
			setProfile: setProfile,
			getProfile: getProfile
		};
	}

}()); 