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
		${modalRow(item)}

		
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
		
		s+=`</tr></thead>`
		return s
	}

	function modalRow(item){
		var fields=item.fields
		var s=`
		<div class="modal" id="modal${item.id}" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="true" aria-labelledby="modal${item.id}Label" aria-hidden="true">
			<div class="modal-dialog modal-lg modal-dialog-scrollable modal-dialog-centered" role="document">
				<div class="modal-content">
					<div class="modal-header p-2 ">
						<label class="modal-title" id="modal${item.id}Label"><i class="fas fa-edit"></i> Satır düzenle</label>
						<button class="close" type="button" data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<div class="modal-body p-2" style="overflow: auto;">
						${formBuilder.build(item,{})}
					</div>
					<div class="modal-footer">
						<a class="btn btn-primary" href="javascript:modal${item.id}_OK()" title="Kaydet"><i class="fas fa-check"></i> Tamam</a>
						<button class="btn btn-secondary" type="button" data-dismiss="modal">Vazgeç</button>
					</div>
				</div>
			</div>
		</div>
		`
		
		return s
	}
})(typeof exports === 'undefined'? this['InsideGridBuilder']={}: exports)