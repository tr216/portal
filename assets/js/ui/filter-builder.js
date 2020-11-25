(function(exports) {
	var frontEnd=true
	if(typeof config!='undefined'){
		if(typeof config.mongodb!='undefined'){
			frontEnd=false
			
		}
	}
	
	var currentPath=''

	exports.FilterBuilder = Object.freeze({
		generateFilter:generateFilter
	})

	function generateFilter(fields,uiParams,data,callback){
		if(callback==undefined){
			return start(fields,uiParams,data)
		}
		iteration(Object.keys(fields),(key,cb)=>{
			if(fields[key].type=='remoteLookup' && fields[key].dataSource!=undefined){
				if(frontEnd){
					cb(null)
				}else{

					fields[key].dataSource.label=fields[key].dataSource.label==undefined?'{name}':fields[key].dataSource.label
					api.get(fields[key].dataSource.url,uiParams,{},(err,resp)=>{
						if(!err){
							fields[key]['lookup']={}
							resp.data.docs.forEach((e)=>{
								fields[key].lookup[e._id]=replaceUrlCurlyBracket(fields[key].dataSource.label,e)
							})
							cb(null)
						}else{
							cb(err)
						}
					})
				}
			}else{
				cb(null)
			}
		},0,true,(err,result)=>{
			if(!err){
				callback(null,start(fields,uiParams,data))
			}else{
				callback(err)
			}
		})
	}
	function start(fields,uiParams,data){

		if(frontEnd){
			currentPath=window.location.pathname
			qParams=q
		}else{

			currentPath=uiParams.urlPath
			qParams=uiParams.q
		}
		
		Object.keys(fields).forEach((key)=>{
			if(fields[key].type=='lookup' && fields[key].all==undefined){
				fields[key].all=true
			}
			if(fields[key].col==undefined){
				fields[key].col=fields[key].type=='dateRange'?5:3
			}
		})
		
		var s=`<form method="POST" name="form-filter" id="form-filter" autocomplete="off">
		<div class="row m-0 p-0">
		${formBuilder.generateForm(fields,{mode:'addnew',form:false,row:false, headerButtons:''},uiParams,data)}
		<div class="col text-right mt-1 pt-3"><button type="submit" class="btn btn-primary" name="btnFilter"><i class="fas fa-filter"></i> Süz</button></div>
		</div>
		</form>
		`

		var script=`<script type="text/javascript">
		$(document).ready(()=>{
		var fields=${JSON.stringify(fields)}
		
		`
		Object.keys(fields).forEach((key)=>{
			script+=`
			$('#${generateFormId(key)}').val((q['${key}'] || ''))
			`
		})	

		script+=`
		})
		</script>`

		if(frontEnd){
			$('body').append(script)
		}else{
			s+=script
		}

		return s
	}


})(typeof exports === 'undefined'?  
this['FilterBuilder']={}: exports)
