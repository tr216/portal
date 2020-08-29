module.exports = function(req,res,callback){
	var data={
		form:{
			name:'',
			importerType:'',
			importFileExtensions:'*.*',
			passive:false
		},
		message:'',
		list:[],
		filter:{}
	}

	switch(req.params.func || ''){
		case 'addnew':
		addnew(req,res,data,callback)
		break
		case 'edit':
		edit(req,res,data,callback)
		break
		case 'delete':
		deleteItem(req,res,data,callback)
		break
		case 'view':
		view(req,res,data,callback)
		break
		case 'code':
		require('./file-importers-code.js')(req,res,callback)
		break
		default:
		data.filter=getFilter(data.filter,req,res)
		if(req.method!='POST') 
			getList(req,res,data,callback)
		break
	}
	
}

function getList(req,res,data,callback){
	api.get(`/{db}/file-importers`,req,data.filter,(err,resp)=>{
		if(!err){
			data=mrutil.setGridData(data,resp)
		}
		callback(null,data)
	})
}

function addnew(req,res,data,callback){
	if(req.method=='POST'){
		data.form=Object.assign(data.form,req.body)
		if(req.body['btnConnectorTest']!=undefined){
			api.post(`/{db}/file-importers/test`,req,data.form,(err,resp)=>{
				data['testResult']=resp
				callback(null,data)
			})
		}else{
			api.post(`/{db}/file-importers`,req,data.form,(err,resp)=>{
				if(!err){
					res.redirect(`/settings/file-importers?sid=${req.query.sid}&importerType=${(req.query.importerType || '')}`)
				}else{
					data['message']=err.message
					callback(null,data)
				}
			})
		}
	}else{
		callback(null,data)
	}
}

function edit(req,res,data,callback){
	var _id=req.params.id || ''
	if(req.method=='POST' || req.method=='PUT'){
		data.form=Object.assign(data.form,req.body)
		if(req.body['btnConnectorTest']!=undefined){
			api.post(`/{db}/file-importers/test`,req,data.form,(err,resp)=>{
				data['testResult']=resp
				callback(null,data)
			})
		}else{
			api.put(`/{db}/file-importers/${_id}`,req,data.form,(err,resp)=>{
				if(!err){
					res.redirect(`/settings/file-importers?sid=${req.query.sid}&mid=${req.query.mid}&importerType=${(req.query.importerType || '')}`)

				}else{
					data['message']=err.message
					callback(null,data)
				}
			})
		}
		
		
	}else{
		api.get(`/{db}/file-importers/${_id}`,req,null,(err,resp)=>{
			if(!err){
				data.form=Object.assign(data.form,resp.data)
				callback(null,data)
			}else{
				data['message']=err.message
				callback(null,data)
			}
		})
	}
}

function view(req,res,data,callback){
	var _id=req.params.id || ''
	if(req.method=='POST' || req.method=='PUT'){
		data.form=Object.assign(data.form,req.body)
		if(req.body['btnConnectorTest']!=undefined){
			api.post(`/{db}/file-importers/test`,req,data.form,(err,resp)=>{
				data['testResult']=resp
				callback(null,data)
			})
		}else{
			api.get(`/{db}/file-importers/${_id}`,req,null,(err,resp)=>{
				if(!err){
					data.form=Object.assign(data.form,resp.data)
					callback(null,data)
				}else{
					data['message']=err.message
					callback(null,data)
				}
			})
		}
	}else{
		api.get(`/{db}/file-importers/${_id}`,req,null,(err,resp)=>{
			if(!err){
				data.form=Object.assign(data.form,resp.data)
				callback(null,data)
			}else{
				data['message']=err.message
				callback(null,data)
			}
		})
	}
}


function deleteItem(req,res,data,callback){
	var _id=req.params.id || ''
	api.delete(`/{db}/file-importers/${_id}`,req,(err,resp)=>{
		if(!err){
			res.redirect(`/settings/file-importers?sid=${req.query.sid}&mid=${req.query.mid}`)
			
		}else{
			
			//data['message']=err.message
			callback(err,data)
		}
	})
}