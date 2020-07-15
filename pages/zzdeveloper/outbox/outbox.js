module.exports = function(req,res,callback){
	var data={
		eIntegratorList:[],
		locationList:[],
		printDesignList:[],
		docStatusTypes:Array.from(staticValues.despatchStatusTypes),
		currencyList:Array.from(staticValues.currencyList),
		docProfileIdList:Array.from(staticValues.despatchProfileIdList),
		docTypeCodeList:Array.from(staticValues.despatchAdviceTypeCodeList),
		form:Object.assign({},dbType.despatchAdviceType),
		html:'Goruntulenemedi',
		xmlData:'',
		xslt:'',
		list:[],
		filter:{}
	}
	data.form.ioType=0
	
	if(!req.query.db){
		return callback({code:'ACTIVE DB ERROR',message:'Aktif secili bir veri ambari yok.'})
	}

	switch((req.params.func || '')){
		case 'addnew':
			addnew(req,res,data,callback)
		break
		case 'edit':
			edit(req,res,data,callback)
		break
		case 'view':
			view(req,res,data,callback)
		break
		case 'xslt':
			xslt(req,res,data,callback)
		break
		case 'pdf':
			pdf(req,res,data,callback)
		break
		case 'logs':
			logs(req,res,data,callback)
		break
		default:
			data.filter=getFilter(data.filter,req,res)
			if(req.method!='POST') 
				getList(req,res,data,callback)
		break
	}

}

function xslt(req,res,data,callback){

	var _id=req.params.id || ''
	if(_id.trim()==''){
		data['message']='ID bos olamaz'
		callback(null,data)
		return
	}
	// console.log(`xslt:calisiyor`)

	// var xslt=fs.readFileSync(path.join(rootDir,'assets/deneme.xslt'),'utf8')
	// var xmlData=fs.readFileSync(path.join(rootDir,'assets/testdata.xml'),'utf8')

	// data.xslt=xslt // encodeURIComponent(xslt)
	// data.xmlData=xmlData // encodeURIComponent(xmlData)
	callback(null,data)


	// api.get('/' + req.query.db + '/despatch/despatch/' + _id,req,null,(err,resp)=>{
	// 	if(!err){
	// 		data.form=Object.assign(data.form,resp.data)
	// 		callback(null,data)
	// 	}else{
	// 		data['message']=err.message
	// 		callback(null,data)
	// 	}
	// })
}

function logs(req,res,data,callback){
	var _id=req.params.id || ''
	if(_id.trim()==''){
		data['message']='id bos olamaz'
		callback(null,data)
		return
	}
	api.get('/' + req.query.db + '/despatch/despatch-logs/' + _id,req,null,(err,resp)=>{
		if(!err){
			data.form=Object.assign(data.form,resp.data)
			callback(null,data)
		}else{
			data['message']=err.message
			callback(null,data)
		}
	})
}


function getList(req,res,data,callback){
	data.docStatusTypes.unshift({text:'-Tümü-',value:''})
	data.currencyList.unshift({text:'-Tümü-',value:''})
	data.docProfileIdList.unshift({text:'-Tümü-',value:''})
	data.docTypeCodeList.unshift({text:'-Tümü-',value:''})
	
	initLookUpLists(req,res,data,(err,data)=>{
		data.eIntegratorList.unshift({_id:'',name:'-Tümü-'})
		api.get('/' + req.query.db + '/despatch/outboxDespatchList',req,data.filter,(err,resp)=>{
			if(!err){
				var docs=[]
				resp.data.docs.forEach((e)=>{
					docs.push(docFormHelper.makeSimpleDespatchList(e))
					
				})
				resp.data.docs=docs
				data=mrutil.setGridData(data,resp)
			}
			callback(null,data)
		})
	})
}

function initLookUpLists(req,res,data,cb){
	data.eIntegratorList=[]
	data.locationList=[]

	api.get('/' + req.query.db + '/integrators',req,{passive:false},(err,resp)=>{
		if(!err){
			data.eIntegratorList=resp.data.docs
			if(data.eIntegratorList.length>0){
				data.eIntegratorList.forEach((e)=>{
					if(e.isDefault){
						data.form.eIntegrator=e._id
					}
				})
			}
		}
		api.get('/' + req.query.db + '/locations',req,{passive:false},(err,resp)=>{
			if(!err){
				data.locationList=resp.data.docs
			}
			cb(null,data)
		})
	})
}

function addnew(req,res,data,callback){
	initLookUpLists(req,res,data,(err,data)=>{
		if(req.method=='POST'){
			data.form=Object.assign(data.form,req.body)
			data.form['buyerCustomerParty']={party:(data.form.party || {})}
			data.form.ioType=0
			api.post('/' + req.query.db + '/despatch/despatch',req,data.form,(err,resp)=>{
				if(!err){
					res.redirect('/despatch/outbox?db=' + req.query.db +'&sid=' + req.query.sid)
					return
				}else{
					data['message']=err.message
					callback(null,data)
				}
			})
		}else{
			if(data.eIntegratorList.length==1){
				data.form.eIntegrator=data.eIntegratorList[0]
			}
			callback(null,data)
		}
	})
}

function view(req,res,data,callback){
	var _id=req.params.id || ''
	api.get('/' + req.query.db + '/despatch/view/' + _id,req,null,(err,resp)=>{
		if(!err){
			data['html']=resp.data
			callback(null,data)
		}else{
			data['html']=err.message
			callback(null,data)
		}
	})
}
function pdf(req,res,data,callback){
	var _id=req.params.id || ''
	api.downloadFile('/' + req.query.db + '/despatch/despatchPdf/' + _id,req,res,null,(err,resp)=>{
		return
	})
}

function edit(req,res,data,callback){
	var _id=req.params.id || ''
	if(_id.trim()==''){
		data['message']='ID bos olamaz'
		callback(null,data)
		return
	}
	initLookUpLists(req,res,data,(err,data)=>{
		if(req.method=='POST' || req.method=='PUT'){
			data.form=Object.assign(data.form,req.body)
			
			console.log('data.form.location:',data.form.location)
			data.form['buyerCustomerParty']={party:(data.form.party || {})}
			data.form.ioType=0
			api.put('/' + req.query.db + '/despatch/despatch/' + _id,req,data.form,(err,resp)=>{
				if(!err){
					res.redirect('/despatch/outbox?db=' + req.query.db +'&sid=' + req.query.sid)
					return
				}else{
					data['message']=err.message
					callback(null,data)
				}
			})
		}else{
			api.get('/' + req.query.db + '/despatch/despatch/' + _id,req,null,(err,resp)=>{
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
	api.delete('/' + req.query.db + '/despatch/despatch/' + _id,req,(err,resp)=>{
		if(!err){
			res.redirect('/despatch/outbox?db=' + req.query.db +'&sid=' + req.query.sid)
		}else{
			data['message']=err.message
			callback(null,data)
		}
	})
}