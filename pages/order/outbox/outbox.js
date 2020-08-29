module.exports = function(req,res,callback){
	var data={
		eIntegratorList:[],
		docStatusTypes:Array.from(staticValues.orderStatusTypes),
		currencyList:Array.from(staticValues.currencyList),
		docProfileIdList:Array.from(staticValues.orderProfileIdList),
		docTypeCodeList:Array.from(staticValues.orderTypeCodeList),
		form:Object.assign({},dbType.orderType),
		html:'Goruntulenemedi',
		list:[],
		filter:{}
	}
	data.form.ioType=0;

	switch((req.params.func || '')){
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
	api.get(`/{db}/order/errors/${_id}`,req,null,(err,resp)=>{
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
		api.get(`/{db}/order/outboxOrderList`,req,data.filter,(err,resp)=>{
			if(!err){
				var docs=[];
				resp.data.docs.forEach((e)=>{
					docs.push(docFormHelper.makeSimpleOrderList(e));
					
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
	
	api.get(`/{db}/integrators`,req,{passive:false},(err,resp)=>{
		if(!err){
			data.eIntegratorList=resp.data.docs;
			
		}
		cb(null,data);
	});
}

function addnew(req,res,data,callback){
	initLookUpLists(req,res,data,(err,data)=>{
		if(req.method=='POST'){
			data.form=Object.assign(data.form,req.body);
			data.form['buyerCustomerParty']={party:(data.form.party || {})}
			data.form.ioType=0;
			api.post(`/{db}/order/order`,req,data.form,(err,resp)=>{
				if(!err){
					res.redirect(`/order/outbox?sid=${req.query.sid}&mid=${req.query.mid}`)
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
	api.getFile(`/{db}/order/orderView/${_id}`,req,null,(err,resp)=>{
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
	api.downloadFile(`/{db}/order/orderPdf/${_id}`,req,res,null,(err,resp)=>{
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
			data.form.ioType=0;
			api.put(`/{db}/order/order/${_id}`,req,data.form,(err,resp)=>{
				if(!err){
					res.redirect(`/order/outbox?sid=${req.query.sid}&mid=${req.query.mid}`)
					return;
				}else{
					data['message']=err.message;
					callback(null,data);
				}
			});
		}else{
			api.get(`/{db}/order/order/${_id}`,req,null,(err,resp)=>{
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
	api.delete(`/{db}/order/order/${_id}`,req,(err,resp)=>{
		if(!err){
			res.redirect(`/order/outbox?sid=${req.query.sid}&mid=${req.query.mid}`)
		}else{
			data['message']=err.message;
			callback(null,data);
		}
	});
}