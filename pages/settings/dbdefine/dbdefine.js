module.exports = function(req,res,callback){
	var data={
		title:'Veri Ambarları',
		form:{
			dbName:''
		},
		list:[],
		filter:{}
	};

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
		default:
			data.filter=getFilter(data.filter,req);
			getList(req,res,data,callback);
		break;
	}
	
}

function getList(req,res,data,callback){
	api.get('/dbdefine',req,data.filter,(err,resp)=>{
		if(!err){
			data=mrutil.setGridData(data,resp);
		}
		callback(null,data);
	});
}

function addnew(req,res,data,callback){
	if(req.method=='POST'){
		var dbName=req.body.dbName || '';
		eventLog('dbName:',dbName);

		if(dbName.trim()==''){
			data['message']='Veri ambari ismi bos olamaz!';
			callback(null,data);
		}else{
			data['dbName']=dbName;
			api.post('/dbdefine',req,{dbName:dbName},(err,resp)=>{
				if(!err){
					res.redirect('/settings/dbdefine?sid=' + req.query.sid);
 					//callback(null,data);
 				}else{
 					data['message']=err.message;
 					callback(null,data);
 				}
 			});
		}
	}else{
		callback(null,data);
	}
}

function edit(req,res,data,callback){
	var _id=req.params.id || '';
	if(req.method=='POST' || req.method=='PUT'){
		data.form=Object.assign(data.form,req.body);
		
		api.put('/dbdefine/' + _id,req,data.form,(err,resp)=>{
			if(!err){
				res.redirect('/settings/dbdefine?sid=' + req.query.sid);

			}else{
				data['message']=err.message;
				callback(null,data);
			}
		});
	}else{
		api.get('/dbdefine/' + _id,req,null,(err,resp)=>{
			if(!err){
				data.form.dbName=resp.data.dbName;

				callback(null,data);
			}else{
				data['message']=err.message;
				callback(null,data);
			}
		});
	}
}

function deleteItem(req,res,data,callback){
	var _id=req.params.id || '';
	api.delete('/dbdefine/' + _id,req,(err,resp)=>{
		if(!err){
			res.redirect('/dbdefine?sid=' + req.query.sid);
			
		}else{
			data['message']=err.message;
			callback(null,data);
		}
	});
}