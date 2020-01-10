var template=require(path_module.join(rootDir,'_assets','js','einvoice-document-template.js'));

module.exports = function(req,res,callback){
	
	var data={
		eIntegratorList:[],
		eInvoiceStatusTypes:Array.from(staticValues.eInvoiceStatusTypes),
		currencyList:Array.from(staticValues.currencyList),
		eInvoiceProfileIdList:Array.from(staticValues.eInvoiceProfileIdList),
		eInvoiceTypeCodeList:Array.from(staticValues.eInvoiceTypeCodeList),
		form:JSON.parse(JSON.stringify(template.invoiceTemplate.invoice)),
		html:'Goruntulenemedi',
		list:[],
		filter:{}
	}
	
	
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
		case 'delete':
		
		deleteItem(req,res,data,callback);
		break;
		default:
			getList(req,res,data,callback);
		break;
	}
	
}


function getList(req,res,data,callback){
	data.eInvoiceStatusTypes.unshift({text:'-Tümü-',value:''});
	data.currencyList.unshift({text:'-Tümü-',value:''});
	data.eInvoiceProfileIdList.unshift({text:'-Tümü-',value:''});
	data.eInvoiceTypeCodeList.unshift({text:'-Tümü-',value:''});
	if(req.method=='POST'){
		var filter={};
		filter=Object.assign(filter,req.query);
		filter=Object.assign(filter,req.body);
		filter['btnFilter']=undefined;
		delete filter['btnFilter'];
		filter['page']=1;
		res.redirect('/e-invoice/outbox?' + mrutil.encodeUrl(filter));
	}else{
		data.filter=Object.assign(data.filter,req.query);
		data.filter.db=undefined;
		delete data.filter.db;
		data.filter.sid=undefined;
		delete data.filter.sid;
		initLookUpLists(req,res,data,(err,data)=>{
			data.eIntegratorList.unshift({_id:'',name:'-Tümü-'})
			api.get('/' + req.query.db + '/e-invoice/outboxInvoiceList',req,data.filter,(err,resp)=>{
				if(!err){
					var docs=[]
					resp.data.docs.forEach((e)=>{
						docs.push(eInvoiceHelper.makeSimpleInvoiceList(e));
					});
					resp.data.docs=docs;
					data=mrutil.setGridData(data,resp);
				}
				callback(null,data);
			});
		})
	}
}



function initLookUpLists(req,res,data,cb){
	data.eIntegratorList=[];
	
	api.get('/' + req.query.db + '/e-integrators',req,{passive:false},(err,resp)=>{
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
		cb(null,data);
	});
}

function addnew(req,res,data,callback){
	if(req.method=='POST' || req.method=='PUT'){
		data.form=Object.assign(data.form,req.body);
		data.form['accountingCustomerParty']={party:(data.form.party || {})}

		api.post('/' + req.query.db + '/e-invoice/invoice',req,data.form,(err,resp)=>{
			if(!err){
				res.redirect('/e-invoice/outbox?db=' + req.query.db +'&sid=' + req.query.sid);
				return;
			}else{
				data['message']=err.message;
				callback(null,data);
			}
		});
	}else{
		initLookUpLists(req,res,data,(err,data)=>{
			callback(null,data);
		});
	}
}

function view(req,res,data,callback){
	var _id=req.params.id || '';
	api.getFile('/' + req.query.db + '/e-invoice/invoiceView/' + _id,req,null,(err,resp)=>{
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
	api.downloadFile('/' + req.query.db + '/e-invoice/invoicePdf/' + _id,req,res,null,(err,resp)=>{
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
	if(req.method=='POST' || req.method=='PUT'){
		data.form=Object.assign(data.form,req.body);
		data.form['accountingCustomerParty']={party:(data.form.party || {})}

		api.put('/' + req.query.db + '/e-invoice/invoice/' + _id,req,data.form,(err,resp)=>{
			if(!err){
				res.redirect('/e-invoice/outbox?db=' + req.query.db +'&sid=' + req.query.sid);
				return;
			}else{
				data['message']=err.message;
				callback(null,data);
			}
		});
	}else{
		initLookUpLists(req,res,data,(err,data)=>{
			api.get('/' + req.query.db + '/e-invoice/invoice/' + _id,req,null,(err,resp)=>{
				if(!err){
					data.form=Object.assign(data.form,resp.data);
					callback(null,data);
				}else{
					data['message']=err.message;
					callback(null,data);
				}
			});
		})
		
	}
}

function deleteItem(req,res,data,callback){
	var _id=req.params.id || '';
	api.delete('/' + req.query.db + '/e-invoice/invoice/' + _id,req,(err,resp)=>{
		if(!err){
			res.redirect('/e-invoice/outbox?db=' + req.query.db +'&sid=' + req.query.sid);
		}else{
			data['message']=err.message;
			callback(null,data);
		}
	});
}