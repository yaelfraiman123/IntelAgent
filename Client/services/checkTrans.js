(function() {
	function checkTrans(IP)
	{
		//TODO Check with API if changed
		 
		var isChanged;
<<<<<<< HEAD
		//$http.get(null,function(data)
		//{
		//	//on success
		//	//data = true iff changed
		//	isChanged = data.isChanged;
		//},
		//function(e)
		//{
		//	console.log("Transactions checker failed");//on failure
		//});
=======
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
>>>>>>> b55f8541c8249d3543a7be5a4a5d3e41d2bee2f5
		self.postMessage({'isChanged': isChanged});// or false
		
	}
	
	self.onmessage = function(e) {
		setInterval(checkTrans, 5000,e.data.IP); 
	}
  
}()); 