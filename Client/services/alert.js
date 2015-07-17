(function () {
'use strict';

  var moduleRef = angular.module('services')'
  
  var alert = function alert($rootScope, $timeout){
	var alertTimeout;
	return function(type,title,message,timeout){
		$rootScope.alert = {
			hasBeenShown: true,
			show: true,
			type: type,
			message: message,
			title: title
		};
		$timeout.cancel(alertTimeout);
		alertTimeout = $timeout(function(){
			$rootScope.alert.show = false;
		}, timeout || 2000);
	}

	
	};
	moduleRef.service('alert'['$rootScope', '$timeout',alert]);
}());