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
	
	if((req.query.username || '')==''){
		data.message='Kullanici adi gereklidir!';
		return callback(null,data);
	}

	
	data.form.username=req.query.username;
	if(req.method=='POST'){
		verify(req,res,data,callback);
	}else{
		
		callback(null,data);
	}
}



function verify(req,res,data,cb){

	
	data.form.username=req.query.username;
	console.log('req.query.username:',req.query.username);
	if(req.method=='POST' || req.method=='PUT'){
		data.form.authCode=req.body.authCode;
		api.post('/verify',req,data.form,(err,resp)=>{
			if(!err){
				var userAgent=req.headers['user-agent'] || '';
				var IP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || '';

				var doc=new db.sessions({token:resp.data.token,username:resp.data.username,isSysUser:resp.data.isSysUser,isMember: resp.data.isMember, ip:IP,userAgent:userAgent});
				doc.save((err,sessionDoc)=>{
					if(!err){
						res.redirect('/passport?sid=' + sessionDoc._id);
					}else{
						data['message']=err.message;
						cb(null,data);
					}
				});
			}else{
				data.message=err.message;
				cb(null,data);
			}
		});
	}else{
		cb(null,data);
	}
	
	
}
