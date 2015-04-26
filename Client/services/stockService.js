(function() {
  var moduleRef = angular.module("services");
	
  var stockService = function(appSettings,$http) {
			
	var getStockBySymbol = function(symbol){
		return $http.get(appSettings.serverURL + "/api/DarkPoolStocks?symbol=" + symbol)
						.then(function(response){
								return response.data;
							});
	};
	
	var getStocks = function(){
		return $http.get(appSettings.serverURL + "/api/DarkPoolStocks")
						.then(function(response){
								return response.data;
							});
		
	};
	
	return {
			getStocks: getStocks,
			getStockBySymbol: getStockBySymbol
			
		};
	}
  moduleRef.factory("stockService", ["appSettings","$http",stockService]);//use this dependencies
}()); 