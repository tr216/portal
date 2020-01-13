module.exports = function(req,res,callback){
	var data={
		form:{
			posDevice:'',
			data:'',
			pending:false,
			transferred:false,
			transferDate:'',
			createdDate:''
		},
		list:[],
		locationList:[],
		filter:{
			status:'',
			date1:(new Date()).yyyymmdd(),
			date2:(new Date()).yyyymmdd()
		}

	}

	if(!req.query.db){
		return callback({code:'ACTIVE DB ERROR',message:'Aktif secili bir veri ambari yok.'});
	}
	

	switch(req.params.func || ''){
		
		case 'view':
			view(req,res,data,callback);
		break;
		case 'transfer':
			transfer(req,res,data,callback);
		break;
		case 'rollback':
			rollback(req,res,data,callback);
		break;
		case 'settransferred':
			setTransferred(req,res,data,callback);
		break;
		case 'delete':
		
		deleteItem(req,res,data,callback);
		break;
		default:
			getList(req,res,data,callback);
		break;
	}
	
}

function getList(req,res,data,callback){
	if(req.method=='POST'){
		data.filter={};
		
		for(let k in req.body){
			if(req.body[k] && k!='btnFilter'){
				data.filter[k]=req.body[k];
			}
		}

		res.redirect('/pos-device/transfer?db=' + req.query.db + '&' + mrutil.encodeUrl(data.filter) + '&sid=' + req.query.sid);
	}else{
		data.filter=Object.assign(data.filter,req.query);
		data.filter.db=undefined;
		delete data.filter.db;
		data.filter.sid=undefined;
		delete data.filter.sid;
		initLookUpLists(req,res,data,(err,data)=>{
			api.get('/' + req.query.db + '/pos-device-zreports',req,data.filter,(err,resp)=>{
				if(!err){
					
					data=mrutil.setGridData(data,resp);
				}
				callback(null,data);
			});
		});
		
	}

}

function initLookUpLists(req,res,data,cb){
	data.locationList=[];
	api.get('/' + req.query.db + '/locations',req,{},(err,resp)=>{
		if(!err){
			data.locationList=resp.data.docs;
			data.locationList.unshift({_id:'',locationName:'Tümü'});
		}
		cb(null,data);
	});
}

function transfer(req,res,data,callback){
	if(req.method=='POST' || req.method=='PUT'){

		data.list=[];
		if(req.body.selected!=undefined){
			if(req.body.selected.length>0){
				req.body.selected.forEach((e)=>{
					try{
						var item=JSON.parse(decodeURIComponent(e));
						if(item.status!='transferred'){
							data.list.push(item);
						}
					}catch(err){
						eventLog('function transfer. error:',err);
					}
					
				});
				
				
			}
		}
		if(req.body.btnTransfer){
			var smallData={list:[]};
			data.list.forEach((e)=>{
				smallData.list.push({_id:e._id});
			});
			api.post('/' + req.query.db + '/pos-device-zreports/transfer',req,smallData,(err,resp)=>{
				if(!err){

					data['success']=resp.data.length + ' adet Z Raporu aktarim icin kuyruga alindi.';
					callback(null,data);
				}else{
					data['message']=err.message;
					callback(null,data);
				}
			});
		}else{
			callback(null,data);
		}
		
	}else{
		res.redirect('/pos-device/transfer?db=' + req.query.db +'&sid=' + req.query.sid);
	}
	
}

function rollback(req,res,data,callback){
	if(req.method=='POST' || req.method=='PUT'){

		data.list=[];
		if(req.body.selected!=undefined){
			if(req.body.selected.length>0){
				req.body.selected.forEach((e)=>{
					try{
						var item=JSON.parse(decodeURIComponent(e));
						if(item.status!=''){
							data.list.push(item);
						}
					}catch(err){
						eventLog('function transfer. error:',err);
					}
					
				});
				
				
			}
		}
		if(req.body.btnRollback){
			var smallData={list:[]};
			data.list.forEach((e)=>{
				smallData.list.push({_id:e._id});
			});
			api.post('/' + req.query.db + '/pos-device-zreports/rollback',req,smallData,(err,resp)=>{
				if(!err){

					data['success']=resp.data.n + ' adet Z Raporu aktarilmamis olarak geri alindi.';
					callback(null,data);
				}else{
					data['message']=err.message;
					callback(null,data);
				}
			});
		}else{
			callback(null,data);
		}
		
	}else{
		res.redirect('/pos-device/transfer?db=' + req.query.db +'&sid=' + req.query.sid);
	}
	
}

function setTransferred(req,res,data,callback){
	if(req.method=='POST' || req.method=='PUT'){

		data.list=[];
		if(req.body.selected!=undefined){
			if(req.body.selected.length>0){
				req.body.selected.forEach((e)=>{
					try{
						var item=JSON.parse(decodeURIComponent(e));
						if(item.status!='transferred'){
							data.list.push(item);
						}
					}catch(err){
						eventLog('function transfer. error:',err);
					}
					
				});
				
				
			}
		}
		if(req.body.btnSetTransferred){
			var smallData={list:[]};
			data.list.forEach((e)=>{
				smallData.list.push({_id:e._id});
			});
			api.post('/' + req.query.db + '/pos-device-zreports/settransferred',req,smallData,(err,resp)=>{
				if(!err){

					data['success']=resp.data.n + ' adet Z Raporu aktarilmis olarak isaretlendi.';
					callback(null,data);
				}else{
					data['message']=err.message;
					callback(null,data);
				}
			});
		}else{
			callback(null,data);
		}
		
	}else{
		res.redirect('/pos-device/transfer?db=' + req.query.db +'&sid=' + req.query.sid);
	}
	
}

function view(req,res,data,callback){
	var _id=req.params.id || '';
	api.get('/' + req.query.db + '/pos-device-zreports/' + _id,req,null,(err,resp)=>{
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
	api.delete('/' + req.query.db + '/pos-device-zreports/' + _id,req,(err,resp)=>{
		if(!err){
			res.redirect('/pos-device/transfer?db=' + req.query.db +'&sid=' + req.query.sid);
			
		}else{
			data['message']=err.message;
			callback(null,data);
		}
	});
}