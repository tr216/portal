module.exports = function(req,res,callback){
	var data={
		locationList:[],
		serviceList:[],
		localConnectorList:[],
		form:{
			location:'',
			service:'',
			deviceModel:'',
			deviceSerialNo:'',
			localConnector:'',
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
	initLookUpLists(req,res,data,(err,data)=>{
		api.get(`/{db}/pos-devices`,req,data.filter,(err,resp)=>{
			if(!err){
				data=mrutil.setGridData(data,resp);
			}else{
				eventLog('hata:',err);
			}
			eventLog('data:',data);
			callback(null,data);
		});
	});
}



function initLookUpLists(req,res,data,cb){
	data.locationList=[];
	data.serviceList=[];
	data.localConnectorList=[];
	api.get(`/{db}/locations`,req,{passive:false},(err,resp)=>{
		if(!err){
			data.locationList=resp.data.docs;
			data.locationList.unshift({_id:'',locationName:'-Tümü-'})
		}
		api.get(`/{db}/pos-device-services`,req,{},(err,resp)=>{
			if(!err){
				data.serviceList=resp.data.docs;
				data.serviceList.unshift({_id:'',name:'-Tümü-'})
			}
			api.get(`/{db}/local-connectors`,req,{},(err,resp)=>{
				if(!err){
					data.localConnectorList=resp.data.docs;
					data.localConnectorList.unshift({_id:'',name:'-Tümü-'})
				}
				cb(null,data);
			});
		});
	});
}

function addnew(req,res,data,callback){
	//data['title']='Yeni Lokasyon';
	initLookUpLists(req,res,data,(err,data)=>{
		if(req.method=='POST'){
			data.form=Object.assign(data.form,req.body);
			api.post(`/{db}/pos-devices`,req,data.form,(err,resp)=>{
				if(!err){
					res.redirect(`/pos-device/list?sid=${req.query.sid}&mid=${req.query.mid}`)
					return;
 				}else{
 					data['message']=err.message;
 					callback(null,data);
 				}
 			});
		}else{
			callback(null,data);
		}
	});
}


function edit(req,res,data,callback){
	initLookUpLists(req,res,data,(err,data)=>{
		var _id=req.params.id || '';
		if(req.method=='POST' || req.method=='PUT'){
			data.form=Object.assign(data.form,req.body);
			api.put(`/{db}/pos-devices/${_id}`,req,data.form,(err,resp)=>{
				if(!err){
					res.redirect(`/pos-device/list?sid=${req.query.sid}&mid=${req.query.mid}`)

				}else{
					data['message']=err.message;
					callback(null,data);
				}
			});
		}else{
			api.get(`/{db}/pos-devices/${_id}`,req,null,(err,resp)=>{
				if(!err){
					data.form=Object.assign(data.form,resp.data);
					callback(null,data);
				}else{
					data['message']=err.message;
					callback(null,data);
				}
			});
		}
	});
}

function view(req,res,data,callback){
	initLookUpLists(req,res,data,(err,data)=>{
		var _id=req.params.id || '';
		api.get(`/{db}/pos-devices/${_id}`,req,null,(err,resp)=>{
			if(!err){
				data.form=Object.assign(data.form,resp.data);
				callback(null,data);
			}else{
				data['message']=err.message;
				callback(null,data);
			}
		});
	});
}

function deleteItem(req,res,data,callback){
	var _id=req.params.id || '';
	api.delete(`/{db}/pos-devices/${_id}`,req,(err,resp)=>{
		if(!err){
			res.redirect(`/pos-device/list?sid=${req.query.sid}&mid=${req.query.mid}`)
			
		}else{
			data['message']=err.message;
			callback(null,data);
		}
	});
}