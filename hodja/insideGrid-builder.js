(function(exports) {
	var frontEnd=true
	if(typeof config!='undefined'){
		if(typeof config.mongodb!='undefined'){
			frontEnd=false
		}
	}

	exports.InsideGridBuilder = Object.freeze({
		build:build
	})

	function build(item,callback){
		if(callback==undefined){
			return start(item)
		}
		return callback(null,start(item))

	}

	function start(item){
		var s=`

		<div class="table-responsive">
				<table id="grid${item.id}" class="table table-striped border m-0 table-bordered" cellspacing="0">
				${header(item)}
				<tbody>
				</tbody>
				</table>
				
		</div>

		
		<script type="text/javascript">
		`

		 // <div id="grid${item.id}-modal-add" class="float-right mt-1 mr-1">
			// 	<a class="btn btn-primary" href="javascript:gridHelper.editRowModal('grid${item.id}',grid${item.id})" title="Satir ekle"><i class="far fa-plus-square"></i> Satir Ekle</a>
			// 	</div>
		if(item.onchange){
			var onchange=item.onchange.replace('this.value',`e.detail`).replace('(this)','(e.detail)')
			s+=`document.getElementById('grid${item.id}').addEventListener('onchange',(e)=>{
				${onchange}
			})
			`
		}


		s+=`
		var grid${item.id}=JSON.parse(decodeURIComponent('${encodeURIComponent2(JSON.stringify(item))}'))
		// grid${item.id}['inputRowType']='modal'
		$(document).ready(()=>{

			// $('#gridInputType${item.id}').change((event)=>{
			// 	if($('#gridInputType${item.id}').prop('checked')){
			// 		grid${item.id}['inputRowType']='modal'
			// 		$('#grid${item.id}-edit-row').hide()
			// 		$('#grid${item.id}-modal-add').show()
			// 	}else{
			// 		grid${item.id}['inputRowType']='line'
			// 		$('#grid${item.id}-edit-row').show()
			// 		$('#grid${item.id}-modal-add').hide()
			// 	}
				
			// })

			gridHelper.refreshGridRows('grid${item.id}',grid${item.id})
		})

	
		</script>
		`

		s+=builder.control('form/modal_row',item)
		
		return s
	}
	
	function header(item){
		var fields=item.fields
		var s=`<thead><tr class="text-nowrap">`
		Object.keys(fields).forEach((key)=>{
				var field=fields[key]
				if((field.visible==undefined?true:field.visible)){
					var cls=''
					switch(field.type ){
						case 'money':
						case 'number':
						cls='text-right mr-1'
						break
						case 'boolean':
						cls='text-center'
						break
					}

					s+=`<th class="${cls}" style="${field.width?'width:' + field.width:''}">${field.icon?'<i class="' + field.icon + '"></i>':''} ${field.title || ''}</th>`
				}
		})
		s+=`<td style="width:100px;">#</td>`
		// s+=`
		// <td style="width:100px;">
		// 	<input type="checkbox" id="gridInputType${item.id}" checked data-toggle="toggle" data-size="xs" data-on="Form Giriş" data-off="Satır giriş" >
		// </td>`

		s+=`</tr></thead>`
		return s
	}


})(typeof exports === 'undefined'? this['InsideGridBuilder']={}: exports)