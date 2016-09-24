function prepare_dataset(data){

	var groups = countBy(data,function(a){
		return a.description.split(" ").slice(0,1);
	});
	return {
		labels: Object.keys(groups),
		datasets: [{
			label: "etste",
			data: Object.keys(groups).map(function(a){
				return groups[a];
			}),
		}]
	}
}
chartLei={};
dadosLei={};
function updateChart(name,data){
	var data = prepare_dataset(data);
	var ctx = $("#canvasLei"+name)[0];
	ctx.innerHTML="";
	Chart.defaults.global.legend.display = false;
	if(chartLei[name])
		chartLei[name].destroy();
	chartLei[name] = new Chart(ctx,{
		type: 'doughnut',
		data: data
	});

}
