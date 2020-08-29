
module.exports = function(req,res,callback){
	var data={
		form:{
			username:'',
			password:'',
			repassword:'',
			authCode:''
		},
		title:'Giriş'
	}
	switch(req.params.func){
		case 'signup':
		signup(req,res,data,callback)
		break
		case 'verify':
		verify(req,res,data,callback)
		break
		case 'forgot-password':
		forgotPassword(req,res,data,callback)
		break
		default:

		login(req,res,data,callback)
		break
	}
}


function login(req,res,data, cb){
	if(req.method=='POST' || req.method=='PUT'){
		data.form.username=req.body.username || ''
		data.form.password=req.body.password || ''
		api.post(`/login`,req,data.form,(err,resp)=>{
			if(!err){
				sessionHelper.newSession(resp.data,req,res,(err,sessionId)=>{
					if(!err){
						res.redirect(`/general/dashboard?sid=${sessionId}`)
					}else{
						data['message']=err.message
						cb(null,data)
					}
					
				})
			}else{
				data['message']=err.message
				cb(null,data)
			}
			
		})
	}else{
		cb(null,data)
	}
}


function menuModule(menu,modules){
	if(menu.nodes==undefined){
		if(menu.module!=undefined){
			var dizi=menu.module.split('.')
			var bShow=false
			if(modules[dizi[0]]){
				if(dizi.length>1){
					if(modules[dizi[0]][dizi[1]]){
						if(dizi.length>2){
							if(modules[dizi[0]][dizi[1]][dizi[2]]){
								if(dizi.length>3){
									if(modules[dizi[0]][dizi[1]][dizi[2]][dizi[3]]){
										bShow=true
									}
								}else{
									bShow=true
								}
							}
						}else{
							bShow=true
						}
					}
				}else{
					bShow=true
				}
			}
			if(bShow){
				return menu
			}else{
				return undefined
			}
		}else{
			return menu
		}
	}else{
		var bNodeVar=false
		var nodes=[]
		menu.nodes.forEach((e)=>{
			e=menuModule(e,modules)
			if(e!=undefined)
				nodes.push(clone(e))
		})
		if(nodes.length>0){
			menu.nodes=nodes
			return menu
		}else{
			return undefined
		}

	}
}

function signup(req,res,data,cb){

	data.form=Object.assign(data.form,req.body)
	if(data.form.password.trim()==''){
		data.message='Parola bos olamaz!'
		return cb(null,data)
	}
	if(data.form.password!=data.form.repassword){
		data.message='Tekrar parola ayni degil!'
		return cb(null,data)
	}
	api.post(`/signup`,req,data.form,(err,resp)=>{
		if(!err){
			res.redirect(`/general/login/verify?username=${data.form.username}`)
		}else{
			data.message=err.message
			cb(null,data)
		}
		
	})
}

function verify(req,res,data,cb){

	if((req.query.username || '')==''){
		data.message='Kullanici adi gereklidir!'
		cb(null,data)
	}else{
		data.form.username=req.query.username
		eventLog('req.query.username:',req.query.username)
		if(req.method=='POST' || req.method=='PUT'){
			data.form.authCode=req.body.authCode
			api.post(`/verify`,req,data.form,(err,resp)=>{
				if(!err){
					var userAgent=req.headers['user-agent'] || ''
					var IP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || ''

					var doc=new db.sessions({token:resp.data,ip:IP,userAgent:userAgent})
					doc.save((err,sessionDoc)=>{
						if(!err){
							res.redirect(`/passport?sid=${sessionDoc._id}`)
						}else{
							data['message']=err.message
							cb(null,data)
						}
					})
				}else{
					data.message=err.message
					cb(null,data)
				}
			})
		}else{
			cb(null,data)
		}
	}
	
	
}

function forgotPassword(req,res,data,cb){

	if(req.method=='POST' || req.method=='PUT'){
		data.form.username=req.body.username
		api.post(`/forgot-password`,req,data.form,(err,resp)=>{
			if(!err){
				res.redirect(`/general/login`)
				
			}else{
				data.message=err.message
				cb(null,data)
			}
		})
	}else{
		cb(null,data)
	}
	
}