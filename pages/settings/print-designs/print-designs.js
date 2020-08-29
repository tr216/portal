module.exports = function(req,res,callback){
	var data={
		printDesignModuleList:clone(staticValues.printDesignModuleList),
		form:{
			module:'',
			name:'',
			design:'',
			isDefault:false,
			passive:false
		},
		filter:{

		},
		list:[]
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
	data.printDesignModuleList.unshift({text:'-- Tümü --',value:''});
	api.get(`/{db}/print-designs`,req,data.filter,(err,resp)=>{
		if(!err){
			data=mrutil.setGridData(data,resp);
		}else{
			errorLog('hata:',err);
		}
		
		callback(null,data);
	});
}



function addnew(req,res,data,callback){
	data.printDesignModuleList.unshift({text:'-- Seç --',value:''});
	if(req.method=='POST'){
		data.form=Object.assign(data.form,req.body);
		api.post(`/{db}/print-designs`,req,data.form,(err,resp)=>{
			if(!err){
				res.redirect(`/settings/print-designs?sid=${req.query.sid}&mid=${req.query.mid}`)
				return;
				}else{
					data['message']=err.message;
					callback(null,data);
				}
			});
	}else{
		var fileName='print-design-empty.ejs'
		switch((req.query.module || '')){
			case 'recipe':
				fileName='print-design-recipe.ejs';
			break;
			default:
			break;
		}
		fs.readFile(path_module.join(__dirname,'../../../defaults',fileName),'utf-8',(err,fileData)=>{
			if(!err){
				data.form.design=fileData;
			}
			callback(null,data);
		})
		
	}
}


function edit(req,res,data,callback){
	var _id=req.params.id || '';
	if(req.method=='POST' || req.method=='PUT'){
		data.form=Object.assign(data.form,req.body);
		api.put(`/{db}/print-designs/${_id}`,req,data.form,(err,resp)=>{
			if(!err){
				res.redirect(`/settings/print-designs?sid=${req.query.sid}&mid=${req.query.mid}`)

			}else{
				data['message']=err.message;
				callback(null,data);
			}
		});
	}else{
		api.get(`/{db}/print-designs/${_id}`,req,null,(err,resp)=>{
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
	api.get(`/{db}/print-designs/${_id}`,req,null,(err,resp)=>{
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
	api.delete(`/{db}/print-designs/${_id}`,req,(err,resp)=>{
		if(!err){
			res.redirect(`/settings/print-designs?sid=${req.query.sid}&mid=${req.query.mid}`)
			
		}else{
			data['message']=err.message;
			callback(null,data);
		}
	});
}