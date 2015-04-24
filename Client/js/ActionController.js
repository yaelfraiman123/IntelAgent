(function(){
  
    var app = angular.module('intelAgent');
    
    var ActionController = function($scope,$log){
      
		$scope.stockNamesArray = getStockNames();
    
		function getStockNames()
		{
		var names = [{
				id: '0',
				name: 'LEUMI'
			}, {
				id: '1',
				name: 'HAPOALIM'
			}];
		return names;
		}
    
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
		$log.debug("stockID: " + $scope.selectedStock.id + " Stock Name: " +$scope.selectedStock.name);
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
    
    app.controller('ActionController',["$scope","$log",ActionController]);

}());
