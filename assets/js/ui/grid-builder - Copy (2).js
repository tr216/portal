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

	function generateGrid(divId,fields,options,data){
		if(divId=='')
			return
		divId=`${divId.substr(0,1)!='#'?'#':'' + divId}`


		options.editable=options.editable || false
		options.hidable=options.hidable || false

		var columns=[]
		if(options.rowSelection){
			columns.push(
				{formatter:"rowSelection", titleFormatter:"rowSelection",  hozAlign:"center",headerHozAlign:"center", headerSort:false, width:50}
			)
		}

		fields.forEach((e,index)=>{
			e.editable=options.editable
			e.headerMenu=options.hidable?headerMenu:undefined
			e['width']=100
			switch((e.type || 'string')){
				case 'date':
				e['sorter']='date'
				e['headerFilter']=true
				e['editor']=dateEditor
				e['editor']=dateEditor

				break

				case 'number':
				e['sorter']='number'
				break

				case 'lookup':
				e['sorter']='string'
				e['editor']='select'
				e['headerFilter']='select'
				e['lookup']=e.lookup || {}
				e['headerFilterParams']={values:e.lookup}
				e['editorParams']={values:e.lookup}
				e['formatter']=function(cell){
		    	return e.lookup[cell.getValue()]
		    }
				break
				case 'boolean':
				e['sorter']='boolean'
				e['hozAlign']='center'
				e['headerHozAlign']='center'
				e['formatter']='tickCross'
				e['headerFilterParams']={tristate:true}

				break

				default:
				e['sorter']='string'
				break
			}
			if(options.filter){
				e['headerFilter']=true
			}else{
				e['headerFilter']=false
			}
			columns.push(e)
		})

		columns.push({title:"#",  hozAlign:"center",headerHozAlign:"center",  width:100,headerSort:false},
  {formatter:function(cell, formatterParams, onRendered){
  	return '<span class="btn btn-primary"><i class="fas fa-edit"></i></span>'
  }, width:80, hozAlign:"center", cellClick:function(e, cell){alert("deneme row data for: " + cell.getRow().getData()._id)}})
		

		
		var table=new Tabulator(divId, {
    height:"100%",
    // layout:"fitDataStretch",
    layout:"fitColumns",
    // layout:"fitDataFill",
    // responsiveLayout:"collapse",
    responsiveLayout:"hide",
    // reactiveData:true, 
    data:data.list, 
    clipboard:true,
    // clipboardPasteAction:"replace",
    printAsHtml:true,
    printHeader:"<h1>Example Table Header<h1>",
    printFooter:"<h2>Example Table Footer<h2>",
    // pagination:"remote",
   
    // paginationElement:paginationElement,
    // paginationSize:10,
    // paginationSizeSelector:[10, 20 , 50, 100, 500],
    // paginationSizeSelector:true,
    // footerElement:footerHtml,
    
    
    //paginationAddRow:"table",

    //responsiveLayout:"collapse",
    // paginationAddRow:"page",
    langs:gridLangs,
    // locale:true,
    columns:columns,
 
    dataFiltering:function(filters){
    	console.log(`dataFiltering.filters:`,filters)
    },
    dataFiltered:function(filters,rows){
    	console.log(`dataFiltered:`,filters)
    	console.log(`dataFiltered rows.length:`,rows.length)
    },
    localized:function(locale, lang){
	  	// console.log(`locale:`,locale)
	  	// console.log(`lang:`,lang)
	  },
	  persistenceID:`${window.location.pathname}_grid`,
	  persistence:{
        sort: true, //persist column sorting
        filter: false, //persist filter sorting
        group: true, //persist row grouping
        page: {
            size:true, //persist the current page size
            page:false, //do not persist the current page
          },
        // columns: true, //persist columns
        // columns: ["width", "visible", "frozen","position"],
        columns: ["width", "visible","position"],
      },
      movableColumns:true,
    // movableRows: true,
    rowContextMenu: rowMenu,

  })

		var gridElement=document.querySelector(divId)
		// var divTop=document.createElement('div')
		var divBottom=document.createElement('div')
		// divTop.classList.add('mt-1 float-left')
		divBottom.classList.add('p-2')
		var miscButtons=`<div class="mt-1 float-left"><a class="btn btn-success btn-sm float-left" href="javascript:clearStorageForGrid()" title="Tabloyu fabrika ayarlarına getirir">Reset</a></div>`
	  var paging=`<div class="float-right al1ign-items-center">
	  ${gridPageSize(data.pageSize)}
	  ${gridPageCount(data)}
	  ${gridPagerButtons(data)}
	  </div>`		

		divBottom.innerHTML=miscButtons+paging
		gridElement.appendChild(divBottom)
		return table
	}

	var rowMenu = [
	{
		label:"<i class='fas fa-user'></i> Change Name",
		action:function(e, row){
			row.update({name:"Steve Bobberson"})
		}
	},
	{
		label:"<i class='fas fa-check-square'></i> Select Row",
		action:function(e, row){
			row.select()
		}
	},
	{
		separator:true,
	},
	{
		label:"<i class='fas fa-trash'></i> Delete Row",
		action:function(e, row){
			row.delete()
		}
	},
	]


	var headerMenu = [
	{
		label:"<i class='fas fa-eye-slash'></i> Sütunu Gizle",
		action:function(e, column){
			column.hide()
		}
	},

	]

	function dateEditor(cell, onRendered, success, cancel){

    //create and style input
    var cellValue =cell.getValue(),
    input = document.createElement("input")

    input.setAttribute("type", "date")

    input.style.padding = "4px"
    input.style.width = "100%"
    input.style.boxSizing = "border-box"

    input.value = cellValue

    onRendered(function(){
    	input.focus()
    	input.style.height = "100%"
    })

    function onChange(){   
    	if(input.value != cellValue){
    		success(input.value)
    	}else{
    		cancel()
    	}
    }

    //submit new value on blur or change
    input.addEventListener("blur", onChange)

    //submit new value on enter
    input.addEventListener("keydown", function(e){
    	if(e.keyCode == 13){
    		onChange()
    	}

    	if(e.keyCode == 27){
    		cancel()
    	}
    })

    return input
  }


  


  function gridPagerButtons(d){
  	var s=``
  	if(d.pageCount>1) {
  		s=`<div class="float-right">
  		<ul class="pagination mb-1">`
  		if(d.page>1){
  			s=`<li class="page-item"><a class="page-link" href="${d.urlPath}?sid=${d.sid}&mid=${d.mid}&page=1&${d.filterString!=''?d.filterString:''}">|&lt;</a></li>
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