module.exports = function(req,res,callback){
	var data={
		eIntegrators:staticValues.eIntegrators,
		localConnectorList:[],
		fileTypes:staticValues.eInvoiceXsltFileTypes,
		form:{
			eIntegrator:'',
			name:'',
			firmNo:0,
			url:'',
			username:'',
			password:'',
			invoicePrefix:'AAA',
			dispatchPrefix:'AAA',
			postboxAlias:'default',
			senderboxAlias:'default',
			isDefault:false,
			localConnectorImportInvoice:{localConnector:''},
			localConnectorExportInvoice:{localConnector:''},
			localConnectorImportELedger:{localConnector:''},
			
			passive:false
		},
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
		case 'delete':
		
		deleteItem(req,res,data,callback);
		break;
		case 'xslt':
			require('./e-integrators-xslt.js')(req,res,callback);
		break;
		default:
			getList(req,res,data,callback);
		break;
	}
	
}

var editorFileTypes=['text/plain', 'application/json','text/javascript','text/html','application/xml'];

function getList(req,res,data,callback){
	if(req.method=='POST'){
		var filter={};
		
		for(let k in req.body){
			if(req.body[k] && k!='btnFilter'){
				filter[k]=req.body[k];
			}
		}

		res.redirect('/settings/e-integrators?db=' + req.query.db + '&' + mrutil.encodeUrl(filter) + '&sid=' + req.query.sid);
	}else{
		data.filter=Object.assign(data.filter,req.query);
		eventLog(data);
		data.filter.db=undefined;
		delete data.filter.db;
		data.filter.sid=undefined;
		delete data.filter.sid;

		api.get('/' + req.query.db + '/e-integrators',req,data.filter,(err,resp)=>{
			if(!err){
				data=mrutil.setGridData(data,resp);
			}
			callback(null,data);
		});
	}
}

function initLookUpLists(req,res,data,cb){
	data.localConnectorList=[];
	api.get('/' + req.query.db + '/local-connectors',req,{passive:false},(err,resp)=>{
		if(!err){
			data.localConnectorList.push({_id:'',name:''});
			resp.data.docs.forEach((e)=>{
				data.localConnectorList.push({_id:e._id,name:e.name + '[' + e.connectorId + ']'});
			});
			
		}
		cb(null,data);
	});
}

function addnew(req,res,data,callback){
	initLookUpLists(req,res,data,(err,data)=>{
		if(req.method=='POST'){
			data.form=Object.assign(data.form,req.body);
			eventLog('data.form:',data.form);
			api.post('/' + req.query.db + '/e-integrators',req,data.form,(err,resp)=>{
				if(!err){
					res.redirect('/settings/e-integrators?db=' + req.query.db +'&sid=' + req.query.sid);
					return;
				}else{
					data['message']=err.message;
					callback(null,data);
				}
			});
		}else{
			callback(null,data);
		}
	});
}


function edit(req,res,data,callback){
	var _id=req.params.id || '';
	initLookUpLists(req,res,data,(err,data)=>{
		if(req.method=='POST' || req.method=='PUT'){
			data.form=Object.assign(data.form,req.body);
			if(_id.trim()==''){
				data['message']='ID bos olamaz';
				callback(null,data);
				return;
			}

			api.put('/' + req.query.db + '/e-integrators/' + _id,req,data.form,(err,resp)=>{
				if(!err){
					res.redirect('/settings/e-integrators?db=' + req.query.db +'&sid=' + req.query.sid);
					return;
				}else{
					data['message']=err.message;
					callback(null,data);
				}
			});
		}else{
			api.get('/' + req.query.db + '/e-integrators/' + _id,req,null,(err,resp)=>{
				if(!err){
					data.form=Object.assign(data.form,resp.data);
					callback(null,data);
				}else{
					data['message']=err.message;
					callback(null,data);
				}
			});
		}
	});
}

function deleteItem(req,res,data,callback){
	var _id=req.params.id || '';
	api.delete('/' + req.query.db + '/e-integrators/' + _id,req,(err,resp)=>{
		if(!err){
			res.redirect('/settings/e-integrators?db=' + req.query.db +'&sid=' + req.query.sid);
		}else{
			data['message']=err.message;
			callback(null,data);
		}
	});
}