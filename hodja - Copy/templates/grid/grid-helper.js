(function(exports) {

	exports.GridHelper = Object.freeze({
		init:init,
		gridCopyItem:gridCopyItem,
		gridDeleteItem:gridDeleteItem,
		autoIncrement:autoIncrement
	})

	var deleteUrl=''
	var dataSourceUrl=''
	var copyUrl=''

	function init(id,fields,options){
		$(`#pageSize`).change(function(e){
			pageSettings.setItem(`pageSize`,$(`#pageSize`).val())
			q[`pageSize`]=$(`#pageSize`).val()
			q[`page`]=1
			reload()
		});

		$(`#selectAll`).on(`change`,(e)=>{
			$(`input:checkbox`).not($(`#selectAll`)).prop(`checked`, $(`#selectAll`).prop(`checked`))
		})

		console.log(`pageSettings.getItem('filterButton'):`,pageSettings.getItem(`filterButton`))
		if(pageSettings.getItem(`filterButton`)==true){
			$(`#filterRow`).collapse('show');
		}else{
			$(`#filterRow`).collapse('hide');
		}

		$(`#filterRow`).on(`hidden.bs.collapse`, function () {
			pageSettings.setItem(`filterButton`,false)
		})
		$(`#filterRow`).on(`shown.bs.collapse`, function () {
			pageSettings.setItem(`filterButton`,true)
		})


		if(options.filter){
			Object.keys(fields).forEach((key,index)=>{

				$(`#filter_${index}`).val((q[fields[key].filterField || key] || ''))
				if(fields[key].type=='lookup' || fields[key].type=='remoteLookup' || fields[key].type=='boolean'){
					
					$(`#filter_${index}`).on('change',(e)=>{
						keyupTimer=0
						runFilter(fields,options)
					})
					
				}else{

					$(`#filter_${index}`).on('keyup',(e)=>{
						setTimeout(()=>{
							keyupTimer=1
							runTimer(fields,options)
						},500)
					})
					
				}
			})	
		}


		if(options.dataSource){
			if(options.dataSource.url){
				dataSourceUrl=options.dataSource.url
			}
		}
		if(dataSourceUrl!=''){
			if(dataSourceUrl.indexOf('?')>-1){
				deleteUrl=`${dataSourceUrl.split('?')[0]}/{_id}?${dataSourceUrl.split('?')[1]}&sid=${q.sid}`
			}else{
				deleteUrl=`${dataSourceUrl}/{_id}?sid=${q.sid}`
			}
		}


		if(dataSourceUrl){
			if(dataSourceUrl.indexOf('?')>-1){
				copyUrl=`${dataSourceUrl.split('?')[0]}/copy/{_id}?${dataSourceUrl.split('?')[1]}&sid=${q.sid}`
			}else{
				copyUrl=`${dataSourceUrl}/copy/{_id}?sid=${q.sid}`
			}
		}
	}

	var keyupTimer=0

	function runTimer(fields,options){
		if(keyupTimer==0)
			return

		if(keyupTimer>=3){
			keyupTimer=0
			runFilter(fields,options)
		}else{
			keyupTimer++
			setTimeout(()=>{
				runTimer(fields,options)
			},1000)
		}
	}

	function runFilter(fields,options){
		var params=getAllUrlParams()
		var filtreVar=false
		Object.keys(fields).forEach((key,index)=>{
			if(options.filter){
				filtreVar=true;
				if($(`#filter_${index}`).val()!=''){
					params[fields[key].filterField || key]=$(`#filter_${index}`).val()
				}else{
					if(params[fields[key].filterField || key]!=undefined){
						params[fields[key].filterField || key]=undefined
						delete params[fields[key].filterField || key]
					}
				}
			}
		})

		if(filtreVar){
			params['page']=1
			reload(params)
		}
	}
	


	function gridDeleteItem(name,_id){
		confirmX('<b>"' + name + '"</b><br>Kayit silinecektir! Onaylıyor musunuz?','danger',(answer)=>{
			if(answer){
				var url=deleteUrl
				$.ajax({
					url:url.replaceAll('{_id}',_id),
					type:'DELETE',
					success:function(result){
						if(result.success){
							window.location.reload()
						}else{
							alertX('Hata:' + result.error.message)
						}
					},
					error:function(err){
						alertX((err.message || err.name || 'Hata oluştu'),'HATA','danger')
					}
				})
			}
		})
	}

	function gridCopyItem(name,_id){
		copyX({
			newName:{title:'Yeni isim',type:'string',value:name+ ' kopya'}
		},'Kopya oluştur',(answer,formData)=>{
			if(answer,formData){

				var url=copyUrl
				$.ajax({
					url:url.replaceAll('{_id}',_id),
					data:formData,
					type:'POST',
					success:function(result){
						if(result.success){
							window.location.reload()
						}else{
							alertX('Hata:' + result.error.message)
						}
					},
					error:function(err){
						alertX((err.message || err.name || 'Hata oluştu'),'HATA','danger')
					}
				})
			}
		})
	}

	function autoIncrement(item,itemValue,rowIndex){
		return 1
		// if(grid${id}data.list!=undefined && rowIndex<0){
		// 	var maxID=0
		// 	grid${id}data.list.forEach((e)=>{
		// 		var fieldName=item.field.replace('grid${id}-','')
		// 		var sayi=getPropertyByKeyPath(e,fieldName)

		// 		if(!isNaN(sayi)){

		// 			if(Number(sayi)>maxID){
		// 				maxID=Number(sayi)
		// 			}
		// 		}
		// 	})
		// 	return maxID+1
		// }else{
		// 	return itemValue
		// }
	}

})(typeof exports === 'undefined'? this['GridHelper']={}: exports)