
global.pages = {}

module.exports = function(app){
	
	loadPages(pages,'',path.join(__dirname, '../pages'))

	app.all("/*", function(req, res, next) {

		res.header("Access-Control-Allow-Origin", "*")
		res.header('Access-Control-Allow-Credentials', 'true')
		res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization,   Content-Type, Content-Length, X-Requested-With , x-access-token, token")
		res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS")
		return next()
	})


	app.all('/', function(req, res) {
		if(req.session.elvanDalton){
			res.redirect(`/general/dashboard`)
		}else{
			res.redirect('/general/login')
		}
		
	})
	
	app.all('/changedb', function(req, res) {
		if(!req.session.elvanDalton){
			res.redirect('/general/login')
		}else{
			var referer=req.headers.referer
			sessionHelper.changeDb(req,res,(err,data)=>{
				if(!err){
					res.redirect(referer)
				}else{
					errorPage(req,res,err)
				}
			})
		}
	})


	app.all('/login', function(req, res) {
		res.redirect(`/general/login?${mrutil.encodeUrl(req.query)}`)
	})
	app.all('/logout', function(req, res) {
		

		if((req.session.elvanDalton || '')==''){
			res.redirect('/general/login')
		}else{
			sessionHelper.logout(req,res,(err,data)=>{
				res.redirect('/general/login')
			})
		}
	})

	// app.all('/general/login', function(req, res) {
		
	// 	res.status(200).end('merhaba login')
	// 	// pageRanderNext(req,res)
	// })

	// app.all('/general/me', function(req, res) {
	// 	pageRanderNext(req,res)
	// })

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

	app.all('/dbapi/downloadFile/:func', function(req, res) {
		apiDownload(req,res,true)
	})
	app.all('/dbapi/downloadFile/:func/:param1', function(req, res) {
		apiDownload(req,res,true)
	})
	app.all('/dbapi/downloadFile/:func/:param1/:param2', function(req, res) {
		apiDownload(req,res,true)
	})
	app.all('/dbapi/downloadFile/:func/:param1/:param2/:param3', function(req, res) {
		apiDownload(req,res,true)
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
		apiDownload(req,res,false)
	})
	app.all('/downloadFile/:func/:param1', function(req, res) {
		apiDownload(req,res,false)
	})
	app.all('/downloadFile/:func/:param1/:param2', function(req, res) {
		apiDownload(req,res,false)
	})
	app.all('/downloadFile/:func/:param1/:param2/:param3', function(req, res) {
		apiDownload(req,res,false)
	})

	// app.all('/hodja/templates', function(req, res) {
	// 	res.status(200).json(hodjaTemplates)
	// })

	app.all('/:module/:page', userInfo, function(req, res) {
		pageRander(req,res)
	})

	app.all('/:module/:page/:func', userInfo, function(req, res) {
		
		pageRander(req,res)
	})
	

	app.all('/:module/:page/:func/:id',userInfo, function(req, res) {
		
		pageRander(req,res)
	})


}


function pageRander(req,res){
	timeReset()
	if(!IsSpecialPages(req)){

		var fileName = path.join(__dirname,`../forms/${req.params.module}`,`${req.params.page}.json`)

		if(!fs.existsSync(fileName)){
			return errorPage(req,res,{code:404,message:'Sayfa bulunamadi'})
		}
		var jsonPage=require(fileName)

		setGeneralParams(req,res, {jsonPage:jsonPage}, (err,data)=>{
			if(err)
				return errorPage(req,res,err)
			var jsFile='../pages/_common/render.js'
			var ejsFile='../pages/_common/render.ejs'
			

			require(jsFile)(req,res,jsonPage,data, (err,data2)=>{
				if(err)
					return errorPage(req,res,err)
				
				res.render(ejsFile, data,(err,html)=>{
					if(!err){
						res.status(200).send(html)
						
					}else{
						errorPage(req,res,err)
					}
				})

			})
		})
	}else{
		pages[req.params.module][req.params.page].code(req, res, (err,data,view)=>{
			if(err)
				return errorPage(req,res,err)
			setGeneralParams(req,res,data, (err,data)=>{
				if(err)
					return errorPage(req,res,null)


				if(!data)
					data={}

				if(view){
					res.render(view, data)
				}else{
					var funcName=req.params.func || 'index'
					if(pages[req.params.module][req.params.page].view[funcName]){
						res.render(pages[req.params.module][req.params.page].view[funcName], data,(err,html)=>{
							if(!err){
								res.status(200).send(html)
							}else{
								errorPage(req,res,err)
							}
						})
					}else{
						errorPage(req,res,null)
					}
				}
			})

		})
	}
	
}

function IsSpecialPages(req){
	if(req.params.module=='general' && (req.params.page=='login' || req.params.page=='error' || req.params.page=='dashboard' || req.params.page=='closed-module')){
		return true
	}
	return false
}

function setGeneralParams(req, res, data, cb){
	var referer=req.headers.referer || ''
	var currentUrl=req.protocol + '://' + req.get('host') + req.originalUrl

	
	data['q']=req.query

	data['username']=req.params.username || ''

	data['func']=req.params.func


	data['urlPath']=req.originalUrl.split('?')[0]


	data['page']=1
	if(req.query.pageSize!=undefined)
		data['pageSize']=Number(req.query.pageSize)

	if(req.query.page!=undefined)
		data['page']=Number(req.query.page)
	if(data.pageSize==undefined)
		data['pageSize']=Number(config.pagination.pageSize)
	if(data.pageCount==undefined)
		data['pageCount']=0
	if(data.recordCount==undefined)
		data['recordCount']=0



	// data['icon']=getMenuIcon(menu, req, currentUrl)
	// data['pageTitle']=getMenuText(menu, req, currentUrl)
	// data['breadCrumbs']=getBreadCrumbs(menu, req, currentUrl)

	data['pagePath']='/' + req.params.module + '/' + req.params.page

	//data['title']=data['pageTitle']
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
		// data['title']=data['title'] + ' - ' + data['funcTitle']
	}

	data['elvanDalton']=req.session.elvanDalton || ''
	data['mid']=req.query.mid || ''
	data['leftMenu']=[]
	data['databases']=[]
	data['db']=''
	data['dbName']=''
	data['session']={}
	data['html']=data['html']==undefined?'':data['html']
	data['list']=data['list']==undefined?[]:data['list']
	data['filter']=data['filter']==undefined?{}:data['filter']
	data['form']=data['form']==undefined?{}:data['form']
	data['message']=data['message']==undefined?'':data['message']
	data['successMessage']=data['successMessage']==undefined?'':data['successMessage']

	data['uiParams']={
		elvanDalton:data.elvanDalton,
		urlPath:data.urlPath,
		mid:data.mid,
		params:req.params
	}
	
	if(IsSpecialPages(req) && (data.elvanDalton || '')==''){

		return cb(null,data)
	}

	db.sessions.findOne({_id:req.session.elvanDalton, passive:false},(err,doc)=>{
		if(!err){
			if(doc!=null){
				data['db']=doc.dbId
				data['dbName']=doc.dbName
				data['mid']=req.query.mid || doc.mId || ''
				data['leftMenu']=doc.menu
				data['databases']=doc.databases
				data['session']=doc.toJSON()
				cb(null, data)
			}else{
				cb({code:'SESSION_NOT_FOUND',message:'Oturum süresi bitmiş. Yeniden giriş yapınız.'})
			}

		}else{
			console.error(`setGeneralParams err:`,err)
			cb(err)
		}
	})
}


var userInfo = function (req, res, next) {
	
	
	
	if(req.params.module=='general' && req.params.page=='login')
		return next()

	developmentSession(req,()=>{
		if((req.session.elvanDalton || '')!=''){
			db.sessions.findOne({_id:req.session.elvanDalton},(err,doc)=>{
				if(!err){
					if(doc!=null){
						return next()
					}
				}
				redirectLogin(req,res)
				
				
			})
		}else{
			redirectLogin(req,res)
			
		}
	})
}

function redirectLogin(req,res){
	var referer=req.headers.referer || ''
	var currentUrl=req.protocol + '://' + req.get('host')
	var r=''
	if(referer!=''){
		if(referer.substr(0,currentUrl.length)==currentUrl){
			r=`?e=timeout&r=${referer.substr(currentUrl.length)}`
		}
	}

	res.redirect(`/login${r}`)
}


function developmentSession(req,next){
	if(config.status=='development' && req.get('host')=='localhost:5100'){
		db.sessions.find({passive:false}).sort({_id:-1}).limit(1).exec((err,docs)=>{
			if(!err){
				if(docs.length>0){
					req.session.elvanDalton=docs[0]._id.toString()
				}
			}
			next()
		})
	}else{
		next()	
	}
}

function errorPage(req,res,err){
	var data={}
	data['title']='Hata'
	data['err']=err || {code:404,message:'Sayfa bulunamadi'}
	
	setGeneralParams(req,res,data,(err,data2)=>{
		if(!err){
			//data2['leftMenu']=[]
		}else{
			data2=data
		}

		res.render('general/error/error', data2)
	})
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





function localApi(req,res,dbApi){
	var dburl=''
	if(dbApi){
		dburl='/{db}'
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

			if(err){
				res.status(200).json({success:false,error:err})
			}else{
				res.status(200).json(resp)
			}
		})
		break

		default: 
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

function apiDownload(req,res,dbApi){
	var dburl=''
	if(dbApi){
		dburl='/{db}'
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

	api.downloadFile(dburl+endpoint,req,res,{},(err)=>{
		if(err){
			res.status(403).send(err.message)
		}
	})
}

function repairMenu(menu){
	menu.forEach((m1,index1)=>{
		m1.mId=`${index1}`
		//m1=repairMenuPath(m1)

		if(m1.nodes){
			if(m1.nodes.length>0){
				m1.nodes.forEach((m2,index2)=>{
					m2.mId=`${index1}.${index2}`
					//m2=repairMenuPath(m2)

					if(m2.nodes){
						if(m2.nodes.length>0){
							m2.nodes.forEach((m3,index3)=>{
								m3.mId=`${index1}.${index2}.${index3}`
								//m3=repairMenuPath(m3)
								if(m3.nodes){
									if(m3.nodes.length>0){
										m3.nodes.forEach((m4,index4)=>{
											m4.mId=`${index1}.${index2}.${index3}.${index4}`
											//m4=repairMenuPath(m4)
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

repairMenu(menu)
