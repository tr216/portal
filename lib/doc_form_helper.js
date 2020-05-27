
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


exports.makeSimpleInventoryFicheList=function(doc){
	var newDoc={
		_id:doc._id,
		docId:'<b>' +  doc.docId + '</b><br>',
		issueDate:doc.issueDate + '<br>' + (doc.issueTime || '').substr(0,5),
		description:doc.description,
		subLocation:doc.location.locationName + (doc.subLocation.name?'.'+doc.subLocation.name:''),
		subLocation2:doc.location2.locationName + (doc.subLocation2.name?'.'+doc.subLocation2.name:'')
	}
	

	newDoc.docId +='<span class="badge badge-invoice ';
	switch(doc.docTypeCode){
		case 'TRANSFER':	newDoc.docId +='invoice-temel">Transfer'; break;
		case 'GIRIS':	newDoc.docId +='invoice-iade">Giriş'; break;
		case 'CIKIS':	newDoc.docId +='invoice-satis">Çıkış'; break;
		case 'SAYIMFAZLASI': newDoc.docId +='invoice-ihrackayitli">Sayım Fazlası(-)';break;
		case 'SAYIMEKSIGI': newDoc.docId +='invoice-istisna">Sayım Eksiği(+)';break;
		case 'URETIMECIKIS': newDoc.docId +='invoice-ozelmatrah">Üretime Çıkış';break;
		case 'URETIMDENGIRIS': newDoc.docId +='invoice-ticari">Üretimden Giriş';break;
		case 'SAYIM': newDoc.docId +='invoice-tevkifat">Sayım';break;
		
	}
	newDoc.docId +='</span>';

	return newDoc;
}



exports.makeSimpleProductionOrderList=function(req, doc){

	var newDoc={
		_id:doc._id,
		productionId:'<b>' +  doc.productionId + '</b><br>',
		issueDate:doc.issueDate ,
		plannedPeriod:'<span title="' + mrutil.haftaninGunu((doc.plannedPeriod.startDate || '')) + '">'+(doc.plannedPeriod.startDate || '') + '</span> ' + (doc.plannedPeriod.startTime || '') + (doc.plannedPeriod.startDate!=doc.plannedPeriod.endDate?'<br>' + '<span title="' + mrutil.haftaninGunu((doc.plannedPeriod.endDate || '')) + '">'+ (doc.plannedPeriod.endDate || '') + '</span>': ' - ') + ' ' + (doc.plannedPeriod.endTime || ''),
		itemName:'<span class="text-primary"><b>' + doc.item.name.value + '</b></span><br><b>' + (doc.item.description.value || '') + '</b>',
		quantity: Number(doc.plannedQuantity).formatQuantity() + (doc.producedQuantity>0?'<span class="text-primary">/Ü:' + Number(doc.producedQuantity).formatQuantity() + ' ' + doc.unitCode + '</span>':'') + ' ' + doc.unitCode ,
		musteri:'',
		ambalaj:'',
		status:'',
		islemButonlari:'',
		doc:doc
	}
	

	newDoc.productionId +='<span class="badge badge-invoice ';
	switch(doc.productionTypeCode){
		case 'DEPO':	newDoc.productionId +='invoice-temel">Depo'; break;
		default: newDoc.productionId +='invoice-ticari">' + doc.productionTypeCode + '';break;
	}
	newDoc.productionId +='</span>';


	newDoc.status ='<span class="badge badge-invoice ';
	switch(doc.status){
		case 'Draft': newDoc.status +='invoice-draft">Taslak';break;
		case 'Approved':	newDoc.status +='invoice-approved">Onaylandı';break;
		case 'Declined': newDoc.status +='invoice-declined">Reddedildi'; break;
		case 'Processing': newDoc.status +='invoice-processing">Üretiliyor';break;
		case 'Completed': newDoc.status +='invoice-senttogib">Bitti';break;
		case 'Cancelled': newDoc.status +='invoice-earsiv">İptal';break;
		case 'Error': newDoc.status +='invoice-error"><a href="javascript:showErrors(\'' + doc._id + '\');"><i class="fa fa-eye"></i> Hata</a>';break;
		default: newDoc.status +='invoice-processing">' + doc.status + ''; break;
	}
	newDoc.status +='</span>';
	

	if(doc.productionTypeCode=='MUSTERI'){
		if(doc.orderLineReference){
			doc.orderLineReference.forEach((e2,index)=>{
				newDoc.musteri +='<b>' + e2.orderReference.buyerCustomerParty.party.partyName.name.value + '</b>';
				if(index<doc.orderLineReference.length-1){

					newDoc.musteri +=' <span class="text-primary"><b>' + Number(e2.producedQuantity.value).formatQuantity() + '</b></span>';
					newDoc.musteri +='<br>';
				}
			});
		}
	}
	
	var paletStr='';
	var ambalajStr='';
	if((doc.totalPallet || 0)>0)	paletStr += doc.totalPallet;
	//if((doc.palletType || '')!='')	paletStr += ' x ' + doc.palletType.name;

	if((doc.totalPacking || 0)>0)	ambalajStr += doc.totalPacking;
	//if((doc.packingType || '')!='')	ambalajStr += ' x ' + doc.packingType.name;
	//qwerty palet/ paket turleri buraya gelsin
	newDoc.ambalaj +='<b>' + paletStr + '<br>' + ambalajStr + '</b>';

	switch(doc.status){
		case 'Draft':
		newDoc.islemButonlari='<a class="btn btn-secondary" href="/mrp/production-orders/approvement/' + doc._id + '?db='+ req.query.db +'&sid=' + req.query.sid +'" target="_self" title="Üretim emrini onayla veya reddet"><i class="fas fa-check-square"></i> Onay/Ret</a>';
		break;
		case 'Approved':
		newDoc.islemButonlari='<a class="btn invoice-istisna" href="/mrp/production-orders/start/' + doc._id + '?db='+ req.query.db +'&sid=' + req.query.sid +'" target="_self" title="Üretim işlemini başlat"><i class="fas fa-play-circle"></i> Başlat</a>';
		break;
		case 'Processing':
		newDoc.islemButonlari='<a class="btn invoice-earsiv" href="/mrp/production-orders/complete/' + doc._id + '?db='+ req.query.db +'&sid=' + req.query.sid +'" target="_self" title="Üretim işlemini tamamla/bitir"><i class="fas fa-stop-circle"></i> Bitir</a>';
		break;
	} 
	return newDoc;
}