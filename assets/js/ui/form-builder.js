(function(exports) { 

	function build(formControls,data,mode,level=0){
		if(formControls==undefined)
			return ''
		var s=''

		Object.keys(formControls).forEach((key,index)=>{
			var item=formControls[key]
			
			item['caption']=ifNull(item['caption'],'')
			item['col']=ifNull(item['col'],'col-12');
			if(!isNaN(item.col)){
				item.col='col-' + item.col
			}
			item['type']=ifNull(item['type'],'textbox')
			item['required']=ifNull(item['required'],false)
			item['lookup']=ifNull(item['lookup'],[])
			item['textField']=ifNull(item['textField'],'text')
			item['valueField']=ifNull(item['valueField'],'value')
			item['class']=ifNull(item['class'],'')
			if(typeof item['readonly']=='undefined')
				item['readonly']=false

			if(typeof item['name']=='undefined')
				item['name']=key


			item['hasChildren']=false
			if(typeof item.formControls!='undefined')
				item.hasChildren=true

			var itemValue

			if(!item.hasChildren)
				itemValue=getSubObjectValue(item.formControls,item.name)

			if(typeof itemValue=='undefined')
				itemValue=''


			if(mode=='view')
				item['readonly']=true

			if(mode=='addnew' && typeof item.default!='undefined')
				itemValue=item.default
			if(itemValue)
			if(item.hasChildren){
				s+=`<div class="card ${item.col} p-0 m-0">
				<div class="card-header collapsible">
					<a class="btn btn-collapse" data-toggle="collapse" data-target="#cardCollapse${generateFormId(item.name)}" aria-expanded="true" aria-controls="cardCollapse${generateFormId(item.name)}" href="#"><i class="far fa-caret-square-up"></i></a>
					${item.caption}
				</div>
				<div id="cardCollapse${generateFormId(item.name)}" class="card-collapse collapse show">
					<div class="card-body p-1">
						<div class="row">
				`
				s+=build(item.formControls,item.formControls,mode,level)
				s+=`
						</div>
					</div>
				</div>`
				itemValue=''
			}else{
				switch(item.type.toLowerCase()) {
					case 'textbox' : 
					s+=textBox(item,itemValue,level)
					break
					case 'number' :
					case 'numberbox' :
					s+= numberBox(item,itemValue,level)
					break
					case 'label': 
					case 'div': 
					s+=  label(item,itemValue,level)
					break
					case 'textarea' :
					s+ textArea(item,itemValue,level)
					break

					case 'fileBase64' : 
					s+=fileBase64(item,itemValue,level)
					break

					case 'fileBase64Image' :
					s+=fileBase64Image(item,itemValue,level)
					break
					case 'checkbox':
					s+=checkBox(item,itemValue,level)
					break

					case 'lookup': 
					case 'combobox': 
					s+=lookUp(item,itemValue,level)
					break
					case 'json': 
					s+=jsonData(item,itemValue,level)
					break
					default :
					s+=textBox(item,itemValue,level)
					break
				}
			}

		})

		return s            
	}

	
	function getData(divId, formControls){
		var obj={}
		
		Object.keys(formControls).forEach((key)=>{
			var item=formControls[key]
			item['type']=ifNull(item['type'],'textbox')
			if(typeof item['name']=='undefined')
				item['name']=key
			item['caption']=ifNull(item['caption'],'')
			item['required']=ifNull(item['required'],false)

			var itemValue=item.default || ''
			var itemId=generateFormId(item.name)


			if(typeof item.formControls=='undefined'){
				switch(item.type.toLowerCase()) {
					case 'textbox' : 
					case 'textarea' :
					case 'json':
					obj[key]=$(`#${divId} #${itemId}`).val()
					break
					
					case 'number' :
					case 'numberbox' :
					obj[key]=Number($(`#${divId} #${itemId}`).val())
					break
					case 'checkbox':
					obj[key]=$(`#${divId} #${itemId}`).is(":checked")?true:false
					break
					case 'lookup': 
					case 'combobox': 
					obj[key]=$(`#${divId} #${itemId}`).val()
					break
					case 'label': 
					case 'div': 
					obj[key]=$(`#${divId} #${itemId}`).html()
					break

					case 'fileBase64' : 
					case 'fileBase64Image' :
					obj[key]={ 
						data: $(`#${divId} #fileDataBase64_${item.name.replaceAll('.','_')}`).val(),
						type:  $(`#${divId} #fileDataBase64_${item.name.replaceAll('.','_')}_type`).val(),
						fileName:  $(`#${divId} #fileDataBase64_${item.name.replaceAll('.','_')}_fileName`).val()
					}
					if(item.required && (obj[key].data || '')==''){
						obj=''
						return
					}
					break

					default :
					obj[key]=$(`#${divId} #${itemId}`).val()
					break
				}
			}else{
				obj[key]=getData(divId, item.formControls)
				if(obj[key]==={}){
					obj=''
					return
				}
			}


			if(item.required && (obj[key] || '')==''){
				console.log(`required key:`,key)
				obj=''
				return
			}

		})
		return obj
	}

	function getDataWithParameters(divId, formControls){
		var obj=clone(formControls)
		
		Object.keys(obj).forEach((key)=>{
			var item=formControls[key]
			item['type']=ifNull(item['type'],'textbox')
			if(typeof item['name']=='undefined')
				item['name']=key
			item['caption']=ifNull(item['caption'],'')
			item['required']=ifNull(item['required'],false)

			var itemValue=item.default || ''
			var itemId=generateFormId(item.name)


			if(typeof item.formControls=='undefined'){
				switch(item.type.toLowerCase()) {
					case 'textbox' : 
					case 'textarea' :
					case 'json':
					obj[key]['value']=$(`#${divId} #${itemId}`).val()
					break
					
					case 'number' :
					case 'numberbox' :
					obj[key]['value']=Number($(`#${divId} #${itemId}`).val())
					break
					case 'checkbox':
					obj[key]['value']=$(`#${divId} #${itemId}`).is(":checked")?true:false
					break
					case 'lookup': 
					case 'combobox': 
					obj[key]['value']=$(`#${divId} #${itemId}`).val()
					break
					case 'label': 
					case 'div': 
					obj[key]['value']=$(`#${divId} #${itemId}`).html()
					break

					case 'fileBase64' : 
					case 'fileBase64Image' :
					obj[key]['value']={ 
						data: $(`#${divId} #fileDataBase64_${item.name.replaceAll('.','_')}`).val(),
						type:  $(`#${divId} #fileDataBase64_${item.name.replaceAll('.','_')}_type`).val(),
						fileName:  $(`#${divId} #fileDataBase64_${item.name.replaceAll('.','_')}_fileName`).val()
					}
					if(item.required && (obj[key]['value'].data || '')==''){
						obj[key]['value']=''
						
					}
					break

					default :
					obj[key]['value']=$(`#${divId} #${itemId}`).val()
					break
				}
			}else{
				obj[key]['formControls']=getDataWithParameters(divId, item.formControls)
				if(JSON.stringify(obj[key]['formControls'])=='{}'){
					obj[key]['formControls']=undefined
				}
			}


			if(item.required && (obj[key]['value'] || '')==''){
				obj[key]['value']=''
			}

		})

		return obj
	}
	
	function textBox(item,itemValue,level){
		var s= `<div class="form-group ${item.col}" ${level>0?'style="margin-left:' + level*20 + 'px;"':''}>
		<label class="m-0 p-0">${item.caption}${item.required?' *':''}</label>
		<input type="text" class="form-control ${item.class}" id="${generateFormId(item.name)}" name="${generateFormName(item.name)}" placeholder="${item.readonly==true?'':item.caption}" autocomplete="off" onkeydown="" value="${itemValue}" ${item.required?'required="required"':''} ${item.readonly==true?'readonly':''}>
		</div>`
		return s
	}

	function numberBox(item,itemValue,level){
		return `<div class="form-group ${item.col}" ${level>0?'style="margin-left:' + level*20 + 'px;"':''}>
		<label class="m-0 p-0">${item.caption}${item.required?' *':''}</label>
		<input type="number" class="form-control ${item.class}" id="${generateFormId(item.name)}" name="${generateFormName(item.name)}" placeholder="${item.readonly==true?'':item.caption}" autocomplete="off" onkeydown="" value="${itemValue}" ${item.required?'required="required"':''} ${item.readonly==true?'readonly':''}>
		</div>`
	}

	function textArea(item,itemValue,level){
		return `<div class="form-group ${item.col}" ${level>0?'style="margin-left:' + level*20 + 'px;"':''}>
		<label class="m-0 p-0">${item.caption}${item.required?' *':''}</label>
		<textarea class="form-control ${item.class}" id="${generateFormId(item.name)}" name="${generateFormName(item.name)}"  rows="${(typeof item.rows!='undefined')?item.rows:4}"  placeholder="${item.readonly==true?'':item.caption}" ${item.required?'required="required"':''} ${item.readonly==true?'readonly':''}>${itemValue}</textarea>
		</div>`
	}

	function label(item,itemValue,level){
		var s=`<div class="form-group ${item.col}" ${level>0?'style="margin-left:' + level*20 + 'px;"':''}>`

		if(item.type=='label'){
			s+=`<div class="${item.class}" id="${generateFormId(item.name)}"><b>${item.caption}:</b> ${itemValue}</div>`
		} else {
			s+=`<div class="${item.class}" id="${generateFormId(item.name)}">${item.caption}</div>`
		}
		s+=`</div>`
		return s
	}

	function checkBox(item,itemValue,level){
		return `<div class="form-group ${item.col}" ${level>0?'style="margin-left:' + level*20 + 'px;"':''}>
		<label>
		<input type="checkbox" class="" id="${generateFormId(item.name)}" name="${generateFormName(item.name)}" onkeydown="" value="true" ${(itemValue?'checked':'')} ${item.readonly==true?'disabled':''} />
		${item.caption}
		</label>
		</div>`
	}

	function lookUp(item,itemValue,level){
		var s=`<div class="form-group ${item.col}" ${level>0?'style="margin-left:' + level*20 + 'px;"':''}>
		<label class="m-0 p-0">${item.caption}${item.required?' *':''}</label>
		<select id="${generateFormId(item.name)}" name="${generateFormName(item.name)}" class="form-control" onkeydown="" ${item.required?'required="required"':''} ${item.readonly==true?'disabled':''}>`
		item.lookup.forEach(function(e){
			s+=`<option value="${e[item.valueField]}" ${e[item.valueField]==itemValue?'selected':''}>${e[item.textField]}</option>`
		})
		s+=`</select>
		</div>`
		return s
	}


	function jsonData(item,itemValue,level){
		return `<div class="form-group<% if(typeof item.class!='undefined'){ ${item.class}<%}}" ${level>0?'style="margin-left:' + level*20 + 'px;"':''}>
		<label class="m-0">${item.caption}${item.required?' *':''}</label>
		<textarea id="${generateFormId(item.name)}" name="${generateFormName(item.name)}" class="form-control" rows="10"  style="height: auto;font-family: monospace;" ${item.readonly==true?'readonly':''}>${(typeof itemValue=='object')?JSON.stringify(itemValue,null,2):itemValue}</textarea>
		</div>`

	}

	function fileBase64(item,itemValue,level){
		return `<div class="form-group ${item.col}" ${level>0?'style="margin-left:' + level*20 + 'px;"':''}>
		<label class="m-0 p-0">${item.caption}${item.required?' *':''}</label><br>

		<label for="fileToUpload_${item.name.replaceAll('.','_')}" class="btn btn-primary"><i class="fa fa-file"></i> Dosya seçiniz</label>
		<input type="file" name="fileToUpload_${item.name}" id="fileToUpload_${item.name.replaceAll('.','_')}" style="visibility:hidden;" accept="" >
		<input type="hidden" name="${generateFormName(item.name)}[data]" id="fileDataBase64_${item.name.replaceAll('.','_')}" value="${(typeof itemValue.data!='undefined')?itemValue.data:''}">
		<input type="hidden" name="${generateFormName(item.name)}[type]" id="fileToUpload_${item.name.replaceAll('.','_')}_type" value="${(typeof itemValue.type!='undefined')?itemValue.type:''}">
		<input type="hidden" name="${generateFormName(item.name)}[fileName]" id="fileToUpload_${item.name.replaceAll('.','_')}_fileName" value="${(typeof itemValue.fileName!='undefined')?itemValue.fileName:''}">

		<a id="fileToUpload_download_${item.name.replaceAll('.','_')}" href="<% if(typeof itemValue.data!='undefined'){${itemValue.data}<%}}" download="${(typeof itemValue.fileName!='undefined')?itemValue.fileName:''}">${(typeof itemValue.fileName!='undefined')?'<i class="fa fa-file"></i>' + itemValue.fileName:''}</a>
		<script type="text/javascript">
		$(document).ready(function(){
			$("#fileToUpload_${item.name.replaceAll('.','_')}").change(function() {
				var filename = this.files[0].name
				$('#fileToUpload_download_${item.name.replaceAll('.','_')}').attr('download',filename)
				$('#fileToUpload_download_${item.name.replaceAll('.','_')}').html('<i class="fa fa-file"></i> ' + filename)
				var file =this.files[0]
				var reader  = new FileReader()
				reader.addEventListener("load", ()=>{
					$('#fileDataBase64_${item.name.replaceAll('.','_')}').val(reader.result)
					$('#fileToUpload_${item.name.replaceAll('.','_')}_type').val(file.type)
					$('#fileToUpload_${item.name.replaceAll('.','_')}_fileName').val(filename)
					$('#fileToUpload_download_${item.name.replaceAll('.','_')}').attr('href',$('#fileDataBase64_${item.name.replaceAll('.','_')}').val())
				}, false)
				if(file) {
					reader.readAsDataURL(file);
				}
			})
		})
		</script>
		</div>`
	}

	function fileBase64Image(item,itemValue,level){
		return `<div class="form-group ${item.col}" ${level>0?'style="margin-left:' + level*20 + 'px;"':''}>
		<label for="fileToUpload_${item.name.replaceAll('.','_')}" class="btn btn-primary"><i class="fas fa-images"></i> ${item.caption}${item.required?' *':''}</label>
		<br>
		<img id="fileToUpload_download_${item.name.replaceAll('.','_')}" src="${(typeof itemValue.data!='undefined')?itemValue.data:'/img/placehold-place.jpg'}" download="${(typeof itemValue.fileName!='undefined')?itemValue.fileName:''}" style="width: 300px;height: 300px;">

		<input type="file" name="fileToUpload_${item.name}" id="fileToUpload_${item.name.replaceAll('.','_')}" style="visibility:hidden;" accept="" >
		<input type="hidden" name="${generateFormName(item.name)}[data]" id="fileDataBase64_${item.name.replaceAll('.','_')}" value="${(typeof itemValue.data!='undefined')?itemValue.data:''}">
		<input type="hidden" name="${generateFormName(item.name)}[type]" id="fileToUpload_${item.name.replaceAll('.','_')}_type" value="${(typeof itemValue.type!='undefined')?itemValue.type:''}">
		<input type="hidden" name="${generateFormName(item.name)}[fileName]" id="fileToUpload_${item.name.replaceAll('.','_')}_fileName" value="${(typeof itemValue.fileName!='undefined')?itemValue.fileName:''}">

		<script type="text/javascript">
		$(document).ready(function(){
			$("#fileToUpload_${item.name.replaceAll('.','_')}").change(()=>{
				var filename = this.files[0].name

				$('#fileToUpload_download_${item.name.replaceAll('.','_')}').attr('download',filename)
				var file =this.files[0]

				var reader  = new FileReader()
				reader.addEventListener("load", function () {
					$('#fileDataBase64_${item.name.replaceAll('.','_')}').val(reader.result)
					$('#fileToUpload_${item.name.replaceAll('.','_')}_type').val(file.type)
					$('#fileToUpload_${item.name.replaceAll('.','_')}_fileName').val(filename)
					$('#fileToUpload_download_${item.name.replaceAll('.','_')}').attr('src',$('#fileDataBase64_${item.name.replaceAll('.','_')}').val())
				}, false)
				if(file){
					reader.readAsDataURL(file)
				}
			})
		})
		</script>
		</div>`
	}


	function getSubObjectValue(targetObj, keyPath) { 
		var keys = keyPath.toString().split('.')
		if(keys.length == 0)
			return undefined
		keys = keys.reverse()
		var subObject = targetObj
		while(keys.length) {
			var k = keys.pop();
			if(typeof subObject[k]=='undefined' || subObject[k]==null) {
				return undefined
			} else {
				if(subObject[k].value!=undefined){
					subObject = subObject[k].value
				}else{
					subObject = subObject[k]
				}
				
			}
		}
		return subObject
	}

	function generateFormName(name){ 
		var keys = name.toString().split('.')
		if(keys.length<=1){
			return name
		}else{
			var s=''
			keys.forEach((k,index)=>{
				if(index==0)
					s=k
				else
					s+=`[${k}]`
			})
			return s
		}
	}

	function generateFormId(name) { 
		return generateFormName(name).replaceAll('.','_')
	}

	function ifNull(item,defaultValue){
		if(typeof item=='undefined'){
			if(typeof defaultValue!='undefined'){
				return defaultValue
			}else{
				return ''
			}
		}else{
			if(item==null){
				if(typeof defaultValue!='undefined'){
					return defaultValue
				}else{
					return ''
				}
			}else{
				return item
			}
		}
	}

	exports.formBuilder = Object.freeze({
		build:build,
		getData:getData,
		getDataWithParameters:getDataWithParameters,
		textBox:textBox,
		numberBox:numberBox,
		textArea:textArea,
		label:label,
		checkBox:checkBox,
		lookUp:lookUp,
		jsonData:jsonData,
		fileBase64:fileBase64,
		fileBase64Image:fileBase64Image
	})


})(typeof exports === 'undefined'?  
this['formBuilder']={}: exports)