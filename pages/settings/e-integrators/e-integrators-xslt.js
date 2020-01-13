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
			invoiceXslt:'',
			invoiceXsltFiles:[],
			fileId:'',
			fileName:'',
			fileExtension:'',
			fileFullName:'',
			fileType:'text/plain',
			fileIcon:'file',
			fileSize:0,
			fileDataBase64:'',
			fileData:null,
			passive:false
		},
		message:'',
		activeTab:1
	}

	if(!req.query.db){
		return callback({xslt:'ACTIVE DB ERROR',message:'Aktif secili bir veri ambari yok.'});
	}
	switch(req.params.func || ''){
		case 'xslt':
			xslt(req,res,data,callback);
		break;
		default:
			xslt(req,res,data,callback);
		
	}
	
}

var editorFileTypes=['text/plain', 'application/json','text/javascript','text/html','application/xml'];


function load(req,res,data,callback){

	if(req.query.newFile!=undefined){
		data.form.fileId=req.query.newFile==true?undefined:req.query.fileId;
		data.newFile=req.query.newFile==true?true:false;
	}else{
		data.form.fileId=req.query.fileId;
		data.newFile=false;
	}
	

	api.get('/' + req.query.db + '/e-integrators/' + req.params.id ,req,{fileId:data.form.fileId},(err,resp)=>{
		if(!err){
			data.form=Object.assign(data.form,resp.data);
			eventLog('invoiceXslt=',data.form.invoiceXslt);
			data.form.invoiceXsltFiles.forEach((f)=>{
				eventLog('isDefault:',f.isDefault);
				staticValues.eInvoiceXsltFileTypes.forEach((fType)=>{
					if(f.extension==fType.value){
						f['icon']=fType.icon;
						return;
					}
				});
				if(data.form.fileId==f._id){
					data.form.fileDataBase64=(editorFileTypes.indexOf(f.type)<0?f.data:'');
					data.form.fileData=(editorFileTypes.indexOf(f.type)>-1?f.data:'');
					data.form.fileSize=f.size;
					data.form.fileName=f.name;
					data.form.fileExtension=f.extension;
					data.form.fileFullName=f.name + (f.extension!=''?'.' + f.extension:'');
					data.form.fileType=f.type;

					staticValues.eInvoiceXsltFileTypes.forEach((e)=>{
						if(e.value==f.extension){
							data.form.fileIcon=e.icon;
						}
					});
					
				}
			});

			if(req.query.newFile){
				data.newFile=true;
			}
			callback(null,data);
		}else{
			data['message']=err.message;
			callback(null,data);
		}
	});

}

function xslt(req,res,data,callback){
	var _id=req.params.id || '';
	if(req.method=='POST' || req.method=='PUT'){
		if(req.body['btnSaveFile']!=undefined){
			var fileInfo={
				_id:(req.body.fileId || '')==''?undefined:req.body.fileId,
				name:(req.body.fileName || ''),
				type:(req.body.fileType || ''),
				extension:(req.body.fileExtension || ''),
				data:req.body.fileDataBase64!=''?req.body.fileDataBase64:req.body.fileData
			}
			
			eventLog('fileInfo.type:', fileInfo.type);
			api.post('/' + req.query.db + '/e-integrators/' + _id + '/file',req,fileInfo,(err,resp)=>{
				if(!err){
					res.redirect('/settings/e-integrators/xslt/' + _id + '?db=' + req.query.db +'&sid=' + req.query.sid);
					//load(req,res,data,callback);
				}else{
					if(req.method=='POST' || req.method=='PUT'){
						data.form=Object.assign(data.form,req.body);
					}
					data['message']=err.message;
					load(req,res,data,callback);
				}
			});
		}else{
			load(req,res,data,callback);
		}
	}else{
		

		if(req.query.deleteFile=='true' && req.query.fileId!=undefined){
			
			api.delete('/' + req.query.db + '/e-integrators/' + _id + '/file?fileId=' + req.query.fileId,req,(err,resp)=>{
				if(!err){
					res.redirect('/settings/e-integrators/xslt/' + _id + '?db=' + req.query.db +'&sid=' + req.query.sid);
					//load(req,res,data,callback);
				}else{
					
					data['message']=err.message;
					load(req,res,data,callback);
				}
			});
		}else if(req.query.setDefaultInvoiceXslt=='true' && req.query.fileId!=undefined){
			api.put('/' + req.query.db + '/e-integrators/' + _id + '/setDefaultInvoiceXslt?fileId=' + req.query.fileId,req,{},(err,resp)=>{
				if(!err){
					res.redirect('/settings/e-integrators/xslt/' + _id + '?db=' + req.query.db +'&sid=' + req.query.sid);
					//load(req,res,data,callback);
				}else{
					
					data['message']=err.message;
					load(req,res,data,callback);
				}
			});
		} else{
			load(req,res,data,callback);
		}
		
	}
}
