module.exports = function(req,res,callback){
	
	var data={
		eIntegratorList:[],
		locationList:[],
		docStatusTypes:Array.from(staticValues.eInvoiceStatusTypes),
		currencyList:Array.from(staticValues.currencyList),
		docProfileIdList:Array.from(staticValues.eInvoiceProfileIdList),
		docTypeCodeList:Array.from(staticValues.eInvoiceTypeCodeList),
		form:Object.assign({},dbType.invoiceType),
		html:'Goruntulenemedi',
		list:[],
		filter:{}
	}
	data.form.ioType=0;
	
	if(!req.query.db){
		return callback({code:'ACTIVE DB ERROR',message:'Aktif secili bir veri ambari yok.'});
	}
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
			data.filter=getFilter(data.filter,req);
			getList(req,res,data,callback);
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
	api.get('/' + req.query.db + '/invoice/errors/' + _id,req,null,(err,resp)=>{
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
	data.docStatusTypes.unshift({text:'-Tümü-',value:''});
	data.currencyList.unshift({text:'-Tümü-',value:''});
	data.docProfileIdList.unshift({text:'-Tümü-',value:''});
	data.docTypeCodeList.unshift({text:'-Tümü-',value:''});
	
	initLookUpLists(req,res,data,(err,data)=>{
		data.eIntegratorList.unshift({_id:'',name:'-Tümü-'})
		api.get('/' + req.query.db + '/invoice/outboxInvoiceList',req,data.filter,(err,resp)=>{
			if(!err){
				var docs=[]
				resp.data.docs.forEach((e)=>{
					docs.push(docFormHelper.makeSimpleInvoiceList(e));
				});
				resp.data.docs=docs;
				data=mrutil.setGridData(data,resp);
			}
			callback(null,data);
		});
	})
	
}



function initLookUpLists(req,res,data,cb){
	data.eIntegratorList=[];
	data.locationList=[];

	api.get('/' + req.query.db + '/integrators',req,{passive:false},(err,resp)=>{
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
		api.get('/' + req.query.db + '/locations',req,{passive:false},(err,resp)=>{
			if(!err){
				data.locationList=resp.data.docs;
			}
			cb(null,data);
		});
	});
}

function addnew(req,res,data,callback){
	initLookUpLists(req,res,data,(err,data)=>{
		if(req.method=='POST' || req.method=='PUT'){
			data.form=Object.assign(data.form,req.body);
			data.form['accountingCustomerParty']={party:(data.form.party || {})}
			data.form.ioType=0;
			api.post('/' + req.query.db + '/invoice/invoice',req,data.form,(err,resp)=>{
				if(!err){
					res.redirect('/invoice/outbox?db=' + req.query.db +'&sid=' + req.query.sid);
					return;
				}else{
					data['message']=err.message;
					callback(null,data);
				}
			});
		}else{
			if(data.eIntegratorList.length==1){
				data.form.eIntegrator=data.eIntegratorList[0];
			}
			callback(null,data);
			
		}
	});
}

function view(req,res,data,callback){
	var _id=req.params.id || '';
	api.getFile('/' + req.query.db + '/invoice/invoiceView/' + _id,req,null,(err,resp)=>{
		if(!err){
			data['html']=resp;
			callback(null,data);
		}else{
			data['html']=err.message;
			callback(null,data);
		}
	});
}

function pdf(req,res,data,callback){
	var _id=req.params.id || '';
	api.downloadFile('/' + req.query.db + '/invoice/invoicePdf/' + _id,req,res,null,(err,resp)=>{
		return;
		// if(!err){
		// 	callback(null,data);
		// }else{
		// 	data['message']=err.message || 'Hata';
		// 	callback(null,data);
		// }
	});
}

function edit(req,res,data,callback){
	var _id=req.params.id || '';
	if(_id.trim()==''){
		data['message']='id bos olamaz';
		callback(null,data);
		return;
	}
	initLookUpLists(req,res,data,(err,data)=>{
		if(req.method=='POST' || req.method=='PUT'){
			data.form=Object.assign(data.form,req.body);
			data.form['accountingCustomerParty']={party:(data.form.party || {})}
			data.form.ioType=0;
			api.put('/' + req.query.db + '/invoice/invoice/' + _id,req,data.form,(err,resp)=>{
				if(!err){
					res.redirect('/invoice/outbox?db=' + req.query.db +'&sid=' + req.query.sid);
					return;
				}else{
					data['message']=err.message;
					callback(null,data);
				}
			});
		}else{
			
			api.get('/' + req.query.db + '/invoice/invoice/' + _id,req,null,(err,resp)=>{
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
	api.delete('/' + req.query.db + '/invoice/invoice/' + _id,req,(err,resp)=>{
		if(!err){
			res.redirect('/invoice/outbox?db=' + req.query.db +'&sid=' + req.query.sid);
		}else{
			data['message']=err.message;
			callback(null,data);
		}
	});
}