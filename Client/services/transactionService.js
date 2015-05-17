(function() {
  var moduleRef = angular.module("services");
  var transactionService = function(appSettings,$resource,currentUser) {
		var profile = currentUser.getProfile().token;
		console.log(profile);
		return $resource(appSettings.serverURL + "/api/StocksManager", null,
		{
			'get': {
				
				headers: { 'Authorization': 'Bearer ' + currentUser.getProfile().token }
			}
			/*'save': {
				headers: { 'Authorization': 'Bearer ' + currentUser.getProfile().token }
			},
			'update': {
				method: 'PUT'
				headers: { 'Authorization': 'Bearer ' + currentUser.getProfile().token }
			}*/
		});
			
	}
  moduleRef.factory("transactionService", ["appSettings","$resource","currentUser",transactionService]);//use this dependencies
}()); 