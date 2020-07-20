module.exports = function(req,res,callback){
	
	var data={
		
		list:[],
		filter:{}
	}
	
	if(!req.query.db){
		return callback({code:'ACTIVE DB ERROR',message:'Aktif secili bir veri ambari yok.'});
	}
	switch(req.params.func || ''){
		
		
		default:
			data.filter=getFilter(data.filter,req,res)
			if(req.method!='POST') 
				getList(req,res,data,callback)
		break;
	}
	
}



function getList(req,res,data,callback){
	
	initLookUpLists(req,res,data,(err,data)=>{
		
		api.get(`/${req.query.db}/production-orders`,req,data.filter,(err,resp)=>{
			if(!err){
				resp.data.docs.forEach((e)=>{
					e['musteri']='';
					if(e.productionTypeCode=='DEPO'){
						e['musteri']='DEPO';
					}else{
						if(e.orderLineReference){
							e.orderLineReference.forEach((e2,index)=>{
								e['musteri']+=e2.orderReference.buyerCustomerParty.party.partyName.name.value;
								if(index<e.orderLineReference.length-1){
									e['musteri']+='<br>';
								}
							});
						}
					}
				});
				data=mrutil.setGridData(data,resp);
			}
			callback(null,data);
		});
	})
	
}

function initLookUpLists(req,res,data,cb){
	cb(null,data);
}
