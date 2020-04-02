module.exports = function(req,res,callback){
	var data={
		locationTypeList:staticValues.locationTypes,
		form:{
			mainParty:null,
			account:null,
			websiteURI:{value:''},
	        partyIdentification:[{
	            ID:{ 
	                value:'',
	                attr: {
	                    schemeID: ''
	                }
	            }
	        }],
	        partyName:{
	            name:{value:''}
	        },
	        postalAddress:{
	            room:{ value:''},
	            streetName:{ value:''},
	            blockName:{ value:''},
	            buildingName:{ value:''},
	            buildingNumber:{ value:''},
	            citySubdivisionName:{ value:''},
	            cityName:{ value:''},
	            postalZone:{ value:''},
	            postbox:{ value:''},
	            region:{ value:''},
	            district:{ value:''},
	            province:{ value:''},
	            country:{
	                identificationCode:{ value:'TR'},
	                name:{value:'Türkiye'}
	            }
	        },
	        partyTaxScheme:{
	            taxScheme:{
	                name:{ value:''},
	                taxTypeCode:{ value:''}
	            }
	        },
	        contact:{
	            telephone:{ value:''},
	            telefax:{ value:''},
	            electronicMail:{ value:''}
	        },
	        person:{
	            firstName:{ value:''},
	            middleName:{ value:''},
	            familyName:{ value:''},
	            nameSuffix:{ value:''},
	            title:{ value:''}
	        },
	        passive:false,
	        tags:'',
	        vknTckn:'',
	        mersisNo:'',
	        aboneNo:''
		},
		filter:{},
		list:[]
	}

	if(!req.query.db){
		return callback({code:'ACTIVE DB ERROR',message:'Aktif secili bir veri ambari yok.'});
	}
	switch(req.params.func || ''){
		case 'addnew':
		
		addnew(req,res,data,callback);
		break;
		case 'edit':
			edit(req,res,data,callback);
		break;
		case 'view':
			view(req,res,data,callback);
		break;
		case 'delete':
		
		deleteItem(req,res,data,callback);
		break;
		default:
			data.filter=getFilter(data.filter,req);
			getList(req,res,data,callback);
		break;
	}
	
}

function getList(req,res,data,callback){
	api.get('/' + req.query.db + '/vendors',req,data.filter,(err,resp)=>{
		if(!err){
			data=mrutil.setGridData(data,resp);
		}
		callback(null,data);
	});
}

function addnew(req,res,data,callback){

	if(req.method=='POST'){
		data.form=Object.assign(data.form,req.body);
		api.post('/' + req.query.db + '/vendors',req,data.form,(err,resp)=>{
			if(!err){
				res.redirect('/finance/vendors?db=' + req.query.db +'&sid=' + req.query.sid);
			}else{
				data['message']=err.message;
				callback(null,data);
			}
		});
	}else{
		callback(null,data);
	}
}

function edit(req,res,data,callback){
	//data['title']='Lokasyon Duzelt';
	var _id=req.params.id || '';
	if(req.method=='POST' || req.method=='PUT'){
		data.form=Object.assign(data.form,req.body);
		if(_id.trim()==''){
			data['message']='ID bos olamaz';
			callback(null,data);
			return;
		}

		api.put('/' + req.query.db + '/vendors/' + _id, req,data.form,(err,resp)=>{
			if(!err){
				res.redirect('/finance/vendors?db=' + req.query.db +'&sid=' + req.query.sid);

			}else{
				data['message']=err.message;
				callback(null,data);
			}
		});
	}else{
		api.get('/' + req.query.db + '/vendors/' + _id,req,null,(err,resp)=>{
			if(!err){
				data.form=Object.assign(data.form,resp.data);
				callback(null,data);
			}else{
				data['message']=err.message;
				callback(null,data);
			}
		});
	}
}

function view(req,res,data,callback){
	var _id=req.params.id || '';
	api.get('/' + req.query.db + '/vendors/' + _id,req,null,(err,resp)=>{
		if(!err){
			data.form=Object.assign(data.form,resp.data);
			callback(null,data);
		}else{
			data['message']=err.message;
			callback(null,data);
		}
	});
}

function deleteItem(req,res,data,callback){
	var _id=req.params.id || '';
	api.delete('/' + req.query.db + '/vendors/' + _id,req,(err,resp)=>{
		if(!err){
			res.redirect('/finance/vendors?db=' + req.query.db +'&sid=' + req.query.sid);
			
		}else{
			
			//data['message']=err.message;
			callback(err,data);
		}
	});
}