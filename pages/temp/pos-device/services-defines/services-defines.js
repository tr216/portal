module.exports = function(req,res,callback){
	var data={
		serviceTypes:staticValues.posDeviceServiceTypes,
		form:{
			serviceType:'',
			name:'',
			url:'',
			username:'',
			password:'',
			passive:false
		},
		list:[],
		filter:{}
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
		default:
			data.filter=getFilter(data.filter,req,res)
			if(req.method!='POST') 
				getList(req,res,data,callback)
		break;
	}
	
}

function getList(req,res,data,callback){
	api.get(`/{db}/pos-device-services`,req,data.filter,(err,resp)=>{
		if(!err){
			data=mrutil.setGridData(data,resp);
		}
		callback(null,data);
	});

}

function addnew(req,res,data,callback){
	if(req.method=='POST'){
		data.form=Object.assign(data.form,req.body);
		api.post(`/{db}/pos-device-services`,req,data.form,(err,resp)=>{
			if(!err){
				res.redirect(`/pos-device/services-defines?sid=${req.query.sid}&mid=${req.query.mid}`)
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
		if(_id.trim()==''){
			data['message']='ID bos olamaz';
			callback(null,data);
			return;
		}

		api.put(`/{db}/pos-device-services/${_id}`,req,data.form,(err,resp)=>{
			if(!err){
				res.redirect(`/pos-device/services-defines?sid=${req.query.sid}&mid=${req.query.mid}`)
				return;
			}else{
				data['message']=err.message;
				callback(null,data);
			}
		});
	}else{
		api.get(`/{db}/pos-device-services/${_id}`,req,null,(err,resp)=>{
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

function deleteItem(req,res,data,callback){
	var _id=req.params.id || '';
	api.delete(`/{db}/pos-device-services/${_id}`,req,(err,resp)=>{
		if(!err){
			res.redirect(`/pos-device/service-defines?sid=${req.query.sid}&mid=${req.query.mid}`)
		}else{
			data['message']=err.message;
			callback(null,data);
		}
	});
}