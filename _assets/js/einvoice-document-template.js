(function(exports) { 
const currencytType={ value:0, attr:{ currencyID:''}}
const quantityType={ value:0, attr:{ unitCode:''}}
const IDType={ value:0, attr:{ unitCode:''}}
const valueType={value:''}
const numberValueType={ value:0}


const countryType={
	identificationCode:valueType,
	name:valueType
}
const partyIdentificationType={ID:{value:'', attr:{schemeID:'VKN'}}}


const partyType={
	websiteURI:valueType,
	partyIdentification:[],
	partyName:{name:valueType},
	postalAddress:{
		room:valueType,
		streetName:valueType,
		blockName:valueType,
		buildingName:valueType,
		buildingNumber:valueType,
		citySubdivisionName:valueType,
		cityName:valueType,
		postalZone:valueType,
		postbox:valueType,
		region:valueType,
		district:valueType,
		country:countryType
	},
	partyTaxScheme:{
		taxScheme:{
			name:valueType,
			taxTypeCode:valueType
		}
	},
	contact:{
		telephone:valueType,
		telefax:valueType,
		electronicMail:valueType
	},
	person:{
		firstName:valueType,
		middleName:valueType,
		familyName:valueType,
		nameSuffix:valueType,
		title:valueType
	}
}

const exchangeRateType={ 
	sourceCurrencyCode  :valueType,
	targetCurrencyCode  :{value:'TRY'},
	calculationRate   :{value:1},
	date   :{ value:(new Date()).yyyymmdd()}
}

const actualPackageType={
	ID:valueType,
	quantity:quantityType,
	packagingTypeCode:valueType
}

const itemType={

	additionalItemIdentification:[],
	brandName:valueType,
	buyersItemIdentification:{ID:valueType},
	commodityClassification:[
		{ 
			itemClassificationCode:valueType
		}
	],
	description:valueType,
	itemInstance:[],
	keyword:valueType,
	manufacturersItemIdentification:{ID:valueType},
	modelName:valueType,
	name:valueType,
	sellersItemIdentification:{ID:valueType},
	originCountry:countryType
}

function eInvoiceDocumentTemplate(){
	return {
		invoice:{
			eIntegrator:'',
			profileId : valueType,
			ID : valueType,
			uuid : valueType,
			issueDate:{ value:(new Date()).yyyymmdd()},
			issueTime:{value : (new Date()).hhmmss()},
			invoiceTypeCode:valueType,
			note:[],  
			documentCurrencyCode:valueType,
			taxCurrencyCode:valueType,
			pricingCurrencyCode:valueType,
			paymentCurrencyCode:valueType,
			paymentAlternativeCurrencyCode:valueType,
			lineCountNumeric:numberValueType,
			additionalDocumentReference:{
				ID:valueType,
				issueDate:valueType,
				documentTypeCode:{value:'XSLT'},
				documentType:valueType,
				documentDescription:[],
				attachment: {
					embeddedDocumentBinaryObject: {
						value:'', 
						attr: {
							mimeCode:'application/xml',
							encodingCode:'Base64',
							characterSetCode:'UTF-8',
							filename: 'xslt_sablon.xslt'
						}
					}
				}
			},
			orderReference:[], // {ID:valueType,issueDate:valueType}
			despatchDocumentReference:[], // {ID:valueType,issueDate:valueType}
			accountingSupplierParty:{
				party:partyType
			},
			accountingCustomerParty:{
				party:partyType
			},
			pricingExchangeRate:exchangeRateType,
			paymentExchangeRate:exchangeRateType,
			taxTotal  : [],
			withholdingTaxTotal  : [],
			allowanceCharge:[],
			legalMonetaryTotal: { 
				lineExtensionAmount  :currencytType,
				taxExclusiveAmount  :currencytType,
				taxInclusiveAmount   :currencytType,
				allowanceTotalAmount   :currencytType,
				chargeTotalAmount   :currencytType,
				payableRoundingAmount   :currencytType,
				payableAmount    :currencytType
			},
			invoiceLine:[],
			localDocumentId:''
		},
		taxTotal:{
			taxAmount :currencytType,
			taxSubtotal:[{
				taxableAmount:currencytType,
				taxAmount :currencytType,
				percent :numberValueType,
				calculationSequenceNumeric :numberValueType,
				taxCategory :{
					name:valueType,
					taxScheme:{
						ID:valueType,
						name:valueType,
						taxTypeCode:valueType
					},
					taxExemptionReason:valueType,
					taxExemptionReasonCode:valueType
				}
			}]
		},

		allowanceCharge:{
			sequenceNumeric:numberValueType,
			allowanceChargeReason:valueType,
			amount: currencytType,
			baseAmount: currencytType,
			chargeIndicator:{value:false},
			multiplierFactorNumeric:numberValueType,
			perUnitAmount:currencytType
		},

		delivery:{
			ID:valueType,
			actualDeliveryDate : valueType,
			actualDeliveryTime : valueType,
			latestDeliveryDate : valueType,
			latestDeliveryTime : valueType,
			deliveryTerms:[],
			quantity:quantityType,
			trackingId : valueType,
			shipment:{
				ID:valueType,
				consignment:[],
				declaredCustomsValueAmount : currencytType,
				declaredForCarriageValueAmount : currencytType,
				declaredStatisticsValueAmount : currencytType,
				delivery:{}, //qwerty
				firstArrivalPortLocation:{
					ID:valueType,
					address:{}
				},
				freeOnBoardValueAmount :currencytType,
				goodsItem:[{requiredCustomsId:valueType}], //qwerty alt nesleneler oldukca fazla
				grossVolumeMeasure:quantityType,
				grossWeightMeasure:quantityType,
				handlingCode:valueType,
				handlingInstructions:valueType,
				insuranceValueAmount : currencytType,
				lastExitPortLocation:{
					ID:valueType,
					address:{}
				},
				netVolumeMeasure:quantityType,
				netWeightMeasure:quantityType,
				returnAddress:{}, //qwerty address
				shipmentStage:[{transportModeCode:valueType}], //qwerty  detaylar kalin, shipment stage ayri bir cumhuriyet
				specialInstructions:[],
				totalGoodsItemQuantity:quantityType,
				totalTransportHandlingUnitQuantity:quantityType,
				transportHandlingUnit:[{
					actualPackage:[]
				}] 
			}
		},
		deliveryTerms:{
			amount : currencytType,
			ID:{ value:'', attr:{ schemeID :'INCOTERMS'}},
			specialTerms:valueType
		},
		consignment:{
			ID:valueType,
			totalInvoiceAmount : currencytType
		},
		invoiceLine:{
			ID:valueType,
			note:[],
			invoicedQuantity :quantityType,
			lineExtensionAmount :currencytType,
			item:{
				additionalItemIdentification:[],
				brandName:valueType,
				buyersItemIdentification:{ID:valueType},
				commodityClassification:[
					{ 
						itemClassificationCode:valueType
					}
				],
				description:valueType,
				itemInstance:[],
				keyword:valueType,
				manufacturersItemIdentification:{ID:valueType},
				modelName:valueType,
				name:valueType,
				sellersItemIdentification:{ID:valueType},
				originCountry:countryType
			},
			price : {
				priceAmount : currencytType
			},
			allowanceCharge:[],
			delivery:[],
			taxTotal:{},
			withholdingTaxTotal:[]
		},
		item:itemType
	}
}

 exports.invoiceTemplate = eInvoiceDocumentTemplate(); 
       
})(typeof exports === 'undefined'?  
            this['eInvoiceDoumentTemplate']={}: exports); 