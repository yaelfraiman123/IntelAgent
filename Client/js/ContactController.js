(function() {

  var app = angular.module("intelAgent");

  var ContactController = function($scope) {
		$scope.$parent.showLangOps = false //disables the lang options in the header
  };

  app.controller("ContactController", ["$scope",ContactController]);

}()); 