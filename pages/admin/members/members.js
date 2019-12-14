module.exports = function(req,res,callback){
	var data={
		form:{
			username:'',
			name:'',
			lastName:'',
			passive:false
		},
		message:'',
		list:[]
	}

	switch(req.params.func || ''){
		case 'addnew':
			addnew(req,res,data,callback);
		break;
		case 'edit':
			edit(req,res,data,callback);
		break;
		case 'delete':
			deleteItem(req,res,data,callback);
		break;
		case 'view':
			view(req,res,data,callback);
		break;
		case 'login':
			login(req,res,data,callback);
		break;
		default:
			getList(req,res,data,callback);
		
	}
	
}

function getList(req,res,data,callback){
	api.get('/system/members',req,{page:req.query.page},(err,resp)=>{
		if(!err){
			data['recordCount']=resp.data.recordCount;
			data['page']=resp.data.page;
			data['pageCount']=resp.data.pageCount;
			data['pageSize']=resp.data.pageSize;
			data['list']=resp.data.docs;
		}
		callback(null,data);
	});
}

function addnew(req,res,data,callback){
	if(req.method=='POST'){
		data.form=Object.assign(data.form,req.body);
		api.post('/system/members',req,data.form,(err,resp)=>{
			if(!err){
				res.redirect('/sys-members?sid=' + req.query.sid);
			}else{
				data['message']=err.message;
				callback(null,data);
			}
		});
	}else{
		callback(null,data);
	}
}

function edit(req,res,data,callback){
	var _id=req.params.id || '';
	if(req.method=='POST' || req.method=='PUT'){
		data.form=Object.assign(data.form,req.body);
		api.put('/system/members/' + _id,req,data.form,(err,resp)=>{
			if(!err){
				res.redirect('/sys-members?sid=' + req.query.sid);

			}else{
				data['message']=err.message;
				callback(null,data);
			}
		});
		
	}else{
		api.get('/system/members/' + _id,req,null,(err,resp)=>{
			if(!err){
				data.form=Object.assign(data.form,resp.data);
				callback(null,data);
			}else{
				data['message']=err.message;
				callback(null,data);
			}
		});
	}
}

function view(req,res,data,callback){
	var _id=req.params.id || '';
	api.get('/system/members/' + _id,req,null,(err,resp)=>{
		if(!err){
			data.form=Object.assign(data.form,resp.data);
			callback(null,data);
		}else{
			data['message']=err.message;
			callback(null,data);
		}
	});
}


function deleteItem(req,res,data,callback){
	var _id=req.params.id || '';
	api.delete('/system/members/' + _id,req,(err,resp)=>{
		if(!err){
			res.redirect('/sys-members?sid=' + req.query.sid);
			
		}else{
			
			//data['message']=err.message;
			callback(err,data);
		}
	});
}

function login(req,res,data,callback){

	var _id=req.params.id || '';
	api.post('/system/login-for-member/' + _id,req,null,(err,resp)=>{
		if(!err){

			var userAgent=req.headers['user-agent'] || '';
			var IP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || '';
			console.log('resp:',resp);
			console.log('resp.success:',resp.success);
			var doc=new db.sessions({token:resp.data.token,
				username:resp.data.username,
				isSysUser:resp.data.isSysUser,
				isMember: resp.data.isMember,
				ip:IP,
				userAgent:userAgent,
				sysLogin:true,
				sysUsername:(req.params.username || '')
			});
			
			doc.save((err,sessionDoc)=>{
				if(!err){
					res.redirect('/dashboard?db=&sid=' + sessionDoc._id);
				}else{
					data['message']=err.message;
					callback(null,data);
				}
			});
		}else{
			data['message']=err.message;
			callback(null,data);
		}
	});
}