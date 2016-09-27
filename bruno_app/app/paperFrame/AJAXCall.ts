///<reference path="../Loader.ts"/>
class AJAXCall{
	static errorFunction = (error)=>{
		alert("Error!");
		console.error(error);
	}
	static toParams(node : string=null,obj : any){
		if(obj && typeof(obj)==="object"){
			return Object.keys(obj).map((key : string)=>{
				if(node){
					return this.toParams(node+"["+key+"]",obj[key]);
				}else{
					return this.toParams(key,obj[key]);
				}
			}).join("&");
		}else{
			return node+"="+encodeURI(obj);
		}
	}
	static http(method : string,url : string,params : any, success : Function,error: Function=AJAXCall.errorFunction) {
		Loader.start();
		$.ajax({
			url: url,
			type: method,
			crossDomain: true,
			data: params,
			dataType: "json",
			success: (data : any)=>{
				Loader.stop();
				success(data);
			},
			error: (data)=>{
				error(data.responseJSON);
				Loader.stop();
			}
		});
	}
	static get(path : string,params : any, callback : Function,error:Function=AJAXCall.errorFunction){
		this.http("GET",path,params,callback,error);
	}
	static post(path : string,params : any, callback : Function,error:Function=AJAXCall.errorFunction){
		this.http("POST",path,params,callback,error);
	}
	static put(path : string,params : any, callback : Function,error:Function=AJAXCall.errorFunction){
		this.http("PUT",path,params,callback,error);
	}
	static destroy(path : string,params : any, callback : Function,error:Function=AJAXCall.errorFunction){
		this.http("DELETE",path,params,callback);
	}
}
