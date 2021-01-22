module.exports = function(req,res,callback){
	var data={
		connectionTypes:staticValues.localConnectorConnectionTypes,
		fileTypes:staticValues.localConnectorFileTypes,
		form:{
			name:'',
			importerType:'',
			importFileExtensions:'*.*',
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

	switch(req.params.func || ''){
		case 'code':
		code(req,res,data,callback)
		break
		default:
		code(req,res,data,callback)
		break
	}
	
}

var editorFileTypes=['text/plain', 'application/json','text/javascript','text/html']

function load(req,res,data,callback){

	if(req.query.newFile!=undefined){
		data.form.fileId=req.query.newFile==true?undefined:req.query.fileId
		data.newFile=req.query.newFile==true?true:false
	}else{
		data.form.fileId=req.query.fileId
		data.newFile=false
	}
	
	

	api.get(`/{db}/file-importers/${req.params.id}`,req,{fileId:data.form.fileId},(err,resp)=>{
		if(!err){
			data.form=Object.assign(data.form,resp.data)
			eventLog('startFile=',data.form.startFile)
			data.form.files.forEach((f)=>{
				eventLog('isStart:',f.isStart)
				staticValues.localConnectorFileTypes.forEach((fType)=>{
					if(f.extension==fType.value){
						f['icon']=fType.icon
						return
					}
				})

				if(data.form.fileId==f._id){
					data.form.fileDataBase64=(editorFileTypes.indexOf(f.type)<0?f.data:'')
					data.form.fileData=(editorFileTypes.indexOf(f.type)>-1?f.data:'')
					data.form.fileSize=f.size
					data.form.fileName=f.name
					data.form.fileExtension=f.extension
					data.form.fileFullName=f.name + (f.extension!=''?'.' + f.extension:'')
					data.form.fileType=f.type

					staticValues.localConnectorFileTypes.forEach((e)=>{
						if(e.value==f.extension){
							data.form.fileIcon=e.icon
						}
					})
				}
			})

			if(req.query.newFile){
				data.newFile=true
			}
			callback(null,data)
		}else{
			data['message']=err.message
			callback(null,data)
		}
	})

}

function code(req,res,data,callback){
	var _id=req.params.id || ''
	if(req.method=='POST' || req.method=='PUT'){
		if(req.body['btnConnectorTest']!=undefined){
			data.activeTab=0
			test(req,res,data,callback)
		}else if(req.body['btnRun']!=undefined){
			data.activeTab=2
			runCode(req,res,data,callback)
		}else if(req.body['btnSaveFile']!=undefined){
			var fileInfo={
				_id:(req.body.fileId || '')==''?undefined:req.body.fileId,
				name:(req.body.fileName || ''),
				type:(req.body.fileType || ''),
				extension:(req.body.fileExtension || ''),
				data:req.body.fileDataBase64!=''?req.body.fileDataBase64:req.body.fileData
			}
			
			
			api.post(`/{db}/file-importers/${_id}/file`,req,fileInfo,(err,resp)=>{
				if(!err){
					res.redirect(`/settings/file-importers/code/${_id}?sid=${req.query.sid}&mid=${req.query.mid}`)
					//load(req,res,data,callback)
				}else{
					if(req.method=='POST' || req.method=='PUT'){
						data.form=Object.assign(data.form,req.body)
					}
					data['message']=err.message
					load(req,res,data,callback)
				}
			})
		}else{
			load(req,res,data,callback)
		}
	}else{
		

		if(req.query.deleteFile=='true' && req.query.fileId!=undefined){
			
			api.delete(`/{db}/file-importers/${_id}/file?fileId=${req.query.fileId}`,req,(err,resp)=>{
				if(!err){
					res.redirect(`/settings/file-importers/code/${_id}?sid=${req.query.sid}&mid=${req.query.mid}`)
					//load(req,res,data,callback)
				}else{
					
					data['message']=err.message
					load(req,res,data,callback)
				}
			})
		}else if(req.query.setStart=='true' && req.query.fileId!=undefined){
			api.put(`/{db}/file-importers/${_id}/setStart?fileId=${req.query.fileId}`,req,{},(err,resp)=>{
				if(!err){
					res.redirect(`/settings/file-importers/code/${_id}?sid=${req.query.sid}&mid=${req.query.mid}`)
					//load(req,res,data,callback)
				}else{
					
					data['message']=err.message
					load(req,res,data,callback)
				}
			})
		} else{
			load(req,res,data,callback)
		}
		
	}
}

function test(req,res,data,callback){
	var _id=req.params.id || ''
	if(req.method=='POST' || req.method=='PUT'){
		data.form=Object.assign(data.form,req.body)
		
		load(req,res,data,(err,data)=>{
			if(!err){
				api.post(`/{db}/file-importers/test`,req,data.form,(err,resp)=>{
					if(!err){
						data['testResult']=resp
						callback(null,data)
					}else{
						data['message']=err.message
						callback(null,data)
					}
				})
			}else{
				data['message']=err.message
				callback(null,data)
			}
		})

	}
}

function runCode(req,res,data,callback){
	var _id=req.params.id || ''
	if(req.method=='POST' || req.method=='PUT'){
		data.form=Object.assign(data.form,req.body)
		api.post(`/{db}/file-importers/${_id}/run`,req,data.form,(err,resp)=>{
			if(!err){
				data.form['resultConsole']=JSON.stringify(resp,null,2)
				load(req,res,data,callback)
			}else{
				
				data.form['resultConsole']='Error:' + err.code + ' - ' + err.message
				load(req,res,data,callback)
			}
		})
	}else{
		data.form['resultConsole']='..'
		load(req,res,data,callback)
	}
}