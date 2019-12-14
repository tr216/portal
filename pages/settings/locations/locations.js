module.exports = function(req,res,callback){
	var data={
		locationTypeList:staticvalues.locationTypes,
		form:{
			locationName:'',
			locationType:0,
			passive:false
		},
		list:[]
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
		case 'delete':
		
		deleteItem(req,res,data,callback);
		break;
		default:
			getList(req,res,data,callback);
		
	}
	
}

function getList(req,res,data,callback){
	api.get('/' + req.query.db + '/locations',req,{page:req.query.page},(err,resp)=>{
		if(!err){
			data=mrutil.setGridData(data,resp);
			// data['recordCount']=resp.data.recordCount;
			// data['page']=resp.data.page;
			// data['pageCount']=resp.data.pageCount;
			// data['pageSize']=resp.data.pageSize;
			// data['list']=resp.data.docs;
		}
		callback(null,data);
	});
}

function addnew(req,res,data,callback){
	//data['title']='Yeni Lokasyon';
	if(req.method=='POST'){
		data.form=Object.assign(data.form,req.body);
		if(data.form.locationName.trim()==''){
			data['message']='Lokasyon ismi bos olamaz!';
			callback(null,data);
		}else{
			api.post('/' + req.query.db + '/locations',req,data.form,(err,resp)=>{
				if(!err){
					res.redirect('/locations?db=' + req.query.db +'&sid=' + req.query.sid);
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
	//data['title']='Lokasyon Duzelt';
	var _id=req.params.id || '';
	if(req.method=='POST' || req.method=='PUT'){
		data.form=Object.assign(data.form,req.body);
		if(data.form.locationName.trim()==''){
			data['message']='Lokasyon ismi bos olamaz!';
			callback(null,data);
			return;
		}
		if(_id.trim()==''){
			data['message']='ID bos olamaz';
			callback(null,data);
			return;
		}

		api.put('/' + req.query.db + '/locations/' + _id, req,data.form,(err,resp)=>{
			if(!err){
				res.redirect('/locations?db=' + req.query.db +'&sid=' + req.query.sid);

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
			res.redirect('/locations?db=' + req.query.db +'&sid=' + req.query.sid);
			
		}else{
			
			//data['message']=err.message;
			callback(err,data);
		}
	});
}