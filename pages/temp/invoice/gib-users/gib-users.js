module.exports = function(req,res,callback){
	var data={
		form:{
			eIntegrator:''
			
		},
		list:[],
		filter:{}
	}
	
	

	if((req.params.func || '')!=''){
		return callback({code:'PAGE ERROR',message:'Sayfa yok.'});
	}
	
	data.filter=getFilter(data.filter,req,res)
	getList(req,res,data,callback);
		
}


function getList(req,res,data,callback){
	api.get(`/{db}/invoice/eInvoiceUserList`,req,data.filter,(err,resp)=>{
		if(!err){
			
			data=mrutil.setGridData(data,resp);
		}
		callback(null,data);
	});
}
