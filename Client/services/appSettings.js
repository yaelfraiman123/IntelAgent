(function() {
"use strict";
	angular.module("services",["ngResource"])
				.constant("appSettings",{
					serverURL: "http://localhost:2304" // NEED TO BE CHANGED!@! TODO
				});

}()); 