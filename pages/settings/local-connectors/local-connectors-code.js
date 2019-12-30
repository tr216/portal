module.exports = function(req,res,callback){
	var data={
		connectionTypes:staticValues.localConnectorConnectionTypes,
		fileTypes:staticValues.localConnectorFileTypes,
		form:{
			name:'',
			connectorId:'',
			connectorPass:'',
			connectionType:'',
			connection:{
				server: '',
            	port:0,
            	database:'',
            	username:'',
            	password: '',
            	file: ''
			},
			files:[],
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
		return callback({code:'ACTIVE DB ERROR',message:'Aktif secili bir veri ambari yok.'});
	}
	switch(req.params.func || ''){
		case 'code':
			code(req,res,data,callback);
		break;
		default:
			code(req,res,data,callback);
		
	}
	
}

var editorFileTypes=['text/plain', 'application/json','text/javascript','text/html'];

function load(req,res,data,callback){

	if(req.query.newFile!=undefined){
		data.form.fileId=req.query.newFile==true?undefined:req.query.fileId;
		data.newFile=req.query.newFile==true?true:false;
	}else{
		data.form.fileId=req.query.fileId;
		data.newFile=false;
	}
	
	

	api.get('/' + req.query.db + '/local-connectors/' + req.params.id ,req,{fileId:data.form.fileId},(err,resp)=>{
		if(!err){
			data.form=Object.assign(data.form,resp.data);
			console.log('startFile=',data.form.startFile);
			data.form.files.forEach((f)=>{
				console.log('isStart:',f.isStart);
				staticValues.localConnectorFileTypes.forEach((fType)=>{
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

					staticValues.localConnectorFileTypes.forEach((e)=>{
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

function code(req,res,data,callback){
	var _id=req.params.id || '';
	if(req.method=='POST' || req.method=='PUT'){
		if(req.body['btnConnectorTest']!=undefined){
			data.activeTab=0;
			test(req,res,data,callback);
		}else if(req.body['btnRun']!=undefined){
			data.activeTab=2;
			runCode(req,res,data,callback);
		}else if(req.body['btnSaveFile']!=undefined){
			var fileInfo={
				_id:(req.body.fileId || '')==''?undefined:req.body.fileId,
				name:(req.body.fileName || ''),
				type:(req.body.fileType || ''),
				extension:(req.body.fileExtension || ''),
				data:req.body.fileDataBase64!=''?req.body.fileDataBase64:req.body.fileData
			}
			
			console.log('fileInfo.type:', fileInfo.type);
			api.post('/' + req.query.db + '/local-connectors/' + _id + '/file',req,fileInfo,(err,resp)=>{
				if(!err){
					res.redirect('/settings/local-connectors/code/' + _id + '?db=' + req.query.db +'&sid=' + req.query.sid);
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
			
			api.delete('/' + req.query.db + '/local-connectors/' + _id + '/file?fileId=' + req.query.fileId,req,(err,resp)=>{
				if(!err){
					res.redirect('/settings/local-connectors/code/' + _id + '?db=' + req.query.db +'&sid=' + req.query.sid);
					//load(req,res,data,callback);
				}else{
					
					data['message']=err.message;
					load(req,res,data,callback);
				}
			});
		}else if(req.query.setStart=='true' && req.query.fileId!=undefined){
			api.put('/' + req.query.db + '/local-connectors/' + _id + '/setStart?fileId=' + req.query.fileId,req,{},(err,resp)=>{
				if(!err){
					res.redirect('/settings/local-connectors/code/' + _id + '?db=' + req.query.db +'&sid=' + req.query.sid);
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

function test(req,res,data,callback){
	var _id=req.params.id || '';
	if(req.method=='POST' || req.method=='PUT'){
		data.form=Object.assign(data.form,req.body);
		
		load(req,res,data,(err,data)=>{
			if(!err){
				api.post('/' + req.query.db + '/local-connectors/test',req,data.form,(err,resp)=>{
					if(!err){
						data['testResult']=resp;
						callback(null,data);
					}else{
						data['message']=err.message;
						callback(null,data);
					}
				});
			}else{
				data['message']=err.message;
				callback(null,data);
			}
		});

	}
}

function runCode(req,res,data,callback){
	var _id=req.params.id || '';
	if(req.method=='POST' || req.method=='PUT'){
		data.form=Object.assign(data.form,req.body);
		api.post('/' + req.query.db + '/local-connectors/' + _id + '/run',req,data.form,(err,resp)=>{
			if(!err){
				data.form['resultConsole']=JSON.stringify(resp,null,2);
				load(req,res,data,callback);
			}else{
				
				data.form['resultConsole']='Error:' + err.code + ' - ' + err.message;
				load(req,res,data,callback);
			}
		});
	}else{
		data.form['resultConsole']='..';
		load(req,res,data,callback);
	}
}