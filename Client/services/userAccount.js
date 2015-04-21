(function() {
  var moduleRef = angular.module("services");
  var userAccount = function(appSettings,$resource) {
	
		return {
			registration: $resource(appSettings.serverURL + "/api/Account/Register",null,{
				'registerUser':{ method: 'POST'}
			}),
			login: $resource(appSettings.serverURL + "/Token",null,{
				'loginUser':{ 
					method: 'POST',
					headers: { 'Content-Type': 'application/x-www-form-urlencoded'},
					transformRequest: function (data, headersGetter){//transform to URL encoded
						var str = [];
						for(var d in data)
							str.push( encodeURIComponent(d) + "=" + 
											encodeURIComponent(data[d]));
						return str.join("&");
					}
				}
			}
		)};
	}
  moduleRef.factory("userAccount", ["appSettings","$resource",userAccount]);//use this dependencies
}()); 