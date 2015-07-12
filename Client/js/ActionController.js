(function(){
   "use strict"
    var app = angular.module('intelAgent');
    
    var ActionController = function($scope,$log,$route,$location,$routeParams ,$resource, stockService,transactionService,currentUser){
		
		$scope.userProfile = {};

		
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
				$scope.original =[];
				angular.copy(data,$scope.original);
				angular.copy(currentUser.getProfile(), $scope.userProfile);
				$scope.userProfile = currentUser.getProfile();
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
			{ label: 'Other', value: 0 }
		];

        //Logic of the "Other" visibility
		$scope.updateLimitSelect = function(){
			$log.debug($scope.desiredLimitObj);
			if ($scope.desiredLimitObj.value == 0){//if "other" selected
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
	
			var dateTime = Date;
			
			$scope.desiredTransaction = {
			user_id: $scope.userProfile.username,
			date_time: dateTime.now(),
			stock_name: $scope.selectedStock.Symbol,
			sell_action: $scope.desiredAction,
			limit: $scope.desiredOtherLimit,
			market_limit: $scope.desiredLimitObj.value,//1 if MKT
			quantity: $scope.desiredQty,
			strategy: $scope.desiredStrat,
			target: $scope.desiredTrgt
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
		
		$scope.update = function(index)
		{
			$log.debug("Updating row index:"+index);
            $scope.editingData[index] = true;
		};
			
		$scope.AcceptUpdate = function(index)
		{
			//PUT UPDATE
			transactionService.put($scope.userProfile.transactions[index],
					function(data){//on Success
							$log.debug("put success");
						},
						function(response){//on Failure
							$log.debug("put failed");
						}
			);				
			 $scope.editingData[index] = false;
		};		
				
		$scope.AbortUpdate = function(index)
		{
			//restore transaction
			 
			$scope.userProfile.transactions[index] = $scope.original[index];
			 console.log($scope.original);
			$scope.editingData[index] = false;
		};		
			
		$scope.abort = function(index)
		{
			var isConfirmed = window.confirm($scope.text.CHECK_DELETE);
			if(isConfirmed)
			{
				var ID = $scope.userProfile.transactions[index].Id;
				$log.debug(ID);
				//TODO send post delete request for the transaction[index]
				transactionService.delete(ID,
					function(data){//on Success
							$log.debug("delete success");
						},
						function(response){//on Failure
							$log.debug("delete failed");
						}
				);	
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
		
		$scope.$parent.showLangOps = true;//enables the Lang option in the header
		
    };
    
    app.controller('ActionController',
	["$scope","$log","$route","$location","$routeParams" ,"$resource","stockService","transactionService","currentUser", ActionController]);

}());

