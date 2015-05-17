(function() {

  var app = angular.module("intelAgent");

  var LangController = function($scope,$location) {
		$scope.showLangOps = $location.path() === '/action';
  };

  app.controller("LangController", ["$scope","$location",LangController]);

}()); 