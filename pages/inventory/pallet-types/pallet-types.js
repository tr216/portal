module.exports = function(req,res,callback){
	var data={
		form:{
			name:'',
			description:'',
			width:0,
			length:0,
			height:0,
			maxWeight:0,
			passive:false
		},
		list:[],
		filter:{}
	}

	if(!req.query.db){
		return callback({code:'ACTIVE DB ERROR',message:'Aktif secili bir veri ambari yok.'});
	}
	switch(req.params.func || ''){
		case 'addnew': return addnew(req,res,data,callback);
		case 'edit': return edit(req,res,data,callback);
		case 'view': return edit(req,res,data,callback);
		case 'delete': return deleteItem(req,res,data,callback);
		default:
			data.filter=getFilter(data.filter,req);
			getList(req,res,data,callback);
		break;
	}
	
}

function getList(req,res,data,callback){
	initLookUpLists(req,res,data,(err,data)=>{
		api.get('/' + req.query.db + '/pallet-types',req,data.filter,(err,resp)=>{
			if(!err){
				data=mrutil.setGridData(data,resp);
			}
			callback(null,data);
		});
	})
}


function initLookUpLists(req,res,data,cb){
	cb(null,data);
}

function addnew(req,res,data,callback){
	initLookUpLists(req,res,data,(err,data)=>{
		if(req.method=='POST'){
			data.form=Object.assign(data.form,req.body);
			api.post('/' + req.query.db + '/pallet-types',req,data.form,(err,resp)=>{
				if(!err){
					res.redirect('/inventory/pallet-types?db=' + req.query.db +'&sid=' + req.query.sid);
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
		data['message']='ID bos olamaz';
		callback(null,data);
		return;
	}
	initLookUpLists(req,res,data,(err,data)=>{
		
		if(req.method=='POST' || req.method=='PUT'){
			data.form=Object.assign(data.form,req.body);
			
			api.put('/' + req.query.db + '/pallet-types/' + _id, req,data.form,(err,resp)=>{
				if(!err){
					res.redirect('/inventory/pallet-types?db=' + req.query.db +'&sid=' + req.query.sid);

				}else{
					data['message']=err.message;
					callback(null,data);
				}
			});
		}else{
			api.get('/' + req.query.db + '/pallet-types/' + _id,req,null,(err,resp)=>{
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

function deleteItem(req,res,data,callback){
	var _id=req.params.id || '';
	api.delete('/' + req.query.db + '/pallet-types/' + _id,req,(err,resp)=>{
		if(!err){
			res.redirect('/inventory/pallet-types?db=' + req.query.db +'&sid=' + req.query.sid);
			
		}else{
			
			//data['message']=err.message;
			callback(err,data);
		}
	});
}