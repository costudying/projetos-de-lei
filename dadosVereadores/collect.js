data= $("tr").map(function(index,tr){
	return {
		foto: $(tr).find(".td1").find("img").attr("src"),
		vereador: $(tr).find(".td2").text(),
		partido: $(tr).find(".td3").find("img").attr("src"),
		sala: $(tr).find(".td4").text(),
		telefone: $(tr).find(".td5").text(),
		email: $(tr).find(".td6").text(),
	}
})
