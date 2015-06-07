(function() {
	"use strict";
	
	angular.module("services")
				.factory("currentUser",currentUser)
					
	function currentUser(){
		var profile = {
				isLoogedIn: false,
				username: "",
				token: ""
		};
		
		
		var setProfile = function(username,token,isLoogedIn)
		{
				profile.username = username;
				profile.token = token;
				profile.isLoogedIn = isLoogedIn;
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