
Date.prototype.yyyymmdd = function () {
	var yyyy = this.getFullYear().toString();
	var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
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
	
				

  
function getUrlParameter(name) {
	name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
	var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
	var results = regex.exec(location.search);
	return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

String.prototype.replaceAll = function (search, replacement) {
	var target = this;
	return target.split(search).join(replacement);
	// var target = this;
	// return target.replace(new RegExp(search, 'g'), replacement);
}

function fnCsvReport(tableId,fileName)
{
	var tab_text="";
	var textRange; 
	tab = document.getElementById(tableId); // id of table

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
				// decimal pointer turkiye gibi virgul olanlar haricindekiler icin yapildi
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

	tab_text= tab_text.replace(/<A[^>]*>|<\/A>/g, "");//remove if u want links in your table
	tab_text= tab_text.replace(/<a[^>]*>|<\/a>/g, "");//remove if u want links in your table
	tab_text= tab_text.replace(/<img[^>]*>/gi,""); // remove if u want images in your table
	tab_text= tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); // reomves input params
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
				// return window.btoa(unescape(encodeURIComponent(s)))
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
	tab = document.getElementById(tableId); // id of table

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
			  // decimal pointer turkiye gibi virgul olanlar haricindekiler icin yapildi
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
		  //+ tab.rows[i].innerHTML
		  tab_text=tab_text + "</tr>";
		}
		//tab_text=tab_text+"</tr>";
	}

	tab_text=tab_text+"</table>";
	tab_text= tab_text.replace(/<A[^>]*>|<\/A>/g, "");//remove if u want links in your table
	tab_text= tab_text.replace(/<img[^>]*>/gi,""); // remove if u want images in your table
	tab_text= tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); // reomves input params
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
				// return window.btoa(unescape(encodeURIComponent(s)))
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

const dbType=typeof types!='undefined'?types.types:'';

function clone(obj){
	return JSON.parse(JSON.stringify(obj));
}

function goBack(){
	//if(document.referrer)
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
        case 'purchasing-service': return 'Hizmet Satış';
        case 'asset': return 'Demirbaş';
        case 'expense': return 'Masraf/Gider';
        default: return 'Envanter';
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

    //A04950;  sbuf='04950';
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

