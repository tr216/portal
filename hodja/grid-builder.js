(function(exports) {
	var frontEnd=true
	if(typeof config!='undefined'){
		if(typeof config.mongodb!='undefined'){
			frontEnd=false
		}
	}
	var elementId=0
	function newId(){
		elementId++
		return elementId
	}

	var defaultButtons={
		add:[false,''],
		edit:[false,''],
		delete:[false,''],
		view:[false,''],
		print:[false,''],
		copy:[false,'']
	}
	var currentPath=''
	var qParams={}

	exports.GridBuilder = Object.freeze({
		build:build
	})

	function build(item,data,callback){
		if(callback==undefined){
			return start(item,data)
		}
		return callback(null,start(item,data))

	}

	function start(item,data){
		item.id=newId()
		
		if(frontEnd){
			currentPath=window.location.pathname
			qParams=q
		}else{

			currentPath=data.uiParams.urlPath
			qParams=data.uiParams
		}

		item.options=buttonOptions(item,item.options || {})
		item.options.show={
			filter:true,
			pageSize:true,
			pageCount:true,
			pagerButtons:true,
			header:true,
			footer:true
		}

		
		if(item.options.insideForm){
			item.options.show.filter=false
			item.options.show.pageSize=false
			item.options.show.pageCount=false
			item.options.show.pagerButtons=false
		}else{
			item.options.insideForm=false
		}

		if(item.options.parentField==undefined){
			item.options.parentField=''
		}
		if(data.docs==undefined && data.list!=undefined){
			data.docs=data.list
		}
		if((data.pageSize || '')=='')
			data['pageSize']=50000
		data['page']=data['page']!=undefined?data.page:1
		data['pageCount']=data['pageCount']!=undefined?data.pageCount:0
		data['recordCount']=data['recordCount']!=undefined?data.recordCount:0
		data['pageCount']=data['pageCount']!=undefined?data.pageCount:0
		Object.keys(item.fields || {}).forEach((key)=>{
			var field=item.fields[key]
			if(field.visible==undefined)
				field.visible=true
			if(field.field==undefined)
				field.field=key
			if(field.type=='lookup' && field.staticValues)
				field.lookup=staticValues[field.staticValues] || {}
		})
		
		var s=``
		item['data']=clone(data)
		item['defaultButtons']=defaultButtons
		// item.headerFilter=builder.control('grid/header_filter',item)	
		// item.header=builder.control('grid/header',item)	
		//item.body=builder.control('grid/body',item)	
		//item.footer=builder.control('grid/footer',item)	
		s=builder.control('grid/grid',item)		

		return s
	}

	

	
	function buttonOptions(item,options){

		var buttonCount=0
		if(options.buttons==undefined){
			options.buttons=defaultButtons
		}else{
			options.buttons=Object.assign({},defaultButtons, options.buttons)
			Object.keys(options.buttons).forEach((key)=>{
				if(typeof options.buttons[key]=='boolean'){
					options.buttons[key]=[options.buttons[key],'']
				}else if(Array.isArray(options.buttons[key])){
					if(options.buttons[key].length<2)
						options.buttons[key].push('')
				}
			})
		}
		
		if(options.buttons.add[0]==true && options.buttons.add[1]==''){
			if(!options.insideForm){
				options.buttons.add[1]=`<a href="${currentPath}/addnew?mid=${qParams.mid}" class="btn btn-primary  btn-sm far fa-plus-square" target="_self"  title="Yeni Ekle"></a>`
			}else{
				options.buttons.add[1]=`<a href="javascript:addGridRow(${item.id})" class="btn btn-primary  btn-sm far fa-plus-square" target="_self"  title="Yeni Ekle"></a>`
			}
			
		}

		if(options.buttons.copy[0]==true && options.buttons.copy[1]==''){
			options.buttons.copy[1]=`<a href="javascript:gridHelper.gridCopyItem('{field[0]}', '{_id}')" class="btn btn-grid-row btn-success " title="Kopyala"><i class="fas fa-copy"></i></a>`
		}

		if(options.buttons.print[0]==true && options.buttons.print[1]==''){
			options.buttons.print[1]=`<a href="javascript:popupCenter('${currentPath}/print/{_id}?mid=${qParams.mid}','Yazdır','900','600')" class="btn btn-grid-row btn-info " title="Yazdır"><i class="fas fa-print"></i></a>`
		}

		if(options.buttons.view[0]==true && options.buttons.view[1]==''){
			options.buttons.view[1]=`<a href="javascript:popupCenter('${currentPath}/view/{_id}?mid=${qParams.mid}','İncele','900','600')" class="btn btn-info btn-grid-row fas fa-eye" title="İncele"></a>`
		}

		if(options.buttons.edit[0]==true && options.buttons.edit[1]==''){
			options.buttons.edit[1]=`<a href="${currentPath}/edit/{_id}?mid=${qParams.mid}" class="btn btn-primary btn-grid-row fas fa-edit" target="_self"  title="Düzenle"></a>`
		}

		if(options.buttons.delete[0]==true && options.buttons.delete[1]==''){
			options.buttons.delete[1]=`<a href="javascript:gridHelper.gridDeleteItem('{field[0]}','{_id}')" class="btn btn-danger btn-grid-row fas fa-trash-alt" title="Sil"></a>`
		}

		Object.keys(options.buttons).forEach((key)=>{
			buttonCount +=options.buttons[key][0]?1:0
		})
		if(buttonCount>1 && options.buttons.add[0])
			buttonCount--

		buttonCount=buttonCount>4?4:buttonCount
		
		if(!options.insideForm){
			options.buttonWidth=`${buttonCount*45+10}px`
		}else{
			options.buttonWidth=`${2*45+10}px`
		}
		return options
	}
})(typeof exports === 'undefined'? this['GridBuilder']={}: exports)