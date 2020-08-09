var engine = require('ejs-locals')

module.exports=function(file, options, cb){
	engine(file,options,(err,html)=>{
		if(!err){
			html=require('./bs-cards')(html)
			cb(null,html)
		}else{
			cb(err,html)
		}
	})
}