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
		editRowAutocomplete:editRowAutocomplete,
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
						console.log(`default changed:`)
						setTimeout(()=>{
							keyupTimer=1
							runTimer(fields,options)
						},500)
					})
					break
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
				deleteUrl=`${dataSourceUrl.split('?')[0]}/{_id}?${dataSourceUrl.split('?')[1]}&sid=${q.sid}`
			}else{
				deleteUrl=`${dataSourceUrl}/{_id}?sid=${q.sid}`
			}
		}


		if(dataSourceUrl){
			if(dataSourceUrl.indexOf('?')>-1){
				copyUrl=`${dataSourceUrl.split('?')[0]}/copy/{_id}?${dataSourceUrl.split('?')[1]}&sid=${q.sid}`
			}else{
				copyUrl=`${dataSourceUrl}/copy/{_id}?sid=${q.sid}`
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
			if(options.filter){
				filtreVar=true;
				if($(`#filter_${index}`).val()!=''){
					params[fields[key].filterField || key]=$(`#filter_${index}`).val()
				}else{
					if(params[fields[key].filterField || key]!=undefined){
						params[fields[key].filterField || key]=undefined
						delete params[fields[key].filterField || key]
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
						
						if(typeof itemValue=='object' && itemValue._id!=undefined){
							td.className=field.class || 'ml-1'
							td.innerHTML=`<div class="">${replaceUrlCurlyBracket((field.dataSource.label || '{name}'), itemValue)}</div>`
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

		// var modalRow=document.querySelector(`#modalRow${parentField}`)
		// console.log(modalRow)
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
		// if(locals.inputRowType!='line'){
		// 	newRow.style.display='none'
		// }
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
				var lookupTextField_id=gridId + '-' + generateFormId(key)+'-autocomplete-text'
				var lookupTextField_name=gridId + '-' + generateFormName(key)+'-autocomplete-text'
				var lookupTextValue=''
				if(field.lookupTextField!=undefined){
					lookupTextField_id=gridId + '-' + generateFormId(field.lookupTextField)
					lookupTextField_name=gridId + '-' + generateFormName(field.lookupTextField)
					if(listItem!=undefined){
						lookupTextValue=getPropertyByKeyPath(listItem,field.lookupTextField)
						if((lookupTextValue || '')==''){
							lookupTextValue=''
						}
					}
				}
				var s=`<div class="input-group">
				<input type="search" class="form-control ${field.class || ''}" id="${lookupTextField_id}" name="${lookupTextField_name}" placeholder="${field.placeholder || field.title || ''}" value="${lookupTextValue}" ${field.readonly?'readonly':''}>
				<div class="input-group-prepend">
				<div class="input-group-text"><i class="fas fa-ellipsis-v"></i></div>
				</div>
				</div>
				<input type="hidden" id="${gridId}-${generateFormId(key)}" name="${gridId}-${generateFormName(key)}" value="${itemValue}">
				<input type="hidden" id="${gridId}-${generateFormId(key)}-obj"  value="">`
				if(field.lookupTextField!=undefined){
					s+=`<input type="hidden" id="${gridId}-${generateFormId(field.lookupTextField)}" name="${gridId}-${generateFormName(field.lookupTextField)}" value="">`
				}
				td.innerHTML=s
				editRowAutocomplete(gridId,field,lookupTextField_id,itemValue)
				$(`#${lookupTextField_id}`).change((e)=>{
					gridHelper.editRowChange(gridId,locals,e)
				})
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

	// function editRowModal(gridId, locals, rowIndex=-1){

	// 	$(`#modalRow${locals.id} .modal-body`).html('loading...')
	// 	$(`#modalRow${locals.id}`).modal('show')
	// 	var parentField=locals.parentField
	// 	var fields=locals.fields
	// 	var listItem
	// 	if(rowIndex>-1){
	// 		listItem=locals.value[rowIndex]
	// 	}
	// 	var s=`
	// 	<div class="row">

	// 	`
	// 	Object.keys(fields).forEach((key)=>{
	// 		var field=fields[key]
	// 		if(!field.field){
	// 			field.field=key
	// 		}

	// 		var itemValue=''
	// 		if(listItem!=undefined){
	// 			itemValue=getPropertyByKeyPath(listItem,key)
	// 		}
	// 		s+=`<div class="form-group col-md-4">
	// 				<label class="m-0 p-0">${field.title || field.label || ''}</label>`
	// 		switch(field.type.toLowerCase()){
	// 			case 'lookup':
	// 			s+=`<select class="form-control ${field.class || ''}"  id="modalRow${gridId}-${generateFormId(key)}" name="modalRow${gridId}-${generateFormName(key)}"  ${field.readonly?'disabled':''}>`
	// 			s+=`<option value="">-- Seç --</option>`
	// 			Object.keys(field.lookup || {}).forEach((e)=>{
	// 				if(itemValue==e){
	// 					s+=`<option value="${e}" selected>${field.lookup[e]}</option>`
	// 				}else{
	// 					s+=`<option value="${e}">${field.lookup[e]}</option>`
	// 				}

	// 			})
	// 			s+='</select>'
	// 			break
	// 			case 'date':
	// 			s+=`<input type="date" class="form-control ${field.class || ''}" id="modalRow${gridId}-${generateFormId(gridId)}" name="modalRow${gridId}-${generateFormName(key)}" placeholder="${field.placeholder || field.title  || ''}" value="${itemValue}" ${field.readonly?'readonly="true"':''}>`
	// 			break;
	// 			case 'time':
	// 			s+=`<input type="time" class="form-control ${field.class || ''}" id="modalRow${gridId}-${generateFormId(gridId)}" name="modalRow${gridId}-${generateFormName(key)}" placeholder="${field.placeholder || field.title  || ''}" value="${itemValue}" ${field.readonly?'readonly="true"':''}>`
	// 			break;

	// 			case 'money':
	// 			case 'number':
	// 			if(itemValue=='')
	// 				itemValue=0
	// 			s+=`<input type="number" class="form-control text-right ${field.class || ''}" id="modalRow${gridId}-${generateFormId(key)}" name="modalRow${gridId}-${generateFormName(key)}" placeholder="${field.placeholder || field.title  || ''}" value="${itemValue}" ${field.readonly?'readonly="true"':''} >`
	// 			break
	// 			case 'identity':
	// 			case 'autoincrement':
	// 			case 'autoinc':
	// 			s+=`<input type="number" class="form-control text-right ${field.class || ''}" id="modalRow${gridId}-${generateFormId(key)}" name="modalRow${gridId}-${generateFormName(key)}" placeholder="${field.placeholder || field.title  || ''}" value="${itemValue}" readonly="true">`
	// 			break
	// 			case 'remotelookup':
	// 			var lookupTextField_id=`modalRow${gridId}-${generateFormId(key)}-autocomplete-text`
	// 			var lookupTextField_name=`modalRow${gridId}-${generateFormName(key)}-autocomplete-text`
	// 			var lookupTextValue=''
	// 			// if(field.lookupTextField!=undefined){
	// 			// 	lookupTextField_id=gridId + '-' + generateFormId(field.lookupTextField)
	// 			// 	lookupTextField_name=gridId + '-' + generateFormName(field.lookupTextField)
	// 			// 	if(listItem!=undefined){
	// 			// 		lookupTextValue=getPropertyByKeyPath(listItem,field.lookupTextField)
	// 			// 		if((lookupTextValue || '')==''){
	// 			// 			lookupTextValue=''
	// 			// 		}
	// 			// 	}
	// 			// }
	// 			s+=`<div class="input-group">
	// 			<input type="search" class="form-control ${field.class || ''}" id="${lookupTextField_id}" name="${lookupTextField_name}" placeholder="${field.placeholder || field.title || ''}" value="${lookupTextValue}" ${field.readonly?'readonly':''}>
	// 			<div class="input-group-prepend">
	// 			<div class="input-group-text"><i class="fas fa-ellipsis-v"></i></div>
	// 			</div>
	// 			</div>
	// 			<input type="hidden" id="modalRow${gridId}-${generateFormId(key)}" name="${gridId}-${generateFormName(key)}" value="${itemValue}">
	// 			<input type="hidden" id="modalRow${gridId}-${generateFormId(key)}-obj"  value="">`
	// 			if(field.lookupTextField!=undefined){
	// 				s+=`<input type="hidden" id="${gridId}-${generateFormId(field.lookupTextField)}" name="${gridId}-${generateFormName(field.lookupTextField)}" value="">`
	// 			}

	// 			editRowAutocomplete(gridId,field,lookupTextField_id,itemValue)

	// 			$(`#${lookupTextField_id}`).autocomplete( "option", "appendTo", ".eventInsForm" )

	// 			$(`#${lookupTextField_id}`).change((e)=>{
	// 				gridHelper.editRowChange(gridId,locals,e)
	// 			})
	// 			break
	// 			default:
	// 			s+=`<input type="text" class="form-control ${field.class || ''}" id="${gridId}-${generateFormId(key)}" name="${gridId}-${generateFormName(key)}" placeholder="${field.placeholder || field.title  || ''}" value="${itemValue}"  ${field.readonly?'readonly="true"':''} >`
	// 			break
	// 		}

	// 		s+=`</div>`
	// 		if(field.type.toLowerCase()!='remotelookup'){
	// 			$(`#${gridId}-${generateFormId(key)}`).change((e)=>{
	// 				gridHelper.editRowChange(gridId,locals,e)
	// 			})
	// 		}
	// 	})

	// 	s+=`</div>`

	// 	$(`#modalRow${locals.id} .modal-body`).html(s)


	// }

	function editRowAutocomplete(gridId,field,lookupTextField_id,itemValue){
		var searchUrl=''
		if((field.dataSource.search || '')!=''){
			searchUrl=replaceUrlCurlyBracket(field.dataSource.search, {_id:itemValue})
			if(searchUrl.indexOf('sid=')<0){
				if(searchUrl.indexOf('?')<0){
					searchUrl+='?sid={sid}'
				}else{
					searchUrl+='&sid={sid}'
				}
			}
		}else if((field.dataSource.url || '')!=''){
			searchUrl=replaceUrlCurlyBracket(field.dataSource.url, {_id:itemValue})
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
		if(field.dataSource.id || field.dataSource.idUrl){
			idUrl=replaceUrlCurlyBracket(field.dataSource.id  || field.dataSource.idUrl, {_id:itemValue})
			if(idUrl.indexOf('sid=')<0){
				if(idUrl.indexOf('?')<0){
					idUrl+='?sid={sid}'
				}else{
					idUrl+='&sid={sid}'
				}
			}

		}else if(field.dataSource.url){
			idUrl=replaceUrlCurlyBracket(field.dataSource.url, {_id:itemValue})
			idUrl=`${idUrl.split('?')[0]}/${itemValue}?sid=${q.sid}`

		}


		if(searchUrl=='' || idUrl==''){
			return
		}
		var labelStr=(field.dataSource.label || '{name}')

		
		$(`#${lookupTextField_id}`).autocomplete({
			source:function(request,response){
				
				var typedText=encodeURIComponent2(request.term)
				var url=searchUrl.replace('{search}',typedText).replace('{search}',typedText).replace('{sid}',q.sid).replace('{mid}',q.mid)
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

				$(`#${lookupTextField_id}`).val((ui.item.label || ''))
				$(`#${gridId}-${generateFormId(field.field)}`).val(ui.item.obj._id.toString())
				$(`#${gridId}-${generateFormId(field.field)}-obj`).val(encodeURIComponent2(JSON.stringify(ui.item.obj)))

				if(field.onchange){
					field.onchange()
				}


				return false
			}
		})


		$(`#${lookupTextField_id}`).on('change',()=>{
			if($(`#${lookupTextField_id}`).val()==''){
				$(`#${gridId}-${generateFormId(field.field)}`).val('')
				$(`#${gridId}-${generateFormId(field.field)}-obj`).val('')
			}
		})

		if(itemValue){
			getAjax(idUrl, labelStr,'',(err,sonuc)=>{
				if(!err){
					if(sonuc.length>0){
						$(`#${lookupTextField_id}`).val(sonuc[0].label)
					}

				}else{

				}
			})
		}
	}

	function filterRowAutocomplete(field,lookupTextField_id,itemValue=''){

		
		var searchUrl=''
		if((field.dataSource.search || '')!=''){
			searchUrl=replaceUrlCurlyBracket(field.dataSource.search, {_id:itemValue})
			if(searchUrl.indexOf('sid=')<0){
				if(searchUrl.indexOf('?')<0){
					searchUrl+='?sid={sid}'
				}else{
					searchUrl+='&sid={sid}'
				}
			}
		}else if((field.dataSource.url || '')!=''){
			searchUrl=replaceUrlCurlyBracket(field.dataSource.url, {_id:itemValue})
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
		if(field.dataSource.id || field.dataSource.idUrl){
			idUrl=replaceUrlCurlyBracket(field.dataSource.id  || field.dataSource.idUrl, {_id:itemValue})
			if(idUrl.indexOf('sid=')<0){
				if(idUrl.indexOf('?')<0){
					idUrl+='?sid={sid}'
				}else{
					idUrl+='&sid={sid}'
				}
			}

		}else if(field.dataSource.url){
			idUrl=replaceUrlCurlyBracket(field.dataSource.url, {_id:itemValue})
			idUrl=`${idUrl.split('?')[0]}/${itemValue}?sid=${q.sid}`

		}


		if(searchUrl=='' || idUrl==''){
			return
		}
		var labelStr=(field.dataSource.label || '{name}')

		
		$(`#${lookupTextField_id}_text`).autocomplete({
			source:function(request,response){
				
				var typedText=encodeURIComponent2(request.term)
				var url=searchUrl.replace('{search}',typedText).replace('{search}',typedText).replace('{sid}',q.sid).replace('{mid}',q.mid)
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
			console.log(`itemValue:`,itemValue)
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

	function modalRowOK(id){

		var s=`
		`
		
		$(`#modalRow${id}`).modal('hide')
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
				default:
				obj[field.field]=$(`#${gridId}-${generateFormId(field.field)}`).val() || ''
				break
			}
			if(field.required && obj[field.field]==''){
				allow=false

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

			var url=`${remoteList[e].dataSource.url.split('?')[0]}/${idList.join(',')}?sid=${q.sid}`
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
					console.log('getAjax err:',err)
				}
			})
		})
	}

	

})(typeof exports === 'undefined'? this['GridHelper']={}: exports)