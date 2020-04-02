module.exports = function(req,res,callback){
	var data={
		title:'Görev yöneticisi',
		form:{
			taskDoc:''
		},
		list:[],
		filter:{}
	};

	switch(req.params.func || ''){
		
		case 'view':
		
		view(req,res,data,callback);
		break;
		
		default:
			data.filter=getFilter(data.filter,req);
			getList(req,res,data,callback);
		break;
	}
	
}

function getList(req,res,data,callback){
	api.get('/' + req.query.db + '/tasks',req,data.filter,(err,resp)=>{
		if(!err){
			data=mrutil.setGridData(data,resp);
		}
		callback(null,data);
	});
}

function view(req,res,data,callback){
	var _id=req.params.id || '';
	
		api.get('/' + req.query.db + '/tasks/' + _id,req,null,(err,resp)=>{
			if(!err){
				data.form.taskDoc=resp.data;
				callback(null,data);
			}else{
				data['message']=err.message;
				callback(null,data);
			}
		});
	
}

function deleteItem(req,res,data,callback){
	var _id=req.params.id || '';
	api.delete('/' + req.query.db + '/tasks/' + _id,req,(err,resp)=>{
		if(!err){
			res.redirect('/system/tasks?sid=' + req.query.sid);
			
		}else{
			data['message']=err.message;
			callback(null,data);
		}
	});
}