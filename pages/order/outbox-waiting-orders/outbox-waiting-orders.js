module.exports = function(req,res,callback){
	var data={
		eIntegratorList:[],
		docStatusTypes:Array.from(staticValues.orderStatusTypes),
		currencyList:Array.from(staticValues.currencyList),
		docProfileIdList:Array.from(staticValues.orderProfileIdList),
		docTypeCodeList:Array.from(staticValues.orderTypeCodeList),
		form:Object.assign({},dbType.orderType),
		html:'Goruntulenemedi',
		list:[],
		filter:{}
	}
	data.form.ioType=0;
	
	if(!req.query.db){
		return callback({code:'ACTIVE DB ERROR',message:'Aktif secili bir veri ambari yok.'});
	}

	switch((req.params.func || '')){
		
		default:
			data.filter=getFilter(data.filter,req,res)
			if(req.method!='POST') 
				getList(req,res,data,callback)
		break;
	}

}



function getList(req,res,data,callback){
	data.docStatusTypes.unshift({text:'-Tümü-',value:''});
	data.currencyList.unshift({text:'-Tümü-',value:''});
	data.docProfileIdList.unshift({text:'-Tümü-',value:''});
	data.docTypeCodeList.unshift({text:'-Tümü-',value:''});
	
	initLookUpLists(req,res,data,(err,data)=>{
		data.eIntegratorList.unshift({_id:'',name:'-Tümü-'})
		api.get('/' + req.query.db + '/order/outboxWaitingOrders',req,data.filter,(err,resp)=>{
			if(!err){
				var docs=[];
				resp.data.docs.forEach((e)=>{
					e['sipNo']=e.ID.value + '.' + Number(e.orderLine.ID.value).n2();
					e['termin']=e.validityPeriod.startDate.value + '<br>' + e.validityPeriod.endDate.value;
					docs.push(e);
					
				});
				resp.data.docs=docs;
				data=mrutil.setGridData(data,resp);
			}
			callback(null,data);
		});
	})
}

function initLookUpLists(req,res,data,cb){
	data.eIntegratorList=[];
	
	api.get('/' + req.query.db + '/integrators',req,{passive:false},(err,resp)=>{
		if(!err){
			data.eIntegratorList=resp.data.docs;
			
		}
		cb(null,data);
	});
}