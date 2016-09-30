function countBy(list,param){
	var retVal = {};
	list.forEach(function(el){
		if(retVal[param(el)])
			retVal[param(el)]++;
		else
			retVal[param(el)]=1;
	});
	return retVal;
}
