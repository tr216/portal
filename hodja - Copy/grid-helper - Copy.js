(function(exports) {

	exports.GridHelper = Object.freeze({
		init:init,
		gridCopyItem:gridCopyItem,
		gridDeleteItem:gridDeleteItem,
		autoIncrement:autoIncrement,
		refreshGridRows:refreshGridRows,
		refreshRemoteList:refreshRemoteList,
		okEditRow:okEditRow,
		removeRow:removeRow,
		editRowChange:editRowChange,
		// editRowAutocomplete:editRowAutocomplete,
		filterRowAutocomplete:filterRowAutocomplete
		// ,
		// editRowModal:editRowModal,
		// modalRowOK:modalRowOK
	})

	var deleteUrl=''
	var dataSourceUrl=''
	var copyUrl=''

	function init(id,fields,options){
		$(`#pageSize`).change(function(e){
			pageSettings.setItem(`pageSize`,$(`#pageSize`).val())
			q[`pageSize`]=$(`#pageSize`).val()
			q[`page`]=1
			reload()
		});

		$(`#selectAll`).on(`change`,(e)=>{
			$(`input:checkbox`).not($(`#selectAll`)).prop(`checked`, $(`#selectAll`).prop(`checked`))
		})

		if(pageSettings.getItem(`filterButton`)==true){
			$(`#filterRow`).collapse('show');
		}else{
			$(`#filterRow`).collapse('hide');
		}

		$(`#filterRow`).on(`hidden.bs.collapse`, function () {
			pageSettings.setItem(`filterButton`,false)
		})
		$(`#filterRow`).on(`shown.bs.collapse`, function () {
			pageSettings.setItem(`filterButton`,true)
		})


		if(options.filter){
			Object.keys(fields).forEach((key,index)=>{
				var field=fields[key]
				
				if(!field.type)
					return
				if((field.visible==undefined?true:field.visible)){
					if((field.filter==undefined?options.filter:field.filter)){
						$(`#filter_${index}`).val((q[field.filterField || key] || ''))
						switch(field.type.toLowerCase()){
							case 'lookup':
							case 'boolean':
							$(`#filter_${index}`).on('change',(e)=>{
								keyupTimer=0
								runFilter(fields,options)
							})
							break
							case 'remotelookup':
							$(`#filter_${index}_text`).on('change',(e)=>{

								keyupTimer=0
								runFilter(fields,options)
							})
							break

							default:
							$(`#filter_${index}`).on('keyup',(e)=>{
								setTimeout(()=>{
									keyupTimer=1
									runTimer(fields,options)
								},800)
							})
							break
						}
					}
				}
			})	
		}


		if(options.dataSource){
			if(options.dataSource.url){
				dataSourceUrl=options.dataSource.url
			}
		}
		if(dataSourceUrl!=''){
			if(dataSourceUrl.indexOf('?')>-1){
				deleteUrl=`${dataSourceUrl.split('?')[0]}/{_id}?${dataSourceUrl.split('?')[1]}`
			}else{
				deleteUrl=`${dataSourceUrl}/{_id}`
			}
		}


		if(dataSourceUrl){
			if(dataSourceUrl.indexOf('?')>-1){
				copyUrl=`${dataSourceUrl.split('?')[0]}/copy/{_id}?${dataSourceUrl.split('?')[1]}`
			}else{
				copyUrl=`${dataSourceUrl}/copy/{_id}`
			}
		}
	}

	var keyupTimer=0

	function runTimer(fields,options){
		if(keyupTimer==0)
			return

		if(keyupTimer>=3){
			keyupTimer=0
			runFilter(fields,options)
		}else{
			keyupTimer++
			setTimeout(()=>{
				runTimer(fields,options)
			},1000)
		}
	}

	function runFilter(fields,options){
		var params=getAllUrlParams()
		var filtreVar=false
		Object.keys(fields).forEach((key,index)=>{
			var field=fields[key]
			if((field.visible==undefined?true:field.visible)){
				if((field.filter==undefined?options.filter:field.filter)){
					filtreVar=true
					if($(`#filter_${index}`).val()!=''){
						params[field.filterField || key]=$(`#filter_${index}`).val()
					}else{
						if(params[field.filterField || key]!=undefined){
							params[field.filterField || key]=undefined
							delete params[field.filterField || key]
						}
					}
				}
			}
		})

		if(filtreVar){
			params['page']=1
			reload(params)
		}
	}
	


	function gridDeleteItem(name,_id){
		confirmX('<b>"' + name + '"</b><br>Kayit silinecektir! Onaylıyor musunuz?','danger',(answer)=>{
			if(answer){
				var url=deleteUrl
				$.ajax({
					url:url.replaceAll('{_id}',_id),
					type:'DELETE',
					success:function(result){
						if(result.success){
							window.location.reload()
						}else{
							alertX('Hata:' + result.error.message)
						}
					},
					error:function(err){
						alertX((err.message || err.name || 'Hata oluştu'),'HATA','danger')
					}
				})
			}
		})
	}

	function gridCopyItem(name,_id){
		copyX({
			newName:{title:'Yeni isim',type:'string',value:name+ ' kopya'}
		},'Kopya oluştur',(answer,formData)=>{
			if(answer){
				var url=copyUrl.replaceAll('{_id}',_id)
				
				$.ajax({
					url:url,
					data:formData,
					type:'POST',
					success:function(result){
						if(result.success){
							window.location.reload()
						}else{
							console.error(`result.error:`,result.error)
							alertX('Hata:' + result.error.message)
						}
					},
					error:function(err){
						console.error(`err:`,err)
						alertX((err.message || err.name || 'Hata oluştu'),'HATA','danger')
					}
				})
			}
		})
	}

	function autoIncrement(item,itemValue,rowIndex){
		return 1
		
	}

	function refreshGridRows(gridId,locals,editRowIndex=-1){
		
		var remoteList={}
		$(`#${gridId} tbody tr`).remove()
		var parentField=locals.parentField || locals.id || ''
		var fields=locals.fields
		if(!locals.value)
			locals.value=[]
		var list=locals.value
		var grid=document.querySelector(`#${gridId} tbody`)

		list.forEach((listItem,rowIndex)=>{
			if(editRowIndex!=rowIndex){
				var newRow=grid.insertRow()
				Object.keys(fields).forEach((key)=>{
					var field=fields[key]
					var td=newRow.insertCell()

					var itemValue=''
					if(field.type.toLowerCase()=='identity' || field.type.toLowerCase()=='autoincrement' || field.type.toLowerCase()=='autoinc'){
						itemValue=rowIndex+1
					}else{
						itemValue=getPropertyByKeyPath(listItem,key)
					}

					switch(field.type.toLowerCase()){
						case 'lookup':
						td.className=field.class || 'ml-1'
						Object.keys(field.lookup || {}).forEach((key2)=>{
							if(key2===itemValue.toString()){
								td.innerHTML= field.lookup[key2]
								return
							}
						})
						if(td.innerHTML=='')
							td.innerHTML=itemValue
						break
						case 'number':
						td.className=field.class || 'text-right mr-1'
						td.innerHTML=itemValue
						break
						case 'money':
						td.className=field.class || 'text-right mr-1'
						td.innerHTML=Number(itemValue).formatMoney()
						break

						case 'boolean':
						td.className=field.class || 'text-center'
						td.style.fontSize='20px'
						td.innerHTML=itemValue?'<i class="fas fa-check-square text-primary"></i>':'<i class="far fa-square text-dark"></i>'
						break
						case 'remotelookup':
						console.log(`listItem:`,listItem)
						console.log(`field:`,field)
						if(itemValue==undefined)
							itemValue=''
						if(typeof itemValue=='object' && itemValue._id!=undefined){
							td.className=field.class || 'ml-1'
							td.innerHTML=`<div class="">${replaceUrlCurlyBracket((field.dataSource.label || '{name}'), itemValue)}</div>`
						}else	if(field.lookupTextField){
							var valueText=getPropertyByKeyPath(listItem,field.lookupTextField)
							td.className=field.class || 'ml-1'
							td.innerHTML=`<div class="">${valueText}</div>`
							td.innerHTML+=`<input type="hidden" name="${generateFormName(parentField + '.' + rowIndex + '.' + field.lookupTextField)}" value="${valueText}" />`
						}else{
							var cellId=''
							if(itemValue!=''){
								cellId=`${gridId}-cell-${itemValue}`
								if(remoteList==undefined){
									remoteList={}
								}

								if(remoteList[field.field]==undefined){
									remoteList[field.field]={
										dataSource:field.dataSource,
										list:{}
									}
								}
								if(remoteList[field.field].list[itemValue]==undefined){
									remoteList[field.field].list[itemValue]={
										cellId:'.' + cellId,
										text:''
									}
								}
							}
							td.className=field.class || 'ml-1'
							td.innerHTML=`<div class="${cellId}">rmtlkup${itemValue}</div>`
						}


						break
						default:
						td.className=field.class || 'ml-1'
						td.innerHTML=itemValue
						break
					}
					td.innerHTML+=`<input type="hidden" name="${generateFormName(parentField + '.' + rowIndex + '.' + key)}" value="${itemValue}" />`
				})
				var td=newRow.insertCell()
				td.innerHTML=`<a href="javascript:gridHelper.refreshGridRows('${gridId}',${gridId},${rowIndex})" class="btn btn-grid-row btn-success" title="Satır düzenle"><i class="fas fa-edit"></i></a>
				<a href="javascript:gridHelper.removeRow('${gridId}',${gridId},${rowIndex})" class="btn btn-grid-row btn-danger ml-2" title="Satır sil"><i class="fas fa-trash-alt"></i></a>`
			}else{
				editRow(gridId,grid,locals,editRowIndex)
			}
		})
		if(editRowIndex<0){
			editRow(gridId,grid,locals)
		}
		
		refreshRemoteList(remoteList)
		var event = new CustomEvent(`onchange`, {detail:locals})
		document.getElementById(gridId).dispatchEvent(event)

	}

	function removeRow(gridId,locals,rowIndex){
		if(rowIndex<0 || rowIndex>locals.value.length-1)
			return
		confirmX(`Satir silinecektir onaylıyor musunuz?`,(answer)=>{
			if(answer){
				locals.value.splice(rowIndex,1)
				refreshGridRows(gridId,locals)
			}
		})
	}

	function editRow(gridId,grid,locals,rowIndex=-1){
		var parentField=locals.parentField
		var fields=locals.fields
		var listItem
		if(rowIndex>-1){
			listItem=locals.value[rowIndex]
		}
		var newRow=grid.insertRow()
		newRow.className='nohover'

		newRow.id=`${gridId}-edit-row`
		Object.keys(fields).forEach((key)=>{
			var field=fields[key]
			if(!field.field){
				field.field=key
			}
			var td=newRow.insertCell()
			var itemValue=''
			if(listItem!=undefined){
				itemValue=getPropertyByKeyPath(listItem,key)
			}
			switch(field.type.toLowerCase()){
				case 'lookup':
				var s=`<select class="form-control ${field.class || ''}"  id="${gridId}-${generateFormId(key)}" name="${gridId}-${generateFormName(key)}"  ${field.readonly?'disabled':''}>`
				s+=`<option value="">-- Seç --</option>`
				Object.keys(field.lookup || {}).forEach((e)=>{
					if(itemValue==e){
						s+=`<option value="${e}" selected>${field.lookup[e]}</option>`
					}else{
						s+=`<option value="${e}">${field.lookup[e]}</option>`
					}

				})
				td.innerHTML=s + '</select>'
				break
				case 'date':
				td.innerHTML=`<input type="date" class="form-control ${field.class || ''}" id="${gridId}-${generateFormId(key)}" name="${gridId}-${generateFormName(key)}" placeholder="${field.placeholder || field.title  || ''}" value="${itemValue}" ${field.readonly?'readonly="true"':''} ${(field.min || '')!=''?'min="' + field.min +'"':''}  ${(field.max || '')!=''?'max="' + field.max +'"':''} >`
				break
				case 'time':
				td.innerHTML=`<input type="time" class="form-control ${field.class || ''}" id="${gridId}-${generateFormId(key)}" name="${gridId}-${generateFormName(key)}" placeholder="${field.placeholder || field.title  || ''}" value="${itemValue}" ${field.readonly?'readonly="true"':''} ${(field.min || '')!=''?'min="' + field.min +'"':''}  ${(field.max || '')!=''?'max="' + field.max +'"':''} >`
				break
				case 'boolean':
				td.innerHTML=`<input type="checkbox" class="grid-checkbox ${field.class || ''}" id="${gridId}-${generateFormId(key)}" name="${gridId}-${generateFormName(key)}" value="true" ${itemValue?'checked':''} ${field.readonly?'readonly="true"':''} >`
				break;

				case 'money':
				case 'number':
				if(itemValue=='')
					itemValue=0
				td.innerHTML=`<input type="number" class="form-control text-right ${field.class || ''}" id="${gridId}-${generateFormId(key)}" name="${gridId}-${generateFormName(key)}" placeholder="${field.placeholder || field.title  || ''}" value="${itemValue}" ${field.readonly?'readonly="true"':''} ${(field.min || '')!=''?'min="' + field.min +'"':''} ${(field.max || '')!=''?'max="' + field.max +'"':''} >`
				break
				case 'identity':
				case 'autoincrement':
				case 'autoinc':
				td.innerHTML=`<input type="number" class="form-control text-right ${field.class || ''}" id="${gridId}-${generateFormId(key)}" name="${gridId}-${generateFormName(key)}" placeholder="${field.placeholder || field.title  || ''}" value="${itemValue}" readonly="true">`
				break
				case 'remotelookup':
				var controlId=gridId + '-' + generateFormId(key)
				var controlName=gridId + '-' + generateFormName(key)
				var controlNameTextField=''
				var valueText=''
				field.value=itemValue
				if(field.lookupTextField){
					if(listItem){
						valueText=getPropertyByKeyPath(listItem,field.lookupTextField)
					}
					controlNameTextField=gridId + '-' + generateFormName(field.lookupTextField)
				}
				var s=`
				<div class="input-group">
				<input type="search" class="form-control ${field.class || ''}" id="${controlId}-autocomplete-text"  placeholder="${field.placeholder || field.title || ''}" value="${valueText}" autocomplete="off" autofill="off" spellcheck="false" ${field.readonly?'readonly':''} >
				<div class="input-group-prepend">
				<div class="input-group-text"><i class="fas fa-ellipsis-v"></i></div>
				</div>
				</div>
				<input type="hidden" name="${controlName}" value="${field.value}">
				<input type="hidden" id="${controlId}-obj"  value="">`
				if(controlNameTextField){
					s+=`<input type="hidden" name="${controlNameTextField}" value="${valueText}">`
				}
				
				field.valueText=valueText
				
				td.innerHTML=s
				remoteLookupAutocomplete(field,`${gridId}-`)
				break
				default:
				td.innerHTML=`<input type="text" class="form-control ${field.class || ''}" id="${gridId}-${generateFormId(key)}" name="${gridId}-${generateFormName(key)}" placeholder="${field.placeholder || field.title  || ''}" value="${itemValue}"  ${field.readonly?'readonly="true"':''} >`
				break
			}

			if(field.type.toLowerCase()!='remotelookup'){
				$(`#${gridId}-${generateFormId(key)}`).change((e)=>{
					gridHelper.editRowChange(gridId,locals,e)
				})
			}
		})

var td=newRow.insertCell()
td.innerHTML=`<a href="javascript:gridHelper.okEditRow('${gridId}',${gridId},${rowIndex})" class="btn btn-grid-row status-iade" title="Tamam"><i class="fas fa-check"></i></a>
<a href="javascript:gridHelper.refreshGridRows('${gridId}',${gridId})" class="btn btn-grid-row btn-dark ml-2" title="Vazgeç"><i class="fas fa-reply"></i></a>`

var requiredRow=grid.insertRow()
requiredRow.className='nohover hidden'
requiredRow.id=`${gridId}-required-row`
Object.keys(fields).forEach((key)=>{
	var field=fields[key]

	var td=requiredRow.insertCell()
	if(field.required){
		td.innerHTML='<div class="text-danger">*Gereklidir</div>'
	}else{
		td.innerHTML=''
	}

})

requiredRow.insertCell().innerHTML=''
}


function filterRowAutocomplete(field,lookupTextField_id,itemValue=''){


	var searchUrl=''
	if((field.dataSource.search || '')!=''){
		searchUrl=replaceUrlCurlyBracket(field.dataSource.search, {_id:itemValue})

	}else if((field.dataSource.url || '')!=''){
		searchUrl=replaceUrlCurlyBracket(field.dataSource.url, {_id:itemValue})
		if(searchUrl.indexOf('?')<0){
			searchUrl+='?search={search}'
		}else{
			searchUrl+='&search={search}'
		}
	}


	var idUrl=''
	if(field.dataSource.id || field.dataSource.idUrl){
		idUrl=replaceUrlCurlyBracket(field.dataSource.id  || field.dataSource.idUrl, {_id:itemValue})

	}else if(field.dataSource.url){
		idUrl=replaceUrlCurlyBracket(field.dataSource.url, {_id:itemValue})
		idUrl=`${idUrl.split('?')[0]}/${itemValue}`

	}


	if(searchUrl=='' || idUrl==''){
		return
	}
	var labelStr=(field.dataSource.label || '{name}')


	$(`#${lookupTextField_id}_text`).autocomplete({
		source:function(request,response){

			var typedText=encodeURIComponent2(request.term)
			var url=searchUrl.replace('{search}',typedText).replace('{search}',typedText).replace('{mid}',q.mid)
			getAjax(url, labelStr,'',(err,result)=>{
				if(!err){
					response(result)
				}else{
					console.error(err)
					response([])
				}
			})
		},
		select: function (event, ui) {

			$(`#${lookupTextField_id}_text`).val((ui.item.label || ''))
			$(`#${lookupTextField_id}`).val(ui.item.obj._id.toString()).trigger('change')

			return false
		}
	})


	$(`#${lookupTextField_id}_text`).on('change',()=>{
		if($(`#${lookupTextField_id}_text`).val()==''){
			$(`#${lookupTextField_id}`).val('').trigger('change')
		}
	})

	if(itemValue){

		getAjax(idUrl, labelStr,'',(err,sonuc)=>{
			if(!err){
				if(sonuc.length>0){
					$(`#${lookupTextField_id}_text`).val(sonuc[0].label)
				}

			}else{

			}
		})
	}

}


function editRowChange(gridId,locals,e){
	
	var fields=locals.fields
	var obj=getEditRowData(gridId,locals)
	Object.keys(fields).forEach((key)=>{
		var field=fields[key]
		if(!field.field){
			field.field=key
		}
		if(field.calc && e.target.id!=`${gridId}-${generateFormId(field.field)}`){
			$(`#${gridId}-${generateFormId(field.field)}`).val(eval(replaceUrlCurlyBracket(field.calc,obj)))
		}
	})
}

function getEditRowData(gridId,locals){
	var obj={}
	var fields=locals.fields
	Object.keys(fields).forEach((key)=>{
		var field=fields[key]
		if(!field.field){
			field.field=key
		}
		switch(field.type.toLowerCase()){
			case 'number':
			case 'money':
			obj[field.field]=Number($(`#${gridId}-${generateFormId(field.field)}`).val() || 0)
			break
			case 'remotelookup':
			obj[field.field]=$(`input[name="${gridId}-${generateFormName(field.field)}"]`).val()
			if(field.lookupTextField){
				var controlNameTextField=generateFormName(field.lookupTextField)
				obj[field.lookupTextField]=$(`input[name="${gridId}-${controlNameTextField}"]`).val()
			}
			break
			default:
			obj[field.field]=$(`#${gridId}-${generateFormId(field.field)}`).val() || ''
			break
		}
		if(field.required && obj[field.field]==''){
			
			allow=false

		}
	})

	return listObjectToObject(obj)
}

function okEditRow(gridId,locals,rowIndex){
	var obj={}
	var parentField=locals.parentField || locals.id || ''
	var fields=locals.fields
	var list=locals.value
	var allow=true
	Object.keys(fields).forEach((key)=>{
		var field=fields[key]
		if(!field.field){
			field.field=key
		}
		switch(field.type.toLowerCase()){
			case 'number':
			case 'money':
			obj[field.field]=Number($(`#${gridId}-${generateFormId(field.field)}`).val() || 0)
			break
			case 'remotelookup':
			obj[field.field]=$(`input[name="${gridId}-${generateFormName(field.field)}"]`).val()
			if(field.lookupTextField){
				var controlNameTextField=generateFormName(field.lookupTextField)
				obj[field.lookupTextField]=$(`input[name="${gridId}-${controlNameTextField}"]`).val()
			}
			break
			default:
			obj[field.field]=$(`#${gridId}-${generateFormId(field.field)}`).val() || ''
			break
		}
		if(field.required && obj[field.field]==''){
			if(field.type.toLowerCase()=='remotelookup' && field.lookupTextField){
				if(obj[field.lookupTextField]==''){
					allow=false
				}
			}else{
				allow=false
			}
			

		}

	})

	if(!allow){
		$(`#${gridId}-required-row`).show()
		return 
	}else{
		$(`#${gridId}-required-row`).hide()
	}
	if(rowIndex<0){
		list.push(listObjectToObject(obj))
	}else{
		list[rowIndex]=listObjectToObject(obj)
	}
	locals.value=list
	refreshGridRows(gridId,locals,-1)
}

function refreshRemoteList(remoteList){
	Object.keys(remoteList).forEach((e)=>{
		var idList=[]
		Object.keys(remoteList[e].list).forEach((key)=>{
			idList.push(key)
		})

		var url=`${remoteList[e].dataSource.url.split('?')[0]}/${idList.join(',')}`
		getAjax(url, remoteList[e].dataSource.label || '{name}','',(err,dizi)=>{
			if(!err){

				Object.keys(remoteList[e].list).forEach((key)=>{
					dizi.forEach((d)=>{
						if(d.obj._id==key){
							$(remoteList[e].list[key].cellId).html(d.value)
						}
					})
				})

			}else{
				console.error('getAjax err:',err)
			}
		})
	})
}



})(typeof exports === 'undefined'? this['GridHelper']={}: exports)