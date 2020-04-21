(function(exports) { 
const valueType={value:''}
const idType={value:'', attr:{schemeID:''}}
const numberValueType={value:0}
const booleanValueType={value:false}
const amountType={ value:0, attr:{ currencyID:''}}
const quantityType={ value:0, attr:{ unitCode:''}}
const measureType={ value:0, attr:{ unitCode:''}}
const codeType={ value:'', attr:{ name:''}}

const countryType={
    identificationCode:valueType,
    name:valueType
}

const periodType={
    startDate:valueType,
    startTime:valueType,
    endDate:valueType,
    endTime:valueType,
    description:valueType,
    durationMeasure:quantityType
}

const partyIdentificationType={ID:{value:'', attr:{schemeID:''}}}

const documentReferenceType={ 
    ID:idType,
    issueDate:valueType,
    documentTypeCode:valueType,
    documentType:valueType,
    documentDescription:[valueType],
    attachment: {
        embeddedDocumentBinaryObject: {
            value:'',
            attr: {
                format: '',
                mimeCode:'application/xml',
                encodingCode: 'Base64',
                characterSetCode: 'UTF-8',
                filename: 'xslt_sablon.xslt'
            }
        }
    },
    validityPeriod: periodType
}

const orderReferenceType={
    ID:idType,
    issueDate:valueType,
    orderTypeCode:valueType,
    salesOrderId:idType,
    documentReference:documentReferenceType
}

const contactType={
    ID:idType,
    name:valueType,
    note:valueType,
    telephone:valueType,
    telefax:valueType,
    electronicMail:valueType,
    otherCommunication:[valueType]
}

const financialAccountType={
    currencyCode:valueType,
    financialInstitutionBranch:{
        financialInstitution:{name:valueType},
        name:valueType
    },
    ID:idType,
    paymentNote:valueType
}


const personType={
    firstName:valueType,
    middleName:valueType,
    familyName:valueType,
    nameSuffix:valueType,
    title:valueType,
    financialAccount:financialAccountType,
    identityDocumentReference:documentReferenceType,
    nationalityId:idType
}

const addressType={
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
}

const partyType={
    websiteURI:valueType,
    partyIdentification:[partyIdentificationType],
    partyName:{name:valueType},
    postalAddress:addressType,
    partyTaxScheme:{
        taxScheme:{
            name:valueType,
            taxTypeCode:valueType
        }
    },
    contact:contactType,
    person: personType
}

const exchangeRateType={ 
    sourceCurrencyCode  :valueType,
    targetCurrencyCode  :valueType,
    calculationRate   :numberValueType,
    date   :valueType
}

const actualPackageType={
    ID:idType,
    quantity:quantityType,
    packagingTypeCode:valueType
}

const dimensionType={
    attributeId:idType,
    description:[valueType],
    measure:quantityType,
    minimumMeasure:quantityType,
    maximumMeasure:quantityType
}

const itemPropertyType={
    ID:idType,
    importanceCode:valueType,
    itemPropertyGroup:[{
        ID:idType,
        importanceCode:valueType,
        name:valueType
    }],
    name:valueType,
    nameCode:valueType,
    rangeDimension:dimensionType,
    value: valueType,
    valueQuantity: quantityType,
    valueQualifier:[valueType],
    usabilityPeriod:periodType
}

const itemInstanceType={
    additionalItemProperty:[itemPropertyType],
    serialId:idType,
    lotIdentification:{ 
        lotNumberId: idType,
        expiryDate: valueType,
        additionalItemProperty:[itemPropertyType]
    },
    manufactureDate:valueType,
    manufactureTime:valueType,
    productTraceId:idType,
    registrationId:idType
}

const itemType={
    itemType:'',
    name:valueType,
    description:valueType,
    additionalItemIdentification:[{ID:idType}],
    brandName:valueType,
    buyersItemIdentification:{ID:idType},
    commodityClassification:[
        {
            itemClassificationCode:valueType
        }
    ],
    keyword:valueType,
    manufacturersItemIdentification:{ID:idType},
    modelName:valueType,
    sellersItemIdentification:{ID:idType},
    originCountry:countryType,
    itemInstance:[itemInstanceType],
    images:[{ data: '', type: '', fileName: '' },{ data: '', type: '', fileName: '' },{ data: '', type: '', fileName: '' }],
    files:[{ data: '', type: '', fileName: '' },{ data: '', type: '', fileName: '' },{ data: '', type: '', fileName: '' }],
    localDocumentId:'',
    passive:false
    
}

const paymentTermsType={
    amount :amountType,
    note:valueType,
    paymentDueDate:valueType,
    penaltyAmount :amountType,
    penaltySurchargePercent :numberValueType,
    settlementPeriod:periodType
}

const paymentMeansType={
    instructionNote:valueType,
    paymentMeansCode:codeType,
    paymentChannelCode:codeType,
    paymentDueDate:valueType,
    payerFinancialAccount:financialAccountType,
    payeeFinancialAccount:financialAccountType
}

const taxTotalType ={
    taxAmount :amountType,
    taxSubtotal:[{
        taxableAmount:amountType,
        taxAmount :amountType,
        percent :numberValueType,
        calculationSequenceNumeric :numberValueType,
        taxCategory :{
            name:valueType,
            taxScheme:{
                ID:idType,
                name:valueType,
                taxTypeCode:valueType
            },
            taxExemptionReason:valueType,
            taxExemptionReasonCode:valueType
        }
    }]
}

const allowanceChargeType={
    sequenceNumeric: numberValueType,
    allowanceChargeReason: valueType,
    amount: amountType,
    baseAmount: amountType,
    chargeIndicator:booleanValueType,
    multiplierFactorNumeric: numberValueType,
    perUnitAmount: amountType
}

const lineReferencetype={
    documentReference:documentReferenceType,
    lineId:idType,
    lineStatusCode:valueType
}

const orderLineReferenceType={
    lineId:idType,
    lineStatusCode:valueType,
    salesOrderLineId:idType,
    uuid:valueType,
    orderReference:{
        ID:idType,
        documentReference: documentReferenceType, 
        issueDate:valueType,
        orderTypeCode:valueType,
        salesOrderId:idType
    }
}

const orderLineReferenceType2={
    lineId:idType,
    orderedQuantity:quantityType,
    producedQuantity:quantityType,
    deliveredQuantity:quantityType,
    orderReference:{
        order:'',
        ID:idType,
        issueDate:valueType,
        orderTypeCode:valueType,
        salesOrderId:idType,
        buyerCustomerParty:{
            party:partyType,
            deliveryContact:contactType,
            accountingContact:contactType,
            buyerContact:contactType
        }
    }
}

const locationType={
    ID:idType,
    address:addressType
}

const deliveryTermsType={
    amount : amountType,
    ID:{ 
        value:'',
        attr:{ schemeID :'INCOTERMS'}
    },
    specialTerms:valueType
}

const despatchType={
    ID:idType,
    actualDespatchDate:valueType,
    actualDespatchTime:valueType,
    contact:contactType,
    despatchAddress:addressType,
    despatchParty:partyType,
    estimatedDespatchPeriod:periodType,
    instructions:valueType
}


const temperatureType={
    attributeId:valueType,
    description:[valueType],
    measure:measureType
}

const goodsItemType={
    ID:idType, //*** ihracatta zorunlu alan
    requiredCustomsId:idType, //*** ihracatta zorunlu alan
    chargeableQuantity:quantityType,
    chargeableWeightMeasure:measureType,
    customsImportClassifiedIndicator:booleanValueType,
    customsStatusCode:codeType,
    customsTariffQuantity:quantityType,
    declaredCustomsValueAmount:amountType,
    declaredForCarriageValueAmount:amountType,
    declaredStatisticsValueAmount:amountType,
    description:valueType,
    freeOnBoardValueAmount:amountType,
    freightAllowanceCharge:[allowanceChargeType],
    grossVolumeMeasure:measureType,
    grossWeightMeasure:measureType,
    hazardousRiskIndicator:booleanValueType,
    insuranceValueAmount:amountType,
    invoiceLine:[],
    item:[itemType],
    measurementDimension:[dimensionType],
    NetVolumeMeasure:measureType,
    NetWeightMeasure:measureType,
    OriginAddress:addressType,
    quantity:quantityType,
    returnableQuantity:quantityType,
    temperature:[temperatureType],
    traceId:idType,
    valueAmount:amountType
}

const customsDeclarationType={
    ID:idType,
    issuerParty:partyType
}

const hazardousGoodsTransitType={
    hazardousRegulationCode:codeType,
    inhalationToxicityZoneCode:codeType,
    maximumTemperature:temperatureType,
    minimumTemperature:temperatureType,
    packingCriteriaCode:codeType,
    transportAuthorizationCode:codeType,
    transportEmergencyCardCode:codeType

}

const transportEquipmentType={
    ID:idType,
    description:valueType,
    transportEquipmentTypeCode:codeType
}

const maritimeTransportType={
    grossTonnageMeasure:measureType,
    netTonnageMeasure:measureType,
    radioCallSignId:idType,
    registryCertificateDocumentReference:documentReferenceType,
    registryPortLocation:locationType,
    shipsRequirements:[valueType],
    vesselId:idType,
    vesselName:valueType
}

const railTransportType={
    railCarId:idType,
    trainId:idType
}

const roadTransportType={
    licensePlateId:idType,
    LocationId:idType
}

const stowageType={
    location:[locationType],
    locationId:idType,
    measurementDimension:[dimensionType]
}

const transportMeansType={
    airTransport:{
        aircraftId:idType
    },
    directionCode:codeType,
    journeyId:idType,
    maritimeTransport:maritimeTransportType,
    measurementDimension:[dimensionType],
    ownerParty:partyType,
    railTransport:railTransportType,
    registrationNationality:[valueType],
    registrationNationalityId:idType,
    roadTransport:roadTransportType,
    stowage:stowageType,
    tradeServiceCode:codeType,
    transportMeansTypeCode:codeType
}

const transportHandlingUnitType={
    ID:idType,
    actualPackage:[{ //*** ihracatta zorunlu alan
        ID:idType, //*** ihracatta zorunlu alan
        quantity:quantityType, //*** ihracatta zorunlu alan
        packagingTypeCode:codeType //*** ihracatta zorunlu alan
    }],
    customsDeclaration:[customsDeclarationType],
    floorSpaceMeasurementDimension:dimensionType,
    minimumTemperature:temperatureType,
    maximumTemperature:temperatureType,
    damageRemarks:[valueType],
    handlingCode:codeType,
    handlingInstructions:valueType,
    hazardousGoodsTransit:[hazardousGoodsTransitType],
    measurementDimension:[dimensionType],
    palletSpaceMeasurementDimension:dimensionType,
    shipmentDocumentReference:[documentReferenceType],
    TotalGoodsItemQuantity:quantityType,
    TotalPackageQuantity:quantityType,
    traceId:idType,
    transportEquipment:[transportEquipmentType],
    transportHandlingUnitTypeCode:codeType,
    transportMeans:[transportMeansType]
}

const shipmentStageType={
    driverPerson:[personType],
    transportModeCode:codeType
}

const shipmentType={
    ID:idType,
    declaredCustomsValueAmount : amountType,
    declaredForCarriageValueAmount : amountType,
    declaredStatisticsValueAmount : amountType,
    delivery:{},
    firstArrivalPortLocation:locationType,
    freeOnBoardValueAmount : amountType,
    goodsItem:[goodsItemType],
    grossVolumeMeasure:quantityType,
    grossWeightMeasure:quantityType,
    handlingCode:valueType,
    handlingInstructions:valueType,
    insuranceValueAmount : amountType,
    lastExitPortLocation:locationType,
    netVolumeMeasure:quantityType,
    netWeightMeasure:quantityType,
    returnAddress:addressType,
    shipmentStage:[shipmentStageType], 
    specialInstructions:[valueType],
    totalGoodsItemQuantity:quantityType,
    totalTransportHandlingUnitQuantity:quantityType,
    transportHandlingUnit:[transportHandlingUnitType] 
}

const deliveryType={
    ID:idType,
    actualDeliveryDate:valueType,
    actualDeliveryTime:valueType,
    alternativeDeliveryLocation:locationType,
    carrierParty:partyType,
    deliveryAddress:addressType,
    deliveryParty:partyType,
    deliveryTerms:[deliveryTermsType],
    despatch:despatchType,
    estimatedDeliveryPeriod:periodType,
    latestDeliveryDate:valueType,
    latestDeliveryTime:valueType,
    quantity:quantityType,
    trackingId :idType,
    shipment:shipmentType
}

const invoiceLineType={
    ID:idType,
    note:[valueType],
    invoicedQuantity : quantityType,
    price : {
        priceAmount:amountType
    },
    lineExtensionAmount: amountType,
    orderLineReference:[orderLineReferenceType],
    item:itemType,
    receiptLineReference:[lineReferencetype],
    allowanceCharge:[allowanceChargeType],
    delivery:[deliveryType],
    despatchLineReference:[lineReferencetype],
    taxTotal:taxTotalType,
    withholdingTaxTotal:[taxTotalType],
    subInvoiceLine:[{}]
}

const orderLineType={
    ID:idType,
    salesOrderLineId:idType,
    note:[valueType],
    orderedQuantity:quantityType,
    producedQuantity:quantityType,
    deliveredQuantity:quantityType,
    price : {
        priceAmount:amountType
    },
    lineExtensionAmount: amountType,
    item:itemType,
    allowanceCharge:[allowanceChargeType],
    delivery:[deliveryType],
    taxTotal:taxTotalType,
    withholdingTaxTotal:[taxTotalType],
    subOrderLine:[{}]
}

const billingReferenceLineType={
    ID: idType,
    amount:amountType,
    allowanceCharge:[allowanceChargeType]
}
const billingReferenceType={
    additionalDocumentReference:documentReferenceType,
    billingReferenceLine:[billingReferenceLineType],
    debitNoteDocumentReference:documentReferenceType,
    creditNoteDocumentReference:documentReferenceType,
    invoiceDocumentReference:documentReferenceType,
    reminderDocumentReference:documentReferenceType,
    selfBilledCreditNoteDocumentReference:documentReferenceType,
    selfBilledInvoiceDocumentReference:documentReferenceType


}

const despatchLineType={
    ID:idType,
    item:itemType,
    note:[valueType],
    deliveredQuantity:quantityType,
    documentReference:[documentReferenceType],
    orderLineReference:orderLineReferenceType,
    outstandingQuantity:quantityType,
    outstandingReason:[valueType],
    oversupplyQuantity:quantityType,
    shipment:[shipmentType]
}

const receiptLineType={
    ID:idType,
    item:itemType,
    note:[valueType],
    receivedDate:valueType,
    despatchLineReference:lineReferencetype,
    receivedQuantity:quantityType,
    rejectedQuantity:quantityType,
    rejectReason:[valueType],
    rejectReasonCode:codeType,
    shortQuantity:quantityType,
    documentReference:[documentReferenceType],
    orderLineReference:orderLineReferenceType,
    oversupplyQuantity:quantityType,
    timingComplaint:valueType,
    timingComplaintCode:codeType,
    shipment:[shipmentType]
}

const transactionConditionsType={
    ID:idType,
    actionCode:codeType,
    description:[valueType],
    documentReference:[documentReferenceType]
}

const invoiceType={
    ioType : 0, // 0 - cikis , 1- giris
    eIntegrator: '',
    location:'',
    profileId: valueType,
    ID: valueType,
    uuid: valueType,
    issueDate:valueType,
    issueTime:valueType,
    invoiceTypeCode: valueType,
    invoicePeriod: periodType,
    note:[valueType],
    documentCurrencyCode:valueType,
    taxCurrencyCode:valueType,
    pricingCurrencyCode:valueType,
    paymentCurrencyCode:valueType,
    paymentAlternativeCurrencyCode:valueType,
    lineCountNumeric:numberValueType,
    additionalDocumentReference:[documentReferenceType],
    orderReference:[orderReferenceType],
    despatchDocumentReference:[documentReferenceType],
    originatorDocumentReference:[documentReferenceType],
    accountingSupplierParty:{
        party:partyType,
        despatchContact:contactType
    },
    accountingCustomerParty:{
        party:partyType,
        deliveryContact:contactType
    },
    sellerSupplierParty:{
        party:partyType,
        despatchContact:contactType
    },
    buyerCustomerParty:{
        party:partyType,
        deliveryContact:contactType
    },
    accountingCost:valueType,
    delivery:[],
    billingReference:[],
    contractDocumentReference:[],
    paymentTerms:paymentTermsType,
    paymentMeans:[],
    taxExchangeRate:exchangeRateType,
    pricingExchangeRate:exchangeRateType,
    paymentExchangeRate:exchangeRateType,
    paymentAlternativeExchangeRate:exchangeRateType,
    taxTotal:[],
    withholdingTaxTotal:[],
    allowanceCharge:[],
    legalMonetaryTotal: { 
        lineExtensionAmount  :amountType,
        taxExclusiveAmount  : amountType,
        taxInclusiveAmount   : amountType,
        allowanceTotalAmount   : amountType,
        chargeTotalAmount : amountType,
        payableRoundingAmount : amountType,
        payableAmount :amountType
    },
    invoiceLine:[],
    localDocumentId:''
}

const orderType={
    //ioType : 0, // 0 - cikis , 1- giris
    eIntegrator: '',
    profileId: valueType,
    ID: valueType,
    salesOrderId:valueType,
    uuid: valueType,
    issueDate: valueType,
    issueTime: valueType,
    orderTypeCode: valueType,
    note:[valueType],
    requestedInvoiceCurrencyCode:valueType,
    documentCurrencyCode:valueType,
    pricingCurrencyCode:valueType,
    taxCurrencyCode:valueType,
    customerReference:valueType,
    accountingCostCode:valueType,
    accountingCost:valueType,
    lineCountNumeric:numberValueType,
    validityPeriod: periodType,
    quotationDocumentReference:[],
    orderDocumentReference:[],
    originatorDocumentReference:[],
    catalogueReference:[],
    additionalDocumentReference:[],
    contract:[],
    projectReference:[],
    sellerSupplierParty:{
        customerAssignedAccountId:idType,
        additionalAccountId:idType,
        dataSendingCapability:valueType,
        party:partyType,
        despatchContact:contactType,
        accountingContact:contactType,
        sellerContact:contactType
    },
    buyerCustomerParty:{
        customerAssignedAccountId:idType,
        supplierAssignedAccountId:idType,
        additionalAccountId:idType,
        party:partyType,
        deliveryContact:contactType,
        accountingContact:contactType,
        buyerContact:contactType
    },
    accountingCost:valueType,
    delivery:[],
    billingReference:[],
    contractDocumentReference:[],
    paymentTerms:paymentTermsType,
    paymentMeans:[],
    taxExchangeRate:exchangeRateType,
    pricingExchangeRate:exchangeRateType,
    paymentExchangeRate:exchangeRateType,
    paymentAlternativeExchangeRate:exchangeRateType,
    taxTotal:[],
    withholdingTaxTotal:[],
    allowanceCharge:[],
    anticipatedMonetaryTotal: { 
        lineExtensionAmount  :amountType,
        taxExclusiveAmount  : amountType,
        taxInclusiveAmount   : amountType,
        allowanceTotalAmount   : amountType,
        chargeTotalAmount : amountType,
        payableRoundingAmount : amountType,
        payableAmount :amountType,
        payableAlternativeAmount :amountType
    },
    orderLine:[],
    localDocumentId:''
}

const qualityControlType={
        param:'',
        value:''
    }
const materialType={
        item:'',
        quantity:0,
        unitCode:''
    }
const recipeProcessType={
    sequence:0,
    station: '',
    step: '',
    machines: [],
    input: [],  //materialType
    output: [], //materialType
    parameters:''
}
const productionOrderType={
    item: '',
    sourceRecipe: '',
    productionTypeCode:'MUSTERI',
    productionId:'',
    issueDate: '',
    issueTime: '',
    plannedPeriod: {
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: ''
    },
    producedPeriod: {
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: ''
    },
    plannedQuantity:0,
    producedQuantity:0,
    unitCode:'',
    orderLineReference:[],
    description:'',
    process:[],
    materialSummary:[], //materialType
    outputSummary:[], //materialType
    qualityControl:[], //qualityControlType
    finishNotes:'',
    status:'Draft',
    cancelled: false
}

const recipeType={
    item: '',
    name:'',
    description:'',
    revision:1,
    process:[], //recipeProcessType
    materialSummary:[], //materialType
    outputSummary:[],  //materialType
    qualityControl:[], //qualityControlType
    isDefault: true,
    totalQuantity:100,
    passive: false
    
}

const despatchAdviceType={
    eIntegrator: '',
    location:'',
    location2:'',
    profileId: valueType,
    ID: idType,
    uuid: valueType,
    issueDate: valueType,
    issueTime: valueType,
    despatchAdviceTypeCode: valueType,
    despatchPeriod: periodType,
    note:[valueType],
    additionalDocumentReference:[], //documentReferenceType
    orderReference:[], //orderReferenceType
    originatorDocumentReference:[], //documentReferenceType
    despatchSupplierParty:{
        party:partyType,
        despatchContact:contactType
    },
    deliveryCustomerParty:{
        party:partyType,
        deliveryContact:contactType
    },
    originatorCustomerParty:{
        party:partyType,
        deliveryContact:contactType
    },
    sellerSupplierParty:{
        party:partyType,
        despatchContact:contactType
    },
    buyerCustomerParty:{
        party:partyType,
        deliveryContact:contactType
    },
    shipment:shipmentType,
    lineCountNumeric:numberValueType,
    despatchLine:[], //despatchLineType
    localDocumentId: '',
}

exports.types = Object.freeze({
    valueType:valueType,
    idType:idType,
    numberValueType:numberValueType,
    amountType:amountType,
    quantityType:quantityType,
    codeType:codeType,
    measureType:measureType,
    countryType:countryType,
    partyIdentificationType:partyIdentificationType,
    partyType:partyType,
    exchangeRateType:exchangeRateType,
    actualPackageType:actualPackageType,
    dimensionType:dimensionType,
    itemPropertyType:itemPropertyType,
    itemInstanceType:itemInstanceType,
    documentReferenceType:documentReferenceType,
    orderReferenceType:orderReferenceType,
    contactType:contactType,
    personType:personType,
    itemType:itemType,
    paymentTermsType:paymentTermsType,
    paymentMeansType:paymentMeansType,
    exchangeRateType:exchangeRateType,
    taxTotalType:taxTotalType,
    financialAccountType:financialAccountType,
    allowanceChargeType:allowanceChargeType,
    periodType:periodType,
    lineReferencetype:lineReferencetype,
    orderLineReferenceType:orderLineReferenceType,
    deliveryType:deliveryType,
    addressType:addressType,
    locationType:locationType,
    despatchType:despatchType,
    shipmentType:shipmentType,
    customsDeclarationType:customsDeclarationType,
    transportHandlingUnitType:transportHandlingUnitType,
    dimensionType:dimensionType,
    temperatureType:temperatureType,
    hazardousGoodsTransitType:hazardousGoodsTransitType,
    transportEquipmentType:transportEquipmentType,
    transportMeansType:transportMeansType,
    maritimeTransportType:maritimeTransportType,
    railTransportType:railTransportType,
    roadTransportType:roadTransportType,
    stowageType:stowageType,
    invoiceLineType:invoiceLineType,
    shipmentStageType:shipmentStageType,
    billingReferenceType:billingReferenceType,
    billingReferenceLineType:billingReferenceLineType,
    despatchLineType:despatchLineType,
    receiptLineType:receiptLineType,
    orderLineType:orderLineType,
    transactionConditionsType:transactionConditionsType,
    deliveryTermsType:deliveryTermsType,
    invoiceType:invoiceType,
    orderType:orderType,
    productionOrderType:productionOrderType,
    recipeType:recipeType,
    recipeProcessType:recipeProcessType,
    materialType:materialType,
    qualityControlType:qualityControlType,
    despatchAdviceType:despatchAdviceType
});

       
})(typeof exports === 'undefined'?  
            this['types']={}: exports); 

