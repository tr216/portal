
function cariKart_changed(prefix){
	// var prefix='deliveryCustomerParty'

	var fieldList=[
	"person.firstName.value",
	"person.familyName.value",
	"partyIdentification.0.ID.value",
	"partyIdentification.0.ID.attr.schemeID",
	"partyTaxScheme.taxScheme.name.value",
	"postalAddress.streetName.value",
	"postalAddress.buildingNumber.value",
	"postalAddress.buildingName.value",
	"postalAddress.blockName.value",
	"postalAddress.room.value",
	"postalAddress.citySubdivisionName.value",
	"postalAddress.district.value",
	"postalAddress.cityName.value",
	"postalAddress.region.value",
	"postalAddress.country.identificationCode.value",
	"postalAddress.country.name.value",
	"postalAddress.postbox.value",
	"contact.telephone.value",
	"contact.telefax.value",
	"contact.electronicMail.value",
	"websiteURI.value"
	]
	
	var cari=$(`#${prefix}-party-_id-obj`).val()
	if(cari==undefined)
		return
	var obj=JSON.parse(decodeURIComponent(cari))
	fieldList.forEach((e)=>{
		var componentFieldName=`${prefix}.party.${e}`
		
		var value=getPropertyByKeyPath(obj,e)
		if(value!=undefined){
			if($(`#${generateFormId(componentFieldName)}`).val()!=undefined){
				$(`#${generateFormId(componentFieldName)}`).val(value)
			}
		}
	})

	if(($(`#${generateFormId(prefix + '.party.postalAddress.country.identificationCode.value')}`).val() || '')==''){
		$(`#${generateFormId(prefix + '.party.postalAddress.country.identificationCode.value')}`).val('TR')

	}
}

function countryCode_changed(prefix){
	var fieldName=`${prefix}.party.postalAddress.country.identificationCode.value`
	var fieldNameCountryName=`${prefix}.party.postalAddress.country.name.value`
	var countryCode=$(`#${generateFormId(fieldName)}`).val() || ''
	var countryText=$(`#${generateFormId(fieldName)} option:selected`).text() || ''

	if(countryCode!=''){
		$(`#${generateFormId(fieldNameCountryName)}`).val(countryText)
		console.log(`countryCode_changed:`,countryText)
	}
}