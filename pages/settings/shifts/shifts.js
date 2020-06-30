module.exports = function(req,res,callback){
	var data={
		form:{
			name:'',
			times:[],
			passive:false
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
			data.filter=getFilter(data.filter,req,res)
			if(req.method!='POST') 
				getList(req,res,data,callback)
		break;
	}
	
}

function getList(req,res,data,callback){
	api.get('/' + req.query.db + '/shifts',req,data.filter,(err,resp)=>{
		if(!err){
			data=mrutil.setGridData(data,resp);
			data.list.forEach((e)=>{
				e['zaman']=zamanText(e);
			})
		}else{
			errorLog(err);
		}
		
		callback(null,data);
	});
}

function zamanText(doc){
	if(!doc.times) return '';
	var sbuf='';
	doc.times.forEach((zaman,index)=>{
		sbuf +=zaman.name + '(' + zaman.startHour.n2() + ':' + zaman.startMinute.n2() + ' - ' + zaman.endHour.n2() + ':' + zaman.endMinute.n2() + ')';
		if(index<doc.times.length-1){
			sbuf +=', ';
		}
	});

	return sbuf;
}

function addnew(req,res,data,callback){
	//data['title']='Yeni Lokasyon';
	if(req.method=='POST'){
		data.form=Object.assign(data.form,req.body);
		api.post('/' + req.query.db + '/shifts',req,data.form,(err,resp)=>{
			if(!err){
				res.redirect('/settings/shifts?db=' + req.query.db +'&sid=' + req.query.sid);
				return;
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
	var _id=req.params.id || '';
	if(req.method=='POST' || req.method=='PUT'){
		data.form=Object.assign(data.form,req.body);
		api.put('/' + req.query.db + '/shifts/' + _id,req,data.form,(err,resp)=>{
			if(!err){
				res.redirect('/settings/shifts?db=' + req.query.db +'&sid=' + req.query.sid);

			}else{
				data['message']=err.message;
				callback(null,data);
			}
		});
	}else{
		api.get('/' + req.query.db + '/shifts/' + _id,req,null,(err,resp)=>{
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
	api.get('/' + req.query.db + '/shifts/' + _id,req,null,(err,resp)=>{
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
	api.delete('/' + req.query.db + '/shifts/' + _id,req,(err,resp)=>{
		if(!err){
			res.redirect('/settings/shifts?db=' + req.query.db +'&sid=' + req.query.sid);
			
		}else{
			data['message']=err.message;
			callback(null,data);
		}
	});
}