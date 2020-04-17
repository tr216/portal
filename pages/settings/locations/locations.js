module.exports = function(req,res,callback){
	var data={
		locationTypeList:clone(staticValues.locationTypes),
		form:{
			locationName:'',
			locationType:0,
			hasSubLocations:false,
			passive:false
		},
		list:[],
		filter:{}
	}

	if(!req.query.db){
		return callback({code:'ACTIVE DB ERROR',message:'Aktif secili bir veri ambari yok.'});
	}
	switch(req.params.func || ''){
		case 'addnew':
		
		addnew(req,res,data,callback);
		break;
		case 'edit':
			edit(req,res,data,callback);
		break;
		case 'view':
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
	data.locationTypeList.unshift({text:'-- Tümü --', value:-1});
	api.get('/' + req.query.db + '/locations',req,data.filter,(err,resp)=>{
		if(!err){
			data=mrutil.setGridData(data,resp);
		}
		callback(null,data);
	});
}

function addnew(req,res,data,callback){
	if(req.method=='POST'){
		data.form=Object.assign(data.form,req.body);
		api.post('/' + req.query.db + '/locations',req,data.form,(err,resp)=>{
			if(!err){
				res.redirect('/settings/locations?db=' + req.query.db +'&sid=' + req.query.sid);
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
	//data['title']='Lokasyon Duzelt';
	var _id=req.params.id || '';
	if(_id.trim()==''){
		data['message']='ID bos olamaz';
		callback(null,data);
		return;
	}
	if(req.method=='POST' || req.method=='PUT'){
		data.form=Object.assign(data.form,req.body);

		api.put('/' + req.query.db + '/locations/' + _id, req,data.form,(err,resp)=>{
			if(!err){
				res.redirect('/settings/locations?db=' + req.query.db +'&sid=' + req.query.sid);

			}else{
				data['message']=err.message;
				callback(null,data);
			}
		});
	}else{
		api.get('/' + req.query.db + '/locations/' + _id,req,null,(err,resp)=>{
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
	api.delete('/' + req.query.db + '/locations/' + _id,req,(err,resp)=>{
		if(!err){
			res.redirect('/settings/locations?db=' + req.query.db +'&sid=' + req.query.sid);
			
		}else{
			
			//data['message']=err.message;
			callback(err,data);
		}
	});
}