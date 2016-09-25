function structure(stringList){
	var retval = {};
	var nextStep=[];
	stringList.forEach(function(a){
		if(retval[a.split(" ")[0]]){
			retval[a.split(" ")[0]].push(a.split(" ").slice(1));
		}else{
			retval[a.split(" ")[0]]=[a.split(" ").slice(1)];
		}
	});
	return retval;
}

