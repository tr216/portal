module.exports = function(req,res,callback){
	var data={
		form:{
			name:''
		},
		filter:{},
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
	initLookUpLists(req,res,data,(err,data)=>{
		api.get(`/{db}/mrp-machine-groups`,req,data.filter,(err,resp)=>{
			if(!err){
				data=mrutil.setGridData(data,resp);
			}else{
				errorLog('hata:',err);
			}
			callback(null,data);
		});
	});
}



function initLookUpLists(req,res,data,cb){
	cb(null,data);
}

function addnew(req,res,data,callback){
	initLookUpLists(req,res,data,(err,data)=>{
		if(req.method=='POST'){
			data.form=Object.assign(data.form,req.body);
			api.post(`/{db}/mrp-machine-groups`,req,data.form,(err,resp)=>{
				if(!err){
					res.redirect(`/mrp/machine-groups?sid=${req.query.sid}&mid=${req.query.mid}`)
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
			api.put(`/{db}/mrp-machine-groups/${_id}`,req,data.form,(err,resp)=>{
				if(!err){
					res.redirect(`/mrp/machine-groups?sid=${req.query.sid}&mid=${req.query.mid}`)

				}else{
					data['message']=err.message;
					callback(null,data);
				}
			});
		}else{
			api.get(`/{db}/mrp-machine-groups/${_id}`,req,null,(err,resp)=>{
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
	api.delete(`/{db}/mrp-machine-groups/${_id}`,req,(err,resp)=>{
		if(!err){
			res.redirect(`/mrp/machine-groups?sid=${req.query.sid}&mid=${req.query.mid}`)
			
		}else{
			data['message']=err.message;
			callback(null,data);
		}
	});
}