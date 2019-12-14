
var request=require('request');

exports.get=(endpoint,req, params, callback)=>{
	sessionId2Token(req,(err,token)=>{
		if(!err){
			var url=config.api.url + endpoint;
			
			var headers = {
			    'Content-Type':'application/json; charset=utf-8',
			    'token':token
			}

			if(req.params.sid){
				req.params.sid=undefined;
				delete req.params.sid;
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
						return callback({code: 'API_ERROR_GET', message: error.message});
					}
			    	try{

		    			var resp=JSON.parse(body);
		    			if(resp.success){
		    				callback(null,resp);
		    			}else{
		    				callback(resp.error);
		    			}
			    		
			    	}catch(e){
			    		if(!e.hasOwnProperty('message')){
			    			callback({code: 'API_ERROR_GET', message: e.message});
			    		}else{
			    			callback({code: 'API_ERROR_GET', message: e});
			    		}
			    		
			    	}
			    
			});
		}else{
			callback(err);
		}
	});
}

exports.post=(endpoint,req, jsonData, callback)=>{
	sessionId2Token(req,(err,token)=>{
		if(!err){
			var url=config.api.url  + endpoint;
			
			var headers = {
			    'Content-Type':'application/json; charset=utf-8',
			    'token':token
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
							var resp=JSON.parse(body);
							if(resp.success){
								callback(null,resp);
							}else{
								callback(resp.error);
							}
				    		
				    	}catch(e){
				    		if(!e.hasOwnProperty('message')){
				    			callback({code: 'API_ERROR_DELETE', message: e.message});
				    		}else{
				    			callback({code: 'API_ERROR_DELETE', message: e});
				    		}
				    		
				    	}
			    	}else{
			    		callback(null,body);
			    	}
			        
			    }else{
			    	callback(error?error:body.error,body);
			    }
			});
		}else{
			callback(err);
		}
	});

}

exports.put=(endpoint,req, jsonData, callback)=>{
	sessionId2Token(req,(err,token)=>{
		if(!err){
			var url=config.api.url  + endpoint;
			
			var headers = {
			    'Content-Type':'application/json; charset=utf-8',
			    'token':token
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
			        callback(null,body);
			    }else{
			    	callback(error?error:body.error,body);
			    }
			});
		}else{
			callback(err);
		}
	});
}

exports.delete=(endpoint,req, callback)=>{
	sessionId2Token(req,(err,token)=>{
		if(!err){
			var url=config.api.url  + endpoint;
			
			var headers = {
			    'Content-Type':'application/json; charset=utf-8',
			    'token':token
			}

			var options = {
			    url: url,
			    method: 'DELETE',
			    rejectUnauthorized: false,
			    headers: headers
			}

			request(options, function (error, response, body) {
			    if(error){
					return callback({code: 'API_ERROR_DELETE', message: error.message});
				}
		    	try{

					var resp=JSON.parse(body);
					if(resp.success){
						callback(null,resp);
					}else{
						callback(resp.error);
					}
		    		
		    	}catch(e){
		    		if(!e.hasOwnProperty('message')){
		    			callback({code: 'API_ERROR_DELETE', message: e.message});
		    		}else{
		    			callback({code: 'API_ERROR_DELETE', message: e});
		    		}
		    		
		    	}
			});
		}else{
			callback(err);
		}
	});
}

function sessionId2Token(req,cb){
	if(req.query.sid==undefined) return cb(null,'');
	db.sessions.findOne({_id:req.query.sid},(err,doc)=>{
		if(!err){
			if(doc!=null){
				var userAgent=req.headers['user-agent'] || '';
				var IP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || '';

				// if(userAgent!=doc.userAgent) return cb({code:'WRONT_AGENT',message:'Yanlis userAgent'});
				
				if(IP!=doc.ip) return cb({code:'WRONT_IP',message:'Yanlis IP'});
				doc.lastOnline=new Date();
				doc.save((err,doc2)=>{
					cb(null,doc.token);
				});
				
			}else{
				cb({code:'RECORD_NOT_FOUND',message:'sessionId bulunamadi!'});
			}
		}else{
			cb({code:err.name,message:err.message});
		}
	});
}

