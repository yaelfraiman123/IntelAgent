(function(){
   "use strict"
    var app = angular.module('intelAgent');
    
    var ActionController = function($scope,$log,$route,$location,$routeParams ,$resource, $http,
									stockService,transactionService,currentUser,appSettings,alert,$interval)
	{
	
				/*FUNCTIONS */
		//Logic of the "Other" visibility
		$scope.updateLimitSelect = function(){
	
			if ($scope.desiredLimitNumber == 0){//if "other" selected
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
				limit: $scope.desiredOtherLimit,// Might be nothing if MKT is selected.
				market_limit: $scope.desiredLimitNumber,//1 is MKT
				quantity: $scope.desiredQty,
				strategy: $scope.desiredStrat,
				target: $scope.desiredTrgt,
				amount_done: 0,
				price_done: 0
				};
				
				
				var userTransactions = $resource(appSettings.serverURL + "/api/StocksManager", null,
				{post: {method:'POST' ,headers: { 'Authorization': 'Bearer ' + currentUser.getProfile().token }}});
				userTransactions.post($scope.desiredTransaction, function(data) {
					$log.debug("post success");
					$route.reload();
				});									
			};
			
		var getLang = function()
		{
			var language = "he";//default lang
			$scope.langDirection = "rtl";
			if($routeParams.lang)
			{
				//check if we support the lang wanted
				switch($routeParams.lang)
				{
					case "en":
						language = "en";
						$scope.langDirection = "ltr";
						break;
					default:
						language = "he";
						$scope.langDirection = "rtl";
						break;
				}
			}
			
			var languageFilePath = '\\translations\\translation_'+ language + '.json';
			$resource(languageFilePath).get(function (data) {
					$scope.text = data;
					iteration();
			});	
			
		};
		
		var checkTrans = function()
		{
			var req = 
			{
				method: 'GET',
				url: appSettings.serverURL + "/api/Refresh",
				headers: { 'Authorization': 'Bearer ' + currentUser.getProfile().token}
			};

			$http(req).success(function(isChanged)
			{
				if(isChanged)
					updateAlert();
			}).error(function(e)
			{
				console.log("fail" + e);
			});
			
		}
		
		$scope.update = function(index)
		{
			$log.debug("Updating row index:"+index);
			$scope.editingData[index] = true;
		};
			
		$scope.AcceptUpdate = function(index)
		{
			document.getElementById("submitLimit").click();
			document.getElementById("submitQty").click();
			
			if(!this.formLimit.$invalid && !this.formQty.$invalid)
			{
				if($scope.userProfile.transactions[index].sell_action == $scope.text.SELL)
					$scope.userProfile.transactions[index].sell_action = 1;
				else
					$scope.userProfile.transactions[index].sell_action = 0;
				//PUT UPDATE TODO
				
				var req = 
				{
					method: 'PUT',
					url: appSettings.serverURL + "/api/StocksManager",
					data: $scope.userProfile.transactions[index],
					headers: { 'Authorization': 'Bearer ' + currentUser.getProfile().token},
					
				};
	
				$http(req).success(function(data)
				{
					$route.reload();
                
				}).error(function(e)
				{
					console.log("fail" + e);
				});
				
				var userUpdate = $resource(appSettings.serverURL + "/api/StocksManager", null,
					{put: {method:'PUT' ,headers: { 'Authorization': 'Bearer ' + currentUser.getProfile().token }}});
				console.log($scope.userProfile.transactions[index]);
				
				var resource = userUpdate.put(null,$scope.userProfile.transactions[index]);
				
				resource.$promise.then(function(data)
				{
					console.log(data);
					$route.reload();
				});
				$scope.editingData[index] = false;
			}
			
		};		
				
		$scope.AbortUpdate = function(index)
		{
			//restore transaction
			$route.reload();
		};					
		
		$scope.abort = function(index)
		{
			var isConfirmed = window.confirm($scope.text.CHECK_DELETE);
			if(isConfirmed)
			{
				var ID = $scope.userProfile.transactions[index].Id;
				$log.debug(ID);
				//Delete the transaction at index.Post to API
				var transDelete = $resource(appSettings.serverURL + "/api/StocksManager?id=:userId", { userId:'@id'},
				{del: {method:'DELETE', headers: { 'Authorization': 'Bearer ' + currentUser.getProfile().token }}});
				
				transDelete.del({ userId:ID}, function(data) {
					console.log("del success");
					$route.reload();
				});	
			}
						
		};
		
		function updateAlert()
		{
			alert('warning',$scope.text.ALERT_UPDATE_STRONG,$scope.text.ALERT_UPDATE,true,5000);
		}
		
		getLang();// We will need it anyway for alerts.
		
		var iteration = function()
		{
			if(currentUser.getProfile().isLoggedIn)
			{	
				$scope.userProfile = {};	
				
				
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
				var userTransactions = $resource(appSettings.serverURL + "/api/StocksManager", null,
				{get: {method:'GET', isArray:true ,headers: { 'Authorization': 'Bearer ' + currentUser.getProfile().token }}});
				
				userTransactions.get(null, function(data) {
						currentUser.setTransactions(data);
						$scope.original =[];
						angular.copy(data,$scope.original);
						angular.copy(currentUser.getProfile(), $scope.userProfile);
						$scope.userProfile = currentUser.getProfile();
						
						for (var i = 0, length = $scope.userProfile.transactions.length; i < length; i++) {
							$scope.editingData[i] = false;
							
							if($scope.userProfile.transactions[i].sell_action == 0)
								$scope.userProfile.transactions[i].sell_action = $scope.text.BUY;
							else
								$scope.userProfile.transactions[i].sell_action = $scope.text.SELL;
							
						}
				});		
					
				$scope.optionArray = [
					{ label: 'MKT', value: 1 },
					{ label: 'Other', value: 0 }
				];
				
				var intervalDefine = typeof $scope.$parent.intervalStop;
				//Start the refresh service, Only if not started
				if (intervalDefine === 'undefined') {
					$scope.$parent.intervalStop = $interval(checkTrans, appSettings.checkIfChangeTimer); 
				}
						
				$scope.$parent.showLangOps = true;//enables the Lang option in the header
			}
			else//User not logged in/refreshed
			{
				var token = localStorage["intelToken"];
				var user = localStorage["intelUser"];
				if( token != "" && token )
				{
					var LoggedIn = true;
					currentUser.setProfile(user,token,LoggedIn);
					$scope.$parent.showLogout = true;//enables the logout button at the header
					alert('success', $scope.text.ALERT_LOGGED_STRONG ,$scope.text.ALERT_LOGGED + user ,false, 5000);
					$route.reload();
				}
				else
				{
					var showRefresh = true;
					alert('danger', $scope.text.ALERT_NOTLOGGED_STRONG,$scope.text.ALERT_NOTLOGGED ,!showRefresh, 5000);
					$location.path("/login");
				}
			}
		};
    };
    
    app.controller('ActionController',
	["$scope","$log","$route","$location","$routeParams" ,"$resource","$http","stockService","transactionService","currentUser","appSettings",'alert'
	,'$interval',ActionController]);

}());

