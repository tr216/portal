var formOrjinal;

function editLine(index){
	var old=document.getElementById('docLineModal');
	old.parentNode.replaceChild(formOrjinal.cloneNode(true),old);

	var btnSave=document.getElementById('docLineModalSaveButton');
	btnSave.href='javascript:saveDocLine(' + index + ')';
	var line;
	switch(docFormType){
		case 'order':
			line=doc.orderLine[index];
			line=Object.assign({}, clone(dbType.orderLineType),line);
		break;
		case 'invoice':
			line=doc.invoiceLine[index];
			line=Object.assign({}, clone(dbType.invoiceLineType),line);
		break;
		case 'despatch':
			line=doc.despatchLine[index];
			line=Object.assign({}, clone(dbType.despatchLineType),line);
		break;
	}
	
	
	docLinePackageGrid_clear();
	$('#docLinePackageGrid-Quantity').on('keyup',function(e){
		if((e.keyCode ? e.keyCode : e.which)=='13'){
			docLinePackageGrid_AddRow();
		}
	});
	
	$('#docLineModalLabel').text('Satir: #' + line.ID.value);

	$('#docLine-item-name').val(line.item.name.value);
	$('#docLine-item-id').val(line.item._id);
	$('#docLine-item-itemType').val(line.item.itemType);
	
	switch(docFormType){
		case 'order':
			$('#docLine-quantity').val(line.orderedQuantity.value);
			$('#docLine-quantity-unitCode').val(line.orderedQuantity.attr.unitCode);
		break;
		case 'invoice':
			$('#docLine-quantity').val(line.invoicedQuantity.value);
			$('#docLine-quantity-unitCode').val(line.invoicedQuantity.attr.unitCode);
		break;
		case 'despatch':
			$('#docLine-quantity').val(line.deliveredQuantity.value);
			$('#docLine-quantity-unitCode').val(line.deliveredQuantity.attr.unitCode);
		break;
	}
	
	if(docFormType!='despatch'){
		$('#docLine-price-priceAmount').val(line.price.priceAmount.value);
		if(line.taxTotal)
			if(line.taxTotal.taxSubtotal)
				if(line.taxTotal.taxSubtotal.length>0){
					$('#docLine-taxExemptionReasonCode').val(line.taxTotal.taxSubtotal[0].taxCategory.taxExemptionReasonCode.value);
					
					$('#docLine-KDV-percent').val(line.taxTotal.taxSubtotal[0].percent.value);
					$('#docLine-KDV-amount').val(line.taxTotal.taxSubtotal[0].taxAmount.value);
				}
		if(line.withholdingTaxTotal)
			if(line.withholdingTaxTotal.length>0)
				if(line.withholdingTaxTotal[0].taxSubtotal.length>0){
					$('#docLine-Tevkifat-percent').val(line.withholdingTaxTotal[0].taxSubtotal[0].percent.value);
					$('#docLine-Tevkifat-amount').val(line.withholdingTaxTotal[0].taxSubtotal[0].taxAmount.value);
					$('#docLine-tevkifat-taxTypeCode').val(line.withholdingTaxTotal[0].taxSubtotal[0].taxCategory.taxScheme.taxTypeCode.value);
					if(line.withholdingTaxTotal[0].taxSubtotal[0].percent.value>0 || line.withholdingTaxTotal[0].taxSubtotal[0].taxAmount.value>0){
						$('#cbTevkifatPanel').prop('checked',true);
						//$('#cbTevkifatPanel').prop('checked',true);
						$('#tevkifatPanel').show();
						
					}
				}



		$('#docLine-lineExtensionAmount').val(line.lineExtensionAmount.value);
		var iskontolar=[];
		var artirimlar=[];

		if(line.allowanceCharge)
			if(line.allowanceCharge.length>0){
				line.allowanceCharge.forEach((e)=>{
					var obj={oran:(e.multiplierFactorNumeric.value<1?e.multiplierFactorNumeric.value*100:e.multiplierFactorNumeric.value),tutar:e.amount.value,aciklama:(e.allowanceChargeReason.value || '')}
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
			$('#cbIskontoPanel').prop('checked',true);
			$('#iskontoPanel').show();

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
			$('#cbArtirimPanel').prop('checked',true);
			$('#artirimPanel').show();
			
		}
		if(line.delivery){
			if(line.delivery.length>0){
				if(line.delivery[0].deliveryTerms)
					if(line.delivery[0].deliveryTerms.length>0)
						$('#docLine-deliveryTerms').val(line.delivery[0].deliveryTerms[0].ID.value);
				if(line.delivery[0].shipment){
					if(line.delivery[0].shipment.goodsItem)
						if(line.delivery[0].shipment.goodsItem.length>0)
							$('#docLine-GTIPNO').val(line.delivery[0].shipment.goodsItem[0].requiredCustomsId.value);
					if(line.delivery[0].shipment.shipmentStage)
						if(line.delivery[0].shipment.shipmentStage.length>0)
							$('#docLine-transportModeCode').val(line.delivery[0].shipment.shipmentStage[0].transportModeCode.value);
					if(line.delivery[0].shipment.transportHandlingUnit)
						if(line.delivery[0].shipment.transportHandlingUnit.length>0)
							if(line.delivery[0].shipment.transportHandlingUnit[0].actualPackage.length>0){
								line.delivery[0].shipment.transportHandlingUnit[0].actualPackage.forEach((e)=>{
									docLinePackageGrid_AddRow({quantity:e.quantity.value, packagingTypeCode:e.packagingTypeCode.value});
								})
						}
				}
			}
		}
	}
	

	
	$('#docLine-item-sellersItemIdentification').val(line.item.sellersItemIdentification.ID.value);
	$('#docLine-item-buyersItemIdentification').val(line.item.buyersItemIdentification.ID.value);
	$('#docLine-item-manufacturersItemIdentification').val(line.item.manufacturersItemIdentification.ID.value);
	$('#docLine-item-brandName').val(line.item.brandName.value);
	$('#docLine-item-modelName').val(line.item.modelName.value);
	$('#docLine-item-keyword').val(line.item.keyword.value);
	$('#docLine-item-description').val(line.item.description.value);

	if(line.item.originCountry) $('#docLine-originCountry-identificationCode').val(line.item.originCountry.identificationCode.value);
	
	if(line.item.commodityClassification)
		if(line.item.commodityClassification.length>0)
			$('#docLine-item-itemClassificationCode').val(line.item.commodityClassification[0].itemClassificationCode.value);

	

	
	
	if(line.note)
		if(line.note.length>0){
			var notlar='';
			line.note.forEach((e)=>{
				notlar +=e.value + '\r\n';
			})
			$('#docLine-notes').val(notlar);
		}
	

	

	
	
	if((line.item._id || '')!=''){
		$('#cbNewItemPanel').hide();
	}else{
		$('#cbNewItemPanel').show();
	}
	calculateDocLine();
	docLineItemNameAutoComplete();
	$('#docLineModal').modal('show');
}

var iskontoCount=1;
var artirimCount=1;

function saveDocLine(index){
	if(index<0) return;
	$('#docLineModal').modal('hide');

	var line;
	var quantity=Number($('#docLine-quantity').val());

	switch(docFormType){
		case 'order':
			line=Object.assign({}, clone(dbType.orderLineType),doc.orderLine[index]);
			line.orderedQuantity.value=quantity;
			line.orderedQuantity.attr.unitCode=$('#docLine-quantity-unitCode').val();
		break;
		case 'invoice':
			line=Object.assign({}, clone(dbType.invoiceLineType),doc.invoiceLine[index]);
			line.invoicedQuantity.value=quantity;
			line.invoicedQuantity.attr.unitCode=$('#docLine-quantity-unitCode').val();
		break;
		case 'despatch':
			line=Object.assign({}, clone(dbType.despatchLineType),doc.despatchLine[index]);
			line.deliveredQuantity.value=quantity;
			line.deliveredQuantity.attr.unitCode=$('#docLine-quantity-unitCode').val();
		break;
	}
	
	line.item.name.value=$('#docLine-item-name').val();

	if(docFormType!='despatch'){
		line.price.priceAmount.value=$('#docLine-price-priceAmount').val();
		line.lineExtensionAmount.value=quantity * line.price.priceAmount.value;
		line.taxTotal=clone(dbType.taxTotalType);
		if(Number($('#docLine-KDV-amount').val())>0 || ($('#docLine-taxExemptionReasonCode').val() || '')!=''){
			line.taxTotal['taxAmount']={value:Number($('#docLine-KDV-amount').val())};
			line.taxTotal.taxSubtotal[0].percent.value=Number($('#docLine-KDV-percent').val());
			line.taxTotal.taxSubtotal[0].taxAmount.value=Number($('#docLine-KDV-amount').val());
			line.taxTotal.taxSubtotal[0].taxableAmount.value=line.lineExtensionAmount.value;
			line.taxTotal.taxSubtotal[0].calculationSequenceNumeric.value=1;
			line.taxTotal.taxSubtotal[0].taxCategory.taxExemptionReasonCode.value=($('#docLine-taxExemptionReasonCode').val() || '');
			line.taxTotal.taxSubtotal[0].taxCategory.taxExemptionReason.value=($('#docLine-taxExemptionReasonCode option:selected').text() || '');
			line.taxTotal.taxSubtotal[0].taxCategory.name.value='KDV';
			line.taxTotal.taxSubtotal[0].taxCategory.taxScheme.name.value='Katma Değer Vergisi';
			line.taxTotal.taxSubtotal[0].taxCategory.taxScheme.taxTypeCode.value='9015';

		}
		
		line.withholdingTaxTotal=[];
		if(Number($('#docLine-Tevkifat-percent').val())>0 || Number($('#docLine-Tevkifat-amount').val())>0 || ($('#docLine-tevkifat-taxTypeCode').val() || '')!=''){
			line.withholdingTaxTotal=[clone(dbType.taxTotalType)];

			line.withholdingTaxTotal[0].taxAmount.value=Number($('#docLine-Tevkifat-amount').val());
			line.withholdingTaxTotal[0].taxSubtotal[0].percent.value=Number($('#docLine-Tevkifat-percent').val());
			line.withholdingTaxTotal[0].taxSubtotal[0].taxAmount.value=Number($('#docLine-Tevkifat-amount').val());
			line.withholdingTaxTotal[0].taxSubtotal[0].taxableAmount.value=line.lineExtensionAmount.value;
			line.withholdingTaxTotal[0].taxSubtotal[0].calculationSequenceNumeric.value=1;
			line.withholdingTaxTotal[0].taxSubtotal[0].taxCategory.taxExemptionReasonCode.value='';
			line.withholdingTaxTotal[0].taxSubtotal[0].taxCategory.taxExemptionReason.value='';
			line.withholdingTaxTotal[0].taxSubtotal[0].taxCategory.name.value='TEVKIFAT';
			line.withholdingTaxTotal[0].taxSubtotal[0].taxCategory.taxScheme.name.value='Tevkif edilen Kdv';
			line.withholdingTaxTotal[0].taxSubtotal[0].taxCategory.taxScheme.taxTypeCode.value=($('#docLine-tevkifat-taxTypeCode').val() || '');

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
				var obj=clone(dbType.allowanceChargeType);
				sequence++;
				obj.sequenceNumeric.value=sequence;
				obj.chargeIndicator.value=false;
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
				var obj=clone(dbType.allowanceChargeType);
				sequence++;
				obj.sequenceNumeric.value=sequence;
				obj.chargeIndicator.value=true;
				obj.amount.value=e.tutar;
				obj.multiplierFactorNumeric.value=e.oran/100;
				obj.baseAmount.value=line.lineExtensionAmount.value;
				obj.allowanceChargeReason.value=e.aciklama;
				line.allowanceCharge.push(obj)
			}
		});

		// -- ihracat paketleri ---
		var ihracatPaketleri=[];
		var table1=document.getElementById('docLinePackageGridBody');
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
				if(!isNaN((document.getElementById('docLinePackageGrid-Quantity').value)) && document.getElementById('docLinePackageGrid-packagingTypeCode').value!=''){
					if(Number(document.getElementById('docLinePackageGrid-Quantity').value)>0){
						var obj={
							quantity:Number(document.getElementById('docLinePackageGrid-Quantity').value),
							packagingTypeCode:document.getElementById('docLinePackageGrid-packagingTypeCode').value
						}
						ihracatPaketleri.push(obj);
					}
				}
			}
		}
		line.delivery=[]

		if(ihracatPaketleri.length>0 || $('#docLine-deliveryTerms').val().trim()!='' || $('#docLine-GTIPNO').val().trim()!='' || $('#docLine-transportModeCode').val().trim()!=''){
			line.delivery=[clone(dbType.deliveryType)];
			line.delivery[0].deliveryTerms=[{ID:{ value:$('#docLine-deliveryTerms').val().trim()}}];

			line.delivery[0].shipment.goodsItem=[{requiredCustomsId:{value:$('#docLine-GTIPNO').val().trim()}}];
			line.delivery[0].shipment.shipmentStage=[{transportModeCode:{value:$('#docLine-transportModeCode').val().trim()}}];
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
	}
	
	line.item._id=$('#docLine-item-id').val();
	line.item.itemType=$('#docLine-item-itemType').val();
	line.item.sellersItemIdentification.ID.value=$('#docLine-item-sellersItemIdentification').val().trim();
	line.item.buyersItemIdentification.ID.value=$('#docLine-item-buyersItemIdentification').val().trim();
	line.item.manufacturersItemIdentification.ID.value=$('#docLine-item-manufacturersItemIdentification').val().trim();
	line.item.brandName.value=$('#docLine-item-brandName').val();
	line.item.modelName.value=$('#docLine-item-modelName').val();
	line.item.keyword.value=$('#docLine-item-keyword').val();
	line.item.description.value=$('#docLine-item-description').val();
	line.item.originCountry.identificationCode.value= $('#docLine-originCountry-identificationCode').val();

	line.item.commodityClassification=[{ itemClassificationCode:{ value:$('#docLine-item-itemClassificationCode').val()}}];

	
	
	line.note=[];
	if($('#docLine-notes').val().trim()!=''){
		var notSatirlari=$('#docLine-notes').val().trim().split('\n');
		if(notSatirlari.length>0){
			notSatirlari.forEach((e,index)=>{
				if(!(index==notSatirlari.length-1 && e.trim()=='')){
					line.note.push({value:e.trim()});
				}
			})
		}
	}
	

	
	
	switch(docFormType){
		case 'order':
			doc.orderLine[index]=line;
		break;
		case 'invoice':
			doc.invoiceLine[index]=line;
		break;
		case 'despatch':
			doc.despatchLine[index]=line;
		break;
	}
	
	if($('#cbNewItem').prop('checked')){
		
		var newItem=Object.assign({}, clone(dbType.itemType),line.item);

		newItem['itemType']=$('#docLine-new-itemType').val();
		
	    $.ajax({
	        url:'/dbapi/items?db=' + db + '&sid=' + sid,
	        data:newItem,
	        type:'POST',
	        success:function(result){
	            if(result.success){
            	
	                switch(docFormType){
						case 'order':
							doc.orderLine[index].item['_id']=result.data._id;
						break;
						case 'invoice':
							doc.invoiceLine[index].item['_id']=result.data._id;
						break;
						case 'despatch':
							doc.despatchLine[index].item['_id']=result.data._id;
						break;
					}
	            }else{
	            	alert('Hata:' + result.error.message);
	            }
	            saveDocument((err)=>{
			    	if(!err){
			    		reloadLineGrid();
			    	}else{
			    		$('#docLineModal').modal('show');
			    		alert('Hata:' + err.message);
			    	}
			    });
	        }
	    });
	}else{
		saveDocument((err)=>{
	    	if(!err){
	    		reloadLineGrid();
	    		
	    	}else{
	    		$('#docLineModal').modal('show');
	    		alert('Hata:' + err.message);
	    	}
	    });
	}
    

}

function saveDocument(callback){
	doc.eIntegrator=$("select[name='eIntegrator']").val();
	doc.ID={ value:$("input[name='ID[value]']").val()}
    doc.issueDate={ value:$("input[name='issueDate[value]']").val()}
    doc.issueTime={ value:$("input[name='issueTime[value]']").val()}
    doc.profileId={ value:$("select[name='profileId[value]']").val()}
    switch(docFormType){
    	case 'order':
    		doc.orderTypeCode={ value:$("select[name='orderTypeCode[value]']").val()}
    	break;

    	case 'invoice':
    		doc.invoiceTypeCode={ value:$("select[name='invoiceTypeCode[value]']").val()}
    	break;

    	case 'despatch':
    		doc.despatchAdviceTypeCode={ value:$("select[name='despatchAdviceTypeCode[value]']").val()}
    	break;
    }
    
    doc.uuid={ value:$("input[name='orderTypeCode[value]']").val()}
    doc.localDocumentId=$("input[name='localDocumentId']").val();
    if(docFormType!='despatch'){
    	doc.documentCurrencyCode={ value:$("select[name='documentCurrencyCode[value]']").val()}
    	doc.pricingExchangeRate.calculationRate={ value:$("input[name='pricingExchangeRate[calculationRate][value]']").val()}
    }
    
    var party={}
    
    switch(docFormType){
		case 'order':
			party=doc.ioType==0?doc.buyerCustomerParty.party:doc.sellerSupplierParty.party;
		break;
		case 'invoice':
			party=doc.ioType==0?doc.accountingCustomerParty.party:doc.accountingSupplierParty.party;
		break;
		case 'despatch':
			party=doc.ioType==0?doc.deliveryCustomerParty.party:doc.despatchSupplierParty.party;
		break;
	}
    var vknTckn=$("input[name='vknTckn']").val();
    var bFound=false;
    party.partyIdentification=[];
    if(vknTckn.length==11){
        party.partyIdentification.push({ID:{value:vknTckn, attr:{schemeID:'TCKN'}}})
    }else{
        party.partyIdentification.push({ID:{value:vknTckn, attr:{schemeID:'VKN'}}})
    }
    party.partyName.name.value=$("input[name='party[partyName][name][value]']").val();
    party.person.firstName.value=$("input[name='party[person][firstName][value]']").val();
    party.person.familyName.value=$("input[name='party[person][familyName][value]']").val();
    party.partyName.name.value=$("input[name='party[partyName][name][value]']").val();
    party.partyTaxScheme.taxScheme.name.value=$("input[name='party[partyTaxScheme][taxScheme][name][value]']").val();

    party.postalAddress.country.name.value=$("input[name='party[postalAddress][country][name][value]']").val();
    party.postalAddress.cityName.value=$("input[name='party[postalAddress][cityName][value]']").val();
    party.postalAddress.district.value=$("input[name='party[postalAddress][district][value]']").val();
    party.postalAddress.streetName.value=$("input[name='party[postalAddress][streetName][value]']").val();
    party.postalAddress.buildingName.value=$("input[name='party[postalAddress][buildingName][value]']").val();
    party.postalAddress.blockName.value=$("input[name='party[postalAddress][blockName][value]']").val();
    party.postalAddress.buildingNumber.value=$("input[name='party[postalAddress][buildingNumber][value]']").val();
    party.postalAddress.room.value=$("input[name='party[postalAddress][room][value]']").val();
    party.postalAddress.postbox.value=$("input[name='party[postalAddress][postbox][value]']").val();
    party.contact.telephone.value=$("input[name='party[contact][telephone][value]']").val();
    party.contact.telefax.value=$("input[name='party[contact][telefax][value]']").val();
    party.contact.electronicMail.value=$("input[name='party[contact][electronicMail][value]']").val();
    party.websiteURI.value=$("input[name='party[websiteURI][value]']").val();

    var url;
    var type='PUT';
    if((doc._id || '')=='') type='POST';
    switch(docFormType){
		case 'order':
			if(doc.ioType==0){
		        doc.buyerCustomerParty.party=party;
		        
		        if((doc._id || '')=='')
		        		url='/dbapi/order/saveOutboxOrder?db=' + db + '&sid=' + sid;
		        	else
		        		url='/dbapi/order/saveOutboxOrder/' + doc._id  + '?db=' + db + '&sid=' + sid;
		    }else{
		        doc.sellerSupplierParty.party=party;
		        if((doc._id || '')=='')
		        		url='/dbapi/order/saveInboxOrder?db=' + db + '&sid=' + sid;
		        	else
		       			url='/dbapi/order/saveInboxOrder/' + doc._id  + '?db=' + db + '&sid=' + sid;
		    }
			
		break;
		case 'invoice':
			if(doc.ioType==0){
		        doc.accountingCustomerParty.party=party;
		        if((doc._id || '')=='')
		        		url='/dbapi/invoice/saveOutboxInvoice?db=' + db + '&sid=' + sid;
		    		else
		        		url='/dbapi/invoice/saveOutboxInvoice/' + doc._id  + '?db=' + db + '&sid=' + sid;
		    }else{
		        doc.accountingSupplierParty.party=party;
		        if((doc._id || '')=='')
		        		url='/dbapi/invoice/saveInboxInvoice?db=' + db + '&sid=' + sid;
		    		else
		        		url='/dbapi/invoice/saveInboxInvoice/' + doc._id  + '?db=' + db + '&sid=' + sid;
		    }
		break;
		case 'despatch':
			if(doc.ioType==0){
		        doc.deliveryCustomerParty.party=party;
		        if((doc._id || '')=='')
			 			url='/dbapi/despatch/saveOutboxDespatch?db=' + db + '&sid=' + sid;
			 		else
			 			url='/dbapi/despatch/saveOutboxDespatch/' + doc._id  + '?db=' + db + '&sid=' + sid;
		    }else{
		        doc.despatchSupplierParty.party=party;
		        if((doc._id || '')=='')
				        url='/dbapi/despatch/saveInboxDespatch?db=' + db + '&sid=' + sid;
				   	else
				        url='/dbapi/despatch/saveInboxDespatch/' + doc._id  + '?db=' + db + '&sid=' + sid;
		    }
		break;
	}
    
    $.ajax({
        url:url,
        data:doc,
        type:type,
        success:function(result){
            if(result.success){
            	doc=result.data;
            	$("input[name='ID[value]']").val(doc.ID.value);
            	reloadTotals();
            	
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

function docLinePackageGrid_clear(){
	var table1=document.getElementById('docLinePackageGridBody');
	var rowCount=table1.rows.length;
	for(var i=0;i<rowCount-1;i++){
		docLinePackageGrid_RemoveRow(0);
	}
	document.getElementById('docLinePackageGrid-ID').value=1;
	document.getElementById('docLinePackageGrid-Quantity').value='';
	document.getElementById('docLinePackageGrid-packagingTypeCode').value='';
}

function docLinePackageGrid_AddRow(obj={quantity:0,packagingTypeCode:''}){
	if(obj.quantity>0 && obj.packagingTypeCode!=''){
		document.getElementById('docLinePackageGrid-Quantity').value=obj.quantity;
		document.getElementById('docLinePackageGrid-packagingTypeCode').value=obj.packagingTypeCode;
	}else{
		if(isNaN(document.getElementById('docLinePackageGrid-Quantity').value) || document.getElementById('docLinePackageGrid-packagingTypeCode').value=='') return;
		if(Number(document.getElementById('docLinePackageGrid-Quantity').value)<=0) return;
	}
	
	var table1=document.getElementById('docLinePackageGridBody');
	var newRow=table1.insertRow(table1.rows.length-1);
	newRow.insertCell(0).innerHTML=table1.rows.length-1;
	newRow.insertCell(1).innerHTML=Number(document.getElementById('docLinePackageGrid-Quantity').value);
	newRow.insertCell(2).innerHTML=document.getElementById('docLinePackageGrid-packagingTypeCode').value;
	newRow.insertCell(3).innerHTML='<a class="btn btn-danger btn-sm fas fa-minus-square" href="javascript:docLinePackageGrid_RemoveRow(' + (table1.rows.length-2) + ')" title="Paket Sil"></a>';
	document.getElementById('docLinePackageGrid-ID').value=table1.rows.length;
	document.getElementById('docLinePackageGrid-Quantity').value='';
	document.getElementById('docLinePackageGrid-Quantity').focus();
}

function docLinePackageGrid_RemoveRow(index){
	var table1=document.getElementById('docLinePackageGridBody');
	if(index<0 || index>=table1.rows.length-1) return;
	table1.deleteRow(index);
	for(var i=0;i<table1.rows.length-1;i++){
		table1.rows[i].cells[0].innerHTML=(i+1).toString();
	}
	document.getElementById('docLinePackageGrid-ID').value=table1.rows.length;
}

function addNewLine(){
	var line;
	switch(docFormType){
		case 'order':
			line=clone(dbType.orderLineType);
			line.ID.value=doc.orderLine.length+1;
			doc.orderLine.push(line);
			editLine(doc.orderLine.length-1);
		break;
		case 'invoice':
		    line=clone(dbType.invoiceLineType);
			line.ID.value=doc.invoiceLine.length+1;
			doc.invoiceLine.push(line);
			editLine(doc.invoiceLine.length-1);
		break;
		case 'despatch':
			line=clone(dbType.despatchLineType);
			line.ID.value=doc.despatchLine.length+1;
			doc.despatchLine.push(line);
			editLine(doc.despatchLine.length-1);
		break;
	}
	
	
}

function removeLine(index){
	switch(docFormType){
		case 'order':
			if(index<0 || index>doc.orderLine.length-1) return;
			if(!confirm('Satiri silmek istediginizden emin misiniz?')) return;
	        doc.orderLine.splice(index,1);
		break;
		case 'invoice':
			if(index<0 || index>doc.invoiceLine.length-1) return;
			if(!confirm('Satiri silmek istediginizden emin misiniz?')) return;
	        doc.invoiceLine.splice(index,1);
		break;
		case 'despatch':
			if(index<0 || index>doc.despatchLine.length-1) return;
			if(!confirm('Satiri silmek istediginizden emin misiniz?')) return;
	        doc.despatchLine.splice(index,1);
		break;
	}
        
	saveDocument((err)=>{
        if(!err){
            reloadLineGrid();
        }else{
            alert('Hata:' + err.message);
        }
    });
}

	
    
function reloadLineGrid(){
    $("#lineGrid tr").remove();
    var lineGrid=document.getElementById('lineGrid');
    
    if(!doc) return;
    var lines=[];
    var lineName='';
    switch(docFormType){
		case 'order':
			lines=doc.orderLine;
			lineName='orderLine';
		break;
		case 'invoice':
			lines=doc.invoiceLine;
			lineName='invoiceLine';
		break;
		case 'despatch':
			lines=doc.despatchLine;
			lineName='despatchLine';
		break;
	}
    
    lines.forEach((line,index)=>{
        var newRow=lineGrid.insertRow(lineGrid.rows.length);
        newRow.classList.add('text-nowrap');
        newRow.insertCell(0).innerHTML='<input type="hidden" class="docLine" id="' + lineName + '[' + index + ']" name="' + lineName + '[' + index + ']" value="' + (JSON.stringify(line)) + '">';
        newRow.insertCell(1).innerHTML=line.ID.value;
        
        var itemName=line.item.name.value + '<br>';
        itemName +='<span class="text-primary">';
        if(line.item.buyersItemIdentification.ID.value!='') itemName +=line.item.buyersItemIdentification.ID.value + ' ';
        if(line.item.sellersItemIdentification.ID.value!='') itemName +=line.item.sellersItemIdentification.ID.value + ' ';
        if(line.item.manufacturersItemIdentification.ID.value!='') itemName +=line.item.manufacturersItemIdentification.ID.value + ' ';
        itemName +='</span>';
        newRow.insertCell(2).innerHTML = itemName;

        switch(docFormType){
			case 'order':
				var cell3=newRow.insertCell(3);
		        cell3.classList.add('text-right');
		        cell3.innerHTML=line.orderedQuantity.value;

		        var cell4=newRow.insertCell(4);
		        if(line.orderedQuantity.attr){
		            cell4.innerHTML=line.orderedQuantity.attr.unitCode;
		            var found=unitCodeList.find((e)=>{
		                return e.value==line.orderedQuantity.attr.unitCode;
		            });
		            if(found) cell4.innerHTML=found.text;
		            
		        }
			break;
			case 'invoice':
				var cell3=newRow.insertCell(3);
		        cell3.classList.add('text-right');
		        cell3.innerHTML=line.invoicedQuantity.value;

		        var cell4=newRow.insertCell(4);
		        if(line.invoicedQuantity.attr){
		            cell4.innerHTML=line.invoicedQuantity.attr.unitCode;
		            var found=unitCodeList.find((e)=>{
		                return e.value==line.invoicedQuantity.attr.unitCode;
		            });
		            if(found) cell4.innerHTML=found.text;
		        }
			break;
			case 'despatch':
				var cell3=newRow.insertCell(3);
		        cell3.classList.add('text-right');
		        cell3.innerHTML=line.deliveredQuantity.value;

		        var cell4=newRow.insertCell(4);
		        if(line.deliveredQuantity.attr){
		            cell4.innerHTML=line.deliveredQuantity.attr.unitCode;
		            var found=unitCodeList.find((e)=>{
		                return e.value==line.deliveredQuantity.attr.unitCode;
		            });
		            if(found) cell4.innerHTML=found.text;
		        }
			break;
		}
        

        var cell5=newRow.insertCell(5);
        cell5.classList.add('text-right');
        cell5.innerHTML=docFormType!='despatch'?line.price.priceAmount.value:'';
        var iskontoOran='', iskontoTutar='';
        if(line.allowanceCharge)
            line.allowanceCharge.forEach((allowanceChargeItem,index2)=>{
                if(allowanceChargeItem.amount.value>0){
                    if(allowanceChargeItem.chargeIndicator.value==true){
                        iskontoOran +='(M) ';
                        iskontoTutar +='(M) ';
                    }

                    if(allowanceChargeItem.multiplierFactorNumeric.value>1){
                        iskontoOran += '% ' + allowanceChargeItem.multiplierFactorNumeric.value;
                    } else if(allowanceChargeItem.multiplierFactorNumeric.value>0 && allowanceChargeItem.multiplierFactorNumeric.value<1){
                        iskontoOran += '% ' + (allowanceChargeItem.multiplierFactorNumeric.value*100)
                    }
                    iskontoTutar += allowanceChargeItem.amount.value.formatMoney();
                    if(index2<line.allowanceCharge.length-1){
                        iskontoOran +='<br>';
                        iskontoTutar +='<br>';
                    }
                }
            });
        var cell6=newRow.insertCell(6);
        cell6.classList.add('text-right');
        cell6.innerHTML=docFormType!='despatch'?iskontoOran:'';

        var cell7=newRow.insertCell(7);
        cell7.classList.add('text-right');
        cell7.innerHTML=docFormType!='despatch'?iskontoTutar:'';

        var cell8=newRow.insertCell(8);
        cell8.classList.add('text-right');
        cell8.innerHTML=docFormType!='despatch'?line.lineExtensionAmount.value.formatMoney():'';

        var kdvOrani='', kdvTutar=''; 
        var kdvDahilTutar=docFormType!='despatch'?line.lineExtensionAmount.value:0;
        if(line.taxTotal)
            if(line.taxTotal.taxSubtotal)
                if(line.taxTotal.taxSubtotal.length>0){
                    kdvOrani='% ' + line.taxTotal.taxSubtotal[0].percent.value;
                    kdvTutar=line.taxTotal.taxAmount.value.formatMoney();
                    kdvDahilTutar +=line.taxTotal.taxAmount.value;
                }

        if(line.withholdingTaxTotal!=undefined)
            if(line.withholdingTaxTotal.length>0){
                line.withholdingTaxTotal.forEach((wTax)=>{
                    if(wTax.taxSubtotal.length>0){
                        kdvOrani +='<br>Tevk:% ' + wTax.taxSubtotal[0].percent.value;
                        kdvTutar +='<br>Tevk.:' + wTax.taxAmount.value.formatMoney();
                        kdvDahilTutar -=wTax.taxAmount.value;
                    }
                });
            }

        var cell9=newRow.insertCell(9);
        cell9.classList.add('text-right');
        cell9.innerHTML=docFormType!='despatch'?kdvOrani:'';

        var cell10=newRow.insertCell(10);
        cell10.classList.add('text-right');
        cell10.innerHTML=docFormType!='despatch'?kdvTutar:'';

        var cell11=newRow.insertCell(11);
        cell11.classList.add('text-right');
        cell11.innerHTML=docFormType!='despatch'?kdvDahilTutar.formatMoney():'';

        var cell12=newRow.insertCell(12);
        cell12.classList.add('text-center');
        cell12.innerHTML='<div class="form-inline"><div class="dropdown">' + 
                '<button class="btn btn-warning btn-sm dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" title="Satır işlemleri"><i class="fas fa-table"></i> </button>' +
                '<div class="dropdown-menu">' +
                    '<a class="dropdown-item" href="javascript:alert(' + index + ');">GTIP NO Boş olanları geçmişe bakarak doldur</a>'+
                    '<a class="dropdown-item" href="javascript:alert(' + index + ');">Ihracat bilgilerini alt satirlara kopyala</a>'+
                    '<div class="dropdown-divider"></div>' +
                    '<a class="dropdown-item" href="javascript:alert(' + index + ');">qwerty yeni satir islemi eklenecek</a>'+
                '</div>' + 
            '</div>'+
            '<a href="javascript:editLine(' + index + ');"  class="btn btn-primary btn-sm fas fa-edit ml-2" title="Düzenle"></a>' +
            '<a href="javascript:removeLine(' + index + ');"  class="btn btn-danger btn-sm fas fa-trash-alt ml-2" title="Sil"></a></div>';
    });
    
}

function reloadTotals(){

    if(!doc) return;
    var monetaryTotal;
    switch(docFormType){
		case 'order':
			monetaryTotal=doc.anticipatedMonetaryTotal;
		break;
		case 'invoice':
			monetaryTotal=doc.legalMonetaryTotal;
		break;
		case 'despatch':
			monetaryTotal=null;
		break;
	}
    if(monetaryTotal){
    	document.getElementById('lineExtensionAmount').innerHTML=Number(monetaryTotal.lineExtensionAmount.value).formatMoney();
	    document.getElementById('allowanceTotalAmount').innerHTML=Number(monetaryTotal.allowanceTotalAmount.value).formatMoney();
	    document.getElementById('chargeTotalAmount').innerHTML=Number(monetaryTotal.chargeTotalAmount.value).formatMoney();
	    document.getElementById('taxExclusiveAmount').innerHTML=Number(monetaryTotal.taxExclusiveAmount.value).formatMoney();
	    document.getElementById('taxInclusiveAmount').innerHTML=Number(monetaryTotal.taxInclusiveAmount.value).formatMoney();
	    document.getElementById('payableAmount').innerHTML=Number(monetaryTotal.payableAmount.value).formatMoney();
    }
    

  
    $("#vergiGrid tr").remove();
    var vergiGrid=document.getElementById('vergiGrid');
    if(doc.taxTotal){
	    doc.taxTotal.forEach(function(e){
	        var newRow=vergiGrid.insertRow(vergiGrid.rows.length);
	        newRow.classList.add('text-nowrap');
	        var vergi='';
	        if(e.taxSubtotal)
	            if(e.taxSubtotal.length>0){
	                if(e.taxSubtotal[0].taxCategory.taxScheme.taxTypeCode.value=='9015'){
	                    vergi = 'Kdv %' + e.taxSubtotal[0].percent.value;
	                }else{
	                    vergi = e.taxSubtotal[0].taxCategory.taxScheme.name.value + ' %' + e.taxSubtotal[0].percent.value;
	                }
	            }
	        newRow.insertCell(0).innerHTML=vergi;
	        var cell1=newRow.insertCell(1);
	        cell1.classList.add('text-right');
	        cell1.innerHTML=Number(e.taxSubtotal[0].taxAmount.value).formatMoney();
	    });
	}

    if(doc.withholdingTaxTotal){
	    if(doc.withholdingTaxTotal.length>0){
	        doc.withholdingTaxTotal.forEach(function(e){
	            var newRow=vergiGrid.insertRow(vergiGrid.rows.length);
	            newRow.classList.add('text-nowrap');
	            var vergi='';
	            if(e.taxSubtotal)
	                if(e.taxSubtotal.length>0){
	                    vergi = 'Tevkifat %' + e.taxSubtotal[0].percent.value;
	                }
	            newRow.insertCell(0).innerHTML=vergi;
	            var cell1=newRow.insertCell(1);
	            cell1.classList.add('text-right');
	            cell1.innerHTML=Number(e.taxSubtotal[0].taxAmount.value).formatMoney();
	        });
	    }
    }
    
    $("#iskontoGrid tr").remove();
    var iskontoGrid=document.getElementById('iskontoGrid');

    if(doc.allowanceCharge){
	    doc.allowanceCharge.forEach(function(e){
	        var newRow=iskontoGrid.insertRow(iskontoGrid.rows.length);
	        newRow.classList.add('text-nowrap');
	        var sbuf='';
	        if(e.chargeIndicator.value){
	            sbuf='Artirim';
	        }else{
	            sbuf='Indirim';
	        }
	        if(e.multiplierFactorNumeric.value<1){
	            sbuf +=' %' + (e.multiplierFactorNumeric.value*100);
	        }else{
	            sbuf +=' %' + e.multiplierFactorNumeric.value;
	        }

	        newRow.insertCell(0).innerHTML=sbuf;
	        var cell1=newRow.insertCell(1);
	        cell1.classList.add('text-right');
	        cell1.innerHTML=Number(e.amount.value).formatMoney();
	        newRow.insertCell(2).innerHTML=e.allowanceChargeReason.value;
	    });
	}
}

var bCalculating=false;

function calculateDocLine(){
    if(bCalculating) return;
    bCalculating=true;
    try{
        var kdvOran=Number($('#docLine-KDV-percent').val());
        var tevkifatOran=Number($('#docLine-Tevkifat-percent').val());
        var miktar=Number($('#docLine-quantity').val());
        var fiyat=Number($('#docLine-price-priceAmount').val());
        var kdvAmount=Math.round(100*kdvOran*miktar*fiyat/100)/100;
        var tevkifatAmount=Math.round(100*tevkifatOran*kdvAmount/100)/100;
        var lineExtensionAmount=Math.round(100*miktar*fiyat)/100;
        var taxInclusiveAmount=lineExtensionAmount + kdvAmount - tevkifatAmount;
        //if(!isNaN(miktar) && !isNaN(fiyat)  && !isNaN(kdvOran)) 
        $('#docLine-KDV-amount').val(kdvAmount.formatMoney());
        $('#docLine-Tevkifat-amount').val(tevkifatAmount.formatMoney());
        $('#docLine-lineExtensionAmount').val(lineExtensionAmount.formatMoney());
        $('#docLine-taxInclusiveAmount').val(taxInclusiveAmount.formatMoney());
        if(kdvOran<=0){
            $('#kdvMuafiyetSebebi').show();
        }else{
            $('#kdvMuafiyetSebebi').hide();
        }
    }catch(tryErr){

    }

    bCalculating=false;
    calculateDocLineAllowanceRate();
    calculateDocLineChargeRate();
}
function calculateDocLineAllowanceRate(){

    if(bCalculating) return;
    bCalculating=true;
    try{
        var miktar=Number($('#docLine-quantity').val());
        var fiyat=Number($('#docLine-price-priceAmount').val());
        var lineExtensionAmount=Math.round(100*miktar*fiyat)/100;
        var iskontoToplam=0;

        var iskontoRows=document.getElementById('iskontoRows');
        for(var i=0;i<iskontoRows.getElementsByClassName('row').length;i++){
            var row=iskontoRows.getElementsByClassName('row')[i];
            
            var oran=Number(row.getElementsByClassName('satirIskontoOran')[0].value);
            var iskTutar=Math.round((lineExtensionAmount-iskontoToplam)*oran)/100;
            row.getElementsByClassName('satirIskontoTutar')[0].value=iskTutar;
            iskontoToplam+=iskTutar;
        }
        
    }catch(tryErr){

    }

    bCalculating=false;
}

function calculateDocLineAllowanceAmount(){
    if(bCalculating) return;
    bCalculating=true;
    try{
        var miktar=Number($('#docLine-quantity').val());
        var fiyat=Number($('#docLine-price-priceAmount').val());
        var lineExtensionAmount=Math.round(100*miktar*fiyat)/100;
        var iskontoToplam=0;

        var iskontoRows=document.getElementById('iskontoRows');
        
        for(var i=0;i<iskontoRows.getElementsByClassName('row').length;i++){
            var row=iskontoRows.getElementsByClassName('row')[i];
            
            var iskTutar=Number(row.getElementsByClassName('satirIskontoTutar')[0].value);

            var oran=0;
            if((lineExtensionAmount-iskontoToplam)>0){
                oran=Math.round(100*100* iskTutar/(lineExtensionAmount-iskontoToplam))/100;
            }
            
            row.getElementsByClassName('satirIskontoOran')[0].value=oran;
            iskontoToplam+=iskTutar;
            
        }
        
    }catch(tryErr){

    }

    bCalculating=false;
}

 function calculateDocLineChargeRate(){

    if(bCalculating) return;
    bCalculating=true;
    try{
        var miktar=Number($('#docLine-quantity').val());
        var fiyat=Number($('#docLine-price-priceAmount').val());
        var lineExtensionAmount=Math.round(100*miktar*fiyat)/100;
        var artirimToplam=0;

        var artirimRows=document.getElementById('artirimRows');
        for(var i=0;i<artirimRows.getElementsByClassName('row').length;i++){
            var row=artirimRows.getElementsByClassName('row')[i];
            
            var oran=Number(row.getElementsByClassName('satirArtirimOran')[0].value);
            var artirimTutar=Math.round(lineExtensionAmount*oran)/100;
            row.getElementsByClassName('satirArtirimTutar')[0].value=artirimTutar;
            artirimToplam+=artirimTutar;
        }
        
    }catch(tryErr){

    }

    bCalculating=false;
}

function calculateDocLineChargeAmount(){
    if(bCalculating) return;
    bCalculating=true;
    try{
        var miktar=Number($('#docLine-quantity').val());
        var fiyat=Number($('#docLine-price-priceAmount').val());
        var lineExtensionAmount=Math.round(100*miktar*fiyat)/100;
        var artirimToplam=0;

        var artirimRows=document.getElementById('artirimRows');
        
        for(var i=0;i<artirimRows.getElementsByClassName('row').length;i++){
            var row=artirimRows.getElementsByClassName('row')[i];
            
            var artirimTutar=Number(row.getElementsByClassName('satirArtirimTutar')[0].value);

            var oran=0;
            if((lineExtensionAmount)>0){
                oran=100*artirimTutar/lineExtensionAmount;
            }
            
            row.getElementsByClassName('satirArtirimOran')[0].value=oran;
            artirimToplam+=artirimTutar;
            
        }
        
    }catch(tryErr){

    }

    bCalculating=false;
}

function docLineItemNameAutoComplete(){
    var q=getAllUrlParams();

    $('#docLine-item-name').autocomplete({
        source:function(request,response){
        	//$("#docLine-item-name").val(''); 
            $("#docLine-item-id").val(''); 
            $("#docLine-item-itemType").val(''); 
            $.ajax({
                url:'/dbapi/items?itemType=all&name=' +  encodeURIComponent(request.term) + '&db=' + q.db + '&sid=' + q.sid,
                type:'GET',
                dataType: 'json',
                success: function(result) {
                        if(result.success){
                            var dizi=[];
                            for(var i=0;i<result.data.docs.length;i++){
                                var item=result.data.docs[i];
                                
                                dizi.push({name:item.name.value, label:(getItemTypeName(item.itemType) + ' - ' + item.name.value),value:item._id,itemType:item.itemType});
                            }
                            if(dizi.length>0){
                            	$('#cbNewItemPanel').hide();
                            }else{
                            	$('#cbNewItemPanel').show();
                            }
                            response(dizi);
                        }
                    },
                error:function(err){
                    console.error('err:',err);
                }
            });
        },
        select: function (event, ui) {
                $("#docLine-item-name").val(ui.item.name); 
                $("#docLine-item-id").val(ui.item.value); 
                $("#docLine-item-itemType").val(ui.item.itemType); 
                return false;
            }
    });
}



$(document).ready(function(){
	
	formOrjinal=document.getElementById('docLineModal').cloneNode(true);
	
	
});
