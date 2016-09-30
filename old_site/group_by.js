function groupBy(list,param){
	var retVal = {};
	list.forEach(function(el){
		if(retVal[param(el)])
			retVal[param(el)].push(el);
		else
			retVal[param(el)]=[el];
	});
	return retVal;
}
