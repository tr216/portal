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

		if(item.onchange){
			var onchange=item.onchange.replace('this.value',`e.detail`).replace('(this)','(e.detail)')
			s+=`document.getElementById('grid${item.id}').addEventListener('onchange',(e)=>{
				${onchange}
			})
			`
		}


		s+=`
		var grid${item.id}=JSON.parse(decodeURIComponent('${encodeURIComponent2(JSON.stringify(item))}'))

		$(document).ready(()=>{

			gridHelper.refreshGridRows('grid${item.id}',grid${item.id})
		})



		</script>
		`
		if(item.modal){

			if(item.parentField){
				item.modal.parentField=item.parentField
			}
			item.modal.type='modalRow'
			item.controls=formBuilder.build(item.modal,{})
			s+=builder.control('form/modal_row',item)

			s+=`
			<script type="text/javascript">
				$(document).ready(()=>{
			`

			var prefix=`modalRow${item.modal.parentField || ''}`
		
			Object.keys(item.fields).forEach((key)=>{
					var field=item.fields[key]
					if(!field.field){
						field.field=key
					}
					s+=`
					$('#${generateFormId(prefix + '.' + field.field)}').on('change',(e)=>{
						gridHelper.modalRowChange('modalRow${item.id}',grid${item.id},e)
					})
					`
			})

			s+=`
			})
			</script>
			`
		}
		
		
		return s
	}
	
	function header(item){
		var fields=item.fields
		var s=`<thead><tr class="text-nowrap">`
		Object.keys(fields).forEach((key)=>{
			var field=fields[key]
			if(field.visible==undefined){
				field.visible=true
			}
			
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

			s+=`<th class="${cls}" style="${field.width?'width:' + field.width:''};${field.visible==false?'display:none;':''}">${field.icon?'<i class="' + field.icon + '"></i>':''} ${field.title || ''}</th>`
			
		})
		if(item.modal){
			s+=`<td class="text-center" style="width:100px;"><a class="btn btn-primary" href="javascript:gridHelper.gridModalEdit('grid${item.id}',grid${item.id},-1)" ><i class="far fa-plus-square"></i></a></td>`
		}else{
			s+=`<td class="text-center" style="width:100px;">#</td>`
		}

		
		s+=`</tr></thead>`
		return s
	}



})(typeof exports === 'undefined'? this['InsideGridBuilder']={}: exports)