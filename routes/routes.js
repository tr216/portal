var fs = require('fs');

global.pages = {};


module.exports = function(app){
	
	var DIR = path_module.join(__dirname, '../pages');


	loadPages(DIR);

	app.all("/*", function(req, res, next) {

		res.header("Access-Control-Allow-Origin", "*");
		res.header('Access-Control-Allow-Credentials', 'true');
		res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization,   Content-Type, Content-Length, X-Requested-With , x-access-token, token");
		res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
		return next();
	});


	app.all('/', function(req, res) {
		if(req.query.sid){
			res.redirect('/general/dashboard?db=' + req.query.db + '&sid=' + req.query.sid);
		}else{
			res.redirect('/general/login');
		}
		
	});
	
 	app.all('/passport', function(req, res) {
 		var data={
 			databases:[],
 			sid:(req.query.sid || '')
 		}
		api.get('/mydbdefines',req,null,(err,resp)=>{
	 		if(!err){
	 			data['databases']=resp.data;
	 		}
	 		res.render('_common/activedb', data);
	 	});
		
	});



	app.all('/logout', function(req, res) {
	   res.redirect('/general/login');
	});

	app.all('/api/:func', function(req, res) {
		localApi(req,res,false);
	});
	app.all('/api/:func/:param1', function(req, res) {
		localApi(req,res,false);
	});

	app.all('/api/:func/:param1/:param2', function(req, res) {
		localApi(req,res,false);
	});

	app.all('/api/:func/:param1/:param2/:param3', function(req, res) {
		localApi(req,res,false);
	});

	app.all('/dbapi/:func', function(req, res) {

		localApi(req,res,true);
	});
	app.all('/dbapi/:func/:param1', function(req, res) {
		localApi(req,res,true);
	});

	app.all('/dbapi/:func/:param1/:param2', function(req, res) {
		localApi(req,res,true);
	});

	app.all('/dbapi/:func/:param1/:param2/:param3', function(req, res) {
		localApi(req,res,true);
	});

	
	app.all('/:module/:page', userInfo, function(req, res) {
		if(pages[req.params.module]==undefined){
			errorPage(req,res,null);
		}else if (pages[req.params.module][req.params.page] == undefined) {
			errorPage(req,res,null);
		} else {
			pages[req.params.module][req.params.page].code(req, res, (err,data)=>{
				if(!data) data={};
				data=setGeneralParams(req,data);

				if(req.params.isSysUser){
					data['leftMenu']=sysmenu;
				}else{
					data['leftMenu']=menu;
				}
				

				if(!err){
					res.render(pages[req.params.module][req.params.page].view['index'], data,(err,html)=>{
						if(!err){
							res.status(200).send(applyLanguage(req,html));
						}else{
							errorPage(req,res,err);
						}
					});
				}else{
					errorPage(req,res,err);
				}
			});
		}
	});

	app.all('/:module/:page/:func', userInfo,  function(req, res) {
		if(pages[req.params.module]==undefined){
			errorPage(req,res,null);
		}else if (pages[req.params.module][req.params.page] == undefined) {
			errorPage(req,res,null);
		} else {
			pages[req.params.module][req.params.page].code(req, res, (err,data,view)=>{
				if(!data) data={};
				data=setGeneralParams(req,data);
				
				switch(req.params.func){
					case 'addnew':
						data['funcTitle']='Yeni Ekle';
						break;
					case 'edit':
						data['funcTitle']='Düzenle';
						break;
					case 'view':
						data['funcTitle']='İncele';
						break;
					default:
						data['funcTitle']=req.params.func;
						break;
				}
				if(!data.title) data['title']=getMenuText(req,'/' + req.params.page) + ' - ' + data['funcTitle'];

				if(req.params.isSysUser){
					data['leftMenu']=sysmenu;
				}else{
					data['leftMenu']=menu;
				}

				if(!err){
					
					if(view){
						res.render(view, data);
					}else{
						if(pages[req.params.module][req.params.page].view[req.params.func]){
							res.render(pages[req.params.module][req.params.page].view[req.params.func], data,(err,html)=>{
								if(!err){
									res.status(200).send(applyLanguage(req,html));
								}else{
									errorPage(req,res,err);
								}
							});
						}else{
							res.render(pages[req.params.module][req.params.page].view['index'], data,(err,html)=>{
								if(!err){
									res.status(200).send(applyLanguage(req,html));
								}else{
									errorPage(req,res,err);
								}
							});
						}
						
					}
					
				}else{
					errorPage(req,res,err);
				}
			});
		}
	});
	
	app.all('/:module/:page/:func/:id', userInfo, function(req, res) {
		if(pages[req.params.module]==undefined){
			errorPage(req,res,null);
		}else if (pages[req.params.module][req.params.page] == undefined) {
			errorPage(req,res,null);
		} else {
			pages[req.params.module][req.params.page].code(req, res, (err,data,view)=>{
				if(!data) data={};
				data=setGeneralParams(req,data);
				
				switch(req.params.func){
					case 'addnew':
						data['funcTitle']='Yeni Ekle';
						break;
					case 'edit':
						data['funcTitle']='Düzenle';
						break;
					case 'view':
						data['funcTitle']='İncele';
						break;
					default:
						data['funcTitle']=req.params.func;
						break;
				}
				if(!data.title) data['title']=getMenuText(req,'/' + req.params.page) + ' - ' + data['funcTitle'];

				if(req.params.isSysUser){
					data['leftMenu']=sysmenu;
				}else{
					data['leftMenu']=menu;
				}

				if(!err){
					if(view){
						res.render(view, data);
					}else{
						if(pages[req.params.module][req.params.page].view[req.params.func]){
							res.render(pages[req.params.module][req.params.page].view[req.params.func], data,(err,html)=>{
								if(!err){
									res.status(200).send(applyLanguage(req,html));
								}else{
									errorPage(req,res,err);
								}
							});
						}else{
							res.render(pages[req.params.module][req.params.page].view['index'], data,(err,html)=>{
								if(!err){
									res.status(200).send(applyLanguage(req,html));
								}else{
									errorPage(req,res,err);
								}
							});
						}
					}
				}else{
					errorPage(req,res,err);
				}
			});
		}
	});
}


function applyLanguage(req,html){
	return html.replaceAll('{{','').replaceAll('}}','');
}

function setGeneralParams(req,data){
	var referer=req.headers.referer ;
	var current = req.protocol + '://' + req.get('host') + req.originalUrl + '?';
	var current2=req.originalUrl + '?'
	var filter = '';
	var filterObj = {};

	for(let k in req.query){
		current +=encodeURIComponent(k) + '=' + encodeURIComponent(req.query[k]) + '&';
		current2 +=encodeURIComponent(k) + '=' + encodeURIComponent(req.query[k]) + '&';
		if(k!='page' && k!='db' && k!='sid'){
			filter +=encodeURIComponent(k) + '=' +  encodeURIComponent(req.query[k]) + '&';
			if(k!='pageSize'){
				filterObj[k]=req.query[k];
			}else{
				data['pageSize']=req.query[k];
			}
		}
	}
	if(current.substr(-1)=='&'){
		current=current.substr(0,current.length-1);
	}
	if(filter.substr(-1)=='&'){
		filter=filter.substr(0,filter.length-1);
	}
	
	data['currentUrl']=current;
	if(referer!=current){
		data['setGeneralParams']=referer;
	}
	data['filterString']=filter;
	data['filterObjects']=filterObj;
	data['isSysUser']=req.params.isSysUser || false;
	data['isMember']=req.params.isMember || true;
	data['isSysUser']=req.params.isSysUser || false;
	data['role']=req.params.role || 'user';
	data['username']=req.params.username || '';
	data['sid']=req.query.sid;
	data['func']=req.params.func;
	data['message']=data['message'] || '';
	data['db']=req.query.db || '';
	data['apiUrl']=config.api.url;
	if(req.params.id && req.params.func && req.params.page && req.params.module){

		data['urlPath']='/' + req.params.module + '/' + req.params.page + '/' + req.params.func + '/' + req.params.id;

	}else if(req.params.func && req.params.page && req.params.module ){

		data['urlPath']='/' + req.params.module + '/' + req.params.page + '/' + req.params.func;

	}else if(req.params.page && req.params.module){

		data['urlPath']='/' + req.params.module + '/' + req.params.page;

	}else{
		
		data['urlPath']='/';
	}
		
	data['page']=1;
	if(req.query.pageSize!=undefined) data['pageSize']=req.query.pageSize;
	
	if(req.query.page!=undefined) data['page']=req.query.page;
	if(data.pageSize==undefined) data['pageSize']=config.pagination.pageSize;
	if(data.pageCount==undefined) data['pageCount']=1;
	if(data.recordCount==undefined) data['recordCount']=0;

	data['icon']=getMenuIcon(req,current2)
	data['pageTitle']=getMenuText(req,current2);
	data['pagePath']='/' + req.params.module + '/' + req.params.page;
				
	data['title']=data['pageTitle'];
	data['funcTitle']='';
	

	return data;
}

var userInfo = function (req, res, next) {
	req.params.isSysUser=false;
	req.params.isMember=true;
	req.params.role='user';
	req.params.username='';
	if(req.query.sid){
		db.sessions.findOne({_id:req.query.sid},(err,doc)=>{
			if(!err){
				if(doc!=null){
					req.params.username=doc.username;
					req.params.role=doc.role;
					req.params.isSysUser=doc.isSysUser;
					req.params.isMember=doc.isMember;
					return next();
				}else{
					errorPage(req,res,{code:'503',message:'Yetkisiz giris'});
					//res.redirect('/error?code=403&message=Authentication Failed&sid=' + req.query.sid);
				}
			}else{
				//res.redirect('/error?code=403&message=Authentication Failed&sid=' + req.query.sid);
				errorPage(req,res,{code:err.name,message:err.message});
			}
		});
	}else{
		return next();
	}
}

function errorPage(req,res,err){
	var data={};
	data['title']='Hata';
	data['err']=err || {code:404,message:'Sayfa bulunamadi'};
	data=setGeneralParams(req,data);
	data['leftMenu']=[];
	res.render('general/error/error', data);
}

function loadPages(folder) {
	var modules=fs.readdirSync(folder);
	
	for(var m=0;m<modules.length;m++){
		if(fs.statSync(path_module.join(folder,modules[m])).isDirectory() && modules[m][0]!='_'){
			var pageFolders=fs.readdirSync(path_module.join(folder,modules[m]));
			
			pages[modules[m]]={}
			for (var i = 0; i < pageFolders.length; i++) {
				var pageDir = path_module.join(folder,modules[m], pageFolders[i]);
				if(fs.statSync(pageDir).isDirectory() && pageFolders[i][0]!='_'){
					
					var pageFiles=fs.readdirSync(pageDir);

					if(pageFiles.findIndex((x)=>{return x==pageFolders[i]+'.js'})>-1){
						var requireFileName=path_module.join(pageDir, pageFolders[i] + '.js');
						pages[modules[m]][pageFolders[i]]={};

						pages[modules[m]][pageFolders[i]]['code']=require(requireFileName);
						if(pageFiles.findIndex((x)=>{return x==pageFolders[i]+'.ejs'})>-1){
							pages[modules[m]][pageFolders[i]]['view']=[];
							pages[modules[m]][pageFolders[i]]['view']['index']=path_module.join(modules[m], pageFolders[i], pageFolders[i]);
							var funcP= loadFunctionPages(pageDir,modules[m],pageFolders[i]);
							for(var k in funcP){
								pages[modules[m]][pageFolders[i]]['view'][k]=funcP[k];
								
							}
						}
						
					}
				}
			}
		}
	}
}

function loadFunctionPages(path,module,pageName){
	var funcPageFiles=fs.readdirSync(path);
	var funcPages={};
	for(var i=0;i<funcPageFiles.length;i++){
		var s='';
		if(funcPageFiles[i].substr(0,pageName.length)==pageName && funcPageFiles[i].length>(pageName+'.ejs').length){
			s=funcPageFiles[i].substr(pageName.length,funcPageFiles[i].length-(pageName+'').length);
			if(s.substr(s.length-4)=='.ejs'){
				if(s[0]=='-' && s.length>1){
					s=s.substr(1,s.length-5);
					funcPages[s]=path_module.join(module,pageName,funcPageFiles[i]);
				}
			}
		}
	}

	
	
	return funcPages;
}

function loadFunctionSystemPages(path,pageName){
	var funcPageFiles=fs.readdirSync(path);
	var funcPages={};
	for(var i=0;i<funcPageFiles.length;i++){
		var s='';
		if(funcPageFiles[i].substr(0,pageName.length)==pageName && funcPageFiles[i].length>(pageName+'.ejs').length){
			s=funcPageFiles[i].substr(pageName.length,funcPageFiles[i].length-(pageName+'').length);
			if(s.substr(s.length-4)=='.ejs'){
				if(s[0]=='-' && s.length>1){
					s=s.substr(1,s.length-5);
					funcPages[s]=path_module.join('system',pageName,funcPageFiles[i]);
				}
			}
		}
	}

	
	return funcPages;
}

function getMenuIcon(req,urlPath){

	var icon=getMenuItem(req, urlPath).icon ;
	
	return icon;

}

function getMenuText(req, urlPath){

	var text=getMenuItem(req,urlPath).text;
	
	return text;

}

function getMenuItem(req, urlPath){

	var menuItem={text:'',icon:''};
	var m0=[];
	if((req.params.isSysUser || false)){
		m0=sysmenu;
	}else{
		m0=menu;
	}
	console.log('urlPath:',urlPath);
	m0.forEach((m1)=>{
		
		if(m1.path){
			if(m1.path==urlPath.substr(0,m1.path.length)){
				menuItem.text=m1.text;
				menuItem.icon=m1.icon;
				return;
			}
		}
		if(m1.nodes){
			if(m1.nodes.length>0){
				m1.nodes.forEach((m2)=>{
					if(m2.path){
						if(m2.path==urlPath.substr(0,m2.path.length)){
							menuItem.text=m2.text;
							menuItem.icon=m2.icon;
							return;
						}
					}
					if(m2.nodes){
						if(m2.nodes.length>0){
							m2.nodes.forEach((m3)=>{
								if(m3.path==urlPath.substr(0,m3.path.length)){
									menuItem.text=m3.text;
									menuItem.icon=m3.icon;
									return;
								}
								if(m3.nodes){
									if(m3.nodes.length>0){
										m3.nodes.forEach((m4)=>{
											if(m4.path==urlPath.substr(0,m4.path.length)){
												menuItem.text=m4.text;
												menuItem.icon=m4.icon;
												return;
											}
										});
									}
								}
							});
						}
					}
				});
			}
		}
	});
	return menuItem;

}

function localApi(req,res,dbApi){
	var dburl='';
	if(dbApi){
		if(req.query.db) dburl='/' + req.query.db + '';
	}

	var enpoint='';
	if(req.params.func){
		enpoint = '/' + req.params.func;
		if(req.params.param1){
			enpoint =enpoint + '/' + req.params.param1;
			if(req.params.param2){
				enpoint =enpoint + '/' + req.params.param2;
				if(req.params.param3){
					enpoint =enpoint + '/' + req.params.param3;
					
				}
			}
		}
	}
	
	switch(req.method){
		
		case 'POST':
			api.post(dburl + enpoint,req,req.body,(err,resp)=>{
				res.status(200).json(resp);
			});
		break;

		case 'PUT':
			api.put(dburl + enpoint,req,req.body,(err,resp)=>{
				res.status(200).json(resp);
			});
		break;

		case 'DELETE':
			api.delete(dburl + enpoint,req,(err,resp)=>{
				res.status(200).json(resp);
			});
		break;

		default: //default GET
			api.get(dburl + enpoint,req,req.query,(err,resp)=>{
				res.status(200).json(resp);
			});
			
			
		break;
	}
}
