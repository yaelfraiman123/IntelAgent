(function(){
  
    var app = angular.module('intelAgent');
    
    var ActionController = function($scope){
      
    $scope.stockNamesArray = getStockNames();
    
    function getStockNames()
    {
      var names = [{
            id: '0',
            name: 'לאומי'
        }, {
            id: '1',
            name: 'הפועלים'
        }];
      return names;
    }
    
    $scope.submitFunc = function(){
      console.log("בצעעעעעעעעע")
    };
        
    $scope.transactions = [{
    name: "הפועלים",
    action: "מכירה",
    quantity: 213,
    limit: 129.5,
    strategy: "פסיבי",
    target: "דרק פול",
    status: "ממתין",
    delivered_quantity: 0,
    delivered_price: 0
  },
  {
    name: "לאומי",
    action: "קניה",
    quantity: 100,
    limit: 99.5,
    strategy: "פסיבי",
    target: "קרוס",
    status: "ממתין",
    delivered_quantity: 0,
    delivered_price: 0
  }];
  
  $scope.optionArray = [
    { label: 'MKT', value: 1 },
    { label: 'Other', value: 2 }
  ];
  
	$scope.updateLimitSelect = function updateLimitSelect(){
		  console.log($scope.selectedLimit);
		  if ($scope.selectedLimit.value == 2){
			   $scope.other = "true";
		  }
		  else{
			  $scope.other = "";
		  }
		 
    };
  
    $scope.update = function update(){
      console.log("stockID: " + $scope.selectedStock.id + " Stock Name: " +$scope.selectedStock.name);
    }
    
    };
    
    app.controller('ActionController',ActionController);

}());
