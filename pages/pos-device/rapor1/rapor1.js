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
			getList(req,res,data,callback);
		break;
	}
	
}

function getList(req,res,data,callback){
	if(req.method=='POST'){
		var filter={};
		
		for(let k in req.body){
			if(req.body[k] && k!='btnFilter'){
				filter[k]=req.body[k];
			}
		}

		res.redirect('/pos-device/rapor1?db=' + req.query.db + '&' + mrutil.encodeUrl(filter) + '&sid=' + req.query.sid);
	}else{
		// data.filter.page=1;
		data.filter=Object.assign(data.filter,req.query);
		console.log(data);
		data.filter.db=undefined;
		delete data.filter.db;
		data.filter.sid=undefined;
		delete data.filter.sid;

		initLookUpLists(req,res,data,(err,data)=>{
			api.get('/' + req.query.db + '/pos-device-zreports/rapor1',req,data.filter,(err,resp)=>{
				if(!err){
					data=mrutil.setGridData(data,resp);
				}
				callback(null,data);
			});
		});
		
	}

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
