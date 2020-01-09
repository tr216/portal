var formOrjinal;

function editLine(index){
	var invoiceTemplate=eInvoiceDocumentTemplate();
	var old=document.getElementById('invoiceLineModal');
	old.parentNode.replaceChild(formOrjinal.cloneNode(true),old);
	

	var btnSave=document.getElementById('invoiceLineModalSaveButton');
	btnSave.href='javascript:saveInvoiceLine(' + index + ')';
	var line=invoice.invoiceLine[index];
	line=Object.assign(JSON.parse(JSON.stringify(invoiceTemplate.invoiceLine)),line);
	invoiceLinePackageGrid_clear();
	$('#invoiceLinePackageGrid-Quantity').on('keyup',function(e){
		if((e.keyCode ? e.keyCode : e.which)=='13'){
			invoiceLinePackageGrid_AddRow();
		}
	});
	
	$('#invoiceLineModalLabel').text('Fatura Satir: #' + line.ID.value);

	$('#invoiceLine-item-name').val(line.item.name.value);
	
	$('#invoiceLine-invoicedQuantity').val(line.invoicedQuantity.value);
	$('#invoiceLine-invoicedQuantity-unitCode').val(line.invoicedQuantity.attr.unitCode);
	$('#invoiceLine-price-priceAmount').val(line.price.priceAmount.value);

	if(line.taxTotal)
		if(line.taxTotal.taxSubtotal)
			if(line.taxTotal.taxSubtotal.length>0){
				$('#invoiceLine-taxExemptionReasonCode').val(line.taxTotal.taxSubtotal[0].taxCategory.taxExemptionReasonCode.value);
				
				$('#invoiceLine-KDV-percent').val(line.taxTotal.taxSubtotal[0].percent.value);
				$('#invoiceLine-KDV-amount').val(line.taxTotal.taxSubtotal[0].taxAmount.value);
			}
	if(line.withholdingTaxTotal)
		if(line.withholdingTaxTotal.length>0)
			if(line.withholdingTaxTotal[0].taxSubtotal.length>0){
				$('#invoiceLine-Tevkifat-percent').val(line.withholdingTaxTotal[0].taxSubtotal[0].percent.value);
				$('#invoiceLine-Tevkifat-amount').val(line.withholdingTaxTotal[0].taxSubtotal[0].taxAmount.value);
				$('#invoiceLine-tevkifat-taxTypeCode').val(line.withholdingTaxTotal[0].taxSubtotal[0].taxCategory.taxScheme.taxTypeCode.value);
			}



	$('#invoiceLine-lineExtensionAmount').val(line.lineExtensionAmount.value);
	$('#invoiceLine-item-sellersItemIdentification').val(line.item.sellersItemIdentification.ID.value);
	$('#invoiceLine-item-buyersItemIdentification').val(line.item.buyersItemIdentification.ID.value);
	$('#invoiceLine-item-manufacturersItemIdentification').val(line.item.manufacturersItemIdentification.ID.value);
	$('#invoiceLine-item-brandName').val(line.item.brandName.value);
	$('#invoiceLine-item-modelName').val(line.item.modelName.value);
	$('#invoiceLine-item-keyword').val(line.item.keyword.value);
	$('#invoiceLine-item-description').val(line.item.description.value);

	if(line.item.originCountry) $('#invoiceLine-originCountry-identificationCode').val(line.item.originCountry.identificationCode.value);
	
	if(line.item.commodityClassification)
		if(line.item.commodityClassification.length>0)
			$('#invoiceLine-item-itemClassificationCode').val(line.item.commodityClassification[0].itemClassificationCode.value);

	

	
	
	if(line.note)
		if(line.note.length>0){
			var notlar='';
			line.note.forEach((e)=>{
				notlar +=e.value + '\r\n';
			})
			$('#invoiceLine-notes').val(notlar);
		}
	

	var iskontolar=[];
	var artirimlar=[];

	if(line.allowanceCharge)
		if(line.allowanceCharge.length>0){
			line.allowanceCharge.forEach((e)=>{
				var obj={oran:(e.multiplierFactorNumeric.value<1?e.multiplierFactorNumeric.value*100:e.multiplierFactorNumeric.value),tutar:e.amount.value,aciklama:e.allowanceChargeReason.value}
				if(!e.chargeIndicator.value) iskontolar.push(obj); else artirimlar.push(obj);
			});
		}
	if(iskontolar.length>0){
		iskontolar.forEach((e,index)=>{
			if(index==0){
				var iskontoRow0=document.getElementById('iskontoRow0');
				iskontoRow0.getElementsByClassName('satirIskontoOran')[0].value=e.oran;
				iskontoRow0.getElementsByClassName('satirIskontoTutar')[0].value=e.tutar;
				iskontoRow0.getElementsByClassName('satirIskontoAciklama')[0].value=e.aciklama;
			}else{
				addIskontoRow(e);
			}
		});
	}

	if(artirimlar.length>0){
		artirimlar.forEach((e,index)=>{
			if(index==0){
				var artirimRow0=document.getElementById('artirimRow0');
				artirimRow0.getElementsByClassName('satirArtirimOran')[0].value=e.oran;
				artirimRow0.getElementsByClassName('satirArtirimTutar')[0].value=e.tutar;
				artirimRow0.getElementsByClassName('satirArtirimAciklama')[0].value=e.aciklama;
			}else{
				addArtirimRow(e);
			}
		});
	}

	
	if(line.delivery){
		if(line.delivery.length>0){
			if(line.delivery[0].deliveryTerms)
				if(line.delivery[0].deliveryTerms.length>0)
					$('#invoiceLine-deliveryTerms').val(line.delivery[0].deliveryTerms[0].ID.value);
			if(line.delivery[0].shipment){
				if(line.delivery[0].shipment.goodsItem)
					if(line.delivery[0].shipment.goodsItem.length>0)
						$('#invoiceLine-GTIPNO').val(line.delivery[0].shipment.goodsItem[0].requiredCustomsId.value);
				if(line.delivery[0].shipment.shipmentStage)
					if(line.delivery[0].shipment.shipmentStage.length>0)
						$('#invoiceLine-transportModeCode').val(line.delivery[0].shipment.shipmentStage[0].transportModeCode.value);
				if(line.delivery[0].shipment.transportHandlingUnit)
					if(line.delivery[0].shipment.transportHandlingUnit.length>0)
						if(line.delivery[0].shipment.transportHandlingUnit[0].actualPackage.length>0){
							line.delivery[0].shipment.transportHandlingUnit[0].actualPackage.forEach((e)=>{
								invoiceLinePackageGrid_AddRow({quantity:e.quantity.value, packagingTypeCode:e.packagingTypeCode.value});
							})
					}
			}
		}
	}
	

	$('#invoiceLineModal').modal('show');
}

var iskontoCount=1;
var artirimCount=1;

function saveInvoiceLine(index){
	if(index<0) return;
	var invoiceTemplate=eInvoiceDocumentTemplate();
	
	//var satir=$('input[name="invoiceLine['+index+']"]').val();
	//var line=JSON.parse(decodeURIComponent(satir));
	var line={};
	line=Object.assign(JSON.parse(JSON.stringify(invoiceTemplate.invoiceLine)),invoice.invoiceLine[index]);
	line.item.name.value=$('#invoiceLine-item-name').val();
	
	line.invoicedQuantity.value=$('#invoiceLine-invoicedQuantity').val();
	line.invoicedQuantity.attr.unitCode=$('#invoiceLine-invoicedQuantity-unitCode').val();
	line.price.priceAmount.value=$('#invoiceLine-price-priceAmount').val();

	line.lineExtensionAmount.value=line.invoicedQuantity.value * line.price.priceAmount.value;
	line.taxTotal=JSON.parse(JSON.stringify(invoiceTemplate.taxTotal));
	
	console.log('kdv amount:',Number($('#invoiceLine-KDV-amount').val()))
	console.log('kdv taxExemptionReasonCode:',$('#invoiceLine-taxExemptionReasonCode').val())
	if(Number($('#invoiceLine-KDV-amount').val())>0 || ($('#invoiceLine-taxExemptionReasonCode').val() || '')!=''){
		
		console.log('line.taxTotal oncesi:',line.taxTotal)

		line.taxTotal['taxAmount']['value']=Number($('#invoiceLine-KDV-amount').val());
		
		line.taxTotal.taxSubtotal[0].percent.value=Number($('#invoiceLine-KDV-percent').val());
		line.taxTotal.taxSubtotal[0].taxAmount.value=Number($('#invoiceLine-KDV-amount').val());
		line.taxTotal.taxSubtotal[0].taxableAmount.value=line.lineExtensionAmount.value;
		line.taxTotal.taxSubtotal[0].calculationSequenceNumeric.value=1;
		line.taxTotal.taxSubtotal[0].taxCategory.taxExemptionReasonCode.value=($('#invoiceLine-taxExemptionReasonCode').val() || '');
		line.taxTotal.taxSubtotal[0].taxCategory.taxExemptionReason.value=($('#invoiceLine-taxExemptionReasonCode option:selected').text() || '');
		line.taxTotal.taxSubtotal[0].taxCategory.name.value='KDV';
		line.taxTotal.taxSubtotal[0].taxCategory.taxScheme.name.value='Katma Değer Vergisi';
		line.taxTotal.taxSubtotal[0].taxCategory.taxScheme.taxTypeCode.value='9015';
		console.log('line.taxTotal sonrasi:',line.taxTotal)

	}
	
	line.withholdingTaxTotal=[];
	if(Number($('#invoiceLine-Tevkifat-percent').val())>0 || Number($('#invoiceLine-Tevkifat-amount').val())>0 || ($('#invoiceLine-tevkifat-taxTypeCode').val() || '')!=''){
		line.withholdingTaxTotal=[JSON.parse(JSON.stringify(invoiceTemplate.taxTotal))];

		line.withholdingTaxTotal[0].taxAmount.value=Number($('#invoiceLine-Tevkifat-amount').val());
		line.withholdingTaxTotal[0].taxSubtotal[0].percent.value=Number($('#invoiceLine-Tevkifat-percent').val());
		line.withholdingTaxTotal[0].taxSubtotal[0].taxAmount.value=Number($('#invoiceLine-Tevkifat-amount').val());
		line.withholdingTaxTotal[0].taxSubtotal[0].taxableAmount.value=line.lineExtensionAmount.value;
		line.withholdingTaxTotal[0].taxSubtotal[0].calculationSequenceNumeric.value=1;
		line.withholdingTaxTotal[0].taxSubtotal[0].taxCategory.taxExemptionReasonCode.value='';
		line.withholdingTaxTotal[0].taxSubtotal[0].taxCategory.taxExemptionReason.value='';
		line.withholdingTaxTotal[0].taxSubtotal[0].taxCategory.name.value='TEVKIFAT';
		line.withholdingTaxTotal[0].taxSubtotal[0].taxCategory.taxScheme.name.value='Tevkif edilen Kdv';
		line.withholdingTaxTotal[0].taxSubtotal[0].taxCategory.taxScheme.taxTypeCode.value=($('#invoiceLine-tevkifat-taxTypeCode').val() || '');

	}
	line.item.sellersItemIdentification.ID.value=$('#invoiceLine-item-sellersItemIdentification').val().trim();
	line.item.buyersItemIdentification.ID.value=$('#invoiceLine-item-buyersItemIdentification').val().trim();
	line.item.manufacturersItemIdentification.ID.value=$('#invoiceLine-item-manufacturersItemIdentification').val().trim();
	line.item.brandName.value=$('#invoiceLine-item-brandName').val();
	line.item.modelName.value=$('#invoiceLine-item-modelName').val();
	line.item.keyword.value=$('#invoiceLine-item-keyword').val();
	line.item.description.value=$('#invoiceLine-item-description').val();
	line.item.originCountry.identificationCode.value= $('#invoiceLine-originCountry-identificationCode').val();

	line.item.commodityClassification=[{ itemClassificationCode:{ value:$('#invoiceLine-item-itemClassificationCode').val()}}];

	
	
	line.note=[];
	if($('#invoiceLine-notes').val().trim()!=''){
		var notSatirlari=$('#invoiceLine-notes').val().trim().split('\n');
		if(notSatirlari.length>0){
			notSatirlari.forEach((e,index)=>{
				if(!(index==notSatirlari.length-1 && e.trim()=='')){
					line.note.push({value:e.trim()});
				}
			})
		}
	}
	

	var iskontolar=[];
	var orjinal=document.getElementById('iskontoRows');
	var iskontoRows=orjinal.cloneNode(true);
	for(var i=0;i<iskontoRows.getElementsByClassName('row').length;i++){
		var row=iskontoRows.getElementsByClassName('row')[i];
		var iskonto={oran:0,tutar:0,aciklama:''};
		iskonto.oran=Number(row.getElementsByClassName('satirIskontoOran')[0].value);
		iskonto.tutar=Number(row.getElementsByClassName('satirIskontoTutar')[0].value);
		iskonto.aciklama=row.getElementsByClassName('satirIskontoAciklama')[0].value;
		if(iskonto.tutar>0){
			iskontolar.push(iskonto);
		}
	   
		if(i>0) 
			document.getElementById(row.id).remove();
		else {
			document.getElementById(row.id).getElementsByClassName('satirIskontoOran')[0].value='';
			document.getElementById(row.id).getElementsByClassName('satirIskontoTutar')[0].value='';
			document.getElementById(row.id).getElementsByClassName('satirIskontoAciklama')[0].value='';
		}

	}
	
	var artirimlar=[];
	var orjinal2=document.getElementById('artirimRows');
	var artirimRows=orjinal2.cloneNode(true);
	for(var i=0;i<artirimRows.getElementsByClassName('row').length;i++){
		var row=artirimRows.getElementsByClassName('row')[i];
		var artirim={oran:0,tutar:0,aciklama:''};
		artirim.oran=Number(row.getElementsByClassName('satirArtirimOran')[0].value);
		artirim.tutar=Number(row.getElementsByClassName('satirArtirimTutar')[0].value);
		artirim.aciklama=row.getElementsByClassName('satirArtirimAciklama')[0].value;
		if(artirim.tutar>0){
			artirimlar.push(artirim);
		}
	   
		if(i>0) 
			document.getElementById(row.id).remove();
		else {
			document.getElementById(row.id).getElementsByClassName('satirArtirimOran')[0].value='';
			document.getElementById(row.id).getElementsByClassName('satirArtirimTutar')[0].value='';
			document.getElementById(row.id).getElementsByClassName('satirArtirimAciklama')[0].value='';
		}
	}

	line.allowanceCharge=[];

	var sequence=0;

	iskontolar.forEach((e)=>{
		if(e.oran>0 || e.tutar>0){
			var obj=JSON.parse(JSON.stringify(invoiceTemplate.allowanceCharge));
			sequence++;
			obj.sequenceNumeric.value=sequence;
			obj.chargeIndicator=false;
			obj.amount.value=e.tutar;
			obj.multiplierFactorNumeric.value=e.oran/100;
			obj.baseAmount.value=line.lineExtensionAmount.value;
			obj.allowanceChargeReason.value=e.aciklama;
			line.allowanceCharge.push(obj)
		}
		
	});
	sequence=0;
	artirimlar.forEach((e)=>{
		if(e.oran>0 || e.tutar>0){
			var obj=JSON.parse(JSON.stringify(invoiceTemplate.allowanceCharge));
			sequence++;
			obj.sequenceNumeric.value=sequence;
			obj.chargeIndicator=true;
			obj.amount.value=e.tutar;
			obj.multiplierFactorNumeric.value=e.oran/100;
			obj.baseAmount.value=line.lineExtensionAmount.value;
			obj.allowanceChargeReason.value=e.aciklama;
			line.allowanceCharge.push(obj)
		}
	});
	// -- ihracat paketleri ---
	var ihracatPaketleri=[];
	var table1=document.getElementById('invoiceLinePackageGridBody');
	if(table1.rows){
		if(table1.rows.length>0){
			for(var i=0;i<table1.rows.length-1;i++){
				if(!isNaN(table1.rows[i].cells[1].innerHTML) && table1.rows[i].cells[2].innerHTML!=''){
					if(Number(table1.rows[i].cells[1].innerHTML)>0){
						var obj={
							quantity:Number(table1.rows[i].cells[1].innerHTML),
							packagingTypeCode:table1.rows[i].cells[2].innerHTML
						}
						ihracatPaketleri.push(obj);
					}
				}
			}
			if(!isNaN((document.getElementById('invoiceLinePackageGrid-Quantity').value)) && document.getElementById('invoiceLinePackageGrid-packagingTypeCode').value!=''){
				if(Number(document.getElementById('invoiceLinePackageGrid-Quantity').value)>0){
					var obj={
						quantity:Number(document.getElementById('invoiceLinePackageGrid-Quantity').value),
						packagingTypeCode:document.getElementById('invoiceLinePackageGrid-packagingTypeCode').value
					}
					ihracatPaketleri.push(obj);
				}
			}
		}
	}
	line.delivery=[]

	if(ihracatPaketleri.length>0 || $('#invoiceLine-deliveryTerms').val().trim()!='' || $('#invoiceLine-GTIPNO').val().trim()!='' || $('#invoiceLine-transportModeCode').val().trim()!=''){
		line.delivery=[JSON.parse(JSON.stringify(invoiceTemplate.delivery))];
		line.delivery[0].deliveryTerms=[{ID:{ value:$('#invoiceLine-deliveryTerms').val().trim()}}];

		line.delivery[0].shipment.goodsItem=[{requiredCustomsId:{value:$('#invoiceLine-GTIPNO').val().trim()}}];
		line.delivery[0].shipment.shipmentStage=[{transportModeCode:{value:$('#invoiceLine-transportModeCode').val().trim()}}];
		if(ihracatPaketleri.length>0){
			line.delivery[0].shipment.totalTransportHandlingUnitQuantity.value=0;
			line.delivery[0].shipment.transportHandlingUnit=[{actualPackage:[]}]
			ihracatPaketleri.forEach((e,index)=>{
				var actualPackage={
					ID:{value:(index+1)},
					quantity:{value:e.quantity},
					packagingTypeCode:{value:e.packagingTypeCode}
				}
				line.delivery[0].shipment.transportHandlingUnit[0].actualPackage.push(actualPackage);
				line.delivery[0].shipment.totalTransportHandlingUnitQuantity.value+=actualPackage.quantity.value;
			});
		}
		
	}


	// end of ihracat paketleri ---
	invoice.invoiceLine[index]=line;
	console.log('invoice.invoiceLine[index]:',invoice.invoiceLine[index]);
    saveInvoice((err)=>{
    	if(!err){
    		reloadLineGrid();
    		$('#invoiceLineModal').modal('hide');
    	}else{
    		alert('Hata:' + err.message);
    	}
    });

}

function saveInvoice(callback){
    
    // $(".invoiceLine").each(function() {
    //     tempInvoice.invoiceLine.push(JSON.parse(decodeURIComponent(this.value)));
    // });

    if(ioType==0){
		url='/dbapi/e-invoice/saveOutboxInvoice/' + _id + '?db=' + db + '&sid=' + sid;
	}else{
		url='/dbapi/e-invoice/saveInboxInvoice/' + _id + '?db=' + db + '&sid=' + sid;
	}

	
    $.ajax({
        url:url,
        data:invoice,
        type:'PUT',
        success:function(result){
            if(result.success){
                callback(null);
            }else{
                callback(result.error)
            }
        }
    });
}


function addIskontoRow(obj={oran:'',tutar:'',aciklama:''}){
	
	var iskontoRow0=document.getElementById('iskontoRow0');
  
   
	var clone = iskontoRow0.cloneNode(true);
	
	clone.id = 'iskontoRow' + iskontoCount;
	clone.getElementsByClassName('satirIskontoOran')[0].value=obj.oran;
	clone.getElementsByClassName('satirIskontoTutar')[0].value=obj.tutar;
	clone.getElementsByClassName('satirIskontoAciklama')[0].value=obj.aciklama;

	clone.getElementsByTagName('a')[0].href='javascript:removeIskontoRow(\'' + clone.id + '\')';
	clone.getElementsByTagName('a')[0].setAttribute('title','Iskonto sil');
	clone.getElementsByTagName('a')[0].setAttribute('class','btn btn-danger btn-sm fas fa-minus-square');

	iskontoRows.appendChild(clone);
	iskontoCount++;
}


function removeIskontoRow(rowId){
	document.getElementById(rowId).remove();
	
}
function addArtirimRow(obj={oran:'',tutar:'',aciklama:''}){
	
	var artirimRow0=document.getElementById('artirimRow0');
  
   
	var clone = artirimRow0.cloneNode(true);
	
	clone.id = 'artirimRow' + artirimCount;
	clone.getElementsByClassName('satirArtirimOran')[0].value=obj.oran;
	clone.getElementsByClassName('satirArtirimTutar')[0].value=obj.tutar;
	clone.getElementsByClassName('satirArtirimAciklama')[0].value=obj.aciklama;

	clone.getElementsByTagName('a')[0].href='javascript:removeArtirimRow(\'' + clone.id + '\')';
	clone.getElementsByTagName('a')[0].setAttribute('title','Artırım sil');
	clone.getElementsByTagName('a')[0].setAttribute('class','btn btn-danger btn-sm fas fa-minus-square');

	artirimRows.appendChild(clone);
	artirimCount++;
}


function removeArtirimRow(rowId){
	document.getElementById(rowId).remove();
	
}

function invoiceLinePackageGrid_clear(){
	var table1=document.getElementById('invoiceLinePackageGridBody');
	var rowCount=table1.rows.length;
	for(var i=0;i<rowCount-1;i++){
		invoiceLinePackageGrid_RemoveRow(0);
	}
	document.getElementById('invoiceLinePackageGrid-ID').value=1;
	document.getElementById('invoiceLinePackageGrid-Quantity').value='';
	document.getElementById('invoiceLinePackageGrid-packagingTypeCode').value='';
}

function invoiceLinePackageGrid_AddRow(obj={quantity:0,packagingTypeCode:''}){
	if(obj.quantity>0 && obj.packagingTypeCode!=''){
		document.getElementById('invoiceLinePackageGrid-Quantity').value=obj.quantity;
		document.getElementById('invoiceLinePackageGrid-packagingTypeCode').value=obj.packagingTypeCode;
	}else{
		if(isNaN(document.getElementById('invoiceLinePackageGrid-Quantity').value) || document.getElementById('invoiceLinePackageGrid-packagingTypeCode').value=='') return;
		if(Number(document.getElementById('invoiceLinePackageGrid-Quantity').value)<=0) return;
	}
	
	var table1=document.getElementById('invoiceLinePackageGridBody');
	var newRow=table1.insertRow(table1.rows.length-1);
	newRow.insertCell(0).innerHTML=table1.rows.length-1;
	newRow.insertCell(1).innerHTML=Number(document.getElementById('invoiceLinePackageGrid-Quantity').value);
	newRow.insertCell(2).innerHTML=document.getElementById('invoiceLinePackageGrid-packagingTypeCode').value;
	newRow.insertCell(3).innerHTML='<a class="btn btn-danger btn-sm fas fa-minus-square" href="javascript:invoiceLinePackageGrid_RemoveRow(' + (table1.rows.length-2) + ')" title="Paket Sil"></a>';
	document.getElementById('invoiceLinePackageGrid-ID').value=table1.rows.length;
	document.getElementById('invoiceLinePackageGrid-Quantity').value='';
	document.getElementById('invoiceLinePackageGrid-Quantity').focus();
}

function invoiceLinePackageGrid_RemoveRow(index){
	var table1=document.getElementById('invoiceLinePackageGridBody');
	if(index<0 || index>=table1.rows.length-1) return;
	table1.deleteRow(index);
	for(var i=0;i<table1.rows.length-1;i++){
		table1.rows[i].cells[0].innerHTML=(i+1).toString();
	}
	document.getElementById('invoiceLinePackageGrid-ID').value=table1.rows.length;
}

function addNewLine(){
	var invoiceTemplate=eInvoiceDocumentTemplate();
	var line=JSON.parse(JSON.stringify(invoiceTemplate.invoiceLine));
	line.ID.value=invoice.invoiceLine.length+1;
	invoice.invoiceLine.push(line);
	editLine(invoice.invoiceLine.length-1);
}

$(document).ready(function(){
	console.log('buraya geldi1');
	formOrjinal=document.getElementById('invoiceLineModal').cloneNode(true);
	

	// $('#invoiceLine-taxExemptionReason').autocomplete({
 //        source:taxExtemptionCodeList,
 //        select: function (event, ui) {
 //        	console.log('event:',event);
 //        	console.log('ui:',ui);
 //            $("#invoiceLine-taxExemptionReason").val(ui.item.text); // display the selected text
 //            $("#invoiceLine-taxExemptionReasonCode").val(ui.item.value); // save selected id to hidden input
 //        }
 //    });

	
});
