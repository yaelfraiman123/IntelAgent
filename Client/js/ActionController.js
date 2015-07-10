(function(){
   "use strict"
    var app = angular.module('intelAgent');
    
    var ActionController = function($scope,$log,$route,$location,$routeParams ,$resource, stockService,transactionService,currentUser){
		
		$scope.userProfile = currentUser.getProfile();
		
		if($scope.userProfile.isLoggedIn == false)
		{
			$location.path("/login");
		}
		
		getLang();
 
		$scope.color = {
			isRed: "",
			isGreen: ""
		};

        $scope.editingData = [];//boolean  array to check if inputs has to be shown to modify the table.

        //Get all stocks to show to user.
		stockService.getStocks()
			.then(function(data){ 
			//on success
			$scope.stockArray = data;
			},
			function(errorReason){
			//on failure
				$scope.error = errorReason;
			});

			
		
		//Get all the User's transactions
        transactionService.get(null,
		function(data){//on Success
				currentUser.setTransactions(data);
				for (var i = 0, length = $scope.userProfile.transactions.length; i < length; i++) {
					$scope.editingData[i] = false;
				}
			},
			function(response){//on Failure
					$log.debug("Could not fetch transactions " + response)
				}
			);
		


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

        //Creates a JSON and sends to API.
		$scope.submitNewTansaction = function()
		{					
			$scope.selectFirst = false;
			//VALUE 1 == "MKT" label
			$log.debug($scope.desiredLimitObj);
			if($scope.desiredLimitObj.value == 1)
				$scope.desiredLimit = "MKT";
			else
				$scope.desiredLimit = $scope.desiredOtherLimit;
	
			var dateTime = Date;
			
			$scope.desiredTransaction = {
			Id: $scope.userProfile.transactions.length+1,
			user_id: $scope.userProfile.username,
			date_time: dateTime.now(),
			stock_name: $scope.selectedStock.Symbol,
			sell_action: $scope.desiredAction,
			quantity: $scope.desiredQty,
			market_limit: $scope.desiredLimit,
			strategy: $scope.desiredStrat,
			target: $scope.desiredTrgt,
			carrying_amount: 0,
			price_check: 0
			}
			
			$log.debug($scope.desiredTransaction);
						
			transactionService.post($scope.desiredTransaction,
					function(data){//on Success
						$log.debug("post success");
						$route.reload();
						},
						function(response){//on Failure
							$scope.message = response.statusText + "/r/n";
							if(response.data.exceptionMessage )
								$scope.message += response.data.exceptionMessage;
							
							if(response.data.modelState){
								for(var key in response.data.modelState){
									$scope.message += response.data.modelState[key] + "/r/n";
								}
							}
						});				
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
			angular.copy($scope.transactions[index], $scope.currUpdatedTransaction);
			$log.debug("Updating row index:"+index);
            $scope.editingData[index] = true;
		};
			
		$scope.AcceptUpdate = function(index)
		{
			//POST UPDATE
			 $scope.editingData[index] = false;
		};		
				
		$scope.AbortUpdate = function(index)
		{
			 angular.copy($scope.currUpdatedTransaction, $scope.userProfile.transactions[index]);
			 $scope.editingData[index] = false;
		};		
			
		$scope.abort = function(index)
		{
			var isConfirmed = window.confirm($scope.text.CHECK_DELETE);
			if(isConfirmed)
			{
				var transToDelete = $scope.userProfile.transactions[index];
				$log.debug(transToDelete);
				//TODO send post delete request for the transaction[index]
				$route.reload();
			}
						
		};
		
		 function getLang()
		{
			var language = "he";//default lang
			if($routeParams.lang)
			{
				//check if we support the lang wanted
				switch($routeParams.lang)
				{
					case "en":
						language = "en";
						break;
					case "he":
						language = "he";
						break;
				}
			}
			
			var languageFilePath = '\\translations\\translation_'+ language + '.json';
			$resource(languageFilePath).get(function (data) {
					$scope.text = data;
			});	
			
		}
		
		document.onkeydown = function(){
  switch (event.keyCode){
        case 116 : //F5 button
            event.returnValue = false;
			$route.reload();
            return false;
        case 82 : //R button
            if (event.ctrlKey){ 
                event.returnValue = false;
				$route.reload();
                return false;
            }
    }
}

		$scope.$parent.showLangOps = true;//enables the Lang option in the header
		
    };
    
    app.controller('ActionController',
	["$scope","$log","$route","$location","$routeParams" ,"$resource","stockService","transactionService","currentUser", ActionController]);

}());

