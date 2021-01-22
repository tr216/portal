module.exports = function(req,res,callback){
	var data={
		form:{
			default:'{}', // varsayilan parametreler JSON format
			settings:'{}' // kullanici ozelindeki degistirmeler
		},
		filter:{

		},
		list:[]
	}

	switch(req.method){
		case 'PUT':
		case 'POST':
		saveSettings(req,res,data,callback)
		break
		default:
		getSettings(req,res,data,callback)
		break
	}
	
	
}

const bosVeri=`{
\t
}`
function getSettings(req,res,data,callback){
	
	api.get(`/{db}/settings`,req,data.filter,(err,resp)=>{
		if(!err){
			data.form.default=resp.data.default
			if(JSON.stringify(data.form.settings)!='{}'){
				data.form.settings=JSON.stringify(resp.data.settings,null,4)
			}else{
				data.form.settings=bosVeri
			}
		}else{
			errorLog('hata:',err)
			data['message']=err.message
		}
		callback(null,data)
	})
}

function saveSettings(req,res,data,callback){
	data.form=Object.assign(data.form,req.body)
	var obj={}
	try{
		obj=JSON.parse(data.form.settings)
		api.post(`/{db}/settings`,req,obj,(err,resp)=>{
			if(!err){
				data.form.default=resp.data.default
				if(JSON.stringify(data.form.settings)!='{}'){
					data.form.settings=JSON.stringify(resp.data.settings,null,4)
				}else{
					data.form.settings=bosVeri
				}
				
			}else{
				errorLog('hata:',err)
				data['message']=err.message
			}
			callback(null,data)
		})
	}catch(e){
		errorLog('hata:',e)
		data['message']=e.message || e
		callback(null,data)
	}

	

}
