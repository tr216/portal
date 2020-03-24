var formOrjinal;

function editLine(index){
	var old=document.getElementById('orderLineModal');
	old.parentNode.replaceChild(formOrjinal.cloneNode(true),old);

	var btnSave=document.getElementById('orderLineModalSaveButton');
	btnSave.href='javascript:saveOrderLine(' + index + ')';
	var line=order.orderLine[index];
	line=Object.assign({}, clone(dbType.orderLineType),line);
	orderLinePackageGrid_clear();
	$('#orderLinePackageGrid-Quantity').on('keyup',function(e){
		if((e.keyCode ? e.keyCode : e.which)=='13'){
			orderLinePackageGrid_AddRow();
		}
	});
	
	$('#orderLineModalLabel').text('Fatura Satir: #' + line.ID.value);

	$('#orderLine-item-name').val(line.item.name.value);
	
	$('#orderLine-orderedQuantity').val(line.orderedQuantity.value);
	$('#orderLine-orderedQuantity-unitCode').val(line.orderedQuantity.attr.unitCode);
	$('#orderLine-price-priceAmount').val(line.price.priceAmount.value);

	if(line.taxTotal)
		if(line.taxTotal.taxSubtotal)
			if(line.taxTotal.taxSubtotal.length>0){
				$('#orderLine-taxExemptionReasonCode').val(line.taxTotal.taxSubtotal[0].taxCategory.taxExemptionReasonCode.value);
				
				$('#orderLine-KDV-percent').val(line.taxTotal.taxSubtotal[0].percent.value);
				$('#orderLine-KDV-amount').val(line.taxTotal.taxSubtotal[0].taxAmount.value);
			}
	if(line.withholdingTaxTotal)
		if(line.withholdingTaxTotal.length>0)
			if(line.withholdingTaxTotal[0].taxSubtotal.length>0){
				$('#orderLine-Tevkifat-percent').val(line.withholdingTaxTotal[0].taxSubtotal[0].percent.value);
				$('#orderLine-Tevkifat-amount').val(line.withholdingTaxTotal[0].taxSubtotal[0].taxAmount.value);
				$('#orderLine-tevkifat-taxTypeCode').val(line.withholdingTaxTotal[0].taxSubtotal[0].taxCategory.taxScheme.taxTypeCode.value);
				if(line.withholdingTaxTotal[0].taxSubtotal[0].percent.value>0 || line.withholdingTaxTotal[0].taxSubtotal[0].taxAmount.value>0){
					$('#cbTevkifatPanel').prop('checked',true);
					//$('#cbTevkifatPanel').prop('checked',true);
					$('#tevkifatPanel').show();
					
				}
			}



	$('#orderLine-lineExtensionAmount').val(line.lineExtensionAmount.value);
	$('#orderLine-item-sellersItemIdentification').val(line.item.sellersItemIdentification.ID.value);
	$('#orderLine-item-buyersItemIdentification').val(line.item.buyersItemIdentification.ID.value);
	$('#orderLine-item-manufacturersItemIdentification').val(line.item.manufacturersItemIdentification.ID.value);
	$('#orderLine-item-brandName').val(line.item.brandName.value);
	$('#orderLine-item-modelName').val(line.item.modelName.value);
	$('#orderLine-item-keyword').val(line.item.keyword.value);
	$('#orderLine-item-description').val(line.item.description.value);

	if(line.item.originCountry) $('#orderLine-originCountry-identificationCode').val(line.item.originCountry.identificationCode.value);
	
	if(line.item.commodityClassification)
		if(line.item.commodityClassification.length>0)
			$('#orderLine-item-itemClassificationCode').val(line.item.commodityClassification[0].itemClassificationCode.value);

	

	
	
	if(line.note)
		if(line.note.length>0){
			var notlar='';
			line.note.forEach((e)=>{
				notlar +=e.value + '\r\n';
			})
			$('#orderLine-notes').val(notlar);
		}
	

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
					$('#orderLine-deliveryTerms').val(line.delivery[0].deliveryTerms[0].ID.value);
			if(line.delivery[0].shipment){
				if(line.delivery[0].shipment.goodsItem)
					if(line.delivery[0].shipment.goodsItem.length>0)
						$('#orderLine-GTIPNO').val(line.delivery[0].shipment.goodsItem[0].requiredCustomsId.value);
				if(line.delivery[0].shipment.shipmentStage)
					if(line.delivery[0].shipment.shipmentStage.length>0)
						$('#orderLine-transportModeCode').val(line.delivery[0].shipment.shipmentStage[0].transportModeCode.value);
				if(line.delivery[0].shipment.transportHandlingUnit)
					if(line.delivery[0].shipment.transportHandlingUnit.length>0)
						if(line.delivery[0].shipment.transportHandlingUnit[0].actualPackage.length>0){
							line.delivery[0].shipment.transportHandlingUnit[0].actualPackage.forEach((e)=>{
								orderLinePackageGrid_AddRow({quantity:e.quantity.value, packagingTypeCode:e.packagingTypeCode.value});
							})
					}
			}
		}
	}
	if((line.item._id || '')!=''){
		$('#cbNewItemPanel').hide();
	}else{
		$('#cbNewItemPanel').show();
	}
	calculateOrderLine();
	orderLineItemNameAutoComplete();
	$('#orderLineModal').modal('show');
}

var iskontoCount=1;
var artirimCount=1;

function saveOrderLine(index){
	if(index<0) return;
	$('#orderLineModal').modal('hide');

	var line=Object.assign({}, clone(dbType.orderLineType),order.orderLine[index]);
	line.item.name.value=$('#orderLine-item-name').val();
	
	line.orderedQuantity.value=$('#orderLine-orderedQuantity').val();
	line.orderedQuantity.attr.unitCode=$('#orderLine-orderedQuantity-unitCode').val();
	line.price.priceAmount.value=$('#orderLine-price-priceAmount').val();

	line.lineExtensionAmount.value=line.orderedQuantity.value * line.price.priceAmount.value;
	line.taxTotal=clone(dbType.taxTotalType);
	
	if(Number($('#orderLine-KDV-amount').val())>0 || ($('#orderLine-taxExemptionReasonCode').val() || '')!=''){
		

		line.taxTotal['taxAmount']={value:Number($('#orderLine-KDV-amount').val())};
		
		line.taxTotal.taxSubtotal[0].percent.value=Number($('#orderLine-KDV-percent').val());
		line.taxTotal.taxSubtotal[0].taxAmount.value=Number($('#orderLine-KDV-amount').val());
		line.taxTotal.taxSubtotal[0].taxableAmount.value=line.lineExtensionAmount.value;
		line.taxTotal.taxSubtotal[0].calculationSequenceNumeric.value=1;
		line.taxTotal.taxSubtotal[0].taxCategory.taxExemptionReasonCode.value=($('#orderLine-taxExemptionReasonCode').val() || '');
		line.taxTotal.taxSubtotal[0].taxCategory.taxExemptionReason.value=($('#orderLine-taxExemptionReasonCode option:selected').text() || '');
		line.taxTotal.taxSubtotal[0].taxCategory.name.value='KDV';
		line.taxTotal.taxSubtotal[0].taxCategory.taxScheme.name.value='Katma Değer Vergisi';
		line.taxTotal.taxSubtotal[0].taxCategory.taxScheme.taxTypeCode.value='9015';

	}
	
	line.withholdingTaxTotal=[];
	if(Number($('#orderLine-Tevkifat-percent').val())>0 || Number($('#orderLine-Tevkifat-amount').val())>0 || ($('#orderLine-tevkifat-taxTypeCode').val() || '')!=''){
		line.withholdingTaxTotal=[clone(dbType.taxTotalType)];

		line.withholdingTaxTotal[0].taxAmount.value=Number($('#orderLine-Tevkifat-amount').val());
		line.withholdingTaxTotal[0].taxSubtotal[0].percent.value=Number($('#orderLine-Tevkifat-percent').val());
		line.withholdingTaxTotal[0].taxSubtotal[0].taxAmount.value=Number($('#orderLine-Tevkifat-amount').val());
		line.withholdingTaxTotal[0].taxSubtotal[0].taxableAmount.value=line.lineExtensionAmount.value;
		line.withholdingTaxTotal[0].taxSubtotal[0].calculationSequenceNumeric.value=1;
		line.withholdingTaxTotal[0].taxSubtotal[0].taxCategory.taxExemptionReasonCode.value='';
		line.withholdingTaxTotal[0].taxSubtotal[0].taxCategory.taxExemptionReason.value='';
		line.withholdingTaxTotal[0].taxSubtotal[0].taxCategory.name.value='TEVKIFAT';
		line.withholdingTaxTotal[0].taxSubtotal[0].taxCategory.taxScheme.name.value='Tevkif edilen Kdv';
		line.withholdingTaxTotal[0].taxSubtotal[0].taxCategory.taxScheme.taxTypeCode.value=($('#orderLine-tevkifat-taxTypeCode').val() || '');

	}
	line.item.sellersItemIdentification.ID.value=$('#orderLine-item-sellersItemIdentification').val().trim();
	line.item.buyersItemIdentification.ID.value=$('#orderLine-item-buyersItemIdentification').val().trim();
	line.item.manufacturersItemIdentification.ID.value=$('#orderLine-item-manufacturersItemIdentification').val().trim();
	line.item.brandName.value=$('#orderLine-item-brandName').val();
	line.item.modelName.value=$('#orderLine-item-modelName').val();
	line.item.keyword.value=$('#orderLine-item-keyword').val();
	line.item.description.value=$('#orderLine-item-description').val();
	line.item.originCountry.identificationCode.value= $('#orderLine-originCountry-identificationCode').val();

	line.item.commodityClassification=[{ itemClassificationCode:{ value:$('#orderLine-item-itemClassificationCode').val()}}];

	
	
	line.note=[];
	if($('#orderLine-notes').val().trim()!=''){
		var notSatirlari=$('#orderLine-notes').val().trim().split('\n');
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
	var table1=document.getElementById('orderLinePackageGridBody');
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
			if(!isNaN((document.getElementById('orderLinePackageGrid-Quantity').value)) && document.getElementById('orderLinePackageGrid-packagingTypeCode').value!=''){
				if(Number(document.getElementById('orderLinePackageGrid-Quantity').value)>0){
					var obj={
						quantity:Number(document.getElementById('orderLinePackageGrid-Quantity').value),
						packagingTypeCode:document.getElementById('orderLinePackageGrid-packagingTypeCode').value
					}
					ihracatPaketleri.push(obj);
				}
			}
		}
	}
	line.delivery=[]

	if(ihracatPaketleri.length>0 || $('#orderLine-deliveryTerms').val().trim()!='' || $('#orderLine-GTIPNO').val().trim()!='' || $('#orderLine-transportModeCode').val().trim()!=''){
		line.delivery=[clone(dbType.deliveryType)];
		line.delivery[0].deliveryTerms=[{ID:{ value:$('#orderLine-deliveryTerms').val().trim()}}];

		line.delivery[0].shipment.goodsItem=[{requiredCustomsId:{value:$('#orderLine-GTIPNO').val().trim()}}];
		line.delivery[0].shipment.shipmentStage=[{transportModeCode:{value:$('#orderLine-transportModeCode').val().trim()}}];
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
	order.orderLine[index]=line;
	if($('#cbNewItem').prop('checked')){
		
		var newItem=Object.assign({}, clone(dbType.itemType),line.item);

		newItem['itemType']=$('#orderLine-new-itemType').val();
		
	    $.ajax({
	        url:'/dbapi/items?db=' + db + '&sid=' + sid,
	        data:newItem,
	        type:'POST',
	        success:function(result){
	            if(result.success){
	            	console.log(result);
	            	order.orderLine[index].item['_id']=result.data._id;
	                
	            }else{
	            	alert('Hata:' + result.error.message);
	            }
	            saveOrder((err)=>{
			    	if(!err){
			    		reloadLineGrid();
			    	}else{
			    		$('#orderLineModal').modal('show');
			    		alert('Hata:' + err.message);
			    	}
			    });
	        }
	    });
	}else{
		saveOrder((err)=>{
	    	if(!err){
	    		reloadLineGrid();
	    		
	    	}else{
	    		$('#orderLineModal').modal('show');
	    		alert('Hata:' + err.message);
	    	}
	    });
	}
    

}

function saveOrder(callback){
	order.eIntegrator=$("select[name='eIntegrator']").val();
	order.ID={ value:$("input[name='ID[value]']").val()}
    order.issueDate={ value:$("input[name='issueDate[value]']").val()}
    order.issueTime={ value:$("input[name='issueTime[value]']").val()}
    order.profileId={ value:$("select[name='profileId[value]']").val()}
    order.orderTypeCode={ value:$("select[name='orderTypeCode[value]']").val()}
    order.uuid={ value:$("input[name='orderTypeCode[value]']").val()}
    order.localDocumentId=$("input[name='localDocumentId']").val();
    order.documentCurrencyCode={ value:$("select[name='documentCurrencyCode[value]']").val()}
    order.pricingExchangeRate.calculationRate={ value:$("input[name='pricingExchangeRate[calculationRate][value]']").val()}
    var party={}
    if(order.ioType==0){
        party=order.buyerCustomerParty.party;
    }else{
        party=order.sellerSupplierParty.party;
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


    if(order.ioType==0){
        order.buyerCustomerParty.party=party;
    }else{
        order.sellerSupplierParty.party=party;
    }

    var url;
    var type='PUT';
    if(ioType==0){
		url='/dbapi/order/saveOutboxOrder/' + _id + '?db=' + db + '&sid=' + sid;
	}else{
		url='/dbapi/order/saveInboxOrder/' + _id + '?db=' + db + '&sid=' + sid;
	}

	 
	if((order._id || '')=='') type='POST';

	
    $.ajax({
        url:url,
        data:order,
        type:type,
        success:function(result){
            if(result.success){
            	order=result.data;
            	reloadTotals();
            	
                callback(null);
            }else{
            	console.log(result.error);
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

function orderLinePackageGrid_clear(){
	var table1=document.getElementById('orderLinePackageGridBody');
	var rowCount=table1.rows.length;
	for(var i=0;i<rowCount-1;i++){
		orderLinePackageGrid_RemoveRow(0);
	}
	document.getElementById('orderLinePackageGrid-ID').value=1;
	document.getElementById('orderLinePackageGrid-Quantity').value='';
	document.getElementById('orderLinePackageGrid-packagingTypeCode').value='';
}

function orderLinePackageGrid_AddRow(obj={quantity:0,packagingTypeCode:''}){
	if(obj.quantity>0 && obj.packagingTypeCode!=''){
		document.getElementById('orderLinePackageGrid-Quantity').value=obj.quantity;
		document.getElementById('orderLinePackageGrid-packagingTypeCode').value=obj.packagingTypeCode;
	}else{
		if(isNaN(document.getElementById('orderLinePackageGrid-Quantity').value) || document.getElementById('orderLinePackageGrid-packagingTypeCode').value=='') return;
		if(Number(document.getElementById('orderLinePackageGrid-Quantity').value)<=0) return;
	}
	
	var table1=document.getElementById('orderLinePackageGridBody');
	var newRow=table1.insertRow(table1.rows.length-1);
	newRow.insertCell(0).innerHTML=table1.rows.length-1;
	newRow.insertCell(1).innerHTML=Number(document.getElementById('orderLinePackageGrid-Quantity').value);
	newRow.insertCell(2).innerHTML=document.getElementById('orderLinePackageGrid-packagingTypeCode').value;
	newRow.insertCell(3).innerHTML='<a class="btn btn-danger btn-sm fas fa-minus-square" href="javascript:orderLinePackageGrid_RemoveRow(' + (table1.rows.length-2) + ')" title="Paket Sil"></a>';
	document.getElementById('orderLinePackageGrid-ID').value=table1.rows.length;
	document.getElementById('orderLinePackageGrid-Quantity').value='';
	document.getElementById('orderLinePackageGrid-Quantity').focus();
}

function orderLinePackageGrid_RemoveRow(index){
	var table1=document.getElementById('orderLinePackageGridBody');
	if(index<0 || index>=table1.rows.length-1) return;
	table1.deleteRow(index);
	for(var i=0;i<table1.rows.length-1;i++){
		table1.rows[i].cells[0].innerHTML=(i+1).toString();
	}
	document.getElementById('orderLinePackageGrid-ID').value=table1.rows.length;
}

function addNewLine(){
	var line=clone(dbType.orderLineType);
	line.ID.value=order.orderLine.length+1;
	order.orderLine.push(line);
	editLine(order.orderLine.length-1);
}

function removeLine(index){
        if(index<0 || index>order.orderLine.length-1) return;
		if(!confirm('Satiri silmek istediginizden emin misiniz?')) return;
        index>order.orderLine.splice(index,1);
		saveOrder((err)=>{
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
    
    if(!order) return;
    if(order.orderLine){
        order.orderLine.forEach((line,index)=>{
            var newRow=lineGrid.insertRow(lineGrid.rows.length);
            newRow.classList.add('text-nowrap');
            newRow.insertCell(0).innerHTML='<input type="hidden" class="orderLine" id="orderLine[' + index + ']" name="orderLine[' + index + ']" value="' + (JSON.stringify(line)) + '">';
            newRow.insertCell(1).innerHTML=line.ID.value;
            
            var itemName=line.item.name.value + '<br>';
            itemName +='<span class="text-primary">';
            if(line.item.buyersItemIdentification.ID.value!='') itemName +=line.item.buyersItemIdentification.ID.value + ' ';
            if(line.item.sellersItemIdentification.ID.value!='') itemName +=line.item.sellersItemIdentification.ID.value + ' ';
            if(line.item.manufacturersItemIdentification.ID.value!='') itemName +=line.item.manufacturersItemIdentification.ID.value + ' ';
            itemName +='</span>';
            newRow.insertCell(2).innerHTML = itemName;

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

            var cell5=newRow.insertCell(5);
            cell5.classList.add('text-right');
            cell5.innerHTML=line.price.priceAmount.value;
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
            cell6.innerHTML=iskontoOran;

            var cell7=newRow.insertCell(7);
            cell7.classList.add('text-right');
            cell7.innerHTML=iskontoTutar;

            var cell8=newRow.insertCell(8);
            cell8.classList.add('text-right');
            cell8.innerHTML=line.lineExtensionAmount.value.formatMoney();

            var kdvOrani='', kdvTutar=''; 
            var kdvDahilTutar=line.lineExtensionAmount.value;
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
            cell9.innerHTML=kdvOrani;

            var cell10=newRow.insertCell(10);
            cell10.classList.add('text-right');
            cell10.innerHTML=kdvTutar;

            var cell11=newRow.insertCell(11);
            cell11.classList.add('text-right');
            cell11.innerHTML=kdvDahilTutar.formatMoney();

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
}

function reloadTotals(){

    if(!order) return;
    if(!order.anticipatedMonetaryTotal) return;
    document.getElementById('lineExtensionAmount').innerHTML=Number(order.anticipatedMonetaryTotal.lineExtensionAmount.value).formatMoney();
    document.getElementById('allowanceTotalAmount').innerHTML=Number(order.anticipatedMonetaryTotal.allowanceTotalAmount.value).formatMoney();
    document.getElementById('chargeTotalAmount').innerHTML=Number(order.anticipatedMonetaryTotal.chargeTotalAmount.value).formatMoney();
    document.getElementById('taxExclusiveAmount').innerHTML=Number(order.anticipatedMonetaryTotal.taxExclusiveAmount.value).formatMoney();
    document.getElementById('taxInclusiveAmount').innerHTML=Number(order.anticipatedMonetaryTotal.taxInclusiveAmount.value).formatMoney();
    document.getElementById('payableAmount').innerHTML=Number(order.anticipatedMonetaryTotal.payableAmount.value).formatMoney();

  
    $("#vergiGrid tr").remove();
    var vergiGrid=document.getElementById('vergiGrid');

    order.taxTotal.forEach(function(e){
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
    if(order.withholdingTaxTotal)
    if(order.withholdingTaxTotal.length>0){
        order.withholdingTaxTotal.forEach(function(e){
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
    
    
    $("#iskontoGrid tr").remove();
    var iskontoGrid=document.getElementById('iskontoGrid');

    order.allowanceCharge.forEach(function(e){
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

var bCalculating=false;

function calculateOrderLine(){
    if(bCalculating) return;
    bCalculating=true;
    try{
        var kdvOran=Number($('#orderLine-KDV-percent').val());
        var tevkifatOran=Number($('#orderLine-Tevkifat-percent').val());
        var miktar=Number($('#orderLine-orderedQuantity').val());
        var fiyat=Number($('#orderLine-price-priceAmount').val());
        var kdvAmount=Math.floor(kdvOran*miktar*fiyat/100);
        var tevkifatAmount=Math.floor(100*tevkifatOran*kdvAmount/100)/100;
        var lineExtensionAmount=Math.floor(100*miktar*fiyat)/100;
        var taxInclusiveAmount=lineExtensionAmount + kdvAmount - tevkifatAmount;
        //if(!isNaN(miktar) && !isNaN(fiyat)  && !isNaN(kdvOran)) 
        $('#orderLine-KDV-amount').val(kdvAmount.formatMoney());
        $('#orderLine-Tevkifat-amount').val(tevkifatAmount.formatMoney());
        $('#orderLine-lineExtensionAmount').val(lineExtensionAmount.formatMoney());
        $('#orderLine-taxInclusiveAmount').val(taxInclusiveAmount.formatMoney());
        if(kdvOran<=0){
            $('#kdvMuafiyetSebebi').show();
        }else{
            $('#kdvMuafiyetSebebi').hide();
        }
    }catch(tryErr){

    }

    bCalculating=false;
}
function calculateOrderLineAllowanceRate(){

    if(bCalculating) return;
    bCalculating=true;
    try{
        var miktar=Number($('#orderLine-orderedQuantity').val());
        var fiyat=Number($('#orderLine-price-priceAmount').val());
        var lineExtensionAmount=Math.floor(100*miktar*fiyat)/100;
        var iskontoToplam=0;

        var iskontoRows=document.getElementById('iskontoRows');
        for(var i=0;i<iskontoRows.getElementsByClassName('row').length;i++){
            var row=iskontoRows.getElementsByClassName('row')[i];
            
            var oran=Number(row.getElementsByClassName('satirIskontoOran')[0].value);
            var iskTutar=Math.floor((lineExtensionAmount-iskontoToplam)*oran)/100;
            row.getElementsByClassName('satirIskontoTutar')[0].value=iskTutar;
            iskontoToplam+=iskTutar;
        }
        
    }catch(tryErr){

    }

    bCalculating=false;
}

function calculateOrderLineAllowanceAmount(){
    if(bCalculating) return;
    bCalculating=true;
    try{
        var miktar=Number($('#orderLine-orderedQuantity').val());
        var fiyat=Number($('#orderLine-price-priceAmount').val());
        var lineExtensionAmount=Math.floor(100*miktar*fiyat)/100;
        var iskontoToplam=0;

        var iskontoRows=document.getElementById('iskontoRows');
        
        for(var i=0;i<iskontoRows.getElementsByClassName('row').length;i++){
            var row=iskontoRows.getElementsByClassName('row')[i];
            
            var iskTutar=Number(row.getElementsByClassName('satirIskontoTutar')[0].value);

            var oran=0;
            if((lineExtensionAmount-iskontoToplam)>0){
                oran=Math.floor(100*100* iskTutar/(lineExtensionAmount-iskontoToplam))/100;
            }
            
            row.getElementsByClassName('satirIskontoOran')[0].value=oran;
            iskontoToplam+=iskTutar;
            
        }
        
    }catch(tryErr){

    }

    bCalculating=false;
}

 function calculateOrderLineChargeRate(){

    if(bCalculating) return;
    bCalculating=true;
    try{
        var miktar=Number($('#orderLine-orderedQuantity').val());
        var fiyat=Number($('#orderLine-price-priceAmount').val());
        var lineExtensionAmount=Math.floor(100*miktar*fiyat)/100;
        var artirimToplam=0;

        var artirimRows=document.getElementById('artirimRows');
        for(var i=0;i<artirimRows.getElementsByClassName('row').length;i++){
            var row=artirimRows.getElementsByClassName('row')[i];
            
            var oran=Number(row.getElementsByClassName('satirArtirimOran')[0].value);
            var artirimTutar=Math.floor(lineExtensionAmount*oran)/100;
            row.getElementsByClassName('satirArtirimTutar')[0].value=artirimTutar;
            artirimToplam+=artirimTutar;
        }
        
    }catch(tryErr){

    }

    bCalculating=false;
}

function calculateOrderLineChargeAmount(){
    if(bCalculating) return;
    bCalculating=true;
    try{
        var miktar=Number($('#orderLine-orderedQuantity').val());
        var fiyat=Number($('#orderLine-price-priceAmount').val());
        var lineExtensionAmount=Math.floor(100*miktar*fiyat)/100;
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

function orderLineItemNameAutoComplete(){
    var q=getAllUrlParams();

    $('#orderLine-item-name').autocomplete({
        source:function(request,response){
                
                $.ajax({
                url:'/dbapi/items?itemType=all&name=' +  encodeURIComponent(request.term) + '&db=' + q.db + '&sid=' + q.sid,
                type:'GET',
                dataType: 'json',
                success: function(result) {
                        if(result.success){
                            var dizi=[];
                            for(var i=0;i<result.data.docs.length;i++){
                                var item=result.data.docs[i];
                                
                                dizi.push({name:item.name.value, label:(getItemTypeName(item.itemType) + ' - ' + item.name.value),value:item._id});
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
                $("#orderLine-item-name").val(ui.item.name); 
                $("#orderLine-item-id").val(ui.item.value); 
                return false;
            }
    });
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

$(document).ready(function(){
	
	formOrjinal=document.getElementById('orderLineModal').cloneNode(true);
	
	
});
