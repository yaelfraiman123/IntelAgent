(function() {
  var moduleRef = angular.module("services");
  var transactionService = function(appSettings,$resource,currentUser) {

		return $resource(appSettings.serverURL + "/api/StocksManager?access_token=:access_token", {access_token: currentUser.getProfile().token},
		{
			'get': {	
				method: 'GET',
				isArray: true,
				headers: { 'Authorization': 'Bearer ' + currentUser.getProfile().token }
			},
			'post':{
			    method: 'POST',
				headers: {'Authorization': 'Bearer ' + currentUser.getProfile().token }
			},
			'put': {
				method: 'PUT',
				headers: { 'Authorization': 'Bearer ' + currentUser.getProfile().token }
			},			
			'delete2': {
				method: 'DELETE',
				headers: { 'Authorization': 'Bearer ' + currentUser.getProfile().token }
			},
		});
			
	}
  moduleRef.factory("transactionService", ["appSettings","$resource","currentUser",transactionService]);//use this dependencies
}()); 