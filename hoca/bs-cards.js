// modify card headers 
// add toggle button on left side of header

module.exports=(html)=>{
	//return html
	var ch1=-1,ch2=-1
	var cbd1=-1,cbd2=-1
	var clp=-1
	var clped=-1
	var collapsed=false
	var stepOver=false
	var id=0
	var bContinue=false
	do{
		bContinue=false

		collapsed=false
		stepOver=true
		clp=-1
		clped=-1

		ch1=html.indexOf(`class="card-header`,cbd1+1)
		if(ch1>-1){
			clp=html.indexOf('collapsible',ch1+1)
			clped=html.indexOf('collapsed',ch1+1)
			ch2=html.indexOf(`>`,ch1+1)
			if(ch2>-1){
				if(clped>ch1 && clped<ch2){
					collapsed=true
					stepOver=false
				}else if(clp>ch1 && clp<ch2){
					stepOver=false
				}

				cbd1=html.indexOf(`<div class="card-body`,ch2+1)
				if(cbd1>-1){
					cbd2=findEndOfDiv(html,cbd1+1)
					if(cbd2>-1 && ch2>ch1 && cbd1>ch2 && cbd2>cbd1){
						id++
						if(stepOver==false){
							html=html.substr(0,ch2+1) + collapseBtn(id,collapsed) + html.substr(ch2+1,cbd1-ch2-1) + collapseDiv(id,collapsed) + html.substr(cbd1,cbd2-cbd1+1) + `</div>` + html.substr(cbd2+1)
						}
						bContinue=true
					}
				}
			}
			
		}
	}while(bContinue)


	return html
}

function collapseBtn(id,bCollapsed){
	return `<a class="btn btn-collapse" data-toggle="collapse" data-target="#cardCollapse${id}" aria-expanded="${bCollapsed?'false':'true'}" aria-controls="cardCollapse${id}" href="#"><i class="far fa-caret-square-up fa-2x"></i></a>`
}

function collapseDiv(id,bCollapsed){
	return `<div id="cardCollapse${id}" class="card-collapse collapse${bCollapsed?'':' show'}" aria-labelledby="cardHeading${id}">`
}

function findEndOfDiv(html,start){
	var divOpen=-1, divClose=-1
	var bContinue=false
	do{
		divOpen=html.indexOf('<div',start)
		divClose=html.indexOf('</div>',start)
		if(divClose>0 && (divClose<divOpen || divOpen<0)){
			bContinue=false
		}else{
			start=divClose+6
			bContinue=true
		}
	}while(bContinue)

	if(divClose<0)
		return -1
	return divClose+6
}
