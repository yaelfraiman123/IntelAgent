(function() {
	function checkTrans(IP)
	{
		//TODO Check with API if changed
		 
		var isChanged;
		$http.get(null,function(data)
		{
			//on success
			//data = true iff changed
			isChanged = data.isChanged;
		},
		function(e)
		{
			console.log("Transactions checker failed");//on failure
		});
		self.postMessage({'isChanged': isChanged});// or false
		
	}
	
	self.onmessage = function(e) {
		setInterval(checkTrans, 5000,e.data.IP); 
	}
  
}()); 