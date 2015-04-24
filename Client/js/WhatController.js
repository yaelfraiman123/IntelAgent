(function() {

  var app = angular.module("intelAgent");

  var WhatController = function($scope,$routeParams) {

    if($routeParams.tabToShow)
		$scope.tabToShow = $routeParams.tabToShow;
	else
		$scope.tabToShow = "overview";
		
	$scope.showValues = {
		infrastructure: angular.equals($scope.tabToShow,"infrastructure"),
		strategy: angular.equals($scope.tabToShow,"strategy"),
		overview: angular.equals($scope.tabToShow,"overview")
	};
  };

  app.controller("WhatController", ["$scope","$routeParams",WhatController]);

}());