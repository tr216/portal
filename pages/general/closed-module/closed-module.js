  module.exports = function(req,res,callback){
 	var data={username:'merhaba'};
 	eventLog('dashboard.js calisti');
 	// api.get('/mydbdefines',req,null,(err,resp)=>{
 	// 	if(!err){
 	// 		data['databases']=resp.data;
 	// 	}
 	// 	callback(null,data);
 	// });
 	callback(null,data);
 }