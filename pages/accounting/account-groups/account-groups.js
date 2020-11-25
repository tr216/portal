module.exports = function(req,res,callback){
	var data={
		form:{
			account:'',
			returnAccount:'',
			salesAccount:'',
			exportSalesAccount:'',
			salesDiscountAccount:'',
			buyingDiscountAccount:'',
			costOfGoodsSoldAccount:'',
			code:'',
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
	api.get(`/{db}/account-groups`,req,data.filter,(err,resp)=>{
		if(!err){
			data=mrutil.setGridData(data,resp);
		}
		callback(null,data);
	});
}

function addnew(req,res,data,callback){
	if(req.method=='POST'){
		data.form=Object.assign(data.form,req.body);
		
		if(data.form.name.trim()==''){
			data['message']='Isim boş olamaz!';
			return callback(null,data);
		}
		
		api.post(`/{db}/account-groups`,req,data.form,(err,resp)=>{
			if(!err){
				res.redirect(`/accounting/account-groups?sid=${req.query.sid}&mid=${req.query.mid}`)
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
	if(req.method=='POST' || req.method=='PUT'){
		data.form=Object.assign(data.form,req.body);
		if(data.form.name.trim()==''){
			data['message']='Isim boş olamaz!';
			return callback(null,data);
		}
		if(_id.trim()==''){
			data['message']='ID bos olamaz';
			return callback(null,data);
		}

		api.put(`/{db}/account-groups/${_id}`,req,data.form,(err,resp)=>{
			if(!err){
				res.redirect(`/accounting/account-groups?sid=${req.query.sid}&mid=${req.query.mid}`)

			}else{
				data['message']=err.message;
				callback(null,data);
			}
		});
	}else{
		api.get(`/{db}/account-groups/${_id}`,req,null,(err,resp)=>{
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
	api.delete(`/{db}/account-groups/${_id}`,req,(err,resp)=>{
		if(!err){
			res.redirect(`/accounting/account-groups?sid=${req.query.sid}&mid=${req.query.mid}`)
			
		}else{
			
			//data['message']=err.message;
			callback(err,data);
		}
	});
}