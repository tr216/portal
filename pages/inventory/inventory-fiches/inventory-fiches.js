module.exports = function(req,res,callback){

	var data={
		inventoryFicheTypeCodeList:clone(staticValues.inventoryFicheTypeCodeList),
		locationList:[],
		subLocationList:[],
		palletList:[],
		form:{
			docTypeCode:'URETIMECIKIS',
	        docId:'',
	        issueDate: moment().format('YYYY-MM-DD'),
	        issueTime: moment().format('hh:mm:ss'),
	        location: '',
	        subLocation: '',
	       	location2: '',
	        subLocation2: '',
	        description:'',
	        productionOrderId:'',
	        docLine:[]
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
		data.locationList.unshift({locationName:'-- Tümü --',_id:''});
		data.subLocationList.unshift({name:'-- Tümü --',_id:''});
		data.palletList.unshift({name:'-- Tümü --',_id:''});
		data.inventoryFicheTypeCodeList.unshift({text:'-- Tümü --',value:''});
		api.get(`/${req.query.db}/inventory-fiches`,req,data.filter,(err,resp)=>{
			if(!err){
				
				var docs=[]
				resp.data.docs.forEach((e)=>{
					docs.push(docFormHelper.makeSimpleInventoryFicheList(e));
				});
				resp.data.docs=docs;
				data=mrutil.setGridData(data,resp);
			}
			callback(null,data);
		});
	});
}


function initLookUpLists(req,res,data,cb){
	data.locationList=[];
	data.subLocationList=[];
	data.palletList=[];
	
	api.get(`/${req.query.db}/locations`,req,{},(err,resp)=>{
		if(!err){
			data.locationList=resp.data.docs;
		}
		
			api.get(`/${req.query.db}/pallets`,req,{},(err,resp)=>{
				if(!err){
					data.palletList=resp.data.docs;
				}
				cb(null,data);
			});
	});
}

function addnew(req,res,data,callback){
	initLookUpLists(req,res,data,(err,data)=>{
		data.inventoryFicheTypeCodeList.unshift({text:'-- Seç --',value:''});
		data.palletList.unshift({name:'-- Seç --',_id:''});
		if(req.method=='POST'){
			data.form=Object.assign(data.form,req.body);
			
			api.post(`/${req.query.db}/inventory-fiches`,req,data.form,(err,resp)=>{
				if(!err){
					res.redirect(`/inventory/inventory-fiches?mid=${req.query.mid}&db=${req.query.db}&sid=${req.query.sid}`)
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
	var _id=req.params.id || '';
	if(_id.trim()==''){
		data['message']='ID bos olamaz';
		callback(null,data);
		return;
	}
	initLookUpLists(req,res,data,(err,data)=>{
		data.inventoryFicheTypeCodeList.unshift({text:'-- Seç --',value:''});
		data.palletList.unshift({name:'-- Seç --',_id:''});
		if(req.method=='POST' || req.method=='PUT'){
			data.form=Object.assign(data.form,req.body);
			
			api.put(`/${req.query.db}/inventory-fiches/${_id}`,req,data.form,(err,resp)=>{
				if(!err){
					res.redirect(`/inventory/inventory-fiches?mid=${req.query.mid}&db=${req.query.db}&sid=${req.query.sid}`)

				}else{
					data['message']=err.message;
					callback(null,data);
				}
			});
		}else{

			api.get(`/${req.query.db}/inventory-fiches/${_id}`,req,null,(err,resp)=>{
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
	api.delete(`/${req.query.db}/inventory-fiches/${_id}`,req,(err,resp)=>{
		if(!err){
			res.redirect(`/inventory/inventory-fiches?mid=${req.query.mid}&db=${req.query.db}&sid=${req.query.sid}`)
			
		}else{
			
			//data['message']=err.message;
			callback(err,data);
		}
	});
}