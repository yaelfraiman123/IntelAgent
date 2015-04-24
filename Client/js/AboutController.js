(function() {

  var app = angular.module("intelAgent");

  var AboutController = function($scope,$routeParams) {

    if($routeParams.tabToShow)
		$scope.tabToShow = $routeParams.tabToShow;
	else
		$scope.tabToShow = "overview";
		
	$scope.showValues = {
		team: angular.equals($scope.tabToShow,"team"),
		founders: angular.equals($scope.tabToShow,"founders"),
		overview: angular.equals($scope.tabToShow,"overview")
	};
  };

  app.controller("AboutController", ["$scope","$routeParams",AboutController]);

}());