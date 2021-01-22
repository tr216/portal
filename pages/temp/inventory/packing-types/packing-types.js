module.exports = function(req,res,callback){
	var data={
		form:{
			name:'',
			description:'',
			width:0,
			length:0,
			height:0,
			maxWeight:0,
			content:[],
			passive:false
		},
		list:[],
		filter:{}
	}


	switch(req.params.func || ''){
		case 'addnew': return addnew(req,res,data,callback);
		case 'edit': return edit(req,res,data,callback);
		case 'view': return edit(req,res,data,callback);
		case 'delete': return deleteItem(req,res,data,callback);
		default:
			data.filter=getFilter(data.filter,req,res)
			if(req.method!='POST') 
				getList(req,res,data,callback)
		break;
	}
	
}

function getList(req,res,data,callback){
	initLookUpLists(req,res,data,(err,data)=>{
		api.get(`/{db}/packing-types`,req,data.filter,(err,resp)=>{
			if(!err){
				data=mrutil.setGridData(data,resp);
			}
			callback(null,data);
		});
	})
}


function initLookUpLists(req,res,data,cb){
	// data.palletTypeList=[];
	// api.get(`/{db}/pallet-types`,req,{},(err,resp)=>{
	// 	if(!err){
	// 		resp.data.docs.forEach((e)=>{
	// 			data.palletTypeList.push({_id:e._id,name:(e.name + (e.description?' - ' + e.description:''))});
	// 		})
			
	// 	}
		cb(null,data);
	// });
}

function addnew(req,res,data,callback){
	initLookUpLists(req,res,data,(err,data)=>{
		if(req.method=='POST'){
			data.form=Object.assign(data.form,req.body);
			api.post(`/{db}/packing-types`,req,data.form,(err,resp)=>{
				if(!err){
					res.redirect(`/inventory/packing-types?sid=${req.query.sid}&mid=${req.query.mid}`)
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
			
			api.put(`/{db}/packing-types/${_id}`,req,data.form,(err,resp)=>{
				if(!err){
					res.redirect(`/inventory/packing-types?sid=${req.query.sid}&mid=${req.query.mid}`)

				}else{
					data['message']=err.message;
					callback(null,data);
				}
			});
		}else{
			api.get(`/{db}/packing-types/${_id}`,req,null,(err,resp)=>{
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
	api.delete(`/{db}/packing-types/${_id}`,req,(err,resp)=>{
		if(!err){
			res.redirect(`/inventory/packing-types?sid=${req.query.sid}&mid=${req.query.mid}`)
			
		}else{
			
			//data['message']=err.message;
			callback(err,data);
		}
	});
}