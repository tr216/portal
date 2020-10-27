(function(exports) {
	var frontEnd=true
	if(typeof config!='undefined'){
		if(typeof config.mongodb!='undefined'){
			frontEnd=false
		}
	}
	
	exports.GridBuilder = Object.freeze({
		generateGrid:generateGrid,
		clearStorageForGrid:clearStorageForGrid
	})

	function generateGrid(fields,options,data){
		var s=``
		options=buttonOptions(options)

		s+=`
		<div class="table-responsive mt-1">
		<div class="row m-0 border">
		<div class="col-12 pt-1 px-1">
		<div class="float-left form-inline m-0 p-0 mt-1 mb-1">
		${(options.filter || false)?'<a class="btn btn-secondary btn-sm mr-3" data-toggle="collapse" href="#filterRow" role="button" aria-expanded="false" aria-controls="filterRow" title="Filtre satırını göster/gizle"><i class="fas fa-filter"></i></a>':''}
		${gridPageSize(data.pageSize)}
		<div class="" style="display: inline-flex;">
		${gridPageCount(data)}
		</div>
		</div>
		<div class="float-right">
		${gridPagerButtons(data)}
		</div>

		</div>
		</div>
		<table id="grid1" class="table table-striped m-0"  cellspacing="0">
		${gridHeader(fields,options)}
		<tbody>`
		data.list.forEach((row,index)=>{
			s+=`<tr>
			${options.selection && row._id?'<th><input type="checkbox" class="grid-checkbox checkSingle" value="${encodeURIComponent2(JSON.stringify(row))}" name="selected[${index}]"  id="selected[${index}]"></th>':''}
			${gridRow(fields,options,row)}
			</tr>
			`
		})

		s+=`

		</tbody>
		</table>
		<div class="row m-0 border">
		<div class="col-12 pt-1 px-1">
		<div class="float-left form-inline m-0 p-0 mt-1 mb-1">
		${gridPageCount(data)}
		</div>
		<div class="float-right">
		${gridPagerButtons(data)}
		</div>
		</div>
		</div>
		</div>`

		if(frontEnd){
			$(document).ready(()=>{
				$('#selectAll').on('change',(e)=>{
					$('input:checkbox').not($('#selectAll')).prop('checked', $('#selectAll').prop('checked'))
				})
			})
		}else{
			s+=`<script type="text/javascript">
			$(document).ready(()=>{
				$('#selectAll').on('change',(e)=>{
					$('input:checkbox').not($('#selectAll')).prop('checked', $('#selectAll').prop('checked'))
				})
			})
			</script>`
		}
		return s
	}

	function buttonOptions(options){
		var defaultButtons={
			add:[false,''],
			edit:[false,''],
			delete:[false,''],
			view:[false,''],
			print:[false,'']
		}
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
			options.buttons.add[1]=`<a href="${window.location.pathname}/addnew?sid=${q.sid}&mid=${q.mid}" class="btn btn-primary  btn-sm far fa-plus-square" target="_self"  title="Yeni Ekle"></a>`
		}
		
		if(options.buttons.edit[0]==true && options.buttons.edit[1]==''){
			options.buttons.edit[1]=`<a href="${window.location.pathname}/edit/{_id}?sid=${q.sid}&mid=${q.mid}" class="btn btn-primary btn-sm fas fa-edit ml-1" target="_self"  title="Düzenle"></a>`
		}

		if(options.buttons.view[0]==true && options.buttons.view[1]==''){
			options.buttons.view[1]=`<a href="javascript:popupCenter('${window.location.pathname}/view/{_id}?sid=${q.sid}&mid=${q.mid}','İncele','900','600')" class="btn btn-info  btn-sm fa fa-eye ml-1" title="İncele"></a>`
		}

		if(options.buttons.delete[0]==true && options.buttons.delete[1]==''){
			options.buttons.delete[1]=`<a href="javascript:deleteItem('${options.buttons.delete[1]}','{_id}');" class="btn btn-danger  btn-sm fas fa-trash-alt ml-1" title="Sil"></a>`
		}

		if(options.buttons.print[0]==true && options.buttons.print[1]==''){
			options.buttons.print[1]=`<a href="javascript:popupCenter('${window.location.pathname}/print/{_id}?sid=${q.sid}&mid=${q.mid}','Yazdır','900','600')" class="btn btn-info  btn-sm ml-1" title="Yazdır"><i class="fas fa-print"></i></a>`
		}

		Object.keys(options.buttons).forEach((key)=>{
			buttonCount +=options.buttons[key][0]?1:0
		})
		if(buttonCount>1 && options.buttons.add[0])
			buttonCount--


		options.buttonWidth=`${buttonCount*45+10}px`
		return options
	}

	function gridRow(fields,options,row){
		var s=``
		fields.forEach((e,index)=>{
			if(!e.visible){
				var itemValue=getPropertyByKeyPath(row,e.field) || ''
				
				if(e.type=='lookup'){
					var lookupText=''
					Object.keys(e.lookup || {}).forEach((key)=>{
						if(key===itemValue.toString()){
							lookupText = e.lookup[key]
							return
						}
					})
					s+=`<td class="${e.class?e.class:'ml-1'}">${lookupText}</td>`
				}else if(e.type=='number'){
					s+=`<td class="${e.class?e.class:'text-right mr-1'}">${itemValue}</td>`
				}else if(e.type=='money'){
					s+=`<td class="${e.class?e.class:'text-right mr-1'}">${Number(itemValue).formatMoney()}</td>`
				}else if(e.type=='boolean'){
					s+=`<td class="${e.class?e.class:'text-center'}" style="font-size:20px;">${itemValue?'<i class="fas fa-check-square text-primary"></i>':'<i class="far fa-square text-dark"></i>'}</td>`
				}else{
					s+=`<td class="${e.class?e.class:'ml-1'}">${itemValue}</td>`
				}
				
			}
		})
		s+=`<td class="text-center">
		${options.buttons.print[0]?replaceUrlCurlyBracket(options.buttons.print[1],row,fields):''}
		${options.buttons.view[0]?replaceUrlCurlyBracket(options.buttons.view[1],row,fields):''}
		${options.buttons.edit[0]?replaceUrlCurlyBracket(options.buttons.edit[1],row,fields):''}
		${options.buttons.delete[0]?replaceUrlCurlyBracket(options.buttons.delete[1],row,fields):''}
		</td>`

		return s
	}

	function gridHeader(fields,options){
		var s=`<thead>
		<tr class="text-nowrap">
		${options.selection?'<th style="width: 30px;"><input class="grid-checkbox" type="checkbox" value="true" name="selectAll" id="selectAll"></th>':''}
		`

		fields.forEach((e)=>{
			if(!e.visible){
				var cls=''
				switch(e.type){
					case 'money':
					case 'number':
					cls='text-right mr-1'
					break
					case 'boolean':
					cls='text-center'
					break
				}
				s+=`<th class="${cls}" style="${(typeof e.width!='undefined')?'width:' + e.width + 'px':''}">${(typeof e.icon!='undefined')?'<i class="' + e.icon + '"></i>':''} ${e.title || e.text || ''}</th>`
			}
		})
		
		s+=`<th class="text-center" style="width:${options.buttonWidth}">
		${options.buttons.add[0]==true?options.buttons.add[1]:''}
		</th>
		</tr>
		`
		if(options.filter){
			s+=`<tr class="collapse" id="filterRow">
			${options.selection?'<th></th>':''}
			`
			fields.forEach((e,index)=>{
				if(!e.visible){
					if(options.filter){
						e.filter=e.filter==undefined?true:e.filter
					}
					s+=`<th class="" style="">`
					if(e.filter){
						if(e.type=='lookup'){
							s+=`<select name="filter_${index}" id="filter_${index}" class="form-control p-0 m-0">`
							s+=`<option value="">-- Tümü --</option>`
							Object.keys(e.lookup || {}).forEach((key)=>{
								s+=`<option value="${key}" ${(e.filterValue==key)?'selected':''}>${e.lookup[key]}</option>`
							})
							s+=``
						}else{
							s+=`<input type="text" class="form-control p-0 m-0" name="filter_${index}" id="filter_${index}" placeholder="${e.placeholder?e.placeholder:''}" value="${e.filterValue || ''}">`
						}
					}
					s+=`</th>`
				}
			})
			s+=`<th></th>`
			s+=`</tr>`
		}
		s+=`</thead>`
		return s

	}


	function gridPagerButtons(d){
		var s=``
		if(d.pageCount>1) {
			s=`<div class="float-right">
			<ul class="pagination mb-1">`
			if(d.page>1){
				s+=`<li class="page-item"><a class="page-link" href="${d.urlPath}?sid=${d.sid}&mid=${d.mid}&page=1&${d.filterString!=''?d.filterString:''}">|&lt;</a></li>
				<li class="page-item"><a class="page-link" href="${d.urlPath}?sid=${d.sid}&mid=${d.mid}&page=${(d.page-1)}&${d.filterString!=''?d.filterString:''}">&lt;</a></li>`
			}

			var sayfalar=pagination(d.page,d.pageCount)
			sayfalar.forEach((e)=>{
				if(e==d.page.toString()){
					s+=`<li class="page-item active"><span class="page-link">${d.page}</span></li>`
				}else if(e=='...'){
					s+=`<li class="page-item"><span class="page-link">...</span></li>`
				} else {
					s+=`<li class="page-item"><a class="page-link" href="${d.urlPath}?sid=${d.sid}&mid=${d.mid}&page=${e}&${d.filterString!=''?d.filterString:''}">${e}</a></li>`
				}
			})

			if(d.page<d.pageCount){
				s+=`<li class="page-item"><a class="page-link" href="${d.urlPath}?sid=${d.sid}&mid=${d.mid}&page=${d.page+1}&${d.filterString!=''?d.filterString:''}">&gt;</a></li>
				<li class="page-item"><a class="page-link" href="${d.urlPath}?sid=${d.sid}&mid=${d.mid}&page=${d.pageCount}&${d.filterString!=''?d.filterString:''}">&gt;|</a></li>`
			}

			s+=`</ul></div>`
		}
		return s
	}

	function gridPageCount(d){
		var s=`<div class="" style="display: inline-block">`
		if(d.pageSize>0 && d.recordCount>0){
			s+=`${((d.page-1)*d.pageSize)+1} - ${(d.page*d.pageSize<d.recordCount)?d.page*d.pageSize:d.recordCount} arası, Toplam: ${d.recordCount} kayit, ${d.pageCount} sayfa`
		}else{
			s+=`Toplam: ${d.recordCount} kayit`
		}
		s+=`</div>`
		return s
	}


	function gridPageSize(pageSize){

		if(pageSize<=0){
			return ''
		}
		var s=`<div class="mt-1 align-items-center" style="display: inline-flex">
		Sayfada
		<select class="form-control input-inline input-sm" name="pageSize" id="pageSize">
		<option value="10" ${pageSize==10?'selected':''}>10</option>
		<option value="20" ${pageSize==20?'selected':''}>20</option>
		<option value="50" ${pageSize==50?'selected':''}>50</option>
		<option value="100" ${pageSize==100?'selected':''}>100</option>
		<option value="250" ${pageSize==250?'selected':''}>250</option>
		<option value="500" ${pageSize==500?'selected':''}>500</option>
		</select>
		</div>
		`
		return s
	}



	function getPropertyByKeyPath(targetObj, keyPath) { 
		var keys = keyPath.split('.')
		if(keys.length == 0) return undefined
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

	function replaceUrlCurlyBracket(url,item,fields){
		if(!(url.indexOf('{')>-1 && url.indexOf('}')>-1))
			return url
		//url=url.replaceAll('"',"'")
		if(typeof item!='undefined'){
			if(typeof item._id!='undefined'){
				url=url.replaceAll('{_id}',item._id)
			}
		}
		fields.forEach((field)=>{
			if(url.indexOf(`{${field.field}}`)>-1){
				var itemValue=getPropertyByKeyPath(item,field.field) || ''
				url=url.replaceAll(`{${field.field}}`,itemValue)
			}
		})
		return url
	}

	function pagination(c, m) {
		var current =Number(c),
		last = Number(m),
		delta = 2,
		left = current - delta,
		right = current + delta + 1,
		range = [],
		rangeWithDots = [],
		l

		var i=1
		while(i<=last){
			if (i == 1 || i == last || i >= left && i < right) {
				range.push(i)
			}
			i++
		}


		for (let i of range) {
			if (l) {
				if (i - l == 2) {
					rangeWithDots.push(l + 1)
				} else if (i - l != 1) {
					rangeWithDots.push('...')
				}
			}
			rangeWithDots.push(i)


			l = i
		}

		return rangeWithDots
	}

})(typeof exports === 'undefined'?  
this['GridBuilder']={}: exports)


function clearStorageForGrid(){
	var path=window.location.pathname
	Object.keys(localStorage).forEach((key)=>{
		if(key.indexOf(`tabulator-${path}_grid`)==0){
			localStorage.removeItem(key)
		}
	})
	window.location.reload()
}