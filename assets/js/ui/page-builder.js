(function(exports) {
	var frontEnd=true
	if(typeof config!='undefined'){
		if(typeof config.mongodb!='undefined'){
			frontEnd=false
			
		}
	}
	
	var currentPath=''

	exports.PageBuilder = Object.freeze({
		create:create
	})

	function create(pageTemplate){
		var s=``
		if(!Array.isArray(pageTemplate)){
			pageTemplate=[pageTemplate]
		}
		pageTemplate.forEach((e)=>{
			switch(e.type){
				case 'grid':
				
				s+=gridBuilder.generate((e.fields || e.controls),e.options,e.ui)
				break
				case 'filte11r':
				s+=filterBuilder.generateFilter((e.fields || e.controls),e.data)
				break
			}
		})
		

		return s
	}
})(typeof exports === 'undefined'?  
this['PageBuilder']={}: exports)
