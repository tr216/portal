module.exports = function(req,res,callback){
	var data={
		form:{
			eIntegrator:''
			
		},
		list:[],
		filter:{}
	}
	
	
	if(!req.query.db){
		return callback({code:'ACTIVE DB ERROR',message:'Aktif secili bir veri ambari yok.'});
	}
	if((req.params.func || '')!=''){
		return callback({code:'PAGE ERROR',message:'Sayfa yok.'});
	}
	getList(req,res,data,callback);
		
}


function getList(req,res,data,callback){
	if(req.method=='POST'){
		var filter={};
		filter=Object.assign(filter,req.query);
		filter=Object.assign(filter,req.body);
		filter['btnFilter']=undefined;
		delete filter['btnFilter'];
		filter['page']=1;
		res.redirect('/invoice/gib-users?' + mrutil.encodeUrl(filter));
	}else{
		data.filter=Object.assign(data.filter,req.query);
		data.filter.db=undefined;
		delete data.filter.db;
		data.filter.sid=undefined;
		delete data.filter.sid;
		api.get('/' + req.query.db + '/invoice/eInvoiceUserList',req,data.filter,(err,resp)=>{
			if(!err){
				
				data=mrutil.setGridData(data,resp);
			}
			callback(null,data);
		});
	}
}
