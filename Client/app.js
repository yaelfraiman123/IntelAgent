// Code goes here
(function() {

  var app = angular.module("intelAgent", ["ngRoute"]);

  app.config(function($routeProvider) {
    $routeProvider
      .when("/main", {
        templateUrl: "main.html",
        controller: "MainController"
      })
      .when("/login",{
        templateUrl: "login.html",
        controller: "LoginController"
      })
      .when("/action",{
        templateUrl: "action.html",
        controller: "ActionController"
      })
      .otherwise({
        redirectTo: "/main"
      });
  }); 

}());