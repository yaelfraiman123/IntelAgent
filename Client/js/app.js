// Code goes here
(function () {
    var app = angular.module("intelAgent", ["ngRoute", "services"]);

    app.config(function ($routeProvider) {
        $routeProvider
            .when("/main", {
                templateUrl: "partials/main.html",
                controller: "MainController"
            })
            .when("/login", {
                templateUrl: "partials/Login.html",
                controller: "LoginController"
            })
            .when("/action/:lang?", {
                templateUrl: "partials/action.html",
                controller: "ActionController"
            })
            .when("/register", {
                templateUrl: "partials/register.html",
                controller: "RegisterController"
            })
            .when("/contact", {
                templateUrl: "partials/contact.html",
				controller: "ContactController"
            })
            .when("/what-we-do/:tabToShow?", {
                templateUrl: "partials/what-we-do.html",
                controller: "WhatController"
            })
            .when("/about/:tabToShow?", {
                templateUrl: "partials/about.html",
                controller: "AboutController"
            })
            .otherwise({
                redirectTo: "/main"
            });
    });


}());
