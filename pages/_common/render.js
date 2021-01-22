module.exports = function(req,res,jsonPage,data,callback){
	data.filter=Object.assign({},data.filter,req.query)

	if(!jsonPage)
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
	
	createPage(req,res,jsonPage,data,(err,data)=>{
		
		callback(err,data)
	})
}

function createPage(req,res,jsonPage,data,callback){
	var func=req.params.func || 'index'

	data.headerButtons=''
	switch(func){
		case 'edit':
		jsonPage=clone(jsonPage.edit || jsonPage.form)
		data.headerButtons=`<button type="submit" form="${'form-general'}" class="btn btn-primary btn-form-header" title="Kaydet" name="btnFormSave"><i class="fas fa-save"></i></button>`
		break
		case 'view':
		jsonPage=clone(jsonPage.view || jsonPage.edit || jsonPage.form)
		break
		case 'addnew':
		jsonPage=clone(jsonPage.addnew || jsonPage.form)
		data.headerButtons=`<button type="submit" form="${'form-general'}" class="btn btn-primary btn-form-header" title="Kaydet" name="btnFormSave"><i class="fas fa-save"></i></button>`
		break
		default:
		jsonPage=clone(jsonPage.index)
		break
	}
	if(func!='index')
		data.headerButtons+=`<a href="javascript:goBack();" class="btn btn-dark  btn-form-header ml-2" title="Vazgeç"><i class="fas fa-reply"></i></a>`
	
	if(jsonPage==undefined){
		return callback({code:'404',message:'Sayfa bulunamadi'},data)
	}

	
	data.mid=data.mid || req.query.mid || ''
	iteration(jsonPage,(page,cb)=>{

		switch(page.type){
			case 'grid':
			gridForm(req,res,page,data,(err,s)=>{
				if(!err){
					data.html+=s
				}else{
					data.html+=(err.code || err.name || 'Error') + ' : ' + err.message
				}
				return cb(null,s)
			})
			break
			case 'filter':
			filterForm(req,res,page,data,(err,s)=>{
				if(!err){
					data.html+=s
				}else{
					data.html+=(err.code || err.name || 'Error') + ' : ' + err.message
				}
				return cb(null,s)
			})
			break
			case 'form':
			if(page.options==undefined)
				page.options={}
			switch(func){
				case 'edit':
				page.options['mode']='edit'
				break
				case 'view':
				page.options['mode']='view'
				break
				case 'addnew':
				page.options['mode']='addnew'
				break
				default:
				page.options['mode']='edit'
				break
			}
			normalForm(req,res,page,data,(err,s)=>{
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
			
		}else{
			console.log(`iteration err:`,err)
		}
		
		callback(null,data)
	})
}

function normalForm(req,res,item,data,cb){

	var s=``
	var url=`${item.options.dataSource.url}`
	if((item.options.mode=='addnew' || item.options.mode=='edit') && data.headerButtons==''){
		data.headerButtons=`<button type="submit" form="${'form-general'}" class="btn btn-primary btn-form-header" title="Kaydet" name="btnFormSave"><i class="fas fa-save"></i></button>`
		data.headerButtons+=`<a href="javascript:goBack();" class="btn btn-dark  btn-form-header ml-2" title="Vazgeç"><i class="fas fa-reply"></i></a>`
	}
	
	var formData={}

	if(item.options.mode!='addnew'){
		if((req.params.id || '')!=''){
			if(url.indexOf('?')>-1){
				url=url.split('?')[0] + `/${req.params.id}?` + url.split('?')[1]
			}else{
				url+=`/${req.params.id}`
			}
		}
		
		if(req.method=='POST'){
			
			formData=Object.assign(formData,req.body)
			api.put(url,req,formData,(err,resp)=>{
				if(!err){
					res.redirect(`/${req.params.module}/${req.params.page}?mid=${req.query.mid}`)
				}else{
					
					data.message=`${err.code} - ${err.message}`
						formBuilder.build(item,formData,(err,html)=>{
							cb(err,html)
						})
					}
				})
			
		}else{
			api.get(url,req,data.filter,(err,resp)=>{
				if(!err){
						formData=Object.assign(formData,resp.data)
						formBuilder.build(item,formData,(err,html)=>{
							cb(err,html)
						})
					}else{
						cb(err)
					}

				})
		}

	}else{
		if(req.method=='POST'){
			formData=Object.assign(formData,req.body)
			api.post(url,req,formData,(err,resp)=>{
				if(!err){
					res.redirect(`/${req.params.module}/${req.params.page}?mid=${req.query.mid}`)
				}else{
					data.message=`${err.code} - ${err.message}`
						formBuilder.build(item,formData,(err,html)=>{
							cb(err,html)
						})
					}
				})
		}else{
			
			formBuilder.build(item,formData,(err,html)=>{
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
				data['docs']=resp.data.docs
				data['page']=resp.data.page || 1
				data['recordCount']=resp.data.recordCount || 0
				data['pageSize']=resp.data.pageSize || 0
				data['pageCount']=resp.data.pageCount || 0
				
				gridBuilder.build(item,data,(err,html)=>{
					cb(err,html)
				})
			}else{
				cb(err)
			}
		})
	}else{
		
		gridBuilder.build(item,data,(err,html)=>{
			cb(err,html)
		})

	}


}

function filterForm(req,res,item,data,cb){
	
	filterBuilder.build(item,data,(err,html)=>{
		cb(err,html)
	})
	// filterBuilder.generateFilter(item.fields,data.uiParams,data,(err,html)=>{
	// 	cb(err,html)
	// })
}
