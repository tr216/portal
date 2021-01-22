module.exports = function(req,res,callback){
	var data={
		locationList:[],
		form:{
			name:'',
			useMaterialInput:false,
			useMaterialOutput:false,
			useMachine:false,
			useMold:false,
			useParameters:false,
			passive:false
		},
		filter:{

		},
		list:[]
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
	api.get(`/{db}/mrp-process-steps`,req,data.filter,(err,resp)=>{
		if(!err){
			data=mrutil.setGridData(data,resp);
		}else{
			eventLog('hata:',err);
		}
		eventLog('data:',data);
		callback(null,data);
	});
		
	

}


function addnew(req,res,data,callback){
	//data['title']='Yeni Lokasyon';
	if(req.method=='POST'){
		data.form=Object.assign(data.form,req.body);
		api.post(`/{db}/mrp-process-steps`,req,data.form,(err,resp)=>{
			if(!err){
				res.redirect(`/mrp/process-steps?sid=${req.query.sid}&mid=${req.query.mid}`)
				return;
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
		api.put(`/{db}/mrp-process-steps/${_id}`,req,data.form,(err,resp)=>{
			if(!err){
				res.redirect(`/mrp/process-steps?sid=${req.query.sid}&mid=${req.query.mid}`)

			}else{
				data['message']=err.message;
				callback(null,data);
			}
		});
	}else{
		api.get(`/{db}/mrp-process-steps/${_id}`,req,null,(err,resp)=>{
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
	api.get(`/{db}/mrp-process-steps/${_id}`,req,null,(err,resp)=>{
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
	api.delete(`/{db}/mrp-process-steps/${_id}`,req,(err,resp)=>{
		if(!err){
			res.redirect(`/mrp/process-steps?sid=${req.query.sid}&mid=${req.query.mid}`)
			
		}else{
			data['message']=err.message;
			callback(null,data);
		}
	});
}