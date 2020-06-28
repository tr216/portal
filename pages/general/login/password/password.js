module.exports = function(req,res,callback){
	var data={
		form:{
			username:'',
			password:'',
			repassword:'',
			authCode:''
		},
		title:'Uyelik',
		message:''
	}

	if(req.method=='POST'){
		forgotPassword(req,res,data,callback);
	}else{
		callback(null,data);
	}
}


function forgotPassword(req,res,data,cb){
		
	if(req.method=='POST' || req.method=='PUT'){
		data.form.username=req.body.username;
		api.post('/forgot-password',req,data.form,(err,resp)=>{
			if(!err){
				res.redirect('/login');
				
			}else{
				data.message=err.message;
				cb(null,data);
			}
		});
	}else{
		cb(null,data);
	}
	
}