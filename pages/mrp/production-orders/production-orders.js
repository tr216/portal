module.exports = function(req,res,callback){
	
	var data={
		productionTypeCodeList:Array.from(staticValues.productionTypeCodeList),
		productionStatusTypes:Array.from(staticValues.productionStatusTypes),
		currencyList:Array.from(staticValues.currencyList),
		form:Object.assign({},dbType.productionOrderType),
		html:'Goruntulenemedi',
		list:[],
		filter:{}
	}
	data.form.ioType=1;
	
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
		
		default:
			getList(req,res,data,callback);
		break;
	}
	
}



function getList(req,res,data,callback){
	data.productionTypeCodeList.unshift({text:'-Tümü-',value:''});
	data.productionStatusTypes.unshift({text:'-Tümü-',value:''});
	
	if(req.method=='POST'){
		var filter={};
		filter=Object.assign(filter,req.query);
		filter=Object.assign(filter,req.body);
		filter['btnFilter']=undefined;
		delete filter['btnFilter'];
		filter['page']=1;
		res.redirect('/mrp/production-orders?' + mrutil.encodeUrl(filter));
	}else{
		data.filter=Object.assign(data.filter,req.query);
		data.filter.db=undefined;
		delete data.filter.db;
		data.filter.sid=undefined;
		delete data.filter.sid;
		initLookUpLists(req,res,data,(err,data)=>{
			
			api.get('/' + req.query.db + '/production-orders',req,data.filter,(err,resp)=>{
				if(!err){
					
					data=mrutil.setGridData(data,resp);
				}
				callback(null,data);
			});
		})
	}
}



function initLookUpLists(req,res,data,cb){
	cb(null,data);
}

function addnew(req,res,data,callback){
	initLookUpLists(req,res,data,(err,data)=>{
		if(req.method=='POST' || req.method=='PUT'){
			data.form=Object.assign(data.form,req.body);
			
			api.post('/' + req.query.db + '/production-orders',req,data.form,(err,resp)=>{
				if(!err){
					res.redirect('/mrp/production-orders?db=' + req.query.db +'&sid=' + req.query.sid);
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
	var _id=req.params.id || '';
	if(_id.trim()==''){
		data['message']='id bos olamaz';
		callback(null,data);
		return;
	}
	initLookUpLists(req,res,data,(err,data)=>{
		if(req.method=='POST' || req.method=='PUT'){
			data.form=Object.assign(data.form,req.body);
			api.put('/' + req.query.db + '/production-orders/' + _id,req,data.form,(err,resp)=>{
				if(!err){
					res.redirect('/mrp/production-orders?db=' + req.query.db +'&sid=' + req.query.sid);
					return;
				}else{
					data['message']=err.message;
					callback(null,data);
				}
			});
		}else{
			
			api.get('/' + req.query.db + '/production-orders/' + _id,req,null,(err,resp)=>{
				if(!err){
					data.form=Object.assign(data.form,resp.data);
					callback(null,data);
				}else{
					data['message']=err.message;
					callback(null,data);
				}
			});
		}
	})
}

function deleteItem(req,res,data,callback){
	var _id=req.params.id || '';
	api.delete('/' + req.query.db + '/production-orders/' + _id,req,(err,resp)=>{
		if(!err){
			res.redirect('/mrp/production-orders?db=' + req.query.db +'&sid=' + req.query.sid);
		}else{
			data['message']=err.message;
			callback(null,data);
		}
	});
}