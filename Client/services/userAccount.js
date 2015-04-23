(function() {
  var moduleRef = angular.module("services");
  var userAccount = function(appSettings,$resource) {
	
		return {
			registration: $resource(appSettings.serverURL + "/api/Account/Register",null,{
				'registerUser':{ method: 'POST'},
				headers: { 'Content-Type': 'application/json'}
			}),
			login: $resource(appSettings.serverURL + "/Token",null,{
				'loginUser':{ 
					method: 'POST',
					headers: { 'Content-Type': 'application/x-www-form-urlencoded'},
					transformRequest: function (data, headersGetter){//transform to URL encoded
						var str = [];
					//	for(var d in data)
						//	str.push(encodeURIComponent(data[d]));
					str.push("username="+encodeURIComponent(data.email));
					str.push("password="+encodeURIComponent(data.password));
					str.push("grant_type="+encodeURIComponent(data.grant_type));
						console.log(str.join("&"));
						return str.join("&");
					}
				}
			}
		)};
	}
  moduleRef.factory("userAccount", ["appSettings","$resource",userAccount]);//use this dependencies
}()); 