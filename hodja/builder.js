(function(exports) {
	var frontEnd=true
	if(typeof config!='undefined'){
		if(typeof config.mongodb!='undefined'){
			frontEnd=false
		}
	}
	var templates=hodjaTemplates

	

	exports.Builder = Object.freeze({
		control:control
	})

	// if(!frontEnd){
	// 	templates=hodjaTemplates
	// }else{
	// 	fetch(`/hodja/templates`).then(r=>r.text()).then(v=>{
	// 		templates=JSON.parse(v)
			
	// 	})
	// }

	function control(template,data){
		try{
			// time(`${template} start`)
			data['include']=builder.control
			// var ejs=require('ejs')
			var s= ejs.render(getPropertyByKeyPath(templates,template),data)
			// time(`${template} end`)
			return s
			
		}catch(err){
			return `Oppsss! Render Hatasi: ${err.name} ${err.message}`
		}
	}

	
})(typeof exports === 'undefined'? this['Builder']={}: exports)


