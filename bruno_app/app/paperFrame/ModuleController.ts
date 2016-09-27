///<reference path="./DOMQuery.ts" />

class ModuleController{
	public static routeFunction : Function = null;
	public static templateMap : any = null;
	public container : HTMLElement;
	public template : Function;
	public children : any;
	public $scope : any;
	public constructor(container : HTMLElement = null, template : any){
		this.container = container;
		this.template = template;
		this.$scope={};
		this.children={};
	}
	public render(){
		if(this.container){
			this.container.innerHTML=this.template(this.$scope);
			this.includeProc();
			this.bindIf();
			this.bindPartial();
			this.bindLink();
			this.bindProc();
			this.bindModel();
			Object.keys(this.children).forEach((key : string)=>{
				let child : ModuleController = this.children[key];
				child.render();
			});
		}
	}
	private includeProc(){
		$(this.container).find("[pf-include]").each((index : number , elem : HTMLElement)=>{
			let controller : ModuleController = this.children[$(elem).attr("pf-include")];
			if(controller)
				controller.container = elem;
		});
	}
	private bindLink(){
		$(this.container).find("[pf-link]").each((elementIndex : number,elem : any)=>{
			elem.href = $(elem).attr("pf-link");
			$(elem).click((evt)=>{
				if(ModuleController.routeFunction){
					ModuleController.routeFunction($(elem).attr("pf-link"));
					evt.stopPropagation();
					evt.preventDefault();
				}
			});
		});
	}
	private eval(cmd : string,elem : HTMLElement, evt : any){
		let values : any[] = Object.keys(this.$scope).map((key)=>{
			return this.$scope[key];
		});
		let keys : string[] = Object.keys(this.$scope);
		return Function.apply(elem,keys.concat("event").concat(cmd)).apply(elem,values.concat(evt));
	}
	private bindPartial(){
		if(!ModuleController.templateMap)return;
		$(this.container).find("[pf-partial]").each((elementIndex : number,elem : any)=>{
			elem.innerHTML=ModuleController.templateMap[$(elem).attr("pf-partial")](this.$scope);
		});
	}
	private bindProc(){
		let events : string[] = ["click","keyup","keypress","change"];
		$(events).each((evtIndex : number,evt : string)=>{
			$(this.container).find("[pf-"+evt+"]").each((elementIndex : number,elem : any)=>{
				let cmd : string = $(elem).attr("pf-"+evt);
				let keys : string[] = Object.keys(this.$scope);
				let values : any[] = Object.keys(this.$scope).map((key)=>{
					return this.$scope[key];
				});
				elem["on"+evt]= (event)=>{Function.apply(elem,keys.concat("event").concat(cmd)).apply(elem,values.concat(event))};
			});
		});
		$(this.container).find("[pf-hover]").each((elementIndex : number,elem : any)=>{
			let cmd : string = $(elem).attr("pf-hover");
			let keys : string[] = Object.keys(this.$scope);
			let values : any[] = Object.keys(this.$scope).map((key)=>{
				return this.$scope[key];
			});
			elem["onmouseover"]= (event)=>{Function.apply(elem,keys.concat("event").concat(cmd)).apply(elem,values.concat(event))};
		});
	}
	private bindIf(){
		$(this.container).find("[pf-if]").each((elementIndex : number,elem : any)=>{
			let cmd : string = $(elem).attr("pf-if");
			if(!this.eval(cmd,elem,undefined))
				elem.remove();
		});
	}
	private bindModel(){
		$(this.container).find("[pf-model]").each((elementIndex : number,elem : any)=>{
			var path = $(elem).attr("pf-model");

			var indexAccess = (obj : any,is : any, value : any = undefined) => {
				if (typeof is == 'string')
					return indexAccess(obj,is.split('.'), value);
				else if (is.length==1 && value!==undefined)
					return obj[is[0]] = value;
				else if (is.length==0)
					return obj;
				else
					return indexAccess(obj[is[0]],is.slice(1), value);
			}
			$(elem).val(indexAccess(this.$scope,path));
			$(elem).change(()=>{
				indexAccess(this.$scope,path,$(elem).val());
			});
		});
	}
	_init(){
		this.init();
		Object.keys(this.children).forEach((key : string)=>{
			this.children[key]._init();
		});
	}
	init(){}
}
