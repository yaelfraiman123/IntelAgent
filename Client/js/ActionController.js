(function(){
  
    var app = angular.module('intelAgent');
    
    var ActionController = function($scope,$log,stockService){
		$scope.color = {
			isRed: ($scope.PctChg < 0),
			isGreen: ($scope.PctChg > 0),
			};
		
		stockService.getStocks()
			.then(function(data){ 
			//on success
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
	
		$scope.optionArray = [
			{ label: 'MKT', value: 1 },
			{ label: 'Other', value: 2 }
		];
	
		$scope.updateLimitSelect = function updateLimitSelect(){
			$log.debug($scope.selectedLimit);
			if ($scope.selectedLimit.value == 2){
				$scope.other = "true";
			}
			else{
				$scope.other = "";
			}
			
		};
	
		$scope.changeStock = function changeStock()
		{
			$log.debug($scope.selectedStock);
			
			
			var element = document.getElementById("AskQty");
			element.value=$scope.selectedStock.AskQty;
			
			
			var element = document.getElementById("Ask");
			element.value=$scope.selectedStock.Ask;
			
			
			var element = document.getElementById("Bid");
			element.value=$scope.selectedStock.Bid;
			
			
			var element = document.getElementById("BidQty");
			element.value=$scope.selectedStock.BidQty;
			
			$scope.PctChg = $scope.selectedStock.PctChg;
			var element = document.getElementById("change");
			element.value=$scope.selectedStock.PctChg;
			
			
			var element = document.getElementById("laste_price");
			element.value=$scope.selectedStock.LastPrice;
			
			if($scope.selectedStock.PctChg > 0)
				$scope.color.isGreen = true;
			else if ($scope.selectedStock.PctChg < 0)
				$scope.color.isRed = true;
			else
			{
				$scope.color.isGreen = false;
				$scope.color.isRed = false;
			}
			
			
		}
			
		$scope.update = function(index)
		{
			$log.debug("Updating row index:"+index);
		}
			
		$scope.abort = function(index)
		{
			$log.debug("Aborting row index:"+index);
		}
    };
    
    app.controller('ActionController',["$scope","$log","stockService",ActionController]);

}());
