
Date.prototype.yyyymmdd = function () {
	var yyyy = this.getFullYear().toString();
	var mm = (this.getMonth() + 1).toString();
	var dd = this.getDate().toString();
	var HH = this.getHours().toString();
	var min = this.getMinutes().toString();
	var sec = this.getSeconds().toString();
	return yyyy + '-' + (mm[1]?mm:"0" + mm[0]) + '-' + (dd[1]?dd:"0" + dd[0]); 
}

Date.prototype.hhmmss = function () {
	
	var HH = this.getHours().toString();
	var min = this.getMinutes().toString();
	var sec = this.getSeconds().toString();
	return (HH[1]?HH:"0" + HH[0]) + ':' + (min[1]?min:"0" + min[0]) + ':' + (sec[1]?sec:"0" + sec[0]); 
};

Date.prototype.yyyymmddhhmmss = function () {
	var yyyy = this.getFullYear().toString();
	var mm = (this.getMonth() + 1).toString();
	var dd = this.getDate().toString();
	var HH = this.getHours().toString();
	var min = this.getMinutes().toString();
	var sec = this.getSeconds().toString();
	return yyyy + '-' + (mm[1]?mm:"0" + mm[0]) + '-' + (dd[1]?dd:"0" + dd[0]) + ' ' + (HH[1]?HH:"0" + HH[0]) + ':' + (min[1]?min:"0" + min[0]) + ':' + (sec[1]?sec:"0" + sec[0]); 
};

Date.prototype.hhmm = function () {
	
	var HH = this.getHours().toString();
	var min = this.getMinutes().toString();
	var sec = this.getSeconds().toString();
	return (HH[1]?HH:"0" + HH[0]) + ':' + (min[1]?min:"0" + min[0]); 
};

Date.prototype.addDays = function(days)
{
	var dat = new Date(this.valueOf());
	dat.setDate(dat.getDate() + days);
	return dat;
}

Date.prototype.lastThisMonth = function()
{
	var dat = new Date(this.valueOf());
	dat=new Date((new Date(dat.setMonth(dat.getMonth()+1))).setDate(0))
	//dat.setDate(dat.getDate() + days);
	return dat;
}



function getAllUrlParams(){
	var q={}
	var queryString=window.location.search;
	var dizi=queryString.split('&');
	for(var i=0;i<dizi.length;i++){
		var key=dizi[i].split('=')[0];

		var value=getUrlParameter(key);
		if(value!=''){
			if(key[0]=='?') key=key.substr(1);
			q[key]=value;
		}
	}
	return q;
}

var q=getAllUrlParams();


function getUrlParameter(name) {
	name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
	var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
	var results = regex.exec(location.search);
	return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

String.prototype.replaceAll = function (search, replacement) {
	var target = this;
	return target.split(search).join(replacement);
}

function fnCsvReport(tableId,fileName)
{
	var tab_text="";
	var textRange; 
	tab = document.getElementById(tableId);

	for(var i = 0 ; i < tab.rows.length ; i++) 
	{   
		var filterRow=false;
		if(i==1){
			if(tab.rows[i].innerHTML.indexOf('<th')>-1 && tab.rows[i].innerHTML.indexOf('</th')>-1) filterRow=true;
		}
		if(!filterRow){

			for(var j=0;j<tab.rows[i].cells.length;j++){
				if(j<tab.rows[0].cells.length-1){
					if(isNumeric(tab.rows[i].cells[j].innerHTML)){
						var sayi=tab.rows[i].cells[j].innerHTML;
						if(whatDecimalPointer()=='.'){
							sayi=sayi.replaceAll('.','##');
							sayi=sayi.replaceAll(',','.');
							sayi=sayi.replaceAll('##',',');
						}
						tab_text=tab_text + (i>0?'"':'') + sayi + (i>0?'"':'') + ';';
					}else{
						tab_text=tab_text + (i>0?'"':'') + tab.rows[i].cells[j].innerHTML + (i>0?'"':'') + ';';
					}
				}
			}
			tab_text=tab_text + "\n";
		}
	}

	tab_text= tab_text.replace(/<A[^>]*>|<\/A>/g, "");
	tab_text= tab_text.replace(/<a[^>]*>|<\/a>/g, "");
	tab_text= tab_text.replace(/<img[^>]*>/gi,""); 
	tab_text= tab_text.replace(/<input[^>]*>|<\/input>/gi, "");
	tab_text= tab_text.replace(/<button[^>]*>|<\/button>/gi, "");
	tab_text= tab_text.replace(/<select[^>]*>|<\/select>/gi, "");
	tab_text= tab_text.replace(/<option[^>]*>|<\/option>/gi, "");

	exportToCsv(tab_text,fileName);
	
}

function exportToCsv(table,fileName){
	var htmls = "";
	var uri = 'data:application/text;base64,';
	var template = '{table}'; 
	var base64 = function(s) {
		return b64EncodeUnicode(s);
	};

	var format = function(s, c) {
		return s.replace(/{(\w+)}/g, function(m, p) {
			return c[p];
		})
	};

	htmls = table;

	var ctx = {
		worksheet : 'Sayfa 1',
		table : htmls
	}


	var link = document.createElement("a");
	if(fileName==undefined){
		link.download = "export.csv";
	}else{
		link.download = fileName + ".csv";
	}

	link.href = uri + base64(format(template, ctx));
	link.click();
}

function fnExcelReport(tableId,fileName)
{
	var tab_text="<table border='1px'>";
	var textRange; 
	tab = document.getElementById(tableId);

	for(var i = 0 ; i < tab.rows.length ; i++) 
	{   
		var filterRow=false;
		if(i==1){
			if(tab.rows[i].innerHTML.indexOf('<th')>-1 && tab.rows[i].innerHTML.indexOf('</th')>-1) filterRow=true;
		}
		if(!filterRow){
			if(i==0){

				tab_text=tab_text+ '<tr bgcolor="#87AFC6">';
			}else{
				tab_text=tab_text+"<tr>";
			}

			for(var j=0;j<tab.rows[i].cells.length;j++){

				if(isNumeric(tab.rows[i].cells[j].innerHTML)){
					var sayi=tab.rows[i].cells[j].innerHTML;
					if(whatDecimalPointer()=='.'){
						sayi=sayi.replaceAll('.','##');
						sayi=sayi.replaceAll(',','.');
						sayi=sayi.replaceAll('##',',');
					}
					tab_text=tab_text + "<td>" + sayi + "</td>";
				}else{
					tab_text=tab_text + "<td>" + tab.rows[i].cells[j].innerHTML + "</td>";
				}
			}
			tab_text=tab_text + "</tr>";
		}
	}

	tab_text=tab_text+"</table>";
	tab_text= tab_text.replace(/<A[^>]*>|<\/A>/g, "");
	tab_text= tab_text.replace(/<img[^>]*>/gi,"");
	tab_text= tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); 
	tab_text= tab_text.replace(/<button[^>]*>|<\/button>/gi, "");
	tab_text= tab_text.replace(/<select[^>]*>|<\/select>/gi, "");
	tab_text= tab_text.replace(/<option[^>]*>|<\/option>/gi, "");

	exportToExcel(tab_text,fileName);
	
}

function exportToExcel(table,fileName){
	var htmls = "";
	var uri = 'data:application/vnd.ms-excel;base64,';
	var template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body>{table}</body></html>'; 
	var base64 = function(s) {
		return b64EncodeUnicode(s);
	};

	var format = function(s, c) {
		return s.replace(/{(\w+)}/g, function(m, p) {
			return c[p];
		})
	};

	htmls = table;

	var ctx = {
		worksheet : 'Sayfa 1',
		table : htmls
	}


	var link = document.createElement("a");
	if(fileName==undefined){
		link.download = "export.xls";
	}else{
		link.download = fileName + ".xls";
	}

	link.href = uri + base64(format(template, ctx));
	link.click();
}

function isNumeric(str){
	if(str.toString().trim()=='') return false;
	for(var i=0;i<str.length;i++){ 
		if(!(str[i]>='0' && str[i]<='9' || str[i]=='.' || str[i]==',')){
			return false;
		}
	}
	return true;
}
function whatDecimalPointer() {
	var n = 1.1;
	n = n.toLocaleString().substring(1, 2);
	return n;
}

function b64EncodeUnicode(str) {
	return btoa(unescape(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
	                                                     function toSolidBytes(match, p1) {
	                                                     	return String.fromCharCode('0x' + p1);
	                                                     })));
}

Number.prototype.formatDecimal = function(){
	var c=0;
	var d=whatDecimalPointer();
	var t=d==','?'.':',';

	var s= _formatMoney(this,c,d,t);

	return s;
};

Number.prototype.formatMoney = function(c1){
	var c=c1 || 2;
	var d=whatDecimalPointer();
	var t=d==','?'.':',';

	var s= _formatMoney(this,c,d,t);

	return s;
};

function _formatMoney(value,c,d,t){
	var n = value, 
	c = isNaN(c = Math.abs(c)) ? 2 : c, 
	d = d == undefined ? "." : d, 
	t = t == undefined ? "," : t, 
	s = n < 0 ? "-" : "", 
	i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", 
	j = (j = i.length) > 3 ? j % 3 : 0;
	return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
}

Number.prototype.n2 = function(){
	var sbuf=this.toString();
	if(sbuf.length==1){
		sbuf ='0' + sbuf;
	}   

	return sbuf;
};

Number.prototype.formatQuantity = function(c){

	var d=whatDecimalPointer();
	var t=d==','?'.':',';

	var s= _formatQuantity(this,c,d,t);

	return s;
};

function _formatQuantity(value,c,d,t){
	var n = value, 

	d = d == undefined ? "." : d, 
	t = t == undefined ? "," : t, 
	s = n < 0 ? "-" : "";


	if(c==undefined){
		i = parseInt(n = Math.abs(+n || 0)) + "";
		j = (j = i.length) > 3 ? j % 3 : 0;
		var kusurat=Math.round(Math.abs(n - i)*1000)/1000;

		return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (Math.abs(n - i)>0?d:'') + kusurat.toString().slice(2);
	}else{
		i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "";
		j = (j = i.length) > 3 ? j % 3 : 0;
		return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
	}

}

Element.prototype.remove = function() {
	this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
	for(var i = this.length - 1; i >= 0; i--) {
		if(this[i] && this[i].parentElement) {
			this[i].parentElement.removeChild(this[i]);
		}
	}
}

function savePageFilter(path,key,value){
	var filter={}
	if(localStorage.getItem(path+ '_filter')){
		try{
			filter=JSON.parse(localStorage.getItem(path+ '_filter'));
		}catch(tryErr){
			localStorage.removeItem(path+ '_filter');
		}

	}
	filter[key]=value;
	localStorage.setItem(path + '_filter',JSON.stringify(filter));
}

function getPageFilter(path,key,defaultValue=''){
	var filter={}
	if(localStorage.getItem(path+ '_filter')){
		try{
			filter=JSON.parse(localStorage.getItem(path+ '_filter'));
		}catch(tryErr){
			localStorage.removeItem(path+ '_filter');
		}

	}
	if(filter[key]){
		return filter[key];
	}else{
		return defaultValue;
	}
}




function clone(obj){
	return JSON.parse(JSON.stringify(obj));
}

function goBack(){
	window.location.href=document.referrer;
}

function getItemTypeName(itemType){
	switch(itemType){
		case 'item': return 'Envanter';
		case 'raw-material': return 'Hammadde';
		case 'helper-material': return 'Yardımcı Malzeme';
		case 'product': return 'Mamul';
		case 'semi-product': return 'Yarı Mamul';
		case 'sales-service': return 'Hizmet Satış';
		case 'purchasing-service': return 'Hizmet alım';
		case 'asset': return 'Demirbaş';
		case 'expense': return 'Masraf/Gider';
		default: return 'Envanter';
	}
}
function getItemTypeShortName(itemType){
	switch(itemType){
		case 'item': return 'ENV';
		case 'raw-material': return 'HMM';
		case 'helper-material': return 'YML';
		case 'product': return 'MAM';
		case 'semi-product': return 'YMAM';
		case 'sales-service': return 'HiS';
		case 'purchasing-service': return 'HiA';
		case 'asset': return 'DEM';
		case 'expense': return 'GDR';
		default: return 'ENV';
	}
}

function getUnitCodeText(unitCode){
	switch(unitCode){
		case 'NIU': return 'Adet';
		case 'GRM': return 'gr';
		case 'KGM': return 'kg';
		case 'LTR': return 'lt';
		case 'MTR': return 'm';
		case 'CMT': return 'cm';
		case 'MMT': return 'mm';
		case 'MTK': return 'm2';
		case 'HUR': return 'sa';
		case 'D62': return 'sn';
		case 'D61': return 'dk';
	}
	return unitCode;
}

function incString(text){
	if(!text) return '1';
	var sbuf='';
	for(var i=text.length-1;i>=0;i--){
		if(!isNaN(text[i])){
			sbuf =text[i] + sbuf;
		}else{
			break;
		}
	}
	if(sbuf=='') return text +'1';


	var numara=Number(sbuf);
	var numaraString='';
	numara++;
	if(numara.toString().length<sbuf.length){
		numaraString=numara.toString();
		for(var i=0;i<(sbuf.length-numara.toString().length);i++){
			numaraString = '0' + numaraString;
		}
	}else{
		numaraString=numara.toString();
	}
	if(numaraString.length>=text.length){
		return numaraString;
	}else{
		return text.substr(0,(text.length-numaraString.length)) + numaraString;
	}
}

function dateTimeFromText(dateStr) {
	d=new Date(dateStr); 
	d.setMinutes(d.getMinutes()+(new Date()).getTimezoneOffset()*1);

	return d;
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

function generatePagination(page,pageCount,url){
	var nav=document.createElement('NAV');
	nav.setAttribute('aria-label','tr216 pagination');
	var ul=document.createElement('UL');
	ul.classList.add('pagination');
	nav.appendChild(ul);

	var li_first=document.createElement('LI');
	li_first.classList.add('page-item');
	if(page>1){
		var a_first=document.createElement('A');
		a_first.classList.add('page-link');
		a_first.setAttribute('href',url.replaceAll('{page}',1));
		a_first.innerHTML='|<';
		li_first.appendChild(a_first);
	}else{
		var span_first=document.createElement('SPAN');
		span_first.classList.add('page-link-disabled');
		span_first.innerHTML='|<';
		li_first.appendChild(span_first);
	}

	ul.appendChild(li_first);

	var li_previous=document.createElement('LI');
	li_previous.classList.add('page-item');

	if(page>1){
		var a_previous=document.createElement('A');
		a_previous.classList.add('page-link');
		a_previous.setAttribute('href',url.replaceAll('{page}',(page-1)));
		a_previous.innerHTML='<';
		li_previous.appendChild(a_previous);
	}else{
		var span_previous=document.createElement('SPAN');
		span_previous.classList.add('page-link-disabled');
		span_previous.innerHTML='<';
		li_previous.appendChild(span_previous);
	}

	ul.appendChild(li_previous);


	var sayfalar=pagination(page,pageCount);

	for(var i=0;i<sayfalar.length;i++){
		var li=document.createElement('LI');

		li.classList.add('page-item');
		if(sayfalar[i]==page){
			li.classList.add('active');
			var span=document.createElement('SPAN');
			span.classList.add('page-link');
			span.innerHTML=sayfalar[i];
			li.appendChild(span);
		}else if(sayfalar[i]=='...'){
			var span=document.createElement('SPAN');
			span.classList.add('page-link');
			span.innerHTML='...';
			li.appendChild(span);
		}else{
			var a=document.createElement('A');
			a.classList.add('page-link');
			a.innerHTML=sayfalar[i];
			a.setAttribute('href',url.replaceAll('{page}',sayfalar[i]));
			li.appendChild(a);
		}

		ul.appendChild(li);
	}


	var li_next=document.createElement('LI');
	li_next.classList.add('page-item');
	if(page<pageCount){
		var a_next=document.createElement('A');
		a_next.classList.add('page-link');
		a_next.setAttribute('href',url.replaceAll('{page}',(page+1)));
		a_next.innerHTML='>';
		li_next.appendChild(a_next);
	}else{
		var span_next=document.createElement('SPAN');
		span_next.classList.add('page-link-disabled');
		span_next.innerHTML='>';
		li_next.appendChild(span_next);
	}

	ul.appendChild(li_next);

	var li_last=document.createElement('LI');
	li_last.classList.add('page-item');
	if(page<pageCount){
		var a_last=document.createElement('A');
		a_last.classList.add('page-link');
		a_last.setAttribute('href',url.replaceAll('{page}',pageCount));
		a_last.innerHTML='>|';
		li_last.appendChild(a_last);
	}else{
		var span_last=document.createElement('SPAN');
		span_last.classList.add('page-link-disabled');
		span_last.innerHTML='>|';
		li_last.appendChild(span_last);
	}

	ul.appendChild(li_last);


	return nav;         

}


function btoa2(str){
	return btoa(encodeURIComponent2(str).replace(/%([0-9A-F]{2})/g, function toSolidBytes(match, p1) {
		return String.fromCharCode('0x' + p1)
	}))
}

function atob2(str){
	return decodeURIComponent(atob(str).split('').map(function(c) {
		return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
	}).join(''))
}


function encodeURIComponent2(str){
	return encodeURIComponent(str).replace(/[!'()*]/g, escape)
}

function htmlEncode(str) {
	var buf = []
	if(str){
		for (var i=str.length-1;i>=0;i--) {
			buf.unshift(['&#', str[i].charCodeAt(), ';'].join(''))
		}
	}else{
		return ''
	}


	return buf.join('')
}

function htmlDecode(str) {
	return str.replace(/&#(\d+);/g, function(match, dec) {
		return String.fromCharCode(dec)
	})
}

function windowPathToFieldName(path=''){
	if(path=='')
		path=window.location.pathname
	if(path.substr(0,1)=='/')
		path=path.substr(1)
	path=path.replaceAll('/','_')
	return path
}

function openInNewTab(url) {
	var win = window.open(url, '_blank')
	win.focus()
}


var gridLangs={
	"en-gb":{
		"columns":{
			"name":"Name",
		},
		"ajax":{
			"loading":"Loading",
			"error":"Error",
		},
		"groups":{
			"item":"item",
			"items":"items",
		},
		"pagination":{
			"page_size":"Page Size",
			"page_title":"Show Page",
			"first":"|<",
			"first_title":"First Page",
			"last":">|",
			"last_title":"Last Page",
			"prev":"<",
			"prev_title":"Prev Page",
			"next":">",
			"next_title":"Next Page",
			"all":"All",
		},
		"headerFilters":{
			"default":"filter column...",
			"columns":{
				"name":"filter name...",
			}
		}
	},
	"default":{
		"columns":{
			"name":"Adı",
		},
		"ajax":{
			"loading":"Yükleniyor",
			"error":"Hata",
		},
		"groups":{
			"item":"item",
			"items":"items",
		},
		"pagination":{
			"page_size":"Sayfa",
			"page_title":"Sayfayı Göster",
			"first":"|<", 
			"first_title":"İlk Sayfa",
			"last":">|",
			"last_title":"Son Sayfa",
			"prev":"<",
			"prev_title":"Önceki Sayfa",
			"next":">",
			"next_title":"Sonraki Sayfa",
			"all":"Tümü",
		},
		"headerFilters":{
			"default":"ara ...", 
			"columns":{
				"name":"ara ...", 
			}
		}
	}

}

function getModulePageName(){
	var pageName='page'
	var dizi=window.location.pathname.split('/')
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
			console.error(err)
		}
	},
	getItem:function(param){
		try{
			var obj=JSON.parse(localStorage.getItem(`${getModulePageName()}`) || '{}')
			if(obj[param]==undefined)
				obj[param]=null

			return obj[param]
		}catch(err){
			console.error(err)
			return null
		}

	}
}

function reload(qparams){
	qparams=qparams || q
	var queryString=''
	Object.keys(qparams).forEach((e)=>{
		queryString+=`${queryString!=''?'&':''}${e}=${encodeURIComponent2(qparams[e])}`
	})

	window.location.href=`${window.origin}${window.location.pathname}?${queryString}`
}



function ajaxLookup(url,...params){
	var textField,idField,cb

	cb=params[params.length-1]

	textField=params.length>1?params[0]:'text'
	idField=params.length>2?params[1]:'_id'

	$.ajax({
		url:url,
		type:'GET',
		dataType: 'json',
		success: function(result) {
			console.log(`result:`,result)
			if(result.success){
				var obj={}
				result.data.docs.forEach((e)=>{
					obj[e[idField].toString()]=e[textField]
				})
				cb(null, obj)
			}else{
				cb(result.error,{})
			}
		},
		error:function(err){
			cb(err,{})
		}
	})
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



function listObjectToObject(listObj){
	if(typeof listObj!='object' || listObj==null )
		return listObj
	var obj={}

	Object.keys(listObj).forEach((mainKey)=>{
		if(mainKey.indexOf('.')>-1){
			var keys=mainKey.split('.')

			if(obj[keys[0]]==undefined)
				obj[keys[0]]={}


			if(obj[keys[0]][keys[1]]==undefined){
				if(keys.length==2)
					return obj[keys[0]][keys[1]]=listObj[`${keys[0]}.${keys[1]}`]
				else
					obj[keys[0]][keys[1]]={}
			}

			if(obj[keys[0]][keys[1]][keys[2]]==undefined){
				if(keys.length==3)
					return obj[keys[0]][keys[1]][keys[2]]=listObj[`${keys[0]}.${keys[1]}.${keys[2]}`]
				else
					obj[keys[0]][keys[1]][keys[2]]={}
			}

			if(obj[keys[0]][keys[1]][keys[2]][keys[3]]==undefined){
				if(keys.length==4)
					return obj[keys[0]][keys[1]][keys[2]][keys[3]]=listObj[`${keys[0]}.${keys[1]}.${keys[2]}.${keys[3]}`]
				else
					obj[keys[0]][keys[1]][keys[2]][keys[3]]={}
			}

			if(obj[keys[0]][keys[1]][keys[2]][keys[3]][keys[4]]==undefined){
				if(keys.length==5)
					return obj[keys[0]][keys[1]][keys[2]][keys[3]][keys[4]]=listObj[`${keys[0]}.${keys[1]}.${keys[2]}.${keys[3]}.${keys[4]}`]
				else
					obj[keys[0]][keys[1]][keys[2]][keys[3]][keys[4]]={}
			}

		}else{
			obj[mainKey]=listObj[mainKey]
		}
	})
	return obj
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
			console.error('err2:',err)
			if(cb)
				cb(err)
		}
	})
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
		return name.replaceAll('.','-')
	else
		return ''
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


const gridHelper=typeof GridHelper!='undefined'?GridHelper.GridHelper:''



function generateLeftMenu(leftMenu){
	var mid=q.mid || ''
	var breadCrumbs=[]

	
	breadCrumbs=getBreadCrumbs(leftMenu,mid)
	
	if(breadCrumbs.length>0){
		pageTitle=``
		pageTitle+=`<i class="${breadCrumbs[breadCrumbs.length-1].icon || ''}"></i>`
		breadCrumbs.forEach((e,index)=>{
			if(index<breadCrumbs.length-1){
				pageTitle+=`${e.text} \\ `
			} else {
				if(funcTitle!=''){
					pageTitle+=`${e.text} \\ `
				} else {
					pageTitle+=`<span class="font-weight-bold text-orange">${e.text}</span>`
				}
			}
		})
		document.title=(breadCrumbs[breadCrumbs.length-1].text || '') + ' - tr216'
		
	}

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
		if(bActive){
			s+=`<a id="${menu.mId.replaceAll('.','-')}" class="nav-link navigation active" href="${menu.path}?mid=${menu.mId}">`
		}else{
			s+=`<a id="${menu.mId.replaceAll('.','-')}" class="nav-link navigation" href="${menu.path}?mid=${menu.mId}">`
		}
		s+=`<div class="sb-nav-link-icon"><i class="${menu.icon || 'fas fa-table'}"></i></div>
		${menu.text}
		</a>
		`
		return s

	}
}


function cboEasyDateUrlParams(value){
	var date1=new Date();
	var date2=new Date();
	switch(value){
		case 'today':break;
		case 'thisWeek':
		date1=date1.addDays(-1 * (date1.getDay()-1));
		date2=date2.addDays(7- date2.getDay());
		break;
		case 'thisMonth': 
		date1=date1.addDays(-1 * (date1.getDate()-1));
		date2=date2.lastThisMonth();
		break;
		case 'last1Week':
		date1=date1.addDays(-7);
		break;

		case 'last1Month':
		date1=new Date(date1.setMonth(date1.getMonth()-1))
		break;
		case 'last3Months':
		date1=new Date(date1.setMonth(date1.getMonth()-3))
		break;
		case 'last6Months':
		date1=new Date(date1.setMonth(date1.getMonth()-6))
		break;
		case 'thisYear':
		date1=new Date(date1.getFullYear(),0,1);
		date2=new Date(date2.getFullYear(),11,31);
		break;
		case 'last1Year':
		date1=new Date(date1.setMonth(date1.getMonth()-12))
		break;
		default:
		break;
	}
	return '&date1=' + date1.yyyymmdd() + '&date2=' + date2.yyyymmdd();
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



$("#fileUpload").change(function() {
	var reader  = new FileReader()
	var fileIndex=0
	var files=this.files
	var uploadFiles=[]
	reader.addEventListener("load", function(){

		if(reader.result){
			uploadFiles[uploadFiles.length-1].data=reader.result.split('base64,')[1]
		}
		fileIndex++
		runReader()
	})

	function runReader(){
		if(fileIndex>=files.length){
			document.dispatchEvent(new CustomEvent("file-upload-finished", {detail:uploadFiles}))
			return
		}
		var file=files[fileIndex]
		uploadFiles.push({name:file.name,modifiedDate:file.lastModifiedDate,size:file.size,data:''})
		
		reader.readAsDataURL(file)
	}

	runReader()
})

var programId=''
var programType=''

document.addEventListener('file-upload-finished', function(event) {
	var data={files:event.detail}
	runProgramAjax(data)
})

function runProgram(_id,type){
	programId=_id
	programType=type
	if(type=='file-importer'){
		$('#fileUpload').trigger('click')
		return
	}
	var list=[]

	$(".checkSingle").each(function() {
		if(this.checked){
				//var satir=JSON.parse(decodeURIComponent(this.value))
				//list.push({_id:satir._id})
				list.push({_id:this.value})
			}
		})
	if(list.length==0)
		return alertX('Hiç kayıt seçilmemiş')
	var data={list:list}
	runProgramAjax(data)

}

function runProgramAjax(data){
	$.ajax({
		url:`/dbapi/programs/run/${programId}`,
		data:data,
		type:'POST',
		dataType: "json",
		success:function(result){
			if(result.success){
				if(typeof result.data=='string'){
					if(programType=='file-exporter'){
						download(`data:application/file;base64,${btoa2(result.data)}`,`export_${(new Date()).yyyymmddhhmmss()}.txt`,'application/file')
						return
					}else if(programType=='connector-exporter'){
						alert(result.data)
					}
				}
				
				window.location.reload()	
			}else{
				alertX(result.error.message,'HATA','danger')
			}
		},
		error:function(err){
			alertX((err.message || err.name || 'Hata oluştu'),'HATA','danger')
		}
	})
}

function remoteLookupAutocomplete(locals,prefix=''){
	var controlId=prefix+ generateFormId(locals.field)
	var controlName=prefix + generateFormName(locals.field)
	var controlNameTextField=''
	var valueText=locals.valueText || ''
	if(locals.lookupTextField){
		controlNameTextField=prefix+ generateFormName(locals.lookupTextField)
	}
	
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

	$(`#${controlId}-autocomplete-text`).autocomplete({
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
			$(`#${controlId}-autocomplete-text`).val((ui.item.label || ''))
			$(`input[name="${controlName}"]`).val(ui.item.obj._id.toString())
			$(`#${controlId}-obj`).val(encodeURIComponent2(JSON.stringify(ui.item.obj)))
			if(controlNameTextField){
				$(`input[name="${controlNameTextField}"]`).val((ui.item.label || ''))
				$(`#${controlId}-original-text`).html((ui.item.label || ''))
			}
			if(locals.onchange){
				eval(`${locals.onchange}`)
			}
			return false
		}
	})


	$(`#${controlId}-autocomplete-text`).on('change',()=>{

		if($(`#${controlId}-autocomplete-text`).val()==''){
			$(`input[name="${controlName}"]`).val('')
			$(`#${controlId}-obj`).val('')
			if(controlNameTextField){
				$(`#${controlId}-original-text`).html('')
			}
		}
		if(controlNameTextField){
			$(`input[name="${controlNameTextField}"]`).val($(`#${controlId}-autocomplete-text`).val())
		}

	})


	if((locals.value || '')!=''){

		var url=idUrl.replace('{mid}',q.mid)

		getAjax(url,`${labelStr}`,``,(err,result)=>{
			if(!err){
				if(result.length>0){
					if(valueText==''){
						$(`#${controlId}-autocomplete-text`).val((result[0].label || ''))
					}

					$(`input[name="${controlName}"]`).val(result[0].obj._id.toString())
					$(`#${controlId}-obj`).val(encodeURIComponent2(JSON.stringify(result[0].obj)))

					if(controlNameTextField){
						$(`#${controlId}-original-text`).html((result[0].label || ''))
					}

				}else{
					if(valueText=='')
						$(`#${controlId}-autocomplete-text`).val('')
					$(`input[name="${controlName}"]`).val('')
					$(`#${controlId}-obj`).val('')
					$(`#${controlId}-original-text`).html('')
				}

			}else{
				$(`#${controlId}-autocomplete-text`).val(err.message)
			}
		})

	}
}
