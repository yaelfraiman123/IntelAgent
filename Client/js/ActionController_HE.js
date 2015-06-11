(function(){
   "use strict"
    var app = angular.module('intelAgent');
    
    var ActionController = function($scope,$log,$route,stockService,transactionService,appSettings){
		
		$scope.color = {
			isRed: "",
			isGreen: ""
		};

        $scope.editingData = [];//boolean  array to check weather or not an input has to be shown to modify the table.

        //Get all stocks to show to user.
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

        //Get all the User's transactions
		$scope.transactions = transactionService.get();

        for (var i = 0, length = $scope.transactions.length; i < length; i++) {
            $scope.editingData[i] = false;
        }


        $scope.optionArray = [
			{ label: 'MKT', value: 1 },
			{ label: 'Other', value: 2 }
		];

        //Logic of the "Other" visibility
		$scope.updateLimitSelect = function(){
			$log.debug($scope.desiredLimitObj);
			if ($scope.desiredLimitObj.value == 2){//if "other" selected
				$scope.other = "true";
			}
			else{
				$scope.other = "";
			}
			
		};

        //Logic of the BG-Color of the "change in %" Field
		$scope.changeStock = function changeStock()
		{
			$scope.color.isGreen = $scope.selectedStock.PctChg > 0;
			$scope.color.isRed = $scope.selectedStock.PctChg < 0;
		};

        //Creates a JSON Obj and sends to API.
		$scope.submitNewTansaction = function(){
		
			//VALUE 1 == "MKT" label
			$log.debug($scope.desiredLimitObj);
			if($scope.desiredLimitObj.value == 1)
				$scope.desiredLimit = "MKT";
			else
				$scope.desiredLimit = $scope.desiredOtherLimit;
			
			$scope.desiredTransaction = {
			Symbol: $scope.selectedStock.Symbol,
			Action: $scope.desiredAction,
			Quantity: $scope.desiredQty,
			Limit: $scope.desiredLimit,
			Strategy: $scope.desiredStrat,
			Target: $scope.desiredTrgt
			}

            //TODO post the new transaction
			
			$log.debug($scope.desiredTransaction);
		};
		
		$scope.currUpdatedTransaction = 
		{
            // this is a demo of a transaction,
			name: "LUMI",
			action: "קניה",
			quantity: 100,
			limit: 99.5,
			strategy: "פסיבי",
			target: "קרוס",
			status: "ממתין",
			delivered_quantity: 0,
			delivered_price: 0
		};
		
		$scope.update = function(index)
		{
            //TODO Post the update to server.
			angular.copy($scope.transactions[index], $scope.currUpdatedTransaction);
			$log.debug("Updating row index:"+index);
            $scope.editingData[index] = true;
		};
			
		$scope.AcceptUpdate = function(index)
		{
			 $scope.editingData[index] = false;
		};		
				
		$scope.AbortUpdate = function(index)
		{
			 angular.copy($scope.currUpdatedTransaction, $scope.transactions[index]);
			 $scope.editingData[index] = false;
		};		
			
		$scope.abort = function(index)
		{
			//TODO send post delete request for the transaction[index]
			$route.reload();
		};


		$scope.$parent.showLangOps = true;//enables the Lang option in the header
		
    };
    
    app.controller('ActionController_HE',["$scope","$log","$route","stockService","transactionService","appSettings",ActionController]);

}());
