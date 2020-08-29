module.exports = function(req,res,callback){
	var data={
		eIntegrators:staticValues.eIntegrators,
		localConnectorList:[],
		fileTypes:staticValues.xsltFileTypes,
		form:{
			eIntegrator:'',
			name:'',
			invoice:{
				url:'',
				firmNo:0,
				username:'',
				password:'',
				prefixOutbox:'FAT',
				prefixInbox:'AFT',
				postboxAlias:'defaultpk',
				senderboxAlias:'defaultpk',
				localConnector:{
					import:{
						localConnector:''
					},
					export:{
						localConnector:''
					}
				},
				xslt:[{ data: '', type: '', fileName: '' }]
			},
			despatch:{
				url:'',
				firmNo:0,
				username:'',
				password:'',
				prefixOutbox:'IRS',
				prefixInbox:'AIR',
				prefixReceiptAdviceOutbox: 'TES',
            	prefixReceiptAdviceInbox: 'TES',
				postboxAlias:'defaultpk',
				senderboxAlias:'defaultpk',
				localConnector:{
					import:{
						localConnector:''
					},
					export:{
						localConnector:''
					}
				},
				xslt:[{ data: '', type: '', fileName: '' }]
			},
			order:{
				url:'',
				firmNo:0,
				username:'',
				password:'',
				prefixOutbox:'SIP',
				prefixInbox:'ASP',
				postboxAlias:'defaultpk',
				senderboxAlias:'defaultpk',
				localConnector:{
					import:{
						localConnector:''
					},
					export:{
						localConnector:''
					}
				},
				xslt:[{ data: '', type: '', fileName: '' }]
			},
			document:{
				url:'',
				firmNo:0,
				username:'',
				password:'',
				prefixOutbox:'BEL',
				prefixInbox:'GBE',
				postboxAlias:'defaultpk',
				senderboxAlias:'defaultpk',
				localConnector:{
					import:{
						localConnector:''
					},
					export:{
						localConnector:''
					}
				},
				xslt:[{ data: '', type: '', fileName: '' }]
			},
			ledger:{
				url:'',
				firmNo:0,
				username:'',
				password:'',
				localConnector:{
					import:{
						localConnector:''
					},
					export:{
						localConnector:''
					}
				}
			},
			isDefault:false,
			passive:false,
			party:clone(dbType.partyType)
		},
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
		
		default:
			data.filter=getFilter(data.filter,req,res)
			if(req.method!='POST') 
				getList(req,res,data,callback)
		break;
	}
	
}

var editorFileTypes=['text/plain', 'application/json','text/javascript','text/html','application/xml'];

function getList(req,res,data,callback){
	api.get(`/{db}/integrators`,req,data.filter,(err,resp)=>{
		if(!err){
			data=mrutil.setGridData(data,resp);
		}
		callback(null,data);
	});
}

function initLookUpLists(req,res,data,cb){
	data.localConnectorList=[];
	api.get(`/{db}/local-connectors`,req,{passive:false},(err,resp)=>{
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
			
			api.post(`/{db}/integrators`,req,data.form,(err,resp)=>{
				if(!err){
					res.redirect(`/settings/integrators?sid=${req.query.sid}&mid=${req.query.mid}`)
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

			api.put(`/{db}/integrators/${_id}`,req,data.form,(err,resp)=>{
				if(!err){
					res.redirect(`/settings/integrators?sid=${req.query.sid}&mid=${req.query.mid}`)
					return;
				}else{
					data['message']=err.message;
					callback(null,data);
				}
			});
		}else{
			api.get(`/{db}/integrators/${_id}`,req,null,(err,resp)=>{
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
	api.delete(`/{db}/integrators/${_id}`,req,(err,resp)=>{
		if(!err){
			res.redirect(`/settings/integrators?sid=${req.query.sid}&mid=${req.query.mid}`)
		}else{
			data['message']=err.message;
			callback(null,data);
		}
	});
}