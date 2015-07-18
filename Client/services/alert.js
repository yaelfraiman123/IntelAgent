(function () {
'use strict';

  var moduleRef = angular.module("services");
  
  var alert = function alert($rootScope, $timeout){
	var alertTimeout;
	return function(type,title,message,refresh,timeout){
		$rootScope.alert = {
			hasBeenShown: true,
			show: true,
			type: type,
			message: message,
			title: title,
			refresh: refresh
		};
		$timeout.cancel(alertTimeout);
		alertTimeout = $timeout(function(){
			$rootScope.alert.show = false;
		}, timeout || 2000);
	}

	
	};
	moduleRef.factory('alert',['$rootScope', '$timeout',alert]);
}());