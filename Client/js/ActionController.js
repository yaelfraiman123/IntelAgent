(function(){
   "use strict"
    var app = angular.module('intelAgent');
    
    var ActionController = function($scope,$log,stockService){

		$scope.color = {
			isRed: "",
			isGreen: ""
		};

        $scope.editingData = [];//boolean  array to check weather or not an input has to be shown to modify the table.

		stockService.getStocks()
			.then(function(data){ 
			//on success
			console.log(data);
			$scope.stockArray = data;
			},
			function(errorReason){
			//on failure
				$scope.error = errorReason;
			});
		

		$scope.submitFunc = function(){
			$log.debug("בצעעעעעעעעע")
		};
        
		$scope.transactions = [{
			name: "HAPOALIM",
			action: "SELL",
			quantity: 213,
			limit: 129.5,
			strategy: "PASSIVE",
			target: "DARK POLL",
			status: "PENDING",
			delivered_quantity: 0,
			delivered_price: 0
			},
			{
			name: "LEUMI",
			action: "BUY",
			quantity: 100,
			limit: 99.5,
			strategy: "PASSIVE",
			target: "CROSS",
			status: "PENDING",
			delivered_quantity: 0,
			delivered_price: 0
		}];


        for (var i = 0, length = $scope.transactions.length; i < length; i++) {
            $scope.editingData[i] = false;
        }


        $scope.optionArray = [
			{ label: 'MKT', value: 1 },
			{ label: 'Other', value: 2 }
		];
	
		$scope.updateLimitSelect = function updateLimitSelect(){
			$log.debug($scope.desiredLimitObj);
			if ($scope.desiredLimitObj.value == 2){//if "other" selected
				$scope.other = "true";
			}
			else{
				$scope.other = "";
			}
			
		};
	
		$scope.changeStock = function changeStock()
		{
			$scope.color.isGreen = $scope.selectedStock.PctChg > 0;
			$scope.color.isRed = $scope.selectedStock.PctChg < 0;
		};
		
		$scope.submitFunc = function(){
		
			//VALUE 1 == "MKT" label
			$log.debug($scope.desiredLimitObj);
			if($scope.desiredLimitObj.value == 1)
				$scope.desiredLimit = "MKT";
			else
				$scope.desiredLimit = $scope.desiredLimitValue;
			
			$scope.desiredTransaction = {
			Symbol: $scope.selectedStock.Symbol,
			Action: $scope.desiredAction,
			Quantity: $scope.desiredQty,
			Limit: $scope.desiredLimit,
			Strategy: $scope.desiredStrat,
			Target: $scope.desiredTrgt
			}
			
			$log.debug($scope.desiredTransaction);
		};
		
		$scope.update = function(index)
		{
			$log.debug("Updating row index:"+index);
            $scope.editingData[index] = true;
		};
			
		$scope.abort = function(index)
		{
			$log.debug("Aborting row index:"+index);
            $scope.editingData[index] = false;
		};
		
    };
    
    app.controller('ActionController',["$scope","$log","stockService",ActionController]);

}());
