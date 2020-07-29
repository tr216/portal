
global.pages = {}
global.mobilePages = {}


module.exports = function(app){
	

	loadPages(pages,'',path.join(__dirname, '../pages'))
	loadPages(mobilePages,'_mobile', path.join(__dirname, '../pages/_mobile'))

	app.all("/*", function(req, res, next) {

		res.header("Access-Control-Allow-Origin", "*")
		res.header('Access-Control-Allow-Credentials', 'true')
		res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization,   Content-Type, Content-Length, X-Requested-With , x-access-token, token")
		res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS")
		return next()
	})


	app.all('/', function(req, res) {
		if(req.query.sid){
			res.redirect(`/general/dashboard?db=${req.query.db}&sid=${req.query.sid}&mid=${req.query.mid}`)
		}else{
			res.redirect('/general/login')
		}
		
	})
	
 	app.all('/passport', function(req, res) {
 		var data={
 			databases:[],
 			sid:(req.query.sid || '')
 		}
		api.get('/mydbdefines',req,null,(err,resp)=>{
	 		if(!err){
	 			data['databases']=resp.data
	 		}
	 		res.render('_common/activedb', data)
	 	})
		
	})



	app.all('/logout', function(req, res) {
	   res.redirect('/general/login')
	})

	app.all('/api/:func', function(req, res) {
		localApi(req,res,false)
	})
	app.all('/api/:func/:param1', function(req, res) {
		localApi(req,res,false)
	})

	app.all('/api/:func/:param1/:param2', function(req, res) {
		localApi(req,res,false)
	})

	app.all('/api/:func/:param1/:param2/:param3', function(req, res) {
		localApi(req,res,false)
	})


	app.all('/dbapi/:func', function(req, res) {

		localApi(req,res,true)
	})
	app.all('/dbapi/:func/:param1', function(req, res) {
		localApi(req,res,true)
	})

	app.all('/dbapi/:func/:param1/:param2', function(req, res) {
		localApi(req,res,true)
	})

	app.all('/dbapi/:func/:param1/:param2/:param3', function(req, res) {
		localApi(req,res,true)
	})

	app.all('/downloadFile/:func', function(req, res) {
		apiDownload(req,res)
	})
	app.all('/downloadFile/:func/:param1', function(req, res) {
		apiDownload(req,res)
	})
	app.all('/downloadFile/:func/:param1/:param2', function(req, res) {
		apiDownload(req,res)
	})
	app.all('/downloadFile/:func/:param1/:param2/:param3', function(req, res) {
		apiDownload(req,res)
	})

	// -- start MOBILE PAGES ---
	app.all('/mobile', function(req, res) {
		if(req.query.sid){
			res.redirect(`/mobile/general/dashboard?db=${req.query.db}&sid=${req.query.sid}&mid=${req.query.mid}`)
		}else{
			res.redirect('/mobile/general/login')
		}
	})

	app.all('/mobile/passport', function(req, res) {
 		var data={
 			databases:[],
 			sid:(req.query.sid || '')
 		}
		api.get('/mydbdefines',req,null,(err,resp)=>{
	 		if(!err){
	 			data['databases']=resp.data
	 		}
	 		res.render('_mobile/_common/activedb', data)
	 	})
		
	})

	app.all('/mobile/:module/:page', userInfo, function(req, res) {
		mobilePageRander(req,res)
	})

	app.all('/mobile/:module/:page/:func', userInfo,  function(req, res) {
		mobilePageRander(req,res)
	})
	
	app.all('/mobile/:module/:page/:func/:id', userInfo, function(req, res) {
		mobilePageRander(req,res)
	})

	// -- end MOBILE PAGES ---


	app.all('/:module/:page', userInfo, function(req, res) {
		pageRander(req,res)
	})

	app.all('/:module/:page/:func', userInfo,  function(req, res) {
		pageRander(req,res)
	})
	
	app.all('/:module/:page/:func/:id', userInfo, function(req, res) {
		pageRander(req,res)
	})
}

function mobilePageRander(req,res){
	if(mobilePages[req.params.module]==undefined){
			errorPage(req,res,null)
		}else if (mobilePages[req.params.module][req.params.page] == undefined) {
			errorPage(req,res,null)
		} else {
			console.log(`req.params:`,req.params)
			mobilePages[req.params.module][req.params.page].code(req, res, (err,data,view)=>{
				if(!data)
					data={}
				data=setMobileParams(req,data)

				if(!err){
					if(view){
						res.render(view, data)
					}else{
						var funcName=req.params.func || 'index'
						if(mobilePages[req.params.module][req.params.page].view[funcName]){
							res.render(mobilePages[req.params.module][req.params.page].view[funcName], data,(err,html)=>{
								if(!err){
									res.status(200).send(applyLanguage(req,html))
								}else{
									errorPage(req,res,err)
								}
							})
						}else{
							errorPage(req,res,null)
						}
					}
				}else{
					errorPage(req,res,err)
				}
			})
		}
}

function setMobileParams(req,data){
	var referer=req.headers.referer 
	var current = req.protocol + '://' + req.get('host') + req.originalUrl + '?'
	var current2=req.originalUrl.split('?')[0]
	var filter = ''
	var filterObj = {}
	
	if(req.params.id){
		current2=current2.substr(0,current2.length-req.params.id.length-1)
	}
	if(req.params.func){
		current2=current2.substr(0,current2.length-req.params.func.length-1)
	}
	current2+='?'

	for(let k in req.query){
		current +=encodeURIComponent(k) + '=' + encodeURIComponent(req.query[k]) + '&'
		current2 +=encodeURIComponent(k) + '=' + encodeURIComponent(req.query[k]) + '&'
		if(k!='page' && k!='db' && k!='sid' && k!='mid'){
			filter +=encodeURIComponent(k) + '=' +  encodeURIComponent(req.query[k]) + '&'
			if(k!='pageSize'){
				filterObj[k]=req.query[k]
			}else{
				data['pageSize']=req.query[k]
			}
		}
	}


	if(current.substr(-1)=='&'){
		current=current.substr(0,current.length-1)
	}
	if(filter.substr(-1)=='&'){
		filter=filter.substr(0,filter.length-1)
	}
	
	data['currentUrl']=current
	if(referer!=current){
		data['setGeneralParams']=referer
	}
	data['filterString']=filter
	data['filterObjects']=filterObj
	data['isSysUser']=req.params.isSysUser || false
	data['isMember']=req.params.isMember || true
	data['isSysUser']=req.params.isSysUser || false
	data['role']=req.params.role || 'user'
	data['username']=req.params.username || ''
	data['sid']=req.query.sid
	data['func']=req.params.func
	data['message']=data['message'] || ''
	data['successMessage']=data['successMessage'] || ''
	data['db']=req.query.db || ''
	data['mid']=req.query.mid || ''
	data['apiUrl']=config.api.url

	
	
	data['leftMenu']=mobileMenu

	if(req.params.id && req.params.func && req.params.page && req.params.module){

		data['urlPath']='/mobile/' + req.params.module + '/' + req.params.page + '/' + req.params.func + '/' + req.params.id

	}else if(req.params.func && req.params.page && req.params.module ){

		data['urlPath']='/mobile/' + req.params.module + '/' + req.params.page + '/' + req.params.func

	}else if(req.params.page && req.params.module){

		data['urlPath']='/mobile/' + req.params.module + '/' + req.params.page

	}else{
		
		data['urlPath']='/mobile'
	}
		
	data['page']=1
	if(req.query.pageSize!=undefined)
		data['pageSize']=req.query.pageSize
	
	if(req.query.page!=undefined)
		data['page']=req.query.page
	if(data.pageSize==undefined)
		data['pageSize']=config.pagination.pageSize
	if(data.pageCount==undefined)
		data['pageCount']=1
	if(data.recordCount==undefined)
		data['recordCount']=0

	data['icon']=getMenuIcon(mobileMenu, req, current2)
	data['pageTitle']=getMenuText(mobileMenu, req, current2)
	data['breadCrumbs']=getBreadCrumbs(mobileMenu, req, current2)

	data['pagePath']='/mobile/' + req.params.module + '/' + req.params.page
				
	data['title']=data['pageTitle']
	data['funcTitle']=''
	if(req.params.func){
		switch(req.params.func){
			case 'addnew':
				data['funcTitle']='Yeni Ekle'
				break
			case 'edit':
				data['funcTitle']='Düzenle'
				break
			case 'view':
				data['funcTitle']='İncele'
				break
			default:
				data['funcTitle']=req.params.func
				break
		}
		data['title']=data['title'] + ' - ' + data['funcTitle']
	}

	return data
}


function pageRander(req,res){
	if(pages[req.params.module]==undefined){
			errorPage(req,res,null)
		}else if (pages[req.params.module][req.params.page] == undefined) {
			errorPage(req,res,null)
		} else {
			pages[req.params.module][req.params.page].code(req, res, (err,data,view)=>{
				if(!data)
					data={}
				data=setGeneralParams(req,data)

				if(!err){
					if(view){
						res.render(view, data)
					}else{
						var funcName=req.params.func || 'index'

						if(pages[req.params.module][req.params.page].view[funcName]){
							res.render(pages[req.params.module][req.params.page].view[funcName], data,(err,html)=>{
								if(!err){
									res.status(200).send(applyLanguage(req,html))
								}else{
									errorPage(req,res,err)
								}
							})
						}else{
							errorPage(req,res,null)
						}
					}
				}else{
					errorPage(req,res,err)
				}
			})
		}
}

function applyLanguage(req,html){
	return html.replaceAll('{{','').replaceAll('}}','')
}

function setGeneralParams(req,data){
	var referer=req.headers.referer 
	var current = req.protocol + '://' + req.get('host') + req.originalUrl + '?'
	var current2=req.originalUrl.split('?')[0]
	var filter = ''
	var filterObj = {}
	
	if(req.params.id){
		current2=current2.substr(0,current2.length-req.params.id.length-1)
	}
	if(req.params.func){
		current2=current2.substr(0,current2.length-req.params.func.length-1)
	}
	current2+='?'

	for(let k in req.query){
		current +=encodeURIComponent(k) + '=' + encodeURIComponent(req.query[k]) + '&'
		current2 +=encodeURIComponent(k) + '=' + encodeURIComponent(req.query[k]) + '&'
		if(k!='page' && k!='db' && k!='sid' && k!='mid'){
			filter +=encodeURIComponent(k) + '=' +  encodeURIComponent(req.query[k]) + '&'
			if(k!='pageSize'){
				filterObj[k]=req.query[k]
			}else{
				data['pageSize']=req.query[k]
			}
		}
	}


	if(current.substr(-1)=='&'){
		current=current.substr(0,current.length-1)
	}
	if(filter.substr(-1)=='&'){
		filter=filter.substr(0,filter.length-1)
	}
	
	data['currentUrl']=current
	if(referer!=current){
		data['setGeneralParams']=referer
	}
	data['filterString']=filter
	data['filterObjects']=filterObj
	data['isSysUser']=req.params.isSysUser || false
	data['isMember']=req.params.isMember || true
	data['isSysUser']=req.params.isSysUser || false
	data['role']=req.params.role || 'user'
	data['username']=req.params.username || ''
	data['sid']=req.query.sid
	data['func']=req.params.func
	data['message']=data['message'] || ''
	data['successMessage']=data['successMessage'] || ''
	data['db']=req.query.db || ''
	data['mid']=req.query.mid || ''
	data['apiUrl']=config.api.url

	
	if(req.params.isSysUser){
		data['leftMenu']=sysmenu
	}else{
		data['leftMenu']=menu
	}

	if(req.params.id && req.params.func && req.params.page && req.params.module){

		data['urlPath']='/' + req.params.module + '/' + req.params.page + '/' + req.params.func + '/' + req.params.id

	}else if(req.params.func && req.params.page && req.params.module ){

		data['urlPath']='/' + req.params.module + '/' + req.params.page + '/' + req.params.func

	}else if(req.params.page && req.params.module){

		data['urlPath']='/' + req.params.module + '/' + req.params.page

	}else{
		
		data['urlPath']='/'
	}
		
	data['page']=1
	if(req.query.pageSize!=undefined)
		data['pageSize']=req.query.pageSize
	
	if(req.query.page!=undefined)
		data['page']=req.query.page
	if(data.pageSize==undefined)
		data['pageSize']=config.pagination.pageSize
	if(data.pageCount==undefined)
		data['pageCount']=1
	if(data.recordCount==undefined)
		data['recordCount']=0

	data['icon']=getMenuIcon(menu, req, current2)
	data['pageTitle']=getMenuText(menu, req, current2)
	data['breadCrumbs']=getBreadCrumbs(menu, req, current2)

	data['pagePath']='/' + req.params.module + '/' + req.params.page
				
	data['title']=data['pageTitle']
	data['funcTitle']=''
	if(req.params.func){
		switch(req.params.func){
			case 'addnew':
				data['funcTitle']='Yeni Ekle'
				break
			case 'edit':
				data['funcTitle']='Düzenle'
				break
			case 'view':
				data['funcTitle']='İncele'
				break
			default:
				data['funcTitle']=req.params.func
				break
		}
		data['title']=data['title'] + ' - ' + data['funcTitle']
	}

	return data
}

var userInfo = function (req, res, next) {
	req.params.isSysUser=false
	req.params.isMember=true
	req.params.role='user'
	req.params.username=''
	if(req.query.sid){
		db.sessions.findOne({_id:req.query.sid},(err,doc)=>{
			if(!err){
				if(doc!=null){
					req.params.username=doc.username
					req.params.role=doc.role
					req.params.isSysUser=doc.isSysUser
					req.params.isMember=doc.isMember
					return next()
				}else{
					errorPage(req,res,{code:'503',message:'Yetkisiz giris'})
					//res.redirect('/error?code=403&message=Authentication Failed&sid=' + req.query.sid)
				}
			}else{
				//res.redirect('/error?code=403&message=Authentication Failed&sid=' + req.query.sid)
				errorPage(req,res,{code:err.name,message:err.message})
			}
		})
	}else{
		return next()
	}
}

function errorPage(req,res,err){
	var data={}
	data['title']='Hata'
	data['err']=err || {code:404,message:'Sayfa bulunamadi'}
	data=setGeneralParams(req,data)
	data['leftMenu']=[]
	res.render('general/error/error', data)
}

function loadPages(sayfalar, basePath, folder) {
	var modules=fs.readdirSync(folder)
	
	modules.forEach((e)=>{
		if(fs.statSync(path.join(folder,e)).isDirectory() && e[0]!='_'){
			var pageFolders=fs.readdirSync(path.join(folder,e))
			
			sayfalar[e]={}
			pageFolders.forEach((e2)=>{
				var pageDir = path.join(folder,e, e2)
				if(fs.statSync(pageDir).isDirectory() && e2[0]!='_'){
					
					var pageFiles=fs.readdirSync(pageDir)

					if(pageFiles.findIndex((x)=>{return x==e2+'.js'})>-1){
						var requireFileName=path.join(pageDir, e2 + '.js')
						sayfalar[e][e2]={}

						sayfalar[e][e2]['code']=require(requireFileName)
						if(pageFiles.findIndex((x)=>{return x==e2+'.ejs'})>-1){
							sayfalar[e][e2]['view']=[]
							if(basePath!=''){
								sayfalar[e][e2]['view']['index']=path.join(basePath, e, e2, e2)
							}else{
								sayfalar[e][e2]['view']['index']=path.join(e, e2, e2)
							}
							
							var funcP= loadFunctionPages(pageDir,e,e2)
							for(var k in funcP){
								if(basePath!=''){
									sayfalar[e][e2]['view'][k]=path.join(basePath,funcP[k])
								}else{
									sayfalar[e][e2]['view'][k]=funcP[k]
								}
								
							}
						}
						
					}
				}
			})
		}
	})
}

function loadFunctionPages(folder,module,pageName){
	var funcPageFiles=fs.readdirSync(folder)
	var funcPages={}
	funcPageFiles.forEach((e)=>{
		var s=''
		if(e.substr(0,pageName.length)==pageName && e.length>(pageName+'.ejs').length){
			s=e.substr(pageName.length,e.length-(pageName+'').length)
			if(s.substr(s.length-4)=='.ejs'){
				if(s[0]=='-' && s.length>1){
					s=s.substr(1,s.length-5)
					funcPages[s]=path.join(module,pageName,e)
				}
			}
		}
	})
		
	
	return funcPages
}


function getMenuIcon(menu, req, urlPath){

	var dizi=getBreadCrumbs(menu, req, urlPath)
	if(dizi.length>0){
		return dizi[dizi.length-1].icon
	}else{
		return ''
	}

}

function getMenuText(menu, req, urlPath){
	var dizi=getBreadCrumbs(menu, req, urlPath)
	if(dizi.length>0){
		return dizi[dizi.length-1].text
	}else{
		return ''
	}
	
	

}


function getBreadCrumbs(menu, req, urlPath){
	var menuItem=[]
	var m0=menu
	
	m0.forEach((m1)=>{
		if(m1.path){
			if(m1.mid==req.query.mid){
				menuItem.push({text:m1.text,icon:m1.icon})
				return
			}
		}
		if(m1.nodes){
			if(m1.nodes.length>0){
				m1.nodes.forEach((m2)=>{
					if(m2.path){
						if(m2.mid==req.query.mid){
							menuItem.push({text:m1.text,icon:m1.icon})
							menuItem.push({text:m2.text,icon:m2.icon})
							return
						}
					}
					if(m2.nodes){
						if(m2.nodes.length>0){
							m2.nodes.forEach((m3)=>{
								if(m3.mid==req.query.mid){
									menuItem.push({text:m1.text,icon:m1.icon})
									menuItem.push({text:m2.text,icon:m2.icon})
									menuItem.push({text:m3.text,icon:m3.icon})
									return
								}
								if(m3.nodes){
									if(m3.nodes.length>0){
										m3.nodes.forEach((m4)=>{
											if(m4.mid==req.query.mid){
												menuItem.push({text:m1.text,icon:m1.icon})
												menuItem.push({text:m2.text,icon:m2.icon})
												menuItem.push({text:m3.text,icon:m3.icon})
												menuItem.push({text:m4.text,icon:m4.icon})
												return
											}
										})
									}
								}
							})
						}
					}
				})
			}
		}
	})
	return menuItem
}

function localApi(req,res,dbApi){
	var dburl=''
	if(dbApi){
		if(req.query.db) dburl='/' + req.query.db + ''
	}

	var endpoint=''
	if(req.params.func){
		endpoint = '/' + req.params.func
		if(req.params.param1){
			endpoint =endpoint + '/' + req.params.param1
			if(req.params.param2){
				endpoint =endpoint + '/' + req.params.param2
				if(req.params.param3){
					endpoint =endpoint + '/' + req.params.param3
					
				}
			}
		}
	}

	switch(req.method){
		
		case 'POST':
			api.post(dburl + endpoint,req,req.body,(err,resp)=>{
				if(err){
					res.status(200).json({success:false,error:err})
				}else{
					res.status(200).json(resp)
				}
				
			})
		break

		case 'PUT':
			api.put(dburl + endpoint,req,req.body,(err,resp)=>{
				if(err){
					res.status(200).json({success:false,error:err})
				}else{
					res.status(200).json(resp)
				}
			})
		break

		case 'DELETE':
			api.delete(dburl + endpoint,req,(err,resp)=>{
				console.log(`typeof resp routes.js:`,typeof resp)
				console.log(`typeof err routes.js:`,typeof err)
				if(err){
					res.status(200).json({success:false,error:err})
				}else{
					res.status(200).json(resp)
				}
			})
		break

		default: //default GET
			api.get(dburl + endpoint,req,req.query,(err,resp)=>{
				if(err){
					res.status(200).json({success:false,error:err})
				}else{
					res.status(200).json(resp)
				}
			})
			
			
		break
	}
}

function apiDownload(req,res){
	var dburl=''
	if(req.query.db) 
		dburl+='/' + req.query.db + ''

	var endpoint=''
	if(req.params.func){
		endpoint = '/' + req.params.func
		if(req.params.param1){
			endpoint =endpoint + '/' + req.params.param1
			if(req.params.param2){
				endpoint =endpoint + '/' + req.params.param2
				if(req.params.param3){
					endpoint =endpoint + '/' + req.params.param3
					
				}
			}
		}
	}
	
	api.downloadFile(dburl+endpoint,req,res,{},(err)=>{
		if(err){
			res.status(403).send(err.message)
		}
	})
}

function repairMenu(menu){
	menu.forEach((m1,index1)=>{
		m1.mid=`m${index1}`
		m1=repairMenuPath(m1)

		if(m1.nodes){
			if(m1.nodes.length>0){
				m1.nodes.forEach((m2,index2)=>{
					m2.mid=`m${index1}.${index2}`
					m2=repairMenuPath(m2)

					if(m2.nodes){
						if(m2.nodes.length>0){
							m2.nodes.forEach((m3,index3)=>{
								m3.mid=`m${index1}.${index2}.${index3}`
								m3=repairMenuPath(m3)
								if(m3.nodes){
									if(m3.nodes.length>0){
										m3.nodes.forEach((m4,index4)=>{
											m4.mid=`m${index1}.${index2}.${index3}.${index4}`
											m4=repairMenuPath(m4)
										})
									}
								}
							})
						}
					}
				})
			}
		}
	})
}

function repairMenuPath(menu){
	if((menu.path || '')!=''){
		if(menu.path.indexOf('mid=')<0){
			if(menu.path.indexOf('?')>-1)
				menu.path+=`&mid=${menu.mid}`
			else
				menu.path+=`?mid=${menu.mid}`
		}
	}
	return menu
}

repairMenu(menu)
repairMenu(mobileMenu)