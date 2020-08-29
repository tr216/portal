module.exports = function(req,res,callback){
	var data={
		connectionTypes:staticValues.localConnectorConnectionTypes,
		fileTypes:staticValues.localConnectorFileTypes,
		form:{
			name:'',
			connectorId:'',
			connectorPass:'',
			connectionType:'',
			connection:{
				server: '',
            	port:0,
            	database:'',
            	username:'',
            	password: '',
            	file: ''
			},
			//files:[],
			passive:false
		},
		message:'',
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
		case 'view':
			view(req,res,data,callback);
		break;
		case 'code':
			require('./local-connectors-code.js')(req,res,callback);
		break;
		default:
			data.filter=getFilter(data.filter,req,res)
			if(req.method!='POST') 
				getList(req,res,data,callback)
		break;
	}
	
}

function getList(req,res,data,callback){
	api.get(`/{db}/local-connectors`,req,data.filter,(err,resp)=>{
		if(!err){
			data=mrutil.setGridData(data,resp);
		}
		callback(null,data);
	});
}

function addnew(req,res,data,callback){
	if(req.method=='POST'){
		data.form=Object.assign(data.form,req.body);
		if(req.body['btnConnectorTest']!=undefined){
			api.post(`/{db}/local-connectors/test`,req,data.form,(err,resp)=>{
				data['testResult']=resp;
				callback(null,data);
			});
		}else{
			api.post(`/{db}/local-connectors`,req,data.form,(err,resp)=>{
				if(!err){
					res.redirect(`/settings/local-connectors?sid=${req.query.sid}&mid=${req.query.mid}`)
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
	var _id=req.params.id || '';
	if(req.method=='POST' || req.method=='PUT'){
		data.form=Object.assign(data.form,req.body);
		if(req.body['btnConnectorTest']!=undefined){
			api.post(`/{db}/local-connectors/test`,req,data.form,(err,resp)=>{
				data['testResult']=resp;
				callback(null,data);
			});
		}else{
			api.put(`/{db}/local-connectors/${_id}`,req,data.form,(err,resp)=>{
				if(!err){
					res.redirect(`/settings/local-connectors?sid=${req.query.sid}&mid=${req.query.mid}`)

				}else{
					data['message']=err.message;
					callback(null,data);
				}
			});
		}
		
		
	}else{
		api.get(`/{db}/local-connectors/${_id}`,req,null,(err,resp)=>{
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

function view(req,res,data,callback){
	var _id=req.params.id || '';
	if(req.method=='POST' || req.method=='PUT'){
		data.form=Object.assign(data.form,req.body);
		if(req.body['btnConnectorTest']!=undefined){
			api.post(`/{db}/local-connectors/test`,req,data.form,(err,resp)=>{
				data['testResult']=resp;
				callback(null,data);
			});
		}else{
			api.get(`/{db}/local-connectors/${_id}`,req,null,(err,resp)=>{
				if(!err){
					data.form=Object.assign(data.form,resp.data);
					callback(null,data);
				}else{
					data['message']=err.message;
					callback(null,data);
				}
			});
		}
	}else{
		api.get(`/{db}/local-connectors/${_id}`,req,null,(err,resp)=>{
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
function code1111(req,res,data,callback){
	var _id=req.params.id || '';
	if(req.method=='POST' || req.method=='PUT'){
		if(req.body['btnConnectorTest']!=undefined){
			var form1={ files:[]};
			form1=Object.assign(form1,req.body);
			api.get(`/{db}/local-connectors/${_id}`,req,null,(err,resp)=>{
				if(!err){
					data.form=Object.assign(data.form,resp.data);
					data.form=Object.assign(data.form,form1);
					api.post(`/{db}/local-connectors/test`,req,data.form,(err,resp)=>{
						data['testResult']=resp;
						callback(null,data);
					});
				}else{
					data['message']=err.message;
					callback(null,data);
				}
			});
			
		}else{
			var form={ files:[]};
			form=Object.assign(form,req.body);
			if(req.body.buttonAddNewFile){
				form.files.push({fileName:'yeni dosya 1',fileData:'',passive:false,start:(form.files.length==0?true:false)});
			}
			api.put(`/{db}/local-connectors/${_id}`,req,form,(err,resp)=>{
				if(!err){
					
					api.get(`/{db}/local-connectors/${_id}`,req,null,(err,resp)=>{
						if(!err){
							data.form=Object.assign(data.form,resp.data);
							callback(null,data);
						}else{
							data['message']=err.message;
							callback(null,data);
						}
					});

				}else{
					data['message']=err.message;
					callback(null,data);
				}
			});
		}
	}else{
		api.get(`/{db}/local-connectors/${_id}`,req,null,(err,resp)=>{
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
	api.delete(`/{db}/local-connectors/${_id}`,req,(err,resp)=>{
		if(!err){
			res.redirect(`/settings/local-connectors?sid=${req.query.sid}&mid=${req.query.mid}`)
			
		}else{
			
			//data['message']=err.message;
			callback(err,data);
		}
	});
}