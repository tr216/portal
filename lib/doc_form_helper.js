
exports.makeSimpleInvoiceList=function(doc){
	var newDoc={
		_id:doc._id,
		uuid:doc.uuid,
		invoiceNo:'<b>' +  (doc.ID==''?'':doc.ID) + (doc.localDocumentId!=''?' | ' + doc.localDocumentId:'') + '</b><br>',
		issueDate:doc.issueDate + '<br>' + doc.issueTime,
		partyName:'<b>'+ doc.accountingParty.title + '</b><br><span class="text-primary">' + doc.accountingParty.vknTckn + '</span> | Fatura Satır:' + doc.lineCountNumeric,
		amount: '<b>' + Number(doc.payableAmount).formatMoney(2,',','.') + '</b> <span class="small"><b>' + (doc.documentCurrencyCode=='TRY'?'TL':doc.documentCurrencyCode) + '</b></span><br><span title="Vergiler hariç tutar:' + Number(doc.taxExclusiveAmount).formatMoney(2,',','.') + '">V.H:' + Number(doc.taxExclusiveAmount).formatMoney(2,',','.') + '</span>',
		tax:'',
		currency: doc.documentCurrencyCode + (doc.documentCurrencyCode!='TRY'?'<br>Kur:' + doc.exchangeRate:''),
		invoiceStatus:'',
		doc:doc
	}
	
	try{
		newDoc.issueDate=doc.issueDate + '<br>' + (new Date(doc.issueDate + 'T' + doc.issueTime)).hhmmss();
	}catch(err){

	}

	newDoc.invoiceNo +='<span class="badge badge-invoice ';
	switch(doc.profileId){
		case 'TEMELFATURA':	newDoc.invoiceNo +='invoice-temel">Temel'; break;
		case 'TICARIFATURA': newDoc.invoiceNo +='invoice-ticari">Ticari';break;
		case 'IHRACAT':	newDoc.invoiceNo +='invoice-ihracat">İhracat';break;
		case 'YOLCUBERABERFATURA': newDoc.invoiceNo +='invoice-yolcuberaber">Yolcu Beraber';break;
		case 'EARSIVFATURA': newDoc.invoiceNo +='invoice-earsiv">e-arşiv';break;
		default: newDoc.invoiceNo +='invoice-earsiv">' + doc.profileId + '';break;
	}
	newDoc.invoiceNo +='</span><span class="badge badge-invoice ml-1 ';

	switch(doc.invoiceTypeCode){
		case 'SATIS': newDoc.invoiceNo +='invoice-satis">Satış';break;
		case 'IADE': newDoc.invoiceNo +='invoice-iade">İade';break;
		case 'TEVKIFAT': newDoc.invoiceNo +='invoice-tevkifat">Tevkifat';break;
		case 'ISTISNA':	newDoc.invoiceNo +='invoice-istisna">İstisna';break;
		case 'OZELMATRAH': newDoc.invoiceNo +='invoice-ozelmatrah">Özel Matrah'; break;
		case 'IHRACKAYITLI': newDoc.invoiceNo +='invoice-ihrackayitli">İhraç Kayıtlı';break;
		default: newDoc.invoiceNo +='invoice-ihrackayitli">' + doc.invoiceTypeCode + ''; break;
	}
	newDoc.invoiceNo +='</span>'

	newDoc.invoiceStatus ='<span class="badge badge-invoice ';
	'Draft','Processing','SentToGib','Approved','Declined','WaitingForAprovement','Error'
	switch(doc.invoiceStatus){
		case 'Draft': newDoc.invoiceStatus +='invoice-draft">Taslak';break;
		case 'Pending': newDoc.invoiceStatus +='invoice-pending">Kuyruğa alındı';break;
		case 'Processing': newDoc.invoiceStatus +='invoice-processing">İşleniyor';break;
		case 'SentToGib': newDoc.invoiceStatus +='invoice-senttogib">GİB\'e iletildi';break;
		case 'Approved':	newDoc.invoiceStatus +='invoice-approved">Onaylandı';break;
		case 'Declined': newDoc.invoiceStatus +='invoice-declined">Reddedildi'; break;
		case 'WaitingForAprovement': newDoc.invoiceStatus +='invoice-waitingforaprovement">Onay bekliyor';break;
		case 'Error': newDoc.invoiceStatus +='invoice-error"><a href="javascript:showErrors(\'' + doc._id + '\');"><i class="fa fa-eye"></i> Hata</a>';break;
		default: newDoc.invoiceStatus +='invoice-processing">' + doc.invoiceStatus + ''; break;
	}
	newDoc.invoiceStatus +='</span>';
	if(doc.taxSummary.vat1>0){
		newDoc.tax +='1% = ' + Number(doc.taxSummary.vat1).formatMoney(',','.') + '<br>';
	}
	if(doc.taxSummary.vat8>0){
		newDoc.tax +='8% = ' + Number(doc.taxSummary.vat8).formatMoney(',','.') + '<br>';
	}
	if(doc.taxSummary.vat18>0){
		newDoc.tax +='18% = ' + Number(doc.taxSummary.vat18).formatMoney(',','.') + '<br>';
	}
	if(doc.withholdingTaxTotal>0){
		newDoc.tax +='Tevkifat = ' + Number(doc.withholdingTaxTotal).formatMoney(',','.') + '<br>';
	}
	return newDoc;
}



exports.makeSimpleOrderList=function(doc){
	var newDoc={
		_id:doc._id,
		uuid:doc.uuid,
		orderNo:'<b>' +  (doc.ID==''?'':doc.ID) + (doc.localDocumentId!=''?' | ' + doc.localDocumentId:'') + '</b><br>',
		issueDate:doc.issueDate + '<br>' + doc.issueTime,
		partyName:'<b>'+ doc.party.title + '</b><br><span class="text-primary">' + doc.party.vknTckn + '</span> | Satır sayısı:' + doc.lineCountNumeric,
		amount: '<b>' + Number(doc.payableAmount).formatMoney(2,',','.') + '</b> <span class="small"><b>' + (doc.documentCurrencyCode=='TRY'?'TL':doc.documentCurrencyCode) + '</b></span><br><span title="Vergiler hariç tutar:' + Number(doc.taxExclusiveAmount).formatMoney(2,',','.') + '">V.H:' + Number(doc.taxExclusiveAmount).formatMoney(2,',','.') + '</span>',
		tax:'',
		currency: doc.documentCurrencyCode + (doc.documentCurrencyCode!='TRY'?'<br>Kur:' + doc.exchangeRate:''),
		orderStatus:'',
		doc:doc
	}
	
	try{
		newDoc.issueDate=doc.issueDate + '<br>' + (new Date(doc.issueDate + 'T' + (doc.issueTime || '00:00:00+03:00'))).hhmmss();
	}catch(err){

	}

	newDoc.orderNo +='<span class="badge badge-invoice ';
	switch(doc.profileId){
		case 'TEMELSIPARIS':	newDoc.orderNo +='invoice-temel">Temel'; break;
		case 'TICARISIPARIS': newDoc.orderNo +='invoice-ticari">Ticari';break;
		default: newDoc.orderNo +='invoice-earsiv">' + doc.profileId + '';break;
	}
	newDoc.orderNo +='</span><span class="badge badge-invoice ml-1 ';

	switch(doc.orderTypeCode){
		case 'SATIS': newDoc.orderNo +='invoice-satis">Satış';break;
		case 'IADE': newDoc.orderNo +='invoice-iade">İade';break;
		case 'TEVKIFAT': newDoc.orderNo +='invoice-tevkifat">Tevkifat';break;
		case 'ISTISNA':	newDoc.orderNo +='invoice-istisna">İstisna';break;
		case 'OZELMATRAH': newDoc.orderNo +='invoice-ozelmatrah">Özel Matrah'; break;
		case 'IHRACKAYITLI': newDoc.orderNo +='invoice-ihrackayitli">İhraç Kayıtlı';break;
		default: newDoc.orderNo +='invoice-ihrackayitli">' + doc.orderTypeCode + ''; break;
	}
	newDoc.orderNo +='</span>'

	newDoc.orderStatus ='<span class="badge badge-invoice ';
	switch(doc.orderStatus){
		case 'Draft': newDoc.orderStatus +='invoice-draft">Taslak';break;
		case 'Pending': newDoc.orderStatus +='invoice-pending">Kuyruğa alındı';break;
		case 'Processing': newDoc.orderStatus +='invoice-processing">İşleniyor';break;
		case 'SentToGib': newDoc.orderStatus +='invoice-senttogib">GİB\'e iletildi';break;
		case 'Approved':	newDoc.orderStatus +='invoice-approved">Onaylandı';break;
		case 'Declined': newDoc.orderStatus +='invoice-declined">Reddedildi'; break;
		case 'WaitingForAprovement': newDoc.orderStatus +='invoice-waitingforaprovement">Onay bekliyor';break;
		case 'Error': newDoc.orderStatus +='invoice-error"><a href="javascript:showErrors(\'' + doc._id + '\');"><i class="fa fa-eye"></i> Hata</a>';break;
		default: newDoc.orderStatus +='invoice-processing">' + doc.orderStatus + ''; break;
	}
	newDoc.orderStatus +='</span>';
	if(doc.taxSummary.vat1>0){
		newDoc.tax +='1% = ' + Number(doc.taxSummary.vat1).formatMoney(',','.') + '<br>';
	}
	if(doc.taxSummary.vat8>0){
		newDoc.tax +='8% = ' + Number(doc.taxSummary.vat8).formatMoney(',','.') + '<br>';
	}
	if(doc.taxSummary.vat18>0){
		newDoc.tax +='18% = ' + Number(doc.taxSummary.vat18).formatMoney(',','.') + '<br>';
	}
	if(doc.withholdingTaxTotal>0){
		newDoc.tax +='Tevkifat = ' + Number(doc.withholdingTaxTotal).formatMoney(',','.') + '<br>';
	}
	return newDoc;
}



exports.makeSimpleDespatchList=function(doc){
	var newDoc={
		_id:doc._id,
		uuid:doc.uuid,
		despatchNo:'<b>' +  (doc.ID==''?'':doc.ID) + (doc.localDocumentId!=''?' | ' + doc.localDocumentId:'') + '</b><br>',
		issueDate:doc.issueDate + '<br>' + doc.issueTime,
		partyName:'<b>'+ doc.party.title + '</b><br><span class="text-primary">' + doc.party.vknTckn + '</span> | Satır sayısı:' + doc.lineCountNumeric,
		despatchStatus:'',
		doc:doc
	}
	
	try{
		newDoc.issueDate=doc.issueDate + '<br>' + (new Date(doc.issueDate + 'T' + (doc.issueTime || '00:00:00+03:00'))).hhmmss();
	}catch(err){

	}

	newDoc.despatchNo +='<span class="badge badge-invoice ';
	switch(doc.profileId){
		case 'TEMELIRSALIYE':	newDoc.despatchNo +='invoice-temel">Temel'; break;
		default: newDoc.despatchNo +='invoice-earsiv">' + doc.profileId + '';break;
	}
	newDoc.despatchNo +='</span><span class="badge badge-invoice ml-1 ';

	switch(doc.despatchAdviceTypeCode){
		case 'SEVK': newDoc.despatchNo +='invoice-satis">Sevk';break;
		case 'MATBUDAN': newDoc.despatchNo +='invoice-iade">Matbudan';break;
		
		default: newDoc.despatchNo +='invoice-ihrackayitli">' + doc.despatchAdviceTypeCode + ''; break;
	}
	newDoc.despatchNo +='</span>'

	newDoc.despatchStatus ='<span class="badge badge-invoice ';
	switch(doc.despatchStatus){
		case 'Draft': newDoc.despatchStatus +='invoice-draft">Taslak';break;
		case 'Pending': newDoc.despatchStatus +='invoice-pending">Kuyruğa alındı';break;
		case 'Processing': newDoc.despatchStatus +='invoice-processing">İşleniyor';break;
		case 'SentToGib': newDoc.despatchStatus +='invoice-senttogib">GİB\'e iletildi';break;
		case 'Approved':	newDoc.despatchStatus +='invoice-approved">Onaylandı';break;
		case 'Declined': newDoc.despatchStatus +='invoice-declined">Reddedildi'; break;
		case 'WaitingForAprovement': newDoc.despatchStatus +='invoice-waitingforaprovement">Onay bekliyor';break;
		case 'Error': newDoc.despatchStatus +='invoice-error"><a href="javascript:showErrors(\'' + doc._id + '\');"><i class="fa fa-eye"></i> Hata</a>';break;
		default: newDoc.despatchStatus +='invoice-processing">' + doc.despatchStatus + ''; break;
	}
	newDoc.despatchStatus +='</span>';
	
	return newDoc;
}