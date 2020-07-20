module.exports = function(req,res,callback){
	var data={
		stationList:[],
		shiftList:[],
		bloodGroups:clone(staticValues.bloodGroups),
		form:{
			firstName:dbType.valueType,
	        middleName:dbType.valueType,
	        familyName:dbType.valueType,
	        nameSuffix:dbType.valueType,
	        title:dbType.valueType,
	        financialAccount:dbType.financialAccountType,
	        identityDocumentReference:dbType.documentReferenceType,
	        nationalityId:dbType.idType,
	        postalAddress:dbType.addressType,
	        station: '',
	        shift:'',
	        account: '',
	        bloodGroup: '',
	        passive:false
		},
		filter:{

		},
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
			edit(req,res,data,callback);
		break;
		case 'delete':
		
		deleteItem(req,res,data,callback);
		break;
		default:
			data.filter=getFilter(data.filter,req,res)
			if(req.method!='POST') 
				getList(req,res,data,callback)
		break;
	}
	
}

function getList(req,res,data,callback){
	

	initLookUpLists(req,res,data,(err,data)=>{
		data.stationList.unshift({_id:'',name:'-Tümü-'});
		data.shiftList.unshift({_id:'',name:'-Tümü-'})
		data.bloodGroups.unshift({value:'',text:'-Tümü-'})
		api.get(`/${req.query.db}/persons`,req,data.filter,(err,resp)=>{
			if(!err){
				data=mrutil.setGridData(data,resp);
			}else{
				errorLog('hata:',err);
			}
			
			callback(null,data);
		});
	});
		
	

}



function initLookUpLists(req,res,data,cb){
	data.stationList=[];
	data.shiftList=[];
	api.get(`/${req.query.db}/mrp-stations`,req,{passive:false},(err,resp)=>{
		if(!err){
			data.stationList=resp.data.docs;
			
		}
		api.get(`/${req.query.db}/shifts`,req,{passive:false},(err,resp)=>{
			if(!err){
				data.shiftList=resp.data.docs;
			}
			cb(null,data);
		});
	});
}

function addnew(req,res,data,callback){
	//data['title']='Yeni Lokasyon';
	initLookUpLists(req,res,data,(err,data)=>{
		if(req.method=='POST'){
			data.form=Object.assign(data.form,req.body);
			api.post(`/${req.query.db}/persons`,req,data.form,(err,resp)=>{
				if(!err){
					res.redirect(`/settings/persons?mid=${req.query.mid}&db=${req.query.db}&sid=${req.query.sid}`)
					return;
 				}else{
 					data['message']=err.message;
 					callback(null,data);
 				}
 			});
		}else{
			callback(null,data);
		}
	});
}


function edit(req,res,data,callback){
	initLookUpLists(req,res,data,(err,data)=>{
		var _id=req.params.id || '';
		if(req.method=='POST' || req.method=='PUT'){
			data.form=Object.assign(data.form,req.body);
			api.put(`/${req.query.db}/persons/${_id}`,req,data.form,(err,resp)=>{
				if(!err){
					res.redirect(`/settings/persons?mid=${req.query.mid}&db=${req.query.db}&sid=${req.query.sid}`)

				}else{
					data['message']=err.message;
					callback(null,data);
				}
			});
		}else{
			api.get(`/${req.query.db}/persons/${_id}`,req,null,(err,resp)=>{
				if(!err){
					data.form=Object.assign(data.form,resp.data);
					callback(null,data);
				}else{
					data['message']=err.message;
					callback(null,data);
				}
			});
		}
	});
}


function deleteItem(req,res,data,callback){
	var _id=req.params.id || '';
	api.delete(`/${req.query.db}/persons/${_id}`,req,(err,resp)=>{
		if(!err){
			res.redirect(`/settings/persons?mid=${req.query.mid}&db=${req.query.db}&sid=${req.query.sid}`)
			
		}else{
			data['message']=err.message;
			callback(null,data);
		}
	});
}