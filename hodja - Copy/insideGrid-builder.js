(function(exports) {
	var frontEnd=true
	if(typeof config!='undefined'){
		if(typeof config.mongodb!='undefined'){
			frontEnd=false
		}
	}

	exports.FormBuilder = Object.freeze({
		build:build
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

		var s=``
		item['data']=clone(data)

		if(item.tabs){
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

		s=builder.control('form/form',item)		

		return s
	}


	function generateControls(fields,options,data){
		if(fields==undefined)
			return ''
		var s=''

		Object.keys(fields).forEach((key)=>{
			var item=clone(fields[key])
			if(item.field==undefined)
				item.field=key
			item=itemDefaultValues(item)


			if(item.fields!=undefined && item.type!='grid'){
				item.controls=generateControls(item.fields,options,data)
				s+=builder.control('form/card',item)
			}else{
				item['value']=getPropertyByKeyPath(data,item.field)
				if(item.type==undefined)
					return
				switch(item.type.toLowerCase()) {
					case 'string' : 
					case 'textbox' : 
					s+=builder.control('form/textbox',item)	
					break
					case 'remotelookup' : 
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
					s+=`<div class="w-100"></div>`	
					break
					case 'strings' :
					case 'textarea' :
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
		var formGridOptions={
			insideForm:true,
			parentField:item.field
		}
		console.log(`options:`,options)
		console.log(`item.options:`,item.options)
		var s=``
		if(item.data==undefined)
			item.data={}

		if(data.docs==undefined)
			data.docs=[]

		
		if(Array.isArray(item.value)){
			data.docs=item.value
		}else{
			data.docs=[]
		}
		Object.keys(item.fields).forEach((key)=>{
			if(item.fields[key].type=='lookup' && item.fields[key].staticValues!=undefined){
				item.fields[key].lookup=staticValues[item.fields[key].staticValues]
			}
		})
		formGridOptions=Object.assign({},formGridOptions,options)
		formGridOptions=Object.assign({},formGridOptions,item.options)

		item.options=formGridOptions
		console.log(`item.options:`,item.options)
		item.controls=gridBuilder.build(item,data)
		item.id=item.field
		s=builder.control('form/card',item)
	


		return s
	}
	function itemDefaultValues(item){
		item['id']=generateFormId(item.field)
		item['name']=generateFormName(item.field)
		item['title']=ifNull(item['title'],'')
		item['icon']=ifNull(item['icon'],'')
		item['col']=ifNull(item['col'],'col-md-12')

		if(!isNaN(item.col)){
			item.col='col-md-' + item.col
		}
		item['type']=ifNull(item['type'],'string')
		item['required']=ifNull(item['required'],false)
		item['visible']=ifNull(item['visible'],true)
		item['collapsed']=ifNull(item['collapsed'],false)
		item['lookup']=ifNull(item['lookup'],{})
		if(item.staticValues!=undefined){
			item['lookup']=staticValues[item.staticValues]
		}
		item['class']=ifNull(item['class'],'')
		item['readonly']=item.readonly || false
		item['hasChildren']=false

		return item
	}
})(typeof exports === 'undefined'? this['FormBuilder']={}: exports)