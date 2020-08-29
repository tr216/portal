var request=require('request')

exports.get=(endpoint,req, params, callback)=>{
	sessionId2Token(req,(err,sessionDoc)=>{
		if(!err){
			var url=`${config.api.url}${endpoint.replace('{db}',sessionDoc.dbId)}`
			var headers = {
			    'token':sessionDoc.token
			}
			
			if(params){
				if(params.sid!=undefined){
					params.sid=undefined;
					delete params.sid;
				}
				if(params.mid!=undefined){
					params.mid=undefined;
					delete params.mid;
				}
			}
			
			
			var options = {
			    url: url,
			    method: 'GET',
			    headers: headers,
			    rejectUnauthorized: false,
			    qs: params?params:{}
			}

			request(options, function (error, response, body) {
					if(error){
						return callback({code: 'API_ERROR_GET', message: error.message})
					}
			    	try{
		    			var resp=JSON.parse(body)
		    			if(resp.success){
		    				callback(null,resp)
		    			}else{
		    				callback((resp.error || body))
		    			}
			    		
			    	}catch(e){
			    		if(!e.hasOwnProperty('message')){
			    			callback({code: 'API_ERROR_GET', message: e.message})
			    		}else{
			    			callback({code: 'API_ERROR_GET', message: e})
			    		}
			    		
			    	}
			    
			})
		}else{
			callback(err)
		}
	})
}

exports.getFile=(endpoint,req, params, callback)=>{
	sessionId2Token(req,(err,sessionDoc)=>{
		if(!err){
			var url=`${config.api.url}${endpoint.replace('{db}',sessionDoc.dbId)}`
			
			var headers = {
			    'token':sessionDoc.token
			}

			if(params){
				if(params.sid!=undefined){
					params.sid=undefined
					delete params.sid
				}
				if(params.mid!=undefined){
					params.mid=undefined
					delete params.mid
				}
			}
			
			var options = {
			    url: url,
			    method: 'GET',
			    headers: headers,
			    rejectUnauthorized: false,
			    qs: params?params:{}
			}

			request(options, function (error, response, body) {
					if(error){
						return callback({code: 'API_ERROR_GET', message: error.message})
					}
			    	return callback(null,body)
			    
			})
		}else{
			callback(err)
		}
	})
}

var http = require('http')

exports.downloadFile=(endpoint,req, res, params, callback)=>{
	sessionId2Token(req,(err,sessionDoc)=>{
		if(!err){
			var url=`${config.api.url}${endpoint.replace('{db}',sessionDoc.dbId)}?token=${sessionDoc.token}`
			if(params){
				for(var key in params){
					url = url + '&' + encodeURIComponent2(key) + '=' + encodeURIComponent2(params[key])
				}
			}
			var tmpFile=path.join(os.tmpdir(),`${uuid.v4()}.portal`)
			
			const file = fs.createWriteStream(tmpFile)

		    const request = http.get(url, (response) => {
		        // check if response is success
		        if (response.statusCode !== 200) {
		            return callback({code:'DOWNLOAD_ERROR',message:'Response status was ' + response.statusCode})
		        }

		        response.pipe(file)
		    })
			file.on('finish', () => {

				file.close()
				res.setHeader('Content-Type','application/xml; charset=UTF-8')
				res.sendFile(tmpFile,{},(err)=>{
					fs.unlinkSync(tmpFile)
				})

			});

		    request.on('error', (err) => {
		        fs.unlinkSync(tmpFile)

		        return callback(err)
		    });

		    file.on('error', (err) => { 
		        fs.unlinkSync(tmpFile)
		        return callback(err)
		    });
		}else{
			callback(err)
		}
	})
}

exports.post=(endpoint,req, jsonData, callback)=>{
	sessionId2Token(req,(err,sessionDoc)=>{
		if(!err){
			var url=`${config.api.url}${endpoint.replace('{db}',sessionDoc.dbId)}`

			var headers = {
			    'Content-Type':'application/json; charset=utf-8',
			    'token':sessionDoc.token
			}
			
			var options = {
			    url: url,
			    method: 'POST',
			    headers: headers,
			    rejectUnauthorized: false,
			    json:jsonData
			}

			request(options, function (error, response, body) {
			    if (!error && response.statusCode==200) {
			    	if(typeof body=='string'){
			    		try{
							var resp=JSON.parse(body)
							if(resp.success){
								callback(null,resp)
							}else{
								callback(resp.error)
							}
				    		
				    	}catch(e){
				    		if(!e.hasOwnProperty('message')){
				    			callback({code: 'API_ERROR_DELETE', message: e.message})
				    		}else{
				    			callback({code: 'API_ERROR_DELETE', message: e})
				    		}
				    		
				    	}
			    	}else{
			    		callback(null,body)
			    	}
			        
			    }else{
			    	callback(error?error:body.error,body)
			    }
			})
		}else{
			callback(err)
		}
	})

}

exports.put=(endpoint,req, jsonData, callback)=>{
	sessionId2Token(req,(err,sessionDoc)=>{
		if(!err){
			var url=`${config.api.url}${endpoint.replace('{db}',sessionDoc.dbId)}`

			var headers = {
			    'Content-Type':'application/json; charset=utf-8',
			    'token':sessionDoc.token
			}

			var options = {
			    url: url,
			    method: 'PUT',
			    headers: headers,
			    rejectUnauthorized: false,
			    json:jsonData
			}
			request(options, function (error, response, body) {
			    if (!error && response.statusCode==200) {
			        callback(null,body)
			    }else{
			    	callback(error?error:body.error,body)
			    }
			})
		}else{
			callback(err)
		}
	})
}

exports.delete=(endpoint,req, callback)=>{
	sessionId2Token(req,(err,sessionDoc)=>{
		if(!err){
			var url=`${config.api.url}${endpoint.replace('{db}',sessionDoc.dbId)}`

			var headers = {
			    'Content-Type':'application/json; charset=utf-8',
			    'token':sessionDoc.token
			}
			
			var options = {
			    url: url,
			    method: 'DELETE',
			    rejectUnauthorized: false,
			    headers: headers
			}

			request(options, function (error, response, body) {

				if (!error && response.statusCode==200) {
			        try{
			        	var resp={}
			        	if(typeof body=='string'){
			        		resp=JSON.parse(body)
			        	}else{
			        		resp=body
			        	}
						if(resp.success){
							callback(null,resp)
						}else{
							callback(resp.error)
						}
			    		
			    	}catch(e){
			    		if(!e.hasOwnProperty('message')){
			    			callback({code: 'API_ERROR_DELETE', message: e.message})
			    		}else{
			    			callback({code: 'API_ERROR_DELETE', message: e})
			    		}
			    	}
			    }else{
			    	if(error!=undefined){
			    		if(typeof error=='string')
			    			error=JSON.parse(error)
			    		callback(error)
			    	}else{
			    		if(typeof body=='string')
			    			body=JSON.parse(body)
			    		callback(body.error)
			    	}
			    	
			    }
		    	
			})
		}else{
			callback(err)
		}
	})
}

function sessionId2Token(req,cb){
	if(req.query.sid==undefined) return cb(null,'')
	db.sessions.findOne({_id:req.query.sid},(err,doc)=>{
		if(!err){
			if(doc!=null){
				var userAgent=req.headers['user-agent'] || ''
				var IP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || ''

				// if(userAgent!=doc.userAgent) return cb({code:'WRONT_AGENT',message:'Yanlis userAgent'})
				
				// if(IP!=doc.ip) return cb({code:'WRONT_IP',message:'Yanlis IP'})
				doc.lastOnline=new Date()
				doc.mId=req.query.mid || ''
				doc.save((err,doc2)=>{
					cb(null,doc2)
				})
				
			}else{
				cb({code:'RECORD_NOT_FOUND',message:'sessionId bulunamadi!'})
			}
		}else{
			cb({code:err.name,message:err.message})
		}
	})
}
