///<reference path="./AJAXCall.ts" />
///<reference path="../CookieHelper.ts" />

//Thi is the authentication system. Each instance of this class holds an authentication
class Authentication{
	private token :string;
	private signinPath : string;
	user : any;

	constructor(signinPath : string){
		this.signinPath = signinPath;
		this.token=CookieHelper.get("token");
	}
	signin(login : string,password : string,callback : Function){
		AJAXCall.post(this.signinPath,{login: login,password: password},(auth : any)=>{
			CookieHelper.set("token",auth.token);
			this.token = auth.token;
			this.user = auth.user;
			callback(auth);
		});
	}
	signout(callback){
		AJAXCall.destroy(this.signinPath+"/"+this.token,{},()=>{
			CookieHelper.set("token","null");
			this.token = null;
			this.user = null;
			callback();
		});
	}
	signed(){
		return !!this.token;
	}
	isAdmin(){
		if(this.signed()){
			return this.user.admin;
		}else{
			return false;
		}
	}
	hasId(id:string){
		return this.userId()===id;
	}
	userId(){
		if(this.signed())
			return this.user.id;
		else
			return null;
	}
	validate(callback : Function){
		if(this.token){
			AJAXCall.get(this.signinPath,{token: this.token},(user : any)=>{
				if(user){
					this.user = user;
					callback(true);
				}else{
					this.user = null;
					this.token=null;
					CookieHelper.set("token",null);
					callback(false);
				}
			});
		}else{
			callback(false);
		}
	}
}
