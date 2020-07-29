module.exports = function(req,res,callback){
	var data={
		localConnectors:[],
		form:{
			name:'',
			files:[],
			passive:false
		},
		filter:{
		},
		list:[]
	}

	if(!req.query.db){
		return callback({code:'ACTIVE DB ERROR',message:'Aktif secili bir veri ambari yok.'})
	}
	switch(req.params.func || ''){
		case 'addnew':
		
		addnew(req,res,data,callback)
		break
		case 'edit':
		edit(req,res,data,callback)
		break
		case 'view':
		edit(req,res,data,callback)
		break
		case 'delete':
		
		deleteItem(req,res,data,callback)
		break
		default:
		data.filter=getFilter(data.filter,req,res)
		if(req.method!='POST') 
			getList(req,res,data,callback)
		break
	}
	
}

function getList(req,res,data,callback){
	initLookUpLists(req,res,data,(err,data)=>{
		api.get(`/${req.query.db}/programs`,req,data.filter,(err,resp)=>{
			if(!err){
				data=mrutil.setGridData(data,resp)
			}else{
				errorLog('hata:',err)
			}

			callback(null,data)
		})
	})
}


function initLookUpLists(req,res,data,cb){
	data.localConnectors=[]
	
	api.get(`/${req.query.db}/local-connectors`,req,{passive:false},(err,resp)=>{
		if(!err){
			data.localConnectors=resp.data.docs
		}
		cb(null,data)
	})
}


function addnew(req,res,data,callback){
	initLookUpLists(req,res,data,(err,data)=>{
		if(req.method=='POST'){
			data.form=Object.assign(data.form,req.body)
			api.post(`/${req.query.db}/programs`,req,data.form,(err,resp)=>{
				if(!err){
					res.redirect(`/settings/programs?mid=${req.query.mid}&db=${req.query.db}&sid=${req.query.sid}`)
					return
				}else{
					data['message']=err.message
					callback(null,data)
				}
			})
		}else{
			callback(null,data)
		}
	})
}


function edit(req,res,data,callback){
	var _id=req.params.id || ''
	initLookUpLists(req,res,data,(err,data)=>{
		if(req.method=='POST' || req.method=='PUT'){
			data.form=Object.assign(data.form,req.body)
			api.put(`/${req.query.db}/programs/${_id}`,req,data.form,(err,resp)=>{
				if(!err){
					res.redirect(`/settings/programs?mid=${req.query.mid}&db=${req.query.db}&sid=${req.query.sid}`)

				}else{
					data['message']=err.message
					callback(null,data)
				}
			})
		}else{
			api.get(`/${req.query.db}/programs/${_id}`,req,null,(err,resp)=>{
				if(!err){
					data.form=Object.assign(data.form,resp.data)
					callback(null,data)
				}else{
					data['message']=err.message
					callback(null,data)
				}
			})
		}
	})
}


function deleteItem(req,res,data,callback){
	var _id=req.params.id || ''
	api.delete(`/${req.query.db}/programs/${_id}`,req,(err,resp)=>{
		if(!err){
			res.redirect(`/settings/programs?mid=${req.query.mid}&db=${req.query.db}&sid=${req.query.sid}`)
			
		}else{
			data['message']=err.message
			callback(null,data)
		}
	})
}