
var pages=JSON.parse(localStorage.getItem('pages'))
var staticValues=JSON.parse(localStorage.getItem('staticValues'))
var menu=JSON.parse(localStorage.getItem('menu'))
var pages_version=localStorage.getItem('pages_version')
var hashObj=getHashObject()

function sayfalariTekrarYukle(cb){
	var sessionId=$('#sessionId').html()
	$('#sessionId').html('Sayfalar ve degiskener tekrar yukleniyor...')
	$.ajax({
		type:'GET',
		url:'/api/initialize',
		success:function(result){
			if(result.success){
				localStorage.setItem('pages',JSON.stringify(result.data.pages || {}))
				localStorage.setItem('staticValues',JSON.stringify(result.data.staticValues || {}))
				localStorage.setItem('menu',JSON.stringify(result.data.menu || {}))
				localStorage.setItem('pages_version',result.data.version || '')
				

				pages=result.data.pages || {}
				staticValues=result.data.staticValues || {}
				menu=result.data.menu || {}
				pages_version=result.data.version || ''
				document.getElementById('leftMenu').innerHTML=generateLeftMenu(menu)
				$('#sessionId').html('Yukleme tamamlandi')

			}else{
				showError(result.error)
			}
			if(cb)
				cb()
			setTimeout(()=>{
				$('#sessionId').html(sessionId)
			},500)
		},
		error:function(err){
			showError(err)
			if(cb)
				cb()
			setTimeout(()=>{
				$('#sessionId').html(sessionId)
			},500)
		}
	})
}

function getModulePageName(){
	var pageName='page'
	var dizi=hashObj.path.split('/')
	var c=0
	dizi.forEach((e)=>{
		if(e!=''){
			if(c==2){
				return
			}else{
				pageName+='_' + e
				c++
			}
		}
	})

	return pageName
}


var pageSettings={
	setItem:function(param,value){
		try{
			var obj=JSON.parse(localStorage.getItem(`${getModulePageName()}`) || '{}')
			obj[param]=value
			localStorage.setItem(`${getModulePageName()}`,JSON.stringify(obj))
		}catch(err){
			showError(err)
		}
	},
	getItem:function(param){
		try{
			var obj=JSON.parse(localStorage.getItem(`${getModulePageName()}`) || '{}')
			if(obj[param]==undefined)
				obj[param]=null

			return obj[param]
		}catch(err){
			showError(err)
			return null
		}

	}
}

function helpButton(item){
	if((item.help || '')!=''){
		var helpUrl=manipulateUrl(item.help)

		return `<a href="javascript:openInNewTab('${helpUrl}')" class="skip-enter-next text-primary bold ml-2" title="Yardım ve açıklama için tıklayınız"><i class="far fa-question-circle"></i></a>`
	}else{
		return ''
	}
}

function maxLookupLength(lookup){
	var max=0
	Object.keys(lookup).forEach((key)=>{
		if(lookup[key].length>max)
			max=lookup[key].length
	})
	return max
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
	if(typeof name=='string')
		return name.replaceAll('.','_')
	else
		return ''
}

function loadCardCollapses(){
	var kartlar=document.getElementsByClassName('card-collapse')
	var i=0
	while(i<kartlar.length){
		if(pageSettings.getItem(`collapse_${kartlar[i].id}`)){
			$(`#${kartlar[i].id}`).collapse(pageSettings.getItem(`collapse_${kartlar[i].id}`))			
		}
		i++
	}

	$('.card-collapse').on('show.bs.collapse',(e)=>{
		pageSettings.setItem(`collapse_${e.target.id}`,e.type)

	})
	$('.card-collapse').on('hide.bs.collapse',(e)=>{
		pageSettings.setItem(`collapse_${e.target.id}`,e.type)

	})

	$('.modal .card-collapse').on('show.bs.collapse',(e)=>{
		pageSettings.setItem(`collapse_${e.target.id}`,e.type)
	})
	$('.modal .card-collapse').on('hide.bs.collapse',(e)=>{
		pageSettings.setItem(`collapse_${e.target.id}`,e.type)
	})
}


function getAjax(url,labelStr='{name}',exceptId='',cb){

	$.ajax({
		url:url,
		type:'GET',
		dataType: 'json',
		success: function(result) {
			if(result.success){
				var dizi=[]

				if(result.data.docs!=undefined){
					result.data.docs.forEach((e)=>{

						var text=replaceUrlCurlyBracket(labelStr, e,e)
						dizi.push({label:text,value:text,obj:e})
					})
				}else{
					if(Array.isArray(result.data)){
						result.data.forEach((e)=>{
							var text=replaceUrlCurlyBracket(labelStr, e,e)
							dizi.push({label:text,value:text,obj:e})
						})
					}else{
						var text=replaceUrlCurlyBracket(labelStr, result.data, result.data)
						dizi.push({label:text,value:text,obj:result.data})
					}
				}

				if(cb)
					cb(null,dizi)
			}else{
				if(cb)
					cb(result.error)
			}
		},
		error:function(err){
			if(cb)
				cb(err)
		}
	})
}


function remoteLookupAutocomplete(locals){
	if(locals.dataSource==undefined)
		return

	var searchUrl=''
	if((locals.dataSource.search || '')!=''){
		searchUrl=replaceUrlCurlyBracket(locals.dataSource.search, {_id:locals.value})

	}else if((locals.dataSource.url || '')!=''){
		searchUrl=replaceUrlCurlyBracket(locals.dataSource.url, {_id:locals.value})
		if(searchUrl.indexOf('?')<0){
			searchUrl+='?search={search}'
		}else{
			searchUrl+='&search={search}'
		}
	}
	var idUrl=''
	if(locals.dataSource.id || locals.dataSource.idUrl){
		idUrl=replaceUrlCurlyBracket(locals.dataSource.id  || locals.dataSource.idUrl, {_id:locals.value})

	}else if(locals.dataSource.url){
		idUrl=replaceUrlCurlyBracket(locals.dataSource.url, {_id:locals.value})
		if(idUrl.indexOf('?')<0){
			idUrl+=`/${locals.value}`
		}else{
			idUrl+=`&id=${locals.value}`
		}
	}


	if(searchUrl=='' || idUrl==''){
		return
	}

	var labelStr=(locals.dataSource.label || '{name}')
	var valueText=locals.valueText || ''

	$(`#${locals.id}-autocomplete-text`).autocomplete({
		source:function(request,response){
			var typedText=encodeURIComponent2(request.term)
			var url=searchUrl.replace('{search}',typedText).replace('{search}',typedText).replace('{mid}',q.mid)

			getAjax(url,`${labelStr}`,``,(err,result)=>{
				if(!err){
					response(result)
				}else{
					console.error(err)
					response([])
				}
			})
		},
		select: function (event, ui) {
			$(`#${locals.id}-autocomplete-text`).val((ui.item.label || ''))
			$(`input[name="${locals.name}"]`).val(ui.item.obj._id.toString())
			$(`#${locals.id}-obj`).val(encodeURIComponent2(JSON.stringify(ui.item.obj)))
			if(locals.lookupTextField){
				$(`input[name="${locals.lookupTextFieldName}"]`).val((ui.item.label || ''))
				$(`#${locals.id}-original-text`).html((ui.item.label || ''))
			}
			if(locals.onchange){
				eval(`${locals.onchange}`)
			}
			return false
		}
	})


	$(`#${locals.id}-autocomplete-text`).on('change',()=>{

		if($(`#${locals.id}-autocomplete-text`).val()==''){
			$(`input[name="${locals.name}"]`).val('')
			$(`#${locals.id}-obj`).val('')
			if(locals.lookupTextField){
				$(`#${locals.id}-original-text`).html('')
			}
		}
		if(locals.lookupTextField){
			$(`input[name="${locals.lookupTextFieldName}"]`).val($(`#${locals.id}-autocomplete-text`).val())
		}
	})


	if((locals.value || '')!=''){
		var url=idUrl.replace('{mid}',q.mid)
		getAjax(url,`${labelStr}`,``,(err,result)=>{
			if(!err){
				if(result.length>0){
					if(valueText==''){
						$(`#${locals.id}-autocomplete-text`).val((result[0].label || ''))
					}

					$(`input[name="${locals.name}"]`).val(result[0].obj._id.toString())
					$(`#${locals.id}-obj`).val(encodeURIComponent2(JSON.stringify(result[0].obj)))

					if(locals.lookupTextField){
						$(`#${locals.id}-original-text`).html((result[0].label || ''))
					}

				}else{
					if(valueText=='')
						$(`#${locals.id}-autocomplete-text`).val('')
					$(`input[name="${locals.name}"]`).val('')
					$(`#${locals.id}-obj`).val('')
					$(`#${locals.id}-original-text`).html('')
				}

			}else{
				$(`#${locals.id}-autocomplete-text`).val('')
				$(`#${locals.id}-autocomplete-text`).attr('placeholder',`Hata:${err.message}`)
			}
		})

	}
}



function cboEasyDateChange(value){

	var date1=new Date()
	var date2=new Date()
	date1.setHours(0, 0, 0, 0)
	date1.setMinutes((new Date()).getTimezoneOffset())
	date2.setHours(0, 0, 0, 0)
	date2.setMinutes((new Date()).getTimezoneOffset())

	switch(value){
		case 'today':
		break
		case 'thisWeek':
		date1=date1.addDays(-1 * (date1.getDay()-1))
		date2=date2.addDays(7- date2.getDay())
		break
		case 'thisMonth': 
		date1=date1.addDays(-1 * (date1.getDate()-1))
		date2=date2.lastThisMonth()
		break
		case 'last1Week':
		date1=date1.addDays(-7)
		break

		case 'last1Month':
		date1=new Date(date1.setMonth(date1.getMonth()-1))
		break
		case 'last3Months':
		date1=new Date(date1.setMonth(date1.getMonth()-3))
		break
		case 'last6Months':
		date1=new Date(date1.setMonth(date1.getMonth()-6))
		break
		case 'thisYear':
		date1=new Date(date1.getFullYear(),0,1)
		date2=new Date(date2.getFullYear(),11,31)
		break
		case 'last1Year':
		date1=new Date(date1.setMonth(date1.getMonth()-12))
		break
		default:
		break
	}
	return {
		date1:date1.yyyymmdd(),
		date2:date2.yyyymmdd()
	}
}


function replaceUrlCurlyBracket(url,item){
	if((url || '')=='')
		return ''
	if(!(url.indexOf('{')>-1 && url.indexOf('}')>-1))
		return url
	var fieldList=[]
	var dizi=url.split('}')
	dizi.forEach((e)=>{
		if(e.indexOf('{')>-1){
			fieldList.push(e.split('{')[1])
		}
	})

	fieldList.forEach((e)=>{
		url=url.replaceAll(`{${e}}`,getPropertyByKeyPath(item,e))
	})

	return url
}



function getPropertyByKeyPath(targetObj, keyPath) {
	if(targetObj==undefined || targetObj==null || !keyPath)
		return targetObj

	if(keyPath.substr(0,1)=='/')
		keyPath=keyPath.substr(1)
	if(keyPath.substr(0,2)=='./')
		keyPath=keyPath.substr(2)
	keyPath=keyPath.replaceAll('/','.')

	var keys = keyPath.split('.')
	if(keys.length == 0) 
		return undefined
	keys = keys.reverse()
	var subObject = targetObj
	while(keys.length) {
		var k = keys.pop()
		if(typeof subObject[k]=='undefined' || subObject[k]==null) {
			return undefined
		} else {
			subObject = subObject[k]
		}
	}
	return subObject
}

function getFormData(divId){

	var obj=listObjectToObject($(`${divId}`).serializeArray().reduce((obj, item) => ({ ...obj, ...{ [item.name.replaceAll('[','.').replaceAll(']','')]: item.value } }), {}))
	return obj
}

function getRemoteData(item,cb){
	var data={
		value:item.value || ''
	}
	if(item.value==undefined){
		switch(item.type){
			case 'grid':
			data.value=[]
			break
			case 'form':
			data.value={}
			break
			case 'filter':
			data.value={}
			break

			case 'number':
			case 'money':
			data.value=0
			break

			default:
			data.value=''
			break
		}
	}

	if(item.dataSource==undefined){
		return cb(null,data)
	}

	var url=item.dataSource.url
	var bHashParamsEkle=false
	if(hashObj.func=='addnew'){
		return cb(null,item)
	}else{
		if(hashObj.id){
			url=`${url.split('?')[0]}/${hashObj.id}`
			if(url.split('?')[1]){
				url+='?' + url.split('?')[1]
			}
		}
	}
	var filterString=''
	Object.keys(hashObj.query).forEach((key)=>{
		if(key!='mid'){
			if(filterString!='')
				filterString+='&'
			filterString+=`${key}=${encodeURIComponent2(hashObj.query[key])}`
		}
	})
	if(filterString!=''){
		url+=`${url.indexOf('?')>-1?'&':'?'}${filterString}`
	}

	$.ajax({
		url:url,
		type:item.dataSource.method || 'GET',
		dataType: 'json',
		success: function(result) {
			if(result.success){
				if(result.data.docs){
					data.value=result.data.docs
					data.paging={
						page:result.data.page,
						pageCount:result.data.pageCount,
						pageSize:result.data.pageSize,
						recordCount:result.data.recordCount
					}
				}else{
					data.value=result.data
				}

				cb(null,data)
			}else{
				cb(result.error)
			}
		},
		error:function(err){
			cb(err)
		}
	})

}

function cariKart_changed(prefix){
	var fieldList=[
	"person.firstName.value",
	"person.familyName.value",
	"partyIdentification.0.ID.value",
	"partyIdentification.0.ID.attr.schemeID",
	"partyTaxScheme.taxScheme.name.value",
	"postalAddress.streetName.value",
	"postalAddress.buildingNumber.value",
	"postalAddress.buildingName.value",
	"postalAddress.blockName.value",
	"postalAddress.room.value",
	"postalAddress.citySubdivisionName.value",
	"postalAddress.district.value",
	"postalAddress.cityName.value",
	"postalAddress.region.value",
	"postalAddress.country.identificationCode.value",
	"postalAddress.country.name.value",
	"postalAddress.postbox.value",
	"contact.telephone.value",
	"contact.telefax.value",
	"contact.electronicMail.value",
	"websiteURI.value"
	]

	var cari=$(`#${generateFormId(prefix+'.party._id')}-obj`).val()
	if(cari==undefined)
		return
	var obj=JSON.parse(decodeURIComponent(cari))
	fieldList.forEach((e)=>{
		var componentFieldName=`${prefix}.party.${e}`

		var value=getPropertyByKeyPath(obj,e)
		if(value!=undefined){
			if($(`#${generateFormId(componentFieldName)}`).val()!=undefined){
				$(`#${generateFormId(componentFieldName)}`).val(value)
			}
		}
	})

	if(($(`#${generateFormId(prefix + '.party.postalAddress.country.identificationCode.value')}`).val() || '')==''){
		$(`#${generateFormId(prefix + '.party.postalAddress.country.identificationCode.value')}`).val('TR')

	}
}

function countryCode_changed(prefix){
	var fieldName=`${prefix}.party.postalAddress.country.identificationCode.value`
	var fieldNameCountryName=`${prefix}.party.postalAddress.country.name.value`
	var countryCode=$(`#${generateFormId(fieldName)}`).val() || ''
	var countryText=$(`#${generateFormId(fieldName)} option:selected`).text() || ''

	if(countryCode!=''){
		$(`#${generateFormId(fieldNameCountryName)}`).val(countryText)

	}
}

function formSave(dataSource,formData){
	var hashObj=getHashObject()
	var url=dataSource.url
	var method='GET'
	if(hashObj.func=='addnew'){
		method='POST'
	}else if(hashObj.func=='edit' && hashObj.id){
		method='PUT'
		url=`${url.split('?')[0]}/${hashObj.id}`
		if(url.split('?')[1]){
			url+='?' + url.split[1]
		}
	}else{
		return alertX('URL hatasi var')
	}

	$.ajax({
		url:url,
		type:method,
		data:formData,
		dataType: 'json',
		success: function(result) {
			if(result.success){

				var hashObj=Object.assign({},getHashObject(),{func:'index',page:1})
				setHashObject(hashObj)
			}else{
				showError(result.error)
			}
		},
		error:function(err){
			showError(err)
		}
	})
}

function collectFieldList(item){
	var fieldList={}
	if(item.tabs){
		item.tabs.forEach((tab)=>{
			if(tab.fields){
				var f=collectFieldList(tab.fields)
				fieldList=Object.assign({},fieldList,f)
			}
		})

	}else if(item.fields){

		Object.keys(item.fields).forEach((key)=>{
			if(item.fields[key].fields){
				var f=collectFieldList(item.fields[key])

				if(item.fields[key].type=='grid'){

					Object.keys(f).forEach((k)=>{
						f[k].id=f[k].id || generateFormId(key + '.' + k)
						f[k].name=f[k].name || generateFormName(key + '.' + k)
					})
					var f2={}
					f2[key]=f
					fieldList=Object.assign({},fieldList,f2)
				}else{
					Object.keys(f).forEach((k)=>{
						f[k].id=f[k].id || generateFormId(k)
						f[k].name=f[k].name || generateFormName(k)
					})
					fieldList=Object.assign({},fieldList,f)
				}

			}else{
				fieldList[key]=item.fields[key]
				fieldList[key].id=fieldList[key].id || generateFormId(key)
				fieldList[key].name=fieldList[key].name || generateFormName(key)
			}
		})
	}
	return fieldList
}

function gridSatirDuzenle(rowIndex,tableId,insideOfModal){
	var frm=FormControl.FormControl
	var table=document.getElementById(tableId)
	var thead=document.querySelector(`#${tableId} thead`)
	var tbody=document.querySelector(`#${tableId} tbody`)

	if(rowIndex>-1){
		var trYedek=tbody.rows[rowIndex].cloneNode(true)
		tbody.deleteRow(rowIndex)
		var editRow=tbody.insertRow(rowIndex)
		editRow.id=`${tableId}-gridSatir-edit-${rowIndex}`
		editRow.detail=trYedek

		editRowSekillendir(table.item,editRow,tableId,rowIndex)
		var fieldList=clone(table.item.fields)

		editRowCalculation(`#${tableId} tbody #${editRow.id}`, `${table.item.parentField}.${rowIndex}`, fieldList)
		ilkElemanaFocuslan(`#${tableId} tbody #${editRow.id}`)
	}

	$(`#${tableId}`).append(`<script type="text/javascript">${frm.script}<\/script>`)

	function editRowSekillendir(item,editRow,tableId,rowIndex){
		Object.keys(item.fields).forEach((key,cellIndex)=>{
			var field=item.fields[key]
			field.field=`${item.field}.${rowIndex}.${key}`
			field.id=generateFormId(field.field)
			field.name=generateFormName(field.field)
			field.noGroup=true
			field.value=''
			var td=editRow.insertCell()
			if(field.visible===false){
				td.classList.add('hidden')
			}

			if(editRow.detail.cells[cellIndex].querySelector(`input`)){
				field.value=editRow.detail.cells[cellIndex].querySelector(`input`).value
			}
			if(field.type=='boolean'){
				field.class='grid-checkbox'
				field.value=field.value.toString()==='true'?true:false
			}

			field.valueText=editRow.detail.cells[cellIndex].innerText

			var data={value:{}}
			data.value[field.field]=field.value
			if(field.lookupTextField){
				data.value[field.lookupTextField]=field.valueText
			}
			data.value=listObjectToObject(data.value)

			td.innerHTML=frm.generateControls(field,data)
		})
		var td=editRow.insertCell()
		td.classList.add('text-center')
		td.innerHTML=`<a href="javascript:gridSatirOK('${tableId}','${editRow.id}',${rowIndex},${insideOfModal})" class="btn btn-primary btn-grid-row" title="Tamam"><i class="fas fa-check"></i></a>
		<a href="javascript:gridSatirVazgec('${tableId}','${editRow.id}',${rowIndex},${insideOfModal}) "class="btn btn-dark btn-grid-row" title="Vazgeç"><i class="fas fa-reply"></i></a>
		`
	}
}

function gridSatirOK(tableId,rowId,rowIndex,insideOfModal){
	var table=document.getElementById(tableId)
	var satirObj=getDivData(`#${tableId} #${rowId}`,`${table.item.parentField}.${rowIndex}`)
	var item=clone(table.item)
	if(rowIndex>-1){
		item.value[rowIndex]=satirObj
	}else{
		item.value.push(satirObj)
	}
	var frm=FormControl.FormControl
	$(`#${tableId}`).html(frm.gridHtml(item,false,insideOfModal))
	frm.script+=`
	document.getElementById('${tableId}').item=${JSON.stringify(item)}
	ilkElemanaFocuslan('#${tableId} tbody #${rowId}')

	`
	$(`#${tableId}`).append(`<script type="text/javascript">${frm.script}<\/script>`)
}

function gridSatirSil(rowIndex,tableId,insideOfModal){
	var table=document.getElementById(tableId)
	var item=clone(table.item)
	if(rowIndex>-1){
		item.value.splice(rowIndex,1)
	}
	var frm=FormControl.FormControl
	$(`#${tableId}`).html(frm.gridHtml(item,false,insideOfModal))
	$(`#${tableId}`).append(`<script type="text/javascript">document.getElementById('${tableId}').item=${JSON.stringify(item)}<\/script>`)
}


function gridSatirVazgec(tableId,rowId,rowIndex,insideOfModal){
	if(rowIndex>-1){
		var editRow=document.getElementById(rowId)
		editRow.innerHTML=editRow.detail.innerHTML
	}else{
		var table=document.getElementById(tableId)
		var item=clone(table.item)
		var frm=FormControl.FormControl
		$(`#${tableId}`).html(frm.gridHtml(item,false,insideOfModal))
		frm.script+=`
		document.getElementById('${tableId}').item=${JSON.stringify(item)}
		ilkElemanaFocuslan('#${tableId} tbody #${rowId}')

		`
		$(`#${tableId}`).append(`<script type="text/javascript">${frm.script}<\/script>`)


	}

}

function ilkElemanaFocuslan(selector){
	var ilkEleman=document.querySelector(`${selector}`).querySelector('input,select')
	if(ilkEleman){
		ilkEleman.focus()
		if(typeof ilkEleman.select === 'function'){
			if(ilkEleman.getAttribute('readonly')!=undefined || ilkEleman.getAttribute('disabled')!=undefined){
				enterNext(ilkEleman)
			}else{
				ilkEleman.select()
			}
		}
	}
}

function editRowCalculation(selector, prefix, fields){

	$(`${selector} input,select`).on('change',(e)=>{
		var valueObj=getDivData(selector,prefix)
		Object.keys(fields).forEach((key)=>{
			if(fields[key].id!=e.target.id && fields[key].calc){
				try{
					$(`#${fields[key].id}`).attr('type','text')
					$(`#${fields[key].id}`).val(eval(replaceUrlCurlyBracket(fields[key].calc,valueObj)))
				}catch(tryErr){
					$(`#${fields[key].id}`).val(replaceUrlCurlyBracket(fields[key].calc,valueObj))
				}
			}
		})
	})
}

function gridDeleteItem(rowIndex,tableId){
	var table=document.getElementById(tableId)
	var item=clone(table.item)
	if(!item.dataSource)
		return
	if(!item.value)
		return

	var row=table.querySelectorAll('tbody tr')[rowIndex]
	var listItem=item.value[rowIndex]
	if(!row)
		return


	var soru=`Belge/Nesne silinecektir! Onaylıyor musunuz?`
	var i=0
	soru+=`<br><hr class="hr-primary">`
	while(i<row.cells.length && i<4){
		if(row.cells[i].innerText.trim()!=''){
			soru+=`${row.cells[i].innerHTML.trim()}<br>`
		}
		i++
	}

	var url=''
	if(item.dataSource.deleteUrl){
		url=item.dataSource.deleteUrl.split('?')[0]
	}else{
		url=item.dataSource.url.split('?')[0]
		url+=`/{_id}`
	}
	url=replaceUrlCurlyBracket(url,listItem)

	confirmX(soru,'danger',(answer)=>{
		if(!answer)
			return
		$.ajax({
			url:url,
			type:'DELETE',
			success: function(result) {
				if(result.success){
					window.onhashchange()
				}else{
					showError(result.error)
				}
			},
			error:function(err){
				showError(err)
			}
		})
	})
}

function gridCopyItem(rowIndex,tableId){
	var table=document.getElementById(tableId)
	var item=clone(table.item)
	if(!item.dataSource)
		return
	if(!item.value)
		return

	var row=table.querySelectorAll('tbody tr')[rowIndex]
	var listItem=item.value[rowIndex]
	if(!row)
		return

	var url=''
	if(item.dataSource.copyUrl){
		url=item.dataSource.copyUrl.split('?')[0]
	}else{
		url=item.dataSource.url.split('?')[0]
		url+=`/copy/{_id}`
	}
	url=replaceUrlCurlyBracket(url,listItem)

	var name=''
	var nameTitle=''
	if(item.fields['name']){
		name=listItem['name'] || ''
		nameTitle=item.fields['name'].title || ''
	}else if(item.fields['name.value']){
		name=getPropertyByKeyPath(listItem,'name.value') || ''
		nameTitle=item.fields['name.value'].title || ''
	}else if(item.fields['ID']){
		name=listItem['ID'] || ''
		nameTitle=item.fields['ID'].title || ''
	}else if(item.fields['ID.value']){
		name=getPropertyByKeyPath(listItem,'ID.value') || ''
		nameTitle=item.fields['ID.value'].title || ''
	}

	if(name==''){
		Object.keys(item.fields).forEach((key)=>{
			if(name=='' && item.fields[key].type=='string' && item.fields[key].readonly!==true && item.fields[key].visible!==false){
				name=getPropertyByKeyPath(listItem,key)
				nameTitle=item.fields[key].title || ''
			}
		})	
	}

	copyX({
		newName:{title:`Yeni ${nameTitle}`,type:'string',value:`${name} kopya`}
	},'Kopya oluştur',(answer,formData)=>{
		if(!answer)
			return
		$.ajax({
			url:url,
			data:formData,
			type:'POST',
			success: function(result) {
				if(result.success){
					window.onhashchange()
				}else{
					showError(result.error)
				}
			},
			error:function(err){
				showError(err)
			}
		})
	})

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
							if(remoteList[e].list[key].lookupTextField){

								$(`input[name="${remoteList[e].list[key].lookupTextField}"]`).val(d.value)
							}
						}
					})
				})

			}else{
				console.error('getAjax err:',err)
			}
		})
	})
}

var keyupTimer=0

function runTimer(selector,prefix=''){
	if(keyupTimer==0)
		return

	if(keyupTimer>=2){
		keyupTimer=0
		runFilter(selector,prefix)
	}else{
		keyupTimer++
		setTimeout(()=>{
			runTimer(selector,prefix)
		},1000)
	}
}

function runFilter(selector,prefix=''){
	var hashObj=getHashObject()
	var obj=getDivData(selector,prefix)
	if(obj)
		obj=objectToListObject(obj)
	Object.keys(obj).forEach((key)=>{
		if(hashObj.query[key]!=undefined && obj[key]==''){
			hashObj.query[key]=undefined
			delete hashObj.query[key]
		}else{
			if(obj[key]!=''){
				hashObj.query[key]=obj[key]
			}
		}
	})
	if(hashObj.query.page){
		hashObj.query.page=1
	}
	setHashObject(hashObj)
}

function menuLink(path,filter){
	var s=`#${path}`

	if(!filter){
		filter={}
	}
	if(filter){
		var filterString=''
		Object.keys(filter).forEach((key)=>{
			if(filterString!='')
				filterString+='&'
			filterString+=`${key}=${encodeURIComponent2(filter[key])}`
		})
		s+='?' + filterString
	}
	return s
}




function openPage(url,title){
	history.pushState('', 'New Page Title', '${s}')
}

var q=getAllUrlParams()

function getAllUrlParams(query=null){
	var q={}
	var queryString=query || window.location.search
	if(queryString.substr(0,1)!='?'){
		queryString='?' + queryString
	}
	var dizi=queryString.split('&')
	dizi.forEach((d)=>{
		var key=d.split('=')[0]
		if(key[0]=='?')
			key=key.substr(1)

		var value=getUrlParameter(key,queryString)

		if(value!=''){

			q[key]=value
		}
	})
	return q
}


function getUrlParameter(name,query=null) {
	name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]')
	var regex = new RegExp('[\\?&]' + name + '=([^&#]*)')
	var results=regex.exec(query || location.search)

	return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '))
}

function getHashObject(){
	if(window.location.hash=='')
		return {}

	var hash=window.location.hash.substr(1)
	var queryString=hash.split('?')[1]?hash.split('?')[1]:''
	var dizi=hash.split('?')[0].split('/')
	dizi.splice(0,1)

	var hashObj={
		path:dizi.length>1?`/${dizi[0]}/${dizi[1]}`:'',
		pathKey:dizi.length>1?`${dizi[0]}.${dizi[1]}`:'',
		func:dizi.length>2?dizi[2]:'',
		id:dizi.length>3?dizi[3]:'',
		param1:dizi.length>4?dizi[4]:'',
		param2:dizi.length>5?dizi[5]:'',
		param3:dizi.length>6?dizi[6]:'',
		query:{},
		queryString:queryString
	}
	if(hashObj.path && hashObj.func==''){
		hashObj.func='index'
	}

	if(queryString){

		hashObj.query=getAllUrlParams(queryString)
	}

	return hashObj
}


function setHashObject(hashObj){
	var hashString=hashObj.path || ''

	if(hashObj.func!='' && hashObj.func!='index'){
		hashString+='/' + hashObj.func
		if(hashObj.id){
			hashString+='/' + hashObj.id
			if(hashObj.param1){
				hashString+='/' + hashObj.param1
				if(hashObj.param2){
					hashString+='/' + hashObj.param2
					if(hashObj.param3){
						hashString+='/' + hashObj.param3
					}
				}
			}
		}
	}

	if(hashObj.query){
		var filterString=''
		Object.keys(hashObj.query).forEach((key)=>{
			if(filterString!='')
				filterString+='&'
			filterString+=`${key}=${encodeURIComponent2(hashObj.query[key])}`
		})
		if(filterString!=''){
			hashString+=`?${filterString}`
		}
	}

	window.location.hash=hashString
}

function getHashObject111(){


	var hash=window.location.href.split(`${window.location.origin}/haham`)[1]
	var queryString=hash.split('?')[1]?hash.split('?')[1]:''
	var dizi=hash.split('?')[0].split('/')
	dizi.splice(0,1)

	var hashObj={
		path:dizi.length>1?`/${dizi[0]}/${dizi[1]}`:'',
		pathKey:dizi.length>1?`${dizi[0]}.${dizi[1]}`:'',
		func:dizi.length>2?dizi[2]:'',
		id:dizi.length>3?dizi[3]:'',
		param1:dizi.length>4?dizi[4]:'',
		param2:dizi.length>5?dizi[5]:'',
		param3:dizi.length>6?dizi[6]:'',
		query:{},
		queryString:queryString
	}
	if(hashObj.path && hashObj.func==''){
		hashObj.func='index'
	}

	if(queryString){

		hashObj.query=getAllUrlParams(queryString)
	}
	return hashObj
}

function setHashObject111(hashObj){
	var hashString=hashObj.path || ''

	if(hashObj.func!='' && hashObj.func!='index'){
		hashString+='/' + hashObj.func
		if(hashObj.id){
			hashString+='/' + hashObj.id
			if(hashObj.param1){
				hashString+='/' + hashObj.param1
				if(hashObj.param2){
					hashString+='/' + hashObj.param2
					if(hashObj.param3){
						hashString+='/' + hashObj.param3
					}
				}
			}
		}
	}

	if(hashObj.query){
		var filterString=''
		Object.keys(hashObj.query).forEach((key)=>{
			if(filterString!='')
				filterString+='&'
			filterString+=`${key}=${encodeURIComponent2(hashObj.query[key])}`
		})
		if(filterString!=''){
			hashString+=`?${filterString}`
		}
	}

	window.location.href= `${window.location.origin}/haham${hashString}`
}

function pageTitle(leftMenu){
	var breadCrumbs=[]
	var pageTitle=''
	var funcTitle=hashObj.func || ''
	breadCrumbs=getBreadCrumbs(leftMenu,(hashObj.query.mid || '0'))

	if(breadCrumbs.length>0){
		pageTitle+=`<i class="${breadCrumbs[breadCrumbs.length-1].icon || ''}"></i> `
		breadCrumbs.forEach((e,index)=>{
			if(index<breadCrumbs.length-1){
				pageTitle+=`${e.text} \\ `
			} else {
				if(funcTitle!='' && funcTitle!='index'){
					pageTitle+=`${e.text} \\ `
				} else {
					pageTitle+=`<span class="font-weight-bold text-orange">${e.text}</span>`
				}
			}
		})
		document.title=(breadCrumbs[breadCrumbs.length-1].text || '') + ' - tr216'
		if(funcTitle!='' && funcTitle!='index'){
			switch(funcTitle){
				case 'edit':
				pageTitle+=`<span class="font-weight-bold text-orange">Düzenle</span>`
				break
				case 'addnew':
				pageTitle+=`<span class="font-weight-bold text-orange">Yeni</span>`
				break
				case 'view':
				pageTitle+=`<span class="font-weight-bold text-orange">İzleme</span>`
				break
				case 'print':
				pageTitle+=`<span class="font-weight-bold text-orange">Yazdır</span>`
				break
				default:
				pageTitle+=`<span class="font-weight-bold text-orange">${funcTitle}</span>`
				break
			}
		}
	}

	$('#pageTitle').html(pageTitle)
}

function generateLeftMenu(leftMenu){
	var hashObj=getHashObject()
	var mid=hashObj.query.mid || '0'

	var s=``
	leftMenu.forEach((item,index)=>{
		s+=generateMenu(item,mid)
	})
	return s
}

function generateMenu(menu,mid,parent){
	var s=``
	var bActive=false

	if(typeof menu.nodes!='undefined'){
		if(menu.nodes.length>0){
			bActive=false
			menu.nodes.forEach((e)=>{
				if(e.mId==mid){
					bActive=true
					return
				}
				if(typeof e.nodes!='undefined'){
					e.nodes.forEach((e2)=>{
						if(e2.mId==mid){
							bActive=true
							return
						}
					})
				}
			})
			s=`\n`
			if(bActive){
				s+=`<a class="nav-link" href="#" data-toggle="collapse" data-target="#pagesCollapse${menu.mId.replaceAll('.','-')}" aria-expanded="false" aria-controls="pagesCollapse${menu.mId.replaceAll('.','-')}">\n`
			}else{
				s+=`<a class="nav-link collapsed" href="#" data-toggle="collapse" data-target="#pagesCollapse${menu.mId.replaceAll('.','-')}" aria-expanded="false" aria-controls="pagesCollapse${menu.mId.replaceAll('.','-')}">\n`
			}

			s+=`<div class="sb-nav-link-icon"><i class="${menu.icon || 'fas fa-table'}"></i></div>
			${menu.text}
			<div class="sb-sidenav-collapse-arrow"><i class="fas fa-angle-down"></i></div>
			</a>`

			if(bActive){
				s+=`<div class="collapse show" `
			}else{
				s+=`<div class="collapse" `
			}
			if(parent){
				s+=`id="pagesCollapse${menu.mId.replaceAll('.','-')}" data-parent="#pagesCollapse${parent.mId.replaceAll('.','-')}">`
			}else{
				s+=`id="pagesCollapse${menu.mId.replaceAll('.','-')}" data-parent="#sidenavAccordion">`
			}

			s+=`<nav class="sb-sidenav-menu-nested nav accordion" id="navId${menu.mId.replaceAll('.','-')}">
			`
			menu.nodes.forEach((e)=>{
				s+=generateMenu(e,mid,menu)
			})
			s+=`
			</nav>
			</div>`
		}
		return s
	}else{
		if(menu.mId==mid){
			bActive=true
		}
		s=`\n`
		var link=menuLink(menu.path,{mid:menu.mId})
		s+=`<a id="menu${menu.mId.replaceAll('.','-')}" class="nav-link navigation ${bActive?'active':''}" href="${link}">`

		s+=`<div class="sb-nav-link-icon"><i class="${menu.icon || 'fas fa-table'}"></i></div>
		${menu.text}
		</a>
		`
		return s

	}
}


function getBreadCrumbs(leftMenu,mid){
	var menuItem=[]

	leftMenu.forEach((m1)=>{
		if(menuItem.length>0)
			return
		if(m1.mId==mid){
			menuItem.push({text:m1.text,icon:m1.icon, mId:m1.mId})
			return
		}

		if(m1.nodes){
			m1.nodes.forEach((m2)=>{

				if(m2.mId==mid){
					menuItem.push({text:m1.text,icon:m1.icon, mId:m1.mId})
					menuItem.push({text:m2.text,icon:m2.icon, mId:m2.mId})
					return
				}
				if(m2.nodes){
					m2.nodes.forEach((m3)=>{
						if(m3.mId==mid){
							menuItem.push({text:m1.text,icon:m1.icon, mId:m1.mId})
							menuItem.push({text:m2.text,icon:m2.icon, mId:m2.mId})
							menuItem.push({text:m3.text,icon:m3.icon, mId:m3.mId})
							return
						}
						if(m3.nodes){
							m3.nodes.forEach((m4)=>{
								if(m4.mId==mid){
									menuItem.push({text:m1.text,icon:m1.icon, mId:m1.mId})
									menuItem.push({text:m2.text,icon:m2.icon, mId:m2.mId})
									menuItem.push({text:m3.text,icon:m3.icon, mId:m3.mId})
									menuItem.push({text:m4.text,icon:m4.icon, mId:m4.mId})
									return
								}
							})
						}
					})
				}
			})
		}
	})

	return menuItem
}

function changedb(dbId){
	window.location.href=`/changedb?db=${dbId}&r=${window.location.href}`
}


function openInNewTab(url) {
	var win = window.open(url, '_blank')
	win.focus()
}

function windowPathToFieldName(path=''){
	if(path=='')
		path=getHashObject().path
	if(path.substr(0,1)=='/')
		path=path.substr(1)
	path=path.replaceAll('/','_')


	return path
}


function programButtons(session,urlPath,panelButtons=''){

	var prgButtons=[]
	var pathFieldName=convertPathFieldName(urlPath)

	try{
		prgButtons=session.settings.page[pathFieldName].programs
	}catch(err){

	}
	if(prgButtons.length==0 && panelButtons=='')
		return ''

	var sbuf=`<div class="button-bar mt-2 p-1 rounded justify-content-start" role="toolbar" aria-label="Toolbar with button groups">\n`
	if(panelButtons!='')
		sbuf +=panelButtons

	if(prgButtons.length>0){
		prgButtons.forEach((e)=>{
			var icon=''

			e.showButtonText=e.showButtonText || false
			if((e.icon || '')!=''){
				icon=e.icon
			}else{
				switch(e.type){
					case 'file-importer':
					icon='fas fa-file-import'
					break
					case 'file-exporter':
					icon='fas fa-file-export'
					break
					case 'connector-importer':
					icon='fas fa-cloud-upload-alt'
					break

					case 'connector-exporter':
					icon='fas fa-cloud-download-alt'
					break

					case 'email':
					icon='fas fa-envelope-square'
					break

					case 'sms':
					icon='fas fa-sms'
					break
				}
			}
			sbuf +=`<a class="btn btn-primary mr-2" href="javascript:runProgram('${e._id}','${e.type}')" title="${e.name}">${icon!=''?'<i class="' + icon + '"></i>':''} ${e.showButtonText?e.name:''}</a>\n`
		})
	}
	sbuf+=`</div>\n`
	return sbuf
}
