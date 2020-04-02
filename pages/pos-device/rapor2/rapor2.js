module.exports = function(req,res,callback){
	var data={
		list:[],
		locationList:[],
		filter:{
			date1:(new Date()).yyyymmdd(),
			date2:(new Date()).yyyymmdd()
		},
		returnUrl:''

	}

	if(!req.query.db){
		return callback({code:'ACTIVE DB ERROR',message:'Aktif secili bir veri ambari yok.'});
	}
	

	switch(req.params.func || ''){
		
		
		default:
			data.filter=getFilter(data.filter,req);
			getList(req,res,data,callback);
		break;
	}
	
}

function getList(req,res,data,callback){
	initLookUpLists(req,res,data,(err,data)=>{
		api.get('/' + req.query.db + '/pos-device-zreports/rapor2',req,data.filter,(err,resp)=>{
			if(!err){
				data=mrutil.setGridData(data,resp);
			}
			callback(null,data);
		});
	});
}

function initLookUpLists(req,res,data,cb){
	data.locationList=[];
	api.get('/' + req.query.db + '/locations',req,{},(err,resp)=>{
		if(!err){
			data.locationList=resp.data.docs;
			data.locationList.unshift({_id:'',locationName:'Tümü'});
		}
		cb(null,data);
	});
}
