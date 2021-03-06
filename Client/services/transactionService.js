(function() {
  var moduleRef = angular.module("services");
  var transactionService = function(appSettings,$resource,currentUser) {

		return $resource(appSettings.serverURL + "/api/StocksManager", null,
		{
			'get': {	
				method: 'GET',
				isArray: true,
				headers: { 'Authorization': 'Bearer ' + currentUser.getProfile().token }
			},
			'post':{
			    method: 'POST',
				headers: {'Authorization': 'Bearer ' + localStorage['intelToken'] }
			},
			'put': {
				method: 'PUT',
				headers: { 'Authorization': 'Bearer ' + currentUser.getProfile().token }
			},			
			'delete': {
				method: 'DELETE',
				headers: { 'Authorization': 'Bearer ' + currentUser.getProfile().token }
			},
		});
			
	}
  moduleRef.factory("transactionService", ["appSettings","$resource","currentUser",transactionService]);//use this dependencies
}()); 