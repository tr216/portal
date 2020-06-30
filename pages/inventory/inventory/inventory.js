module.exports = function(req,res,callback){

	var data={
		accountGroupList:[],
		form:{
			item:{_id:'', name:''},
			quantity:0,
			quantity2:0,
			quantity3:0,
			details:[]
		},
		filter:{},
		list:[]
	}
	
	if(!req.query.db){
		return callback({code:'ACTIVE DB ERROR',message:'Aktif secili bir veri ambari yok.'});
	}
	switch(req.params.func || ''){
		
		case 'view':
			view(req,res,data,callback);
		break;
		
		default:
			data.filter=getFilter(data.filter,req,res)
			if(req.method!='POST') 
				getList(req,res,data,callback)
		break;
	}
	
}

function getList(req,res,data,callback){
	
	api.get('/' + req.query.db + '/inventory',req,data.filter,(err,resp)=>{
		if(!err){

			data=mrutil.setGridData(data,resp);
		}
		callback(null,data);
	});
	
}

function view(req,res,data,callback){
	var _id=req.params.id || '';

	api.get('/' + req.query.db + '/inventory/' + _id,req,null,(err,resp)=>{
		if(!err){
			data.form=Object.assign({},data.form,resp.data);
			callback(null,data);
		}else{
			data['message']=err.message;
			callback(null,data);
		}
	});
}

