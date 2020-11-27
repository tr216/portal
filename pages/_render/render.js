module.exports = function(req,res,data,callback){
	
	//
	data.filter=Object.assign({},data.filter,req.query)

	if(!data.template)
		return callback(null,data)
	
	if(req.method=='POST'){
		if(req.body.btnFilter!=undefined){
			
			data.filter=Object.assign({}, data.filter,req.body)

			data.filter['btnFilter']=undefined
			delete data.filter['btnFilter']
			data.filter['page']=1

			
			res.redirect(`${data.urlPath}?${mrutil.encodeUrl(data.filter)}`)
			return
		}
		data.form=Object.assign(data.form,req.body)
	}
	createPage(req,res,data,(err,data)=>{
		
		callback(err,data)
	})
}


function createPage(req,res,data,callback){

	var func=req.params.func || 'index'
	var templateForm
	switch(func){
		case 'edit':
		templateForm=data.template.edit || data.template.form
		break
		case 'view':
		templateForm=data.template.view || data.template.edit || data.template.form
		break
		case 'addnew':
		templateForm=data.template.addnew || data.template.form
		break
		default:
		templateForm=data.template.index
		break
	}
	if(templateForm==undefined){
		return callback({code:'404',message:'Sayfa bulunamadi'},data)
	}

	if(!Array.isArray(templateForm)){
		templateForm=[templateForm]
	}
	iteration(templateForm,(item,cb)=>{

		switch(item.type){
			case 'grid':
			gridForm(req,res,item,data,(err,s)=>{
				if(!err){
					data.html+=s
				}else{
					data.html+=(err.code || err.name || 'Error') + ' : ' + err.message
				}
				return cb(null,s)
			})

			break
			case 'filter':
			filterForm(req,res,item,data,(err,s)=>{
				if(!err){
					data.html+=s
				}else{
					data.html+=(err.code || err.name || 'Error') + ' : ' + err.message
				}
				return cb(null,s)
			})
			break
			case 'form':
			if(item.options==undefined)
				item.options={}
			switch(func){
				case 'edit':
				item.options['mode']='edit'
				break
				case 'view':
				item.options['mode']='view'
				break
				case 'addnew':
				item.options['mode']='addnew'
				break
				default:
				item.options['mode']='edit'
				break
			}
			normalForm(req,res,item,data,(err,s)=>{
				if(!err){
					data.html+=s
				}else{
					data.html+=(err.code || err.name || 'Error') + ' : ' + err.message
				}
				return cb(null,s)
			})
			break
			default:
			cb(null,'---')
			break
		}

	},0,true,(err,result)=>{
		if(!err){
			// console.log(`iteration son:`,result)
		}else{
			console.log(`iteration err:`,err)
		}
		callback(null,data)
	})
}

function normalForm(req,res,item,data,cb){

	var s=``
	var url=`${item.options.dataSource.url}`
	

	if(item.options.mode!='addnew' && (req.params.id || '')!=''){
		if(url.indexOf('?')>-1){
			url=url.split('?')[0] + `/${req.params.id}?` + url.split('?')[1]
		}else{
			url+=`/${req.params.id}`
		}
		
		
		if(req.method=='POST'){
			console.log(`req.body:`,req.body)
			console.log(`data.form:`,data.form)
			data.form=Object.assign(data.form,req.body)
			api.put(url,req,data.form,(err,resp)=>{
				if(!err){
					res.redirect(`/${req.params.module}/${req.params.page}?sid=${req.query.sid}&mid=${req.query.mid}`)
				}else{
					
					data.message=`${err.code} - ${err.message}`
					formBuilder.generateForm(item.fields,item.options,data.uiParams,data.form,(err,html)=>{
						cb(err,html)
					})
				}
			})
			
		}else{
			api.get(url,req,data.filter,(err,resp)=>{
				if(!err){
					formBuilder.generateForm(item.fields,item.options,data.uiParams,resp.data,(err,html)=>{
						cb(err,html)
					})
				}else{
					cb(err)
				}

			})
		}
	}else{
		if(req.method=='POST'){
			data.form=Object.assign(data.form,req.body)
			api.post(url,req,data.form,(err,resp)=>{
				if(!err){
					res.redirect(`/${req.params.module}/${req.params.page}?sid=${req.query.sid}&mid=${req.query.mid}`)
				}else{
					
					data.message=`${err.code} - ${err.message}`
					formBuilder.generateForm(item.fields,item.options,data.uiParams,data.form,(err,html)=>{
						cb(err,html)
					})
				}
			})
		}else{
			formBuilder.generateForm(item.fields,item.options,data.uiParams,data.form,(err,html)=>{
				cb(err,html)
			})
		}

	}
}

function gridForm(req,res,item,data,cb){
	var bRemote=false
	if(item.options.dataSource){

		if(item.options.dataSource.type=='remote' && item.options.dataSource.url)
			bRemote=true
	}
	var s=``

	if(bRemote){

		if(item.options.dataSource.url.indexOf('?')>-1){
			var p=getAllUrlParams(item.options.dataSource.url.split('?')[1])
			data.filter=Object.assign({},data.filter,p)
		}
		api.get(item.options.dataSource.url,req,data.filter,(err,resp)=>{
			if(!err){
				gridBuilder.generateGrid(item.fields,item.options,data.uiParams,resp.data,(err,html)=>{
					cb(err,html)
				})
			}else{
				cb(err)
			}
		})
	}else{
		gridBuilder.generateGrid(item.fields,item.options,data.uiParams,item.data,(err,html)=>{
			cb(err,html)
		})

	}


}

function filterForm(req,res,item,data,cb){
	filterBuilder.generateFilter(item.fields,data.uiParams,data,(err,html)=>{
		cb(err,html)
	})
}

