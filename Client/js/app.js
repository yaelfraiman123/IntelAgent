// Code goes here
(function() {

  var app = angular.module("intelAgent", ["ngRoute","services"]);

  app.config(function($routeProvider) {
    $routeProvider
      .when("/main", {
        templateUrl: "partials/main.html",
        controller: "MainController"
      })
      .when("/login",{
        templateUrl: "partials/login.html",
        controller: "LoginController"
      })
      .when("/action",{
        templateUrl: "partials/action.html",
        controller: "ActionController"
      })
	  .when("/register",{
		templateUrl: "partials/register.html",
		controller: "RegisterController"
	  })
      .otherwise({
        redirectTo: "/main"
      });
  }); 

}());