module.exports = function(req,res,callback){
	var data={
		
		dbName:'',
		form:{
			memberId:'',
			username:'',
			canRead:false,
			canWrite:false,
			canDelete:false
		},
		returnUrl:'',
		list:[],
		filter:{}

	}

	if(!req.query.db){
		return callback({code:'DB ERROR',message:'Secili bir veri ambari yok.'});
	}
	

	switch(req.params.func || ''){
		
		case 'addnew':
			addnew(req,res,data,callback);
		break;
		case 'edit':
			edit(req,res,data,callback);
		break;
		case 'view':
			view(req,res,data,callback);
		break;
		case 'delete':
		
			deleteItem(req,res,data,callback);
		break;
		default:
			data.filter=getFilter(data.filter,req,res)
			if(req.method!='POST') 
				getList(req,res,data,callback)
		break;
	}
	
}

function getList(req,res,data,callback){
	api.get('/dbinvite/' +  req.query.db,req,data.filter,(err,resp)=>{
		if(!err){
			data['recordCount']=resp.data.authorizedMembers.length;
			data['list']=resp.data.authorizedMembers;
			data['dbName']=resp.data.dbName;
		}else{
			
			data['message']=err.message;
		}
		callback(null,data);
	});
}


function addnew(req,res,data,callback){
	initValues(req,res,data,(err,data)=>{
		if(req.method=='POST'){
			data.form=Object.assign(data.form,req.body);
			api.post('/dbinvite/' + req.query.db,req,data.form,(err,resp)=>{
				if(!err){
					res.redirect('/settings/dbinvite?db=' + req.query.db +'&sid=' + req.query.sid);
				}else{
					data['message']=err.message;
					callback(null,data);
				}
			});
		}else{
			callback(null,data);
		}
	})
	
}

function edit(req,res,data,callback){
	api.get('/dbinvite/' + req.query.db + '/' + req.params.id,req,{},(err,resp)=>{
		if(err){
			data['message']=err.message;

			if(req.method=='POST') data.form=Object.assign(data.form,req.body);
			callback(null,data);
		}else{
			
			data.form.canRead=resp.data.canRead;
			data.form.canWrite=resp.data.canWrite;
			data.form.canDelete=resp.data.canDelete;
			if(req.method=='POST'){
				data.form.canRead=req.body.canRead || false;
				data.form.canWrite=req.body.canWrite || false;
				data.form.canDelete=req.body.canDelete || false;
			}
			data.dbName=resp.data.dbName;
			data.form.memberId=resp.data.memberId;
			data.form.username=resp.data.username;

			if(req.method=='POST'){
				api.put('/dbinvite/' + req.query.db + '/' + data.form.memberId ,req,data.form,(err,resp)=>{
					if(!err){
						res.redirect('/dbinvite?db=' + req.query.db +'&sid=' + req.query.sid);
					}else{
						data['message']=err.message;
						callback(null,data);
					}
				});
			}else{
				callback(null,data);
			}
		}
		
	});
	
}

function view(req,res,data,callback){
	api.get('/dbinvite/' + req.query.db + '/' + req.params.id,req,{},(err,resp)=>{
		if(err){
			data['message']=err.message;

			//if(req.method=='POST') data.form=Object.assign(data.form,req.body);
			
		}else{
			
			data.form.canRead=resp.data.canRead;
			data.form.canWrite=resp.data.canWrite;
			data.form.canDelete=resp.data.canDelete;
			// if(req.method=='POST'){
			// 	data.form.canRead=req.body.canRead || false;
			// 	data.form.canWrite=req.body.canWrite || false;
			// 	data.form.canDelete=req.body.canDelete || false;
			// }
			data.dbName=resp.data.dbName;
			data.form.memberId=resp.data.memberId;
			data.form.username=resp.data.username;

			
		}
		callback(null,data);
	});
	
}


function deleteItem(req,res,data,callback){
	api.delete('/dbinvite/' + req.query.db + '/' + req.params.id,req,(err,resp)=>{
		if(!err){
			res.redirect('/settings/dbinvite?db=' + req.query.db +'&sid=' + req.query.sid);
			
		}else{
			data['message']=err.message;
			callback(null,data);
		}
	});
}

function initValues(req,res,data,cb){
	api.get('/mydbdefines/' +  req.query.db,req,{},(err,resp)=>{

		if(!err){
			data['dbName']=resp.data.dbName;
			
		}else{
			
			data['message']=err.message;
		}
		cb(null,data);
	});
}