///<reference path="./paperFrame/Router.ts" />
///<reference path="./paperFrame/AJAXCall.ts" />
///<reference path="./paperFrame/ModuleController.ts" />

//Main function
var router;
var Templates={};
window.onload = ()=>{
	let app = new ModuleController(document.body,Templates["teste"]);
	router = new Router(app,{
		"/" : ()=>{return new ModuleController(document.body,Templates["teste"])}
	});
	ModuleController.routeFunction = router.go;
	ModuleController.templateMap = Templates;
	router.init();
}
