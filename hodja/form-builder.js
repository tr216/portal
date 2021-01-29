(function(exports) {
	var frontEnd=true
	if(typeof config!='undefined'){
		if(typeof config.mongodb!='undefined'){
			frontEnd=false
		}
	}

	exports.FormBuilder = Object.freeze({
		build:build,
		itemDefaultValues:itemDefaultValues,
		insideGrid:insideGrid,
		includeCode:includeCode
	})

	function build(item,data,callback){
		if(callback==undefined){
			return start(item,data)
		}
		return callback(null,start(item,data))

	}

	function start(item,data){


		var headerButtons=''

		if(!item.options)
			item.options={}

		if(item.options.form==undefined)
			item.options.form=true

		if(item.options.row==undefined)
			item.options.row=true

		if(item.options.mode==undefined)
			item.options.mode='addnew'

		if(item.type=='modalRow'){
			item.options.type='modalRow'
		}
		if(item.parentField){
			item.options.parentField=item.parentField
		}
		var s=``
		// item['data']=clone(data)

		if((item.tabs || '')!=''){
			var bActiveFound=false
			item.tabs.forEach((tab,tabIndex)=>{
				if(tab.active)
					bActiveFound=true
				tab.field='tab' + tabIndex
				tab.title=tab.title || ''
				tab.icon=tab.icon || ''
				if(tab.fields){
					tab.controls=generateControls(tab.fields, item.options, data )
				}
			})
			if(bActiveFound==false)
				item.tabs[0]['active']=true
			
			item.controls=builder.control('form/tab',item)		
		}else{
			
			item.controls=generateControls(item.fields, item.options, data)
		}

		s+=includeCode(item)
		s+=builder.control('form/form',item)		
		s+=scriptCode(item)
		return s
	}

	function includeCode(item){
		var s=``

		if((item.includeFile || '')!=''){
			
			var dizi=[]
			if(!Array.isArray(item.includeFile)){
				dizi.push(item.includeFile)
			}else{
				dizi=item.includeFile
			}

			dizi.forEach((e)=>{
				if(e.substr(-3)=='.js'){
					s+=`<script type="text/javascript" src="${e}"></script>\r\n`
				}else if(e.substr(-4)=='.css'){
					s+=`<link rel="stylesheet" type="text/css" href="${e}" />\r\n`
				}
			})
			return s
		}else{
			return ``
		}
	}

	function scriptCode(item){
		var s=``
		var script=item.options.script || item.script || ''
		if((script || '')!=''){

			var dizi=[]
			if(!Array.isArray(script)){
				dizi.push(script)
			}else{
				dizi=script
			}
			s+=`<script type="text/javascript">\r\n`
			dizi.forEach((e)=>{
				s+=`${e}\r\n`
			})
			s+=`</script>\r\n`
			return s
		}else{
			return ``
		}
	}

	function generateControls(fields,options,data){
		if(fields==undefined)
			return ''
		var s=''
		if(options.type=='modalRow' && options.parentField){
			var obj={}
			Object.keys(fields).forEach((key)=>{
				obj[`modalRow${options.parentField}.${key}`]=fields[key]
				if(fields[key].lookupTextField){
					obj[`modalRow${options.parentField}.${key}`].lookupTextField=`modalRow${options.parentField}.${fields[key].lookupTextField}`
				}
			})
			fields=obj
		}
		Object.keys(fields).forEach((key)=>{
			var item=clone(fields[key])
			if(item.field==undefined)
				item.field=key
			item=itemDefaultValues(item,(options.autocol || false))
			
			if(item.fields!=undefined && item.type!='grid'){
				item.controls=generateControls(item.fields,options,data)
				s+=builder.control('form/card',item)
			}else{
				if(options.mode=='addnew'){
					item.value=item.value || ''
				}else{
					item['value']=getPropertyByKeyPath(data,item.field)
				}
				
				if(item.type==undefined)
					return
				switch(item.type.toLowerCase()) {
					case 'string' : 
					case 'textbox' :

					s+=builder.control('form/textbox',item)	
					break
					case 'remotelookup' : 
					// item['data']=data
					if(item.lookupTextField){
						item['valueText']=getPropertyByKeyPath(data,item.lookupTextField)
					}
					s+=builder.control('form/remotelookup',item)	
					break

					case 'money' :
					case 'number' :
					case 'numberbox' :
					s+=builder.control('form/numberbox',item)	
					break
					case 'date' :
					s+=builder.control('form/datebox',item)	
					break
					case 'time' :
					s+=builder.control('form/timebox',item)	
					break
					case 'daterange' :
					s+=builder.control('form/daterangebox',item)	
					break
					case 'label':
					s+=builder.control('form/label',item)	
					break
					case 'div': 
					s+=builder.control('form/div',item)	
					break
					case 'w-100': 
					case 'w100': 
					case 'divisor': 
					s+=`<div class="w-100"></div>`	
					break
					case 'strings' :
					case 'textarea' :
					s+=builder.control('form/textarea',item)	
					break
					case 'code' :
					item.rows=item.rows || 40
					item.encoding=item.encoding || 'base64'
					s+=builder.control('form/textarea',item)	
					break
					case 'file' : 
					case 'filebase64' : 
					s+=builder.control('form/filebase64',item)	
					break

					case 'image' :
					case 'filebase64image' :
					s+=builder.control('form/filebase64image',item)	
					break
					case 'boolean':
					case 'checkbox':
					s+=builder.control('form/checkbox',item)
					break

					case 'lookup': 
					case 'combobox': 
					s+=builder.control('form/lookup',item)
					break
					case 'json': 
					s+=builder.control('form/jsondata',item)
					break
					case 'grid': 
					s+=insideGrid(item,options,data)
					break
					default :
					s+=builder.control('form/textbox',item)
					break
				}
			}
		})

		return s
	}



	function insideGrid(item,options,data){
		var s=''
		item.parentField=item.field
		item.id=item.field.replace('.','_')
		Object.keys(item.fields).forEach((key)=>{
			var field=item.fields[key]
			if(field.type=='lookup' && field.staticValues!=undefined){
				field.lookup=staticValues[field.staticValues] || {}
			}
		})
		item.controls=insideGridBuilder.build(item)
		item.id=generateFormId(item.field)
		s=builder.control('form/card',item)
		return s
	}

	function itemDefaultValues(item,autocol=false){
		item['id']=generateFormId(item.field)
		item['name']=generateFormName(item.field)
		item['title']=ifNull(item['title'],'')
		item['icon']=ifNull(item['icon'],'')
		

		item['type']=ifNull(item['type'],'string')

		if(!isNaN(item.col)){
			item.col='col-md-' + item.col
		}else{
			if(autocol){
				switch(item.type.toLowerCase()){
					case 'identity':
					item.col='col-md-1'
					break
					case 'number':
					case 'money':
					item.col='col-md-2'
					break
					case 'remotelookup':
					item.col='col-md-6'
					break
					case 'lookup':
					item.col='col-md-2'
					if(maxLookupLength(item.lookup || {})>30){
						item.col='col-md-4'
					}
					break
					case 'boolean':
					item.col='col-md-2'
					break
					default:
					item.col='col-md-4'
					break
				}
			}else{
				item['col']=ifNull(item['col'],'col-md-12')
			}
		}
		
		item['required']=ifNull(item['required'],false)
		item['visible']=ifNull(item['visible'],true)
		item['collapsed']=ifNull(item['collapsed'],false)
		item['lookup']=ifNull(item['lookup'],{})
		if(item.staticValues!=undefined){
			item['lookup']=staticValues[item.staticValues] || {}
		}
		item['class']=ifNull(item['class'],'')
		item['readonly']=item.readonly || false
		item['hasChildren']=false

		if(item.required)
			item.title=`*${item.title}`
		return item
	}

	function maxLookupLength(lookup){
		var max=0
		Object.keys(lookup).forEach((key)=>{
			if(lookup[key].length>max)
				max=lookup[key].length
		})
		return max
	}
})(typeof exports === 'undefined'? this['FormBuilder']={}: exports)