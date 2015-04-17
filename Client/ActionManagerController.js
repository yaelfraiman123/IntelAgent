(function(){
  
    var app = angular.module('intelAgent',[]);
    
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
    /*var getStockNames = function(){
      var names = [{
            id: '0',
            name: 'לאומי'
        }, {
            id: '1',
            name: 'הפועלים'
        }];
      return names;
    };       */
    
        
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
  
  
    $scope.update = function update(){
      console.log("stockID: " + $scope.selectedStock.id + " Stock Name: " +$scope.selectedStock.name);
    }
    
    };
    
    app.controller('ActionController',ActionController);

}());
