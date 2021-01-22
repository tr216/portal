module.exports = function(req,res,callback){
	var data={
		eIntegratorList:[],
		locationList:[],
		docStatusTypes:Array.from(staticValues.despatchStatusTypes),
		receiptStatusTypes:Array.from(staticValues.receiptStatusTypes),
		currencyList:Array.from(staticValues.currencyList),
		docProfileIdList:Array.from(staticValues.despatchProfileIdList),
		docTypeCodeList:Array.from(staticValues.despatchAdviceTypeCodeList),
		form:Object.assign({},dbType.despatchAdviceType),
		html:'Goruntulenemedi',
		list:[],
		filter:{}
	}

	data.form.ioType=1;



	switch(req.params.func || ''){
		case 'addnew':
			addnew(req,res,data,callback);
		break;
		case 'edit':
			edit(req,res,data,callback);
		break;
		case 'view':
			view(req,res,data,callback);
		break;
		case 'pdf':
			pdf(req,res,data,callback);
		break;
		case 'errors':
			showErrors(req,res,data,callback);
		break;
		default:
			data.filter=getFilter(data.filter,req,res)
			if(req.method!='POST') 
				getList(req,res,data,callback)
		break;
	}
}

function showErrors(req,res,data,callback){
	var _id=req.params.id || '';
	if(_id.trim()==''){
		data['message']='id bos olamaz';
		callback(null,data);
		return;
	}
	api.get(`/{db}/despatch/errors/${_id}`,req,null,(err,resp)=>{
		if(!err){
			data.form=Object.assign(data.form,resp.data);
			callback(null,data);
		}else{
			data['message']=err.message;
			callback(null,data);
		}
	});
}


function getList(req,res,data,callback){
	data.docStatusTypes.unshift({title:'-Tümü-',value:''});
	data.receiptStatusTypes.unshift({title:'-Tümü-',value:''});
	data.currencyList.unshift({title:'-Tümü-',value:''});
	data.docProfileIdList.unshift({title:'-Tümü-',value:''});
	data.docTypeCodeList.unshift({title:'-Tümü-',value:''});
	
	initLookUpLists(req,res,data,(err,data)=>{
		data.eIntegratorList.unshift({_id:'',name:'-Tümü-'})
		api.get(`/{db}/despatch/inbox`,req,data.filter,(err,resp)=>{
			if(!err){
				var docs=[];
				resp.data.docs.forEach((e)=>{
					docs.push(docFormHelper.makeSimpleDespatchList(e));
				});
				resp.data.docs=docs;

				data=mrutil.setGridData(data,resp);
				// console.log(`data.list:`,data.list)
			}
			callback(null,data);
		});
	})
}



function initLookUpLists(req,res,data,cb){
	data.eIntegratorList=[];
	data.locationList=[];

	api.get(`/{db}/integrators`,req,{passive:false},(err,resp)=>{
		if(!err){
			data.eIntegratorList=resp.data.docs;
			if(data.eIntegratorList.length>0){
				data.eIntegratorList.forEach((e)=>{
					if(e.isDefault){
						data.form.eIntegrator=e._id;
					}
				})
			}
		}
		api.get(`/{db}/locations`,req,{passive:false},(err,resp)=>{
			if(!err){
				data.locationList=resp.data.docs;
			}
			cb(null,data);
		});
	});
}

function addnew(req,res,data,callback){
	initLookUpLists(req,res,data,(err,data)=>{
		if(req.method=='POST'){
			data.form=Object.assign(data.form,req.body);
			data.form['sellerSupplierParty']={party:(data.form.party || {})}
			data.form.ioType=1;
			api.post(`/{db}/despatch/despatch`,req,data.form,(err,resp)=>{
				if(!err){
					res.redirect(`/despatch/inbox?sid=${req.query.sid}&mid=${req.query.mid}`)
					return;
				}else{
					data['message']=err.message;
					callback(null,data);
				}
			});
		}else{
			console.log('data.eIntegratorList:',data.eIntegratorList);
			if(data.eIntegratorList.length==1){
				data.form.eIntegrator=data.eIntegratorList[0];
			}
			callback(null,data);
		}
	});
}

function view(req,res,data,callback){
	var _id=req.params.id || '';
	api.get(`/{db}/despatch/view/${_id}`,req,null,(err,resp)=>{
		if(!err){
			data['html']=resp.data;
			callback(null,data);
		}else{
			data['html']=err.message;
			callback(null,data);
		}
	});
}

function pdf(req,res,data,callback){
	var _id=req.params.id || '';
	api.downloadFile(`/{db}/despatch/despatchPdf/${_id}`,req,res,null,(err,resp)=>{
		return;
		
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
			
			data.form['buyerCustomerParty']={party:(data.form.party || {})}
			data.form.ioType=1;
			api.put(`/{db}/despatch/${_id}`,req,data.form,(err,resp)=>{
				if(!err){
					res.redirect(`/despatch/inbox?sid=${req.query.sid}&mid=${req.query.mid}`)
					return;
				}else{
					data['message']=err.message;
					callback(null,data);
				}
			});
		}else{
			
			api.get(`/{db}/despatch/${_id}`,req,null,(err,resp)=>{
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
	api.delete(`/{db}/despatch/despatch/${_id}`,req,(err,resp)=>{
		if(!err){
			res.redirect(`/despatch/inbox?sid=${req.query.sid}&mid=${req.query.mid}`)
		}else{
			data['message']=err.message;
			callback(null,data);
		}
	});
}