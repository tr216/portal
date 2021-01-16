(function(exports) {
	var frontEnd=true
	if(typeof config!='undefined'){
		if(typeof config.mongodb!='undefined'){
			frontEnd=false

		}
	}

	var currentPath=''
	var qParams={}

	exports.FilterBuilder = Object.freeze({
		build:build
	})

	function build(item,data,callback){
		if(callback==undefined){
			return start(item,data)
		}
		return callback(null,start(item,data))

	}

	function start(item,data){
		if(frontEnd){
			currentPath=window.location.pathname
			qParams=q
		}else{

			currentPath=data.uiParams.urlPath
			qParams=data.uiParams
		}


		Object.keys(item.fields).forEach((key)=>{
			var field=item.fields[key]
			if(field.type=='lookup' && field.all==undefined){
				field.all=true
			}
			if(field.col==undefined){
				field.col=field.type=='dateRange'?5:3
			}
		})

		if(!item.options)
			item.options={}
		item.options.mode='addnew'
		item.options.form=false
		item.options.row=false
		item.options.headerButtons=''

		var s=''
		item.controls=formBuilder.build(item,data)	
		s=builder.control('form/filter_form',item)		
		return s
	}

})(typeof exports === 'undefined'?  
this['FilterBuilder']={}: exports)
