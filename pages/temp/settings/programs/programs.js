module.exports = function(req,res,callback){
	var data={
		localConnectors:[],
		collectionList:[],
		form:{
			name:'',
			type: '',
			showButtonText:false,
			collections:[{
				name:'',
				filter:'',
				updateExpression:'',
				updateErrorExpression:''
			}],
			files:[],
			fileImporter:{
				accept:'audio/*,video/*,image/*,*.csv,*.txt'
			},
			fileExporter:{
				fileName:'export.txt'
			},
			emailSender:{
				host: '',
	      port: 587,
	      secure: false,
	      auth: {
	          user: 'user@domain.com',
	          pass: ''
	      },
	      from:'Mail Sender <user@domain.com>'
			},
			smsSender:{
				api: 'https://sms-service-company.com?user=+90&pass=1234',
				method: 'POST'
			},
			connector:{
				connectorId: '',
				connectorPass: '',
				connectionType:'mssql',
				connection:{
					server: 'localhost',
					port:1433,
					database:'',
					username: '',
					password: ''
				}
			},
			crontab:'',	
			passive:false
		},
		filter:{
		},
		list:[]
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
		api.get(`/{db}/programs`,req,data.filter,(err,resp)=>{
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
	api.get(`/{db}/local-connectors`,req,{passive:false},(err,resp)=>{
		if(!err){
			data.localConnectors=resp.data.docs
		}
		api.get(`/{db}/collections`,req,{passive:false},(err,resp)=>{
			if(!err){
				data.collectionList=resp.data
			}
			cb(null,data)
		})
	})
	
}


function addnew(req,res,data,callback){
	initLookUpLists(req,res,data,(err,data)=>{
		if(req.method=='POST'){
			data.form=Object.assign(data.form,req.body)
			api.post(`/{db}/programs`,req,data.form,(err,resp)=>{
				if(!err){
					res.redirect(`/settings/programs?sid=${req.query.sid}&mid=${req.query.mid}`)
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
			data.form=Object.assign({}, data.form,req.body)
			api.put(`/{db}/programs/${_id}`,req,data.form,(err,resp)=>{
				if(!err){
					res.redirect(`/settings/programs?sid=${req.query.sid}&mid=${req.query.mid}`)

				}else{
					data['message']=err.message
					callback(null,data)
				}
			})
		}else{
			api.get(`/{db}/programs/${_id}`,req,null,(err,resp)=>{
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
	api.delete(`/{db}/programs/${_id}`,req,(err,resp)=>{
		if(!err){
			res.redirect(`/settings/programs?sid=${req.query.sid}&mid=${req.query.mid}`)
			
		}else{
			data['message']=err.message
			callback(null,data)
		}
	})
}