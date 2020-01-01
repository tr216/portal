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
	switch(req.params.func){
		case 'signup':
			signup(req,res,data,callback);
		break;
		case 'verify':
			verify(req,res,data,callback);
		break;
		case 'forgot-password':
			forgotPassword(req,res,data,callback);
		break;
		default:

			login(req,res,data,callback);
		break;
	}
}


function login(req,res,data, cb){
	if(req.method=='POST' || req.method=='PUT'){
		data.form.username=req.body.username || '';
		data.form.password=req.body.password || '';
		console.log('data.form:',data.form);
		api.post('/login',req,data.form,(err,resp)=>{
			if(!err){
				var userAgent=req.headers['user-agent'] || '';
				var IP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || '';

				var doc=new db.sessions({token:resp.data.token,username:resp.data.username,isSysUser:resp.data.isSysUser,isMember: resp.data.isMember, ip:IP,userAgent:userAgent});
				doc.save((err,sessionDoc)=>{
					if(!err){
						console.log('res.redirect(/passport?sid=' + sessionDoc._id);
						res.redirect('/passport?sid=' + sessionDoc._id);
					}else{
						data['message']=err.message;
						cb(null,data);
					}
				});
				
			}else{
				data['message']=err.message;
				cb(null,data);
			}
			
		});
	}else{
		cb(null,data);
	}
}

function signup(req,res,data,cb){

	data.form=Object.assign(data.form,req.body);
	if(data.form.password.trim()==''){
		data.message='Parola bos olamaz!';
		return cb(null,data);
	}
	if(data.form.password!=data.form.repassword){
		data.message='Tekrar parola ayni degil!';
		return cb(null,data);
	}
	api.post('/signup',req,data.form,(err,resp)=>{
		if(!err){
			res.redirect('/general/login/verify?username=' + data.form.username);
		}else{
			data.message=err.message;
			cb(null,data);
		}
		
	});
}

function verify(req,res,data,cb){

	if((req.query.username || '')==''){
		data.message='Kullanici adi gereklidir!';
		cb(null,data);
	}else{
		data.form.username=req.query.username;
		console.log('req.query.username:',req.query.username);
		if(req.method=='POST' || req.method=='PUT'){
			data.form.authCode=req.body.authCode;
			api.post('/verify',req,data.form,(err,resp)=>{
				if(!err){
					var userAgent=req.headers['user-agent'] || '';
					var IP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || '';

					var doc=new db.sessions({token:resp.data,ip:IP,userAgent:userAgent});
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
	
	
}

function forgotPassword(req,res,data,cb){
		
	if(req.method=='POST' || req.method=='PUT'){
		data.form.username=req.body.username;
		api.post('/forgot-password',req,data.form,(err,resp)=>{
			if(!err){
				res.redirect('/general/login');
				
			}else{
				data.message=err.message;
				cb(null,data);
			}
		});
	}else{
		cb(null,data);
	}
	
}