(function(exports) {
	var frontEnd=true
	if(typeof config!='undefined'){
		if(typeof config.mongodb!='undefined'){
			frontEnd=false
		}
	}
	
	exports.GridBuilder = Object.freeze({
		generateGrid:generateGrid
	})

	function generateGrid(fields,options,data){
		var s=`
		<div class="table-responsive mt-1">
		${gridPagingRow(true,data)}
		`
		return s
	}

	function gridTable(fields,options,data){
		var s=`<table id="grid1" class="table table-striped m-0"  cellspacing="0">
		<thead>
			<tr class="text-nowrap">
				<% if(selection) { %>
				<th style="width: 30px;"><input type="checkbox" value="true" name="selectAll" id="selectAll"></th>
				<% } %>

				<% fields.forEach(function(field){ %>
				<% if(field.visible){ %>
				<th class="" style="<% if(typeof field.width!='undefined'){%>width:<%- field.width%><%}%>"><% if(field.icon!=''){%><i class="fa fa-<%- field.icon%>"></i> <% } %><%- field.text%></th>
				<% } %>
				<%})%>
				<th class="text-center" style="width: <%- (ctrlCol*30)%>px;">
					<% if(addNewButton){ %>
					<a href="javascript:addNewUrl('<% if(typeof addNewUrl!='undefined'){%><%- addNewUrl %><%}else{%><%- urlPath %>/addnew?sid=<%- sid %>&mid=<%- mid %><%}%>');" class="btn btn-primary  btn-sm far fa-plus-square"  title="Yeni Ekle"></a>
					<% } else {%>
					#
					<% } %>
				</th>
			</tr>
			<% if(showFilterRow){ %>
			<tr class="collapse" id="filterRow">
				<% if(selection) { %>
				<th class=""></th>
				<% } %>

				<% fields.forEach(function(field,index){%>
				<% if(field.visible){ %>
				<th class="" style="">
					<% if(field.filter){ %>
					<% if(field.type=='lookup' && typeof field.lookupList!='undefined'){ %>
					<select name="filter_<%- index%>" id="filter_<%- index%>" class="form-control p-0 m-0">
						<% field.lookupList.forEach(function(lookupItem){ %> 
						<option value="<%- lookupItem[field.valueField]%>" <% if(field.filterValue==lookupItem[field.valueField]){%>selected<% } %> ><%- lookupItem[field.textField]%></option>
						<% }) %>
					</select>
					<% } else { %>
					<input type="text" class="form-control p-0 m-0" name="filter_<%- index%>" id="filter_<%- index%>" <% if(typeof field.placeholder!='undefined'){%>placeholder="<%- field.placeholder%>"<%}%> value="<%- field.filterValue%>">
					<% } %>
					<% } %>
				</th>
				<% } %>
				<%})%>

				<th></th>
			</tr>
			<% } %>
		</thead>
		<tbody>
		</tbody>
		<tfooter>
		</tfooter>
		</table>
		`
	}


	function gridPagingRow(showFilterRow,data){
		var s=`<div class="row m-0 border">
		<div class="col-12 pt-1 px-1">
		<div class="float-left form-inline m-0 p-0 mt-1 mb-1">
		${showFilterRow?'<a class="btn btn-secondary btn-sm mr-3" data-toggle="collapse" href="#filterRow" role="button" aria-expanded="false" aria-controls="filterRow" title="Filtre satırını göster/gizle"><i class="fas fa-filter"></i></a>':''}
		${gridPageSize(data.pageSize)}
		${gridPageCount(data)}
		</div>
		${gridPagerButtons(data)}
		</div>
		</div>`
		return s
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
		var s=`<div class="" style="display: inline-block;">`
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
		var s=`<div class="form-group" style="display: inline-block;">
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
		l;

		for (let i = 1; i <= last; i++) {
			if (i == 1 || i == last || i >= left && i < right) {
				range.push(i);
			}
		}


		for (let i of range) {
			if (l) {
				if (i - l == 2) {
					rangeWithDots.push(l + 1);
				} else if (i - l != 1) {
					rangeWithDots.push('...');
				}
			}
			rangeWithDots.push(i);


			l = i;
		}

		return rangeWithDots;
	}


	function getPropertyByKeyPath(targetObj, field) { 
		var keyPath=field.name;
		var keys = keyPath.split('.');
		if(keys.length == 0) return undefined; 
		keys = keys.reverse();
		var subObject = targetObj;
		while(keys.length) {
			var k = keys.pop();
			if(typeof subObject[k]=='undefined' || subObject[k]==null) {
				return undefined;
			} else {
				subObject = subObject[k];
			}
		}
		return subObject;
	}

	function replaceUrlCurlyBracket(url,item,fields){
		if(!(url.indexOf('{')>-1 && url.indexOf('}')>-1))
			return url
		url=url.replaceAll('"',"'")
		if(typeof item!='undefined'){
			if(typeof item._id!='undefined'){
				url=url.replaceAll('{_id}',item._id)
			}
		}
		fields.forEach((field)=>{

			if(!(url.indexOf('{')>-1 && url.indexOf('}')>-1)){

				return;
			}
			var itemValue;
			if(typeof item!='undefined'){
				itemValue=getPropertyByKeyPath(item,field)
			}

			if(typeof itemValue=='undefined'){
				itemValue=''
			}

			if(url.indexOf('{' + field.name + '}')>-1){
				url=url.replaceAll('{' + field.name + '}',itemValue)
			}
		})
		return url
	}


})(typeof exports === 'undefined'?  
this['GridBuilder']={}: exports)

