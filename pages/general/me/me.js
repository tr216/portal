module.exports = function(req,res,callback){
	var data={
		genderList:staticValues.genderList,
		form:{
			username:'',
			name:'',
			lastName:'',
			gender:'',
			email:'',
			oldPassword:'',
			newPassword:'',
			rePassword:''
		},
		message:''
	}

	
	myprofile(req,res,data,callback);
	
}

function myprofile(req,res,data,callback){
	if(req.method=='POST'){
		data.form=Object.assign(data.form,req.body);
		if(req.body.oldPassword || req.body.newPassword || req.body.rePassword){
			if(req.body.newPassword!=req.body.rePassword){
				data['message']='Tekrar girilen parola hatali!'
				data.form['oldPassword']='';
				data.form['newPassword']='';
				data.form['rePassword']='';
				return callback(null,data);
			}else{
				api.put(`/me/change-password`,req,req.body,(err,resp)=>{
					if(!err){
						data.form=Object.assign(data.form,resp.data);
					}else{
						
						data['message']=err.message;
					}
					data.form['oldPassword']='';
					data.form['newPassword']='';
					data.form['rePassword']='';
					callback(null,data);
				});
			}
		}else{
			api.put(`/me`,req,req.body,(err,resp)=>{
				if(!err){
					data.form=Object.assign(data.form,resp.data);
				}else{
					
					data['message']=err.message;
				}
				data.form['oldPassword']='';
				data.form['newPassword']='';
				data.form['rePassword']='';
				callback(null,data);
			});
		}

		
	}else{
		api.get(`/me`,req,{},(err,resp)=>{
			if(!err){
				data.form=Object.assign(data.form,resp.data);
			}else{
				data['message']=err.message;
			}
			callback(null,data);
		});
	}

}

