(function(exports) {
	var frontEnd=true
	if(typeof config!='undefined'){
		if(typeof config.mongodb!='undefined'){
			frontEnd=false
		}
	}
	
	exports.FormBuilder = Object.freeze({
		generateForm:generateForm,
		getData:getData,
		generateControls:generateControls,
		textBox:textBox,
		remoteLookup:remoteLookup,
		lookUp:lookUp,
		numberBox:numberBox,
		dateRangeBox:dateRangeBox,
		dateBox:dateBox,
		timeBox:timeBox,
		textArea:textArea,
		checkBox:checkBox,
		label:label
	})

	function generateForm(fields,options,uiParams,data,callback){
		if(callback==undefined){
			return start(fields,options,uiParams,data)
		}
		return callback(null,start(fields,options,uiParams,data))

	}

	var generateFormScript1=false

	function start(fields,options,uiParams,data){

		options.formName=options.formName || 'form-general'
		
		var headerButtons=''

		if(typeof options.headerButtons=='undefined'){
			if((options.mode || 'view')!='view'){
				headerButtons +=`<button type="submit" form="${options.formName}" class="btn btn-primary btn-form-header" title="Kaydet" name="btnFormSave"><i class="fas fa-save"></i></button>`
			} 
			headerButtons +=`<a href="javascript:goBack();" class="btn btn-dark  btn-form-header ml-2" title="Vazgeç"><i class="fas fa-reply"></i></a>`
		}else{
			headerButtons=options.headerButtons
		}

		Object.keys(fields).forEach((key)=>{
			if(fields[key].visible==undefined)
				fields[key].visible=true
		})



		var isTabForm=false
		if(fields.tabs!=undefined){
			if(Array.isArray(fields.tabs)){
				isTabForm=true
			}
		}

		var s=`${(options.form==undefined?true:options.form)?'<form method="POST" action="" name="' + options.formName + '" id="' + options.formName + '" autocomplete="off" >':''}`

		var script1=`
		<script type="text/javascript">
		var fields=${JSON.stringify(fields)}
		var options=${JSON.stringify(options)}
		var data=${JSON.stringify(data || {})}

		</script>

		<script type="text/javascript">
		`
		if(options.script!=undefined){
			script1+=`

			`
			if(Array.isArray(options.script)){
				options.script.forEach((e)=>{
					script1+=e + '\r\n'
				})
			}else{
				script1+=options.script
			}
		}
		script1+=`
		</script>
		`
		
		if(frontEnd){
			if(generateFormScript1==false){
				$('body').append(script1)
				generateFormScript1=true
			}
		}else{
			s+=script1
		}

		if(isTabForm){
			var bFound=false
			fields.tabs.forEach((e)=>{
				e['active']=fields.tabs['active']==undefined?false:e['active']
				if(e.active)
					bFound=true
			})

			if(bFound==false)
				fields.tabs[0].active=true

			s+=`
			<div class="row">
			<div class="col-md-12">
			<ul class="nav nav-tabs" role="tablist">`
			fields.tabs.forEach((tab,tabIndex)=>{
				s+=`<li class="nav-item">
				<a class="nav-link ${tab.active?'active':''}" href="#formTab${tabIndex}" role="tab" data-toggle="tab" id="IDformTab${tabIndex}" aria-controls="formTab${tabIndex}" aria-selected="${tab.active?'true':'false'}">
				${tab.icon!=undefined?'<i class="' + tab.icon + '"></i>':''} ${tab.title}
				</a>
				</li>`
			})
			s+=`</ul>`
			s+=`<div class="tab-content" style="min-height: 70vh;overflow: auto;">`
			fields.tabs.forEach((tab,tabIndex)=>{
				s+=`<div class="tab-pane ${tab.active?'show active':''} " id="formTab${tabIndex}" role="tabpanel" aria-labelledby="IDformTab${tabIndex}">`
				if(tab.partial && frontEnd==false){
					s+=partial(tab.partial,data)
				}else{
					s+=`
					${(options.row==undefined?true:options.row)?'<div class="row">':''}
					${generateControls(tab.fields || tab.controls || tab.formControls || tab.children || tab, {mode:options.mode,form:false,row:false, headerButtons:''}, uiParams, data)}
					${(options.row==undefined?true:options.row)?'</div>':''}`

				}
				s+=`</div>`
			})
			s+=`
			</div>
			</div>
			</div>`

		}else{

			s+=`
			${(options.row==undefined?true:options.row)?'<div class="row">':''}
			${generateControls(fields, options, uiParams, data)}
			${(options.row==undefined?true:options.row)?'</div>':''}
			`
		}

		s+=`${(options.form==undefined?true:options.form)?'</form>':''}`

		var script=`
		<script type="text/javascript">
		var fields=${JSON.stringify(fields)}
		var options=${JSON.stringify(fields)}
		var data=${JSON.stringify(data || {})}

		$(document).ready(()=>{
			var headerButtons=document.getElementById('headerButtons')
			if(headerButtons)
				headerButtons.innerHTML='${headerButtons}'
			`

			Object.keys(fields).forEach((key)=>{
				if((fields[key].type || '').toLowerCase()=='daterange'){
					script +=`
					$('#${generateFormId(key)} #cboEasyDate').on('change',cboEasyDate_onchange)
					if(pageSettings.getItem('${generateFormId(key)}')){
						$('#${generateFormId(key)} #cboEasyDate').val(pageSettings.getItem('${generateFormId(key)}'))
						cboEasyDate_onchange()
					}

					function cboEasyDate_onchange(){
						var obj=cboEasyDateChange($('#${generateFormId(key)} #cboEasyDate').val())

						$('#${generateFormId(key)} #date1').val(obj.date1)
						$('#${generateFormId(key)} #date2').val(obj.date2)
						pageSettings.setItem('${generateFormId(key)}',$('#${generateFormId(key)} #cboEasyDate').val())
					}
					`
				}
			})

			script+=`	})

			</script>
			`

			if(frontEnd){
				$('body').append(script)
			}else{
				s+=script
			}
			return s

		}


		function generateControls(fields,options,uiParams,data,inline=false){
			if(fields==undefined)
				return ''
			var s=''

			Object.keys(fields).forEach((key)=>{

				var item=clone(fields[key])

				item['title']=ifNull(item['title'],'')
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
				if(typeof item['readonly']=='undefined')
					item['readonly']=false

				if(typeof item['field']=='undefined')
					item['field']=key


				item['hasChildren']=false
				var children={}

				if(typeof item.controls!='undefined' || typeof item.children!='undefined' || typeof item.fields!='undefined' || typeof item.formfields!='undefined'  || typeof item.formControls!='undefined'){
					if(item.type!='grid'){
						children=item.controls || item.children || item.fields || item.formfields || item.formControls || {}
						item.hasChildren=true
					}
				}

				var itemValue

				if(!item.hasChildren)
					itemValue=getPropertyByKeyPath(data,key)


				if(typeof itemValue=='undefined')
					itemValue=''

				if(options.mode=='view')
					item['readonly']=true

				if(options.mode=='addnew')
					itemValue=item.default || item.value || itemValue

				if(item.hasChildren){
					s+=`<div class="card cerceve1 ${item.col} p-0 m-0 mb-2 ${!item.visible?'hidden':''}">
					<div class="card-header">
					<a class="btn btn-collapse ${item.collapsed==true?'collapsed':''}" data-toggle="collapse" data-target="#cardCollapse${generateFormId(item.field)}" aria-expanded="${item.collapsed==true?'false':'true'}" aria-fields="cardCollapse${generateFormId(item.field)}" href="#"><i class="far fa-caret-square-up fa-2x"></i></a>
					${item.title}
					</div>
					<div  id="cardCollapse${generateFormId(item.field)}" class="card-body p-1 card-collapse collapse ${item.collapsed==true?'collapsed':'show'}">
					<div class="row">
					${generateControls(children,options, uiParams, data)}
					</div>
					</div>
					</div>`
					
					itemValue=''
				}else{
					if(item.type==undefined)
						return ''
					switch(item.type.toLowerCase()) {
						case 'string' : 
						case 'textbox' : 
						s+=textBox(item,itemValue)
						break
						case 'remotelookup' : 
						s+=remoteLookup(item,itemValue,false,data)
						break
						
						case 'money' :
						case 'number' :
						case 'numberbox' :
						s+= numberBox(item,itemValue)
						break
						case 'date' :
						s+= dateBox(item,itemValue)
						break
						case 'time' :
						s+= timeBox(item,itemValue)
						break
						case 'daterange' :
						s+= dateRangeBox(item,itemValue)
						break
						case 'label': 
						case 'div': 
						s+= label(item,itemValue)
						break
						case 'w-100': 
						case 'w100': 
						s+= '<div class="w-100"></div>'
						break
						case 'strings' :
						case 'textarea' :
						s+=textArea(item,itemValue)
						break

						case 'file' : 
						case 'filebase64' : 
						s+=fileBase64(item,itemValue)
						break

						case 'image' :
						case 'filebase64image' :

						s+=fileBase64Image(item,itemValue)
						break
						case 'boolean':
						case 'checkbox':
						s+=checkBox(item,itemValue)
						break

						case 'lookup': 
						case 'combobox': 
						s+=lookUp(item,itemValue,false,data)
						break
						case 'json': 
						s+=jsonData(item,itemValue)
						break
						case 'grid': 
						s+=insideGrid(item,uiParams,itemValue)
						break
						default :
						s+=textBox(item,itemValue)
						break
					}
				}

			})
			return s
		}

		function getData(divId, fields){
			var obj={}

			Object.keys(fields).forEach((key)=>{
				var item=fields[key]
				item['type']=ifNull(item['type'],'textbox')
				if(typeof item['field']=='undefined')
					item['field']=key
				item['title']=ifNull(item['title'],'')
				item['required']=ifNull(item['required'],false)

				var itemValue=item.default || ''
				var itemId=generateFormId(item.field)


				if(typeof item.controls=='undefined' && typeof item.children=='undefined' && typeof item.fields=='undefined'){
					switch(item.type.toLowerCase()) {
						case 'textbox' : 
						case 'textarea' :
						case 'json':
						obj[key]=$(`${divId} #${itemId}`).val()
						break
						case 'remotelookup' : 

						obj[key]=$(`${divId} #${itemId}`).val()
						break

						case 'number' :
						case 'numberbox' :
						obj[key]=Number($(`${divId} #${itemId}`).val())
						break
						case 'checkbox':
						obj[key]=$(`${divId} #${itemId}`).is(":checked")?true:false
						break
						case 'lookup': 
						case 'combobox': 
						obj[key]=$(`${divId} #${itemId}`).val()
						break
						case 'label': 
						case 'div': 
						obj[key]=$(`${divId} #${itemId}`).html()
						break

						case 'fileBase64' : 
						case 'fileBase64Image' :
						obj[key]={ 
							data: $(`#${divId} #fileDataBase64_${item.field.replaceAll('.','_')}`).val(),
							type:  $(`#${divId} #fileDataBase64_${item.field.replaceAll('.','_')}_type`).val(),
							fileName:  $(`#${divId} #fileDataBase64_${item.field.replaceAll('.','_')}_fileName`).val()
						}
						if(item.required && (obj[key].data || '')==''){
							obj[key]=''
						}
						break

						default :
						obj[key]=$(`${divId} #${itemId}`).val()
						break
					}
				}else{
					var children=item.controls || item.children || item.fields

					obj[key]['children']=getData(divId, children)
					if(JSON.stringify(obj[key]['children'])=='{}'){
						obj[key]['children']=undefined
					}
				}
				if(item.required && (obj[key] || '')==''){
					obj[key]['value']=''
				}

			})

			return listObjectToObject(obj)
		}

		function insideGrid(item,uiParams,itemValue){
			var formGridOptions={
				insideForm:true,
				parentField:item.field
			}
			var s=``
			if(item.data==undefined)
				item.data={}

			if(item.data.docs==undefined)
				item.data.docs=[]

			if(Array.isArray(itemValue)){
				item.data.docs=itemValue
			}else{
				item.data.docs=[]
			}
			Object.keys(item.fields).forEach((key)=>{
				if(item.fields[key].type=='lookup' && item.fields[key].staticValues!=undefined){
					item.fields[key].lookup=staticValues[item.fields[key].staticValues]
				}
			})
			formGridOptions=Object.assign({},formGridOptions,item.options)

			s+=`<div class="card cerceve1 ${item.col} p-0 m-0 mb-2 ${!item.visible?'hidden':''}">
			<div class="card-header  ${item.collapsed==true?'collapsed':'collapsible'}">
			<a class="btn btn-collapse ${item.collapsed==true?'collapsed':''}" data-toggle="collapse" data-target="#cardCollapse${generateFormId(item.field)}" aria-expanded="${item.collapsed==true?'false':'true'}" aria-fields="cardCollapse${generateFormId(item.field)}" href="#"><i class="far fa-caret-square-up fa-2x"></i></a>
			${item.title}
			</div>
			<div  id="cardCollapse${generateFormId(item.field)}" class="card-body p-1 card-collapse collapse ${item.collapsed==true?'collapsed':'show'}">
			<div class="row">
			${gridBuilder.generateGrid(item.fields,formGridOptions,uiParams,item.data)}
			</div>
			</div>
			</div>`


			return s
		}

		function textBox(field,value,inline=false){
			var s=``

			if(inline==false) 
				s+=`<div class="form-group ${field.col} ${!field.visible?'hidden':''}" >
			<label class="m-0 p-0">${field.title}${field.required?' *':''}</label>`

			s+=`<input type="text" class="form-control ${field.class || ''} ${!field.visible?'hidden':''}" id="${generateFormId(field.field)}" name="${generateFormName(field.field)}" placeholder="${field.readonly==true?'':field.title}" autocomplete="chrome-off" onkeydown="" value="${value}" ${field.required?'required="required"':''} ${field.readonly==true?'readonly':''} ${field.onchange?'onchange="' + field.onchange + '"':''}>`

			if(inline==false)
				s+=`</div>`
			return s
		}


		function lookUp(field,value,inline=false,data=undefined){
			var s=``
			if(inline==false)
				s+=`<div class="form-group ${field.col} ${!field.visible?'hidden':''}">
			<label class="m-0 p-0">${field.title}${field.required?' *':''}</label>`

			s+=`<select id="${generateFormId(field.field)}" name="${generateFormName(field.field)}" class="form-control ${field.class || ''} ${!field.visible?'hidden':''}" onkeydown="" ${field.required?'required="required"':''} ${field.readonly==true?'disabled':''} ${field.onchange?'onchange="' + field.onchange + '"':''}>`
			if(field.all==true){
				s+=`<option value="" ${value==''?'selected':''}>*</option>`
			}else{
				if((field.selectOne==undefined?true:field.selectOne))
					s+=`<option value="" ${value==''?'selected':''}>-- Seç --</option>`
			}

			if(field.staticValues!=undefined && field.lookup==undefined){
				field.lookup=staticValues[field.staticValues]
			}

			Object.keys(field.lookup).forEach((key)=>{
				s+=`<option value="${key}" ${key==value?'selected':''}>${field.lookup[key]}</option>`
			})
			s+=`</select>`

			if((field.lookupTextField || '')!=''){
				s+=`<input type="hidden" id="${generateFormId(field.lookupTextField)}" name="${generateFormName(field.lookupTextField)}" value="" />`
				var script=`<script type="text/javascript">
				
				$(document).ready(()=>{
					$('#${generateFormId(field.field)}').on('change',()=>{
						if($('#${generateFormId(field.field)}').val()!=''){
							$('#${generateFormId(field.lookupTextField)}').val($('#${generateFormId(field.field)} option:selected').text())
						}else{
							$('#${generateFormId(field.lookupTextField)}').val('')
						}
						
					})
				})
				</script>
				`

				if(frontEnd){
					$('body').append(script)
				}else{
					s+=script
				}
				
			}

			if(inline==false)
				s+=`</div>`

			
			return s
		}

		function remoteLookup(field,value,inline=false,data=undefined){
			var s=``
			
			s+=inline==false?`<div class="form-group ${field.col} ${!field.visible?'hidden':''}">
			<label class="m-0 p-0">${field.title} ${field.required?' *':''}</label>`:''

			
			var lookupTextField_id=generateFormId(field.field) + '-autocomplete-text'
			var lookupTextField_name=generateFormName(field.field)+ '-autocomplete-text'
			var lookupTextValue=''
			if(field.lookupTextField!=undefined){
				lookupTextField_id=generateFormId(field.lookupTextField)
				lookupTextField_name=generateFormName(field.lookupTextField)
				if(data!=undefined){
					lookupTextValue=getPropertyByKeyPath(data,field.lookupTextField)
					if((lookupTextValue || '')=='')
						lookupTextValue=''
				}
			}
			s+=`<div class="input-group ${!field.visible?'hidden':''}">
			<input type="text" class="form-control ${field.class || ''}" id="${lookupTextField_id}" name="${lookupTextField_name}" placeholder="${field.readonly==true?'':field.title}" autocomplete="chrome-off" value="${lookupTextValue}" ${field.required?'required="required"':''} ${field.readonly==true?'readonly':''} />
			<div class="input-group-prepend">
			<div class="input-group-text"><i class="fas fa-braille"></i></div>
			</div>
			</div>
			<input type="hidden" id="${generateFormId(field.field)}" name="${generateFormName(field.field)}" value="${value}" />
			<input type="hidden" id="${generateFormId(field.field)}-obj"  value="" />
			`

			s+=inline==false?`</div>`:''

			if(field.dataSource==undefined)
				return s

			var searchUrl=''
			if((field.dataSource.search || '')!=''){
				searchUrl=replaceUrlCurlyBracket(field.dataSource.search, {_id:value})
				if(searchUrl.indexOf('sid=')<0){
					if(searchUrl.indexOf('?')<0){
						searchUrl+='?sid={sid}'
					}else{
						searchUrl+='&sid={sid}'
					}
				}
			}else if((field.dataSource.url || '')!=''){
				searchUrl=replaceUrlCurlyBracket(field.dataSource.url, {_id:value})
				if(searchUrl.indexOf('?')<0){
					searchUrl+='?search={search}'
				}else{
					searchUrl+='&search={search}'
				}

				if(searchUrl.indexOf('sid=')<0){
					searchUrl+='&sid={sid}'
				}
			}

			var idUrl=''
			if((field.dataSource.id || field.dataSource.idUrl || '')!=''){
				idUrl=replaceUrlCurlyBracket((field.dataSource.id  || field.dataSource.idUrl), {_id:value})
				if(idUrl.indexOf('sid=')<0){
					if(idUrl.indexOf('?')<0){
						idUrl+='?sid={sid}'
					}else{
						idUrl+='&sid={sid}'
					}
				}

			}else  if((field.dataSource.url || '')!=''){
				idUrl=replaceUrlCurlyBracket(field.dataSource.url, {_id:value})
				if(idUrl.indexOf('?')<0){
					idUrl+=`/${value}?sid={sid}`
				}else{
					idUrl+=`&id=${value}`
				}

				if(searchUrl.indexOf('sid=')<0){
					searchUrl+='&sid={sid}'
				}
			}
			if(searchUrl=='' || idUrl==''){
				return s
			}
			var labelStr=(field.dataSource.label || '{name}')

			var script =`
			<script type="text/javascript">
			$(document).ready(()=>{

				$('#${lookupTextField_id}').autocomplete({
					source:function(request,response){
						var typedText=encodeURIComponent2(request.term)
						var url=('${searchUrl}').replace('{search}',typedText).replace('{search}',typedText).replace('{sid}',q.sid).replace('{mid}',q.mid)

						getAjax(url,'${labelStr}','${value || ''}',(err,result)=>{
							if(!err){
								response(result)
							}else{
								console.error(err)
								response([])
							}
						})
					},
					select: function (event, ui) {

						$("#${lookupTextField_id}").val((ui.item.label || ''))
						$("#${generateFormId(field.field)}").val(ui.item.obj._id.toString())
						$("#${generateFormId(field.field)}-obj").val(encodeURIComponent2(JSON.stringify(ui.item.obj)))
						`
						if(field.onchange){
							script+=`
							${field.onchange}
							`
						}

						script+=`
						return false
					}
				})

				$('#${lookupTextField_id}').on('change',()=>{
					if($('#${lookupTextField_id}').val()==''){
						$('#${generateFormId(field.field)}').val('')
						$('#${generateFormId(field.field)}-obj').val('')
					}
				})
				`
				
				if((value || '')!=''){
					script +=`
					var url=('${idUrl}').replace('{sid}',q.sid).replace('{mid}',q.mid)
					getAjax(url,'${labelStr}','', (err,result)=>{
						if(!err){
							if(result.length>0){
								$('#${lookupTextField_id}').val((result[0].label || ''))
								$('#${generateFormId(field.field)}').val(result[0].obj._id.toString())
								$("#${generateFormId(field.field)}-obj").val(encodeURIComponent2(JSON.stringify(result[0].obj)))
							}else{
								$('#${lookupTextField_id}').val('')
								$('#${generateFormId(field.field)}').val('')
								$('#${generateFormId(field.field)}-obj').val('')
							}

						}else{
							console.error('err1:',err)
							$('#${lookupTextField_id}').val(err.message)
						}
					})
					`
				}

				script +=`})
				</script>
				`

				if(frontEnd){
					$('body').append(script)
				}else{
					s+=script
				}
				return s
			}




			function dateRangeBox(field,value,inline=false){
				var cboEasyDate='thisMonth'
				var s=``
				if(inline==false)
					s+=`<div class="form-group ${field.col} ${!field.visible?'hidden':''}" >
				<label class="m-0 p-0">${field.title}${field.required?' *':''}</label>`

				s+=`<div id="${generateFormId(field.field)}" class="row m-0 p-0 ${!field.visible?'hidden':''}">
				
				<select class="form-control col-sm-4 ${field.class || ''}" name="cboEasyDate" id="cboEasyDate">
				<option value="" ${(cboEasyDate || '')==''?'selected':''}>Tarih</option>
				<option value="today" ${(cboEasyDate || '')=='today'?'selected':''}>Bugün</option>
				<option value="thisWeek" ${(cboEasyDate || '')=='thisWeek'?'selected':''}>Bu Hafta</option>
				<option value="thisMonth" ${(cboEasyDate || '')=='thisMonth'?'selected':''}>Bu Ay</option>
				<option value="last1Week" ${(cboEasyDate || '')=='last1Week'?'selected':''}>Son 1 Hafta</option>
				<option value="last1Month" ${(cboEasyDate || '')=='last1Month'?'selected':''}>Son 1 Ay</option>
				<option value="last3Months" ${(cboEasyDate || '')=='last3Months'?'selected':''}>Son 3 Ay</option>
				<option value="last6Months" ${(cboEasyDate || '')=='last6Months'?'selected':''}>Son 6 Ay</option>
				<option value="thisYear" ${(cboEasyDate || '')=='thisYear'?'selected':''}>Bu yıl</option>
				<option value="last1Year" ${(cboEasyDate || '')=='last1Year'?'selected':''}>Son 1 yıl</option>
				</select>
				<input type="date" name="date1" id="date1" class="form-control col-sm-4"  autocomplete="off" value="${moment().format('YYYY-MM-DD')}">
				<input type="date" name="date2" id="date2" class="form-control col-sm-4"  autocomplete="off" value="${moment().format('YYYY-MM-DD')}">
				</div>`

				if(inline==false)
					s+=`</div>`
				return s
			}


			function dateBox(field,value,inline=false){
				var s=``
				if(inline==false)
					s+=`<div class="form-group ${field.col} ${!field.visible?'hidden':''}" >
				<label class="m-0 p-0">${field.title}${field.required?' *':''}</label>`

				s+=`<input type="date" class="form-control ${field.class || ''} ${!field.visible?'hidden':''}" id="${generateFormId(field.field)}" name="${generateFormName(field.field)}" placeholder="${field.readonly==true?'':field.title}" autocomplete="off" onkeydown="" value="${value}" ${field.required?'required="required"':''} ${field.readonly==true?'readonly':''} ${field.onchange?'onchange="' + field.onchange + '"':''}>`

				if(inline==false)
					s+=`</div>`
				return s
			}

			function timeBox(field,value,inline=false){
				var s=``
				if(inline==false)
					s+=`<div class="form-group ${field.col} ${!field.visible?'hidden':''}" >
				<label class="m-0 p-0">${field.title}${field.required?' *':''}</label>`

				s+=`<input type="time" class="form-control ${field.class || ''} ${!field.visible?'hidden':''}" id="${generateFormId(field.field)}" name="${generateFormName(field.field)}" placeholder="${field.readonly==true?'':field.title}" autocomplete="off" onkeydown="" value="${value}" ${field.required?'required="required"':''} ${field.readonly==true?'readonly':''} ${field.onchange?'onchange="' + field.onchange + '"':''}>`
				if(inline==false)
					s+=`</div>`
				return s
			}


			function numberBox(field,value,inline=false){
				var s=``
				if(inline==false)
					s+=`<div class="form-group text-right ${field.col} ${!field.visible?'hidden':''}" >
				<label class="m-0 p-0">${field.title}${field.required?' *':''}</label>`

				s+=`<input type="number" class="form-control text-right ${field.class || ''} ${!field.visible?'hidden':''}" id="${generateFormId(field.field)}" name="${generateFormName(field.field)}" placeholder="${field.readonly==true?'':field.title}" autocomplete="off" onkeydown="" value="${value}" ${field.required?'required="required"':''} ${field.readonly==true?'readonly':''} ${field.onchange?'onchange="' + field.onchange + '"':''}>`

				if(inline==false)
					s+=`</div>`

				return s
			}

			function textArea(field,value,inline=false){
				var s=``
				if(inline==false)
					s+=`<div class="form-group ${field.col} ${!field.visible?'hidden':''}" >
				<label class="m-0 p-0">${field.title}${field.required?' *':''}</label>`

				s+=`<textarea class="form-control ${field.class || ''} ${!field.visible?'hidden':''}" id="${generateFormId(field.field)}" name="${generateFormName(field.field)}"  rows="${(typeof field.rows!='undefined')?field.rows:4}"  placeholder="${field.readonly==true?'':field.title}" ${field.required?'required="required"':''} ${field.readonly==true?'readonly':''} ${field.onchange?'onchange="' + field.onchange + '"':''} value="${value}">dfdf</textarea>`

				if(inline==false)

					s+=`</div>`
				return s
			}

			function label(field,value,inline=false){
				var s=``

				if(inline==false){
					s+=`
					<label class="form-group ${field.col} ${!field.visible?'hidden':''}">
					<div class="${field.class || ''} ${!field.visible?'hidden':''}" id="${generateFormId(field.field)}">${field.title}</div>
					</label>`
				}else{
					s+=`<div class="${field.class || ''} ${!field.visible?'hidden':''}" id="${generateFormId(field.field)}">${field.title}</div>`
				}

				return s
			}

			function checkBox(field,value,inline=false){
				if(inline==false){
					return `<div class="form-group ${field.col} ${!field.visible?'hidden':''}">
					<label>
					<span class="mb-1" style="display:block;">${field.title}</span>
					<input type="checkbox" class="form-checkbox" id="${generateFormId(field.field)}" name="${generateFormName(field.field)}" value="true" ${(value?'checked':'')} ${field.readonly==true?'disabled':''} ${field.onchange?'onchange="' + field.onchange + '"':''} />
					<input type="hidden" id="${generateFormId(field.field)}-hidden" name="${generateFormName(field.field)}" value="false" />
					<script type="text/javascript">
					$(document).ready(()=>{
						$('#${generateFormId(field.field)}').change(()=>{
							if($('#${generateFormId(field.field)}').prop('checked')){
								document.getElementById('${generateFormId(field.field)}-hidden').disabled=true
							}else{
								document.getElementById('${generateFormId(field.field)}-hidden').disabled=false
							}
						})
					})
					</script>
					</label>
					</div>`
				}else{
					return `
					<div class="text-center">
					<input type="checkbox" class="form-checkbox-inside ${!field.visible?'hidden':''}"  value="true" id="${generateFormId(field.field)}" name="${generateFormName(field.field)}" ${field.onchange?'onchange="' + field.onchange + '"':''}>
					<input type="hidden" id="${generateFormId(field.field)}-hidden" name="${generateFormName(field.field)}" value="false" />
					<script type="text/javascript">
					$(document).ready(()=>{
						$('#${generateFormId(field.field)}').change(()=>{
							if($('#${generateFormId(field.field)}').prop('checked')){
								document.getElementById('${generateFormId(field.field)}-hidden').disabled=true
							}else{
								document.getElementById('${generateFormId(field.field)}-hidden').disabled=false
							}
						})
					})
					</script>
					</div>
					`
				}
			}



			function jsonData(field,value,inline=false){
				return `<div class="form-group  ${field.col} ${!field.visible?'hidden':''}">
				<label class="m-0">${field.title}${field.required?' *':''}</label>
				<textarea id="${generateFormId(field.field)}" name="${generateFormName(field.field)}" class="form-control ${field.class || ''} ${!field.visible?'hidden':''}" rows="10"  style="height: auto;font-family: monospace;" ${field.readonly==true?'readonly':''} ${field.onchange?'onchange="' + field.onchange + '"':''}>${(typeof value=='object')?JSON.stringify(value,null,2):value}</textarea>
				</div>`

			}

			function fileBase64(field,value,inline=false){
				return `<div class="form-group ${field.col} ${!field.visible?'hidden':''}">
				<label class="m-0 p-0">${field.title}${field.required?' *':''}</label><br>

				<label for="fileToUpload_${field.field.replaceAll('.','_')}" class="btn btn-primary"><i class="fa fa-file"></i> Dosya seçiniz</label>
				<input type="file" name="fileToUpload_${field.field}" id="fileToUpload_${field.field.replaceAll('.','_')}" style="visibility:hidden;" accept="" >
				<input type="hidden" name="${generateFormName(field.field)}[data]" id="fileDataBase64_${field.field.replaceAll('.','_')}" value="${(typeof value.data!='undefined')?value.data:''}" ${field.onchange?'onchange="' + field.onchange + '"':''}>
				<input type="hidden" name="${generateFormName(field.field)}[type]" id="fileToUpload_${field.field.replaceAll('.','_')}_type" value="${(typeof value.type!='undefined')?value.type:''}">
				<input type="hidden" name="${generateFormName(field.field)}[fileName]" id="fileToUpload_${field.field.replaceAll('.','_')}_fileName" value="${(typeof value.fileName!='undefined')?value.fileName:''}">

				<a id="fileToUpload_download_${field.field.replaceAll('.','_')}" href="${(typeof value.data!='undefined')?value.data:'#'}" download="${(typeof value.fileName!='undefined')?value.fileName:''}">${(typeof value.fileName!='undefined')?'<i class="fa fa-file"></i>' + value.fileName:''}</a>
				<script type="text/javascript">
				$(document).ready(function(){
					$("#fileToUpload_${field.field.replaceAll('.','_')}").change(function() {
						var filename = this.files[0].name
						$('#fileToUpload_download_${field.field.replaceAll('.','_')}').attr('download',filename)
						$('#fileToUpload_download_${field.field.replaceAll('.','_')}').html('<i class="fa fa-file"></i> ' + filename)
						var file =this.files[0]
						var reader  = new FileReader()
						reader.addEventListener("load", ()=>{
							$('#fileDataBase64_${field.field.replaceAll('.','_')}').val(reader.result)
							$('#fileToUpload_${field.field.replaceAll('.','_')}_type').val(file.type)
							$('#fileToUpload_${field.field.replaceAll('.','_')}_fileName').val(filename)
							$('#fileToUpload_download_${field.field.replaceAll('.','_')}').attr('href',$('#fileDataBase64_${field.field.replaceAll('.','_')}').val())
						}, false)
						if(file) {
							reader.readAsDataURL(file);
						}
					})
				})
				</script>
				</div>`
			}

			function fileBase64Image(field,value,inline=false){

				return `<div class="form-group ${field.col} ${!field.visible?'hidden':''}">
				<label for="fileToUpload_${field.field.replaceAll('.','_')}" class="btn btn-primary"><i class="fas fa-images"></i> ${field.title}${field.required?' *':''}</label>
				<br>
				<img id="fileToUpload_download_${field.field.replaceAll('.','_')}" src="${(typeof value.data!='undefined')?value.data:'/img/placehold-place.jpg'}" download="${(typeof value.fileName!='undefined')?value.fileName:''}" style="width: 300px;height: 300px;">

				<input type="file" name="fileToUpload_${field.field}" id="fileToUpload_${field.field.replaceAll('.','_')}" style="visibility:hidden;" accept="" >
				<input type="hidden" name="${generateFormName(field.field)}[data]" id="fileDataBase64_${field.field.replaceAll('.','_')}" value="${(typeof value.data!='undefined')?value.data:''}" ${field.onchange?'onchange="' + field.onchange + '"':''}>
				<input type="hidden" name="${generateFormName(field.field)}[type]" id="fileToUpload_${field.field.replaceAll('.','_')}_type" value="${(typeof value.type!='undefined')?value.type:''}">
				<input type="hidden" name="${generateFormName(field.field)}[fileName]" id="fileToUpload_${field.field.replaceAll('.','_')}_fileName" value="${(typeof value.fileName!='undefined')?value.fileName:''}">

				<script type="text/javascript">
				$(document).ready(function(){
					$("#fileToUpload_${field.field.replaceAll('.','_')}").change(()=>{
						var files= $("#fileToUpload_${field.field.replaceAll('.','_')}").prop('files')
						if(files.length==0)
							return
						var filename =files[0].name

						$('#fileToUpload_download_${field.field.replaceAll('.','_')}').attr('download',filename)
						var file =files[0]

						var reader  = new FileReader()
						reader.addEventListener("load", function () {
							$('#fileDataBase64_${field.field.replaceAll('.','_')}').val(reader.result)
							$('#fileToUpload_${field.field.replaceAll('.','_')}_type').val(file.type)
							$('#fileToUpload_${field.field.replaceAll('.','_')}_fileName').val(filename)
							$('#fileToUpload_download_${field.field.replaceAll('.','_')}').attr('src',$('#fileDataBase64_${field.field.replaceAll('.','_')}').val())
						}, false)
						if(file){
							reader.readAsDataURL(file)
						}
					})
				})
				</script>
				</div>`
			}









		})(typeof exports === 'undefined'?  
		this['FormBuilder']={}: exports)
