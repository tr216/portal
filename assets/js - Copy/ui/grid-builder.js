(function(exports) {
	var frontEnd=true
	if(typeof config!='undefined'){
		if(typeof config.mongodb!='undefined'){
			frontEnd=false
			
		}
	}
	var elementId=0
	function newId(){
		elementId++
		return elementId
	}

	var defaultButtons={
		add:[false,''],
		edit:[false,''],
		delete:[false,''],
		view:[false,''],
		print:[false,''],
		copy:[false,'']
	}
	var currentPath=''
	var qParams={}


	exports.GridBuilder = Object.freeze({
		generateGrid:generateGrid,
		updateRow:updateRow,
		gridRow:gridRow
	})


	var generateGridScript1=false
	var generateGridScript=false

	function generateGrid(fields,options,uiParams,data,callback){

		if(callback==undefined){
			return start(fields,options,uiParams,data)
		}
		iteration(Object.keys(fields),(key,cb)=>{
			if(fields[key].type=='remoteLookup' && fields[key].dataSource!=undefined){
				if(frontEnd){
					cb(null)
				}else{
					fields[key].dataSource.label=fields[key].dataSource.label==undefined?'{name}':fields[key].dataSource.label
					api.get(fields[key].dataSource.url,uiParams,{},(err,resp)=>{
						if(!err){
							fields[key]['lookup']={}
							
							resp.data.docs.forEach((e)=>{
								fields[key].lookup[e._id]=replaceUrlCurlyBracket(fields[key].dataSource.label,e)
							})
							cb(null)
						}else{
							
							cb(err)
						}
					})
				}
			}else if(fields[key].type=='lookup' && fields[key].staticValues!=undefined){
				
				fields[key]['lookup']=staticValues[fields[key].staticValues]
				
				cb(null)
			}else{
				cb(null)
			}
		},0,true,(err,result)=>{
			if(!err){
				callback(null,start(fields,options,uiParams,data))
			}else{
				callback(err)
			}
		})
	}

	function start(fields,options,uiParams,data){
		var id=newId()
		
		if(frontEnd){
			currentPath=window.location.pathname
			qParams=q
		}else{

			currentPath=uiParams.urlPath
			qParams=uiParams
		}

		options.show={
			filter:true,
			pageSize:true,
			pageCount:true,
			pagerButtons:true,
			header:true,
			footer:true
		}

		
		if(options.insideForm){
			options.show.filter=false
			options.show.pageSize=false
			options.show.pageCount=false
			options.show.pagerButtons=false
		}else{
			options.insideForm=false
		}

		if(options.parentField==undefined){
			options.parentField=''
		}

		if(data.docs==undefined && data.list!=undefined){
			data.docs=data.list
		}

		if((data.pageSize || '')=='')
			data['pageSize']=50000

		data['page']=data['page']!=undefined?data.page:1
		data['pageCount']=data['pageCount']!=undefined?data.pageCount:0
		data['recordCount']=data['recordCount']!=undefined?data.recordCount:0



		var s=``

		
		var script1=``

		if(generateGridScript1==false){
			script1+=`<script type="text/javascript">
			var keyupTimer=0

			var fields=` + JSON.stringify(fields) + `
			var options=` + JSON.stringify(options) + `
			var list=` + JSON.stringify(data.docs) + `

			Object.keys(fields).forEach((key)=>{
				if(fields[key].field==undefined){
					fields[key]['field']=key
				}
				if(fields[key].visible==undefined){
					fields[key]['visible']=true
				}
			})
			</script>
			`
		}

		if(frontEnd){
			if(generateGridScript1==false){
				$('body').append(script1)
				generateGridScript1=true
			}
		}else{
			s+=script1
		}

		var script=``

		if(generateGridScript==false){
			script +=`<script type="text/javascript">

			`
		}
		options=buttonOptions(options)

		if(options.insideForm==false){
			s+=`<div class="table-responsive mt-1">`
		}else{
			s+=`<div class="table-responsive">`
		}
		if(options.show.filter || options.show.pageSize || options.show.pageCount || options.show.pagerButtons){
			s+=`<div class="row m-0 border">
			<div class="col-12 pt-1 px-1">
			<div class="float-left form-inline m-0 p-0 mt-1 mb-1">`
			if(options.show.filter){
				s+=`${(options.filter || false)?'<a class="btn btn-secondary btn-sm mr-3" data-toggle="collapse" href="#filterRow" role="button" aria-expanded="false" aria-controls="filterRow" title="Filtre satırını göster/gizle"><i class="fas fa-filter"></i></a>':''}`
			}
			if(options.show.pageSize){
				s+=`${gridPageSize(data.pageSize)}`
			}
			
			if(options.show.pageCount){
				s+=`<div class="" style="display: inline-flex;">
				${gridPageCount(data)}
				</div>`
			}
			
			s+=`</div>`

			if(options.show.pagerButtons){
				s+=`<div class="float-right">
				${gridPagerButtons(uiParams,data)}
				</div>`
			}
			
			s+=`</div>
			</div>`
		}
		s+=`<table id="grid${id}" class="table table-striped border m-0 ${options.insideForm?'table-bordered':''}"  cellspacing="0">`
		if(options.show.header){
			s+=`${gridHeader(fields,options)}`
		}
		
		s+=`<tbody id="gridBody${id}">`
		
		if(options.insideForm==false){
			data.docs.forEach((row,index)=>{
				s+=gridRow(id,fields,options,row,index)
			})
			if(options.insideForm && options.buttons.add[0]){
				s+=updateRow(id,fields,options,null)
			}
		}else{
			if(generateGridScript==false){
				script+=`
				function refreshGrid${id}(editRowIndex=-100){
					var table1=document.querySelector('#gridBody${id}')
					table1.innerHTML=''

					list.forEach((e,index)=>{
						if(index==editRowIndex){
							table1.innerHTML+=\`\${gridBuilder.updateRow(${id},fields,options,e,index)}\` 
						}else{
							table1.innerHTML+=\`\${gridBuilder.gridRow(${id},fields,options,e,index)}\` 
						}
					})
					`

					if(options.insideForm && options.buttons.add[0]){
						script+=`
						if(editRowIndex<0){
							table1.innerHTML+=\`\${gridBuilder.updateRow(` + id + `,fields,options,null)}\`
						}
						`
					}
					script+=`
				}
				refreshGrid${id}()

				
				`
			}
		}
		
		s+=`
		</tbody>
		</table>`
		if(options.show.pageCount || options.show.pagerButtons){
			s+=`<div class="row m-0 border">
			<div class="col-12 pt-1 px-1">`
			if(options.show.pageCount){
				s+=`<div class="float-left form-inline m-0 p-0 mt-1 mb-1">
				${gridPageCount(data)}
				</div>`
			}
			if(options.show.pagerButtons){
				s+=`<div class="float-right">
				${gridPagerButtons(uiParams,data)}
				</div>`
			}
			s+=`</div>
			</div>`
		}
		
		
		s+=`</div>
		`
		
		if(generateGridScript==false){
			script+=`$(document).ready(()=>{

				$("#btnExportExcel").click(function () {
					fnExcelReport('grid${id}','<%- title%>');
				});
				$("#btnExportCsv").click(function () {
					fnCsvReport('grid${id}','<%- title%>');
				});

				$('#pageSize').change(function(e){
					pageSettings.setItem('pageSize',$('#pageSize').val())
					q['pageSize']=$('#pageSize').val()
					q['page']=1
					reload()
				});

				$('#selectAll').on('change',(e)=>{
					$('input:checkbox').not($('#selectAll')).prop('checked', $('#selectAll').prop('checked'))
				})
				`

				if(options.filter){
					Object.keys(fields).forEach((key,index)=>{
						script+=`
						$('#filter_${index}').val((q['${fields[key].filterField || key}'] || ''))
						`
						if(fields[key].type=='lookup' || fields[key].type=='remoteLookup' || fields[key].type=='boolean'){
							script+=`
							$('#filter_${index}').on('change',(e)=>{
								keyupTimer=0
								runFilter()
							})
							`
						}else{
							script+=`
							$('#filter_${index}').on('keyup',(e)=>{
								setTimeout(()=>{
									keyupTimer=1
									runTimer()
								},500)
							})
							`
						}
					})	
				}

				script +=`
				function runTimer(){
					if(keyupTimer==0)
						return

					if(keyupTimer>=3){
						keyupTimer=0
						runFilter()
					}else{
						keyupTimer++
						setTimeout(runTimer,1000)
					}
				}
				function runFilter(){
					var params=getAllUrlParams()
					var filtreVar=false
					Object.keys(fields).forEach((key,index)=>{
						if(options.filter){
							filtreVar=true;
							if($('#filter_' + index).val()!=''){
								params[fields[key].filterField || key]=$('#filter_' + index).val()
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
				if(pageSettings.getItem('filterButton')==true){
					$('#filterRow').collapse({toggle:true});
				}else{
					$('#filterRow').collapse({toggle:false});
				}

				$('#filterRow').on('hidden.bs.collapse', function () {
					pageSettings.setItem('filterButton',false)
				})
				$('#filterRow').on('shown.bs.collapse', function () {
					pageSettings.setItem('filterButton',true)
				})
			})`

			var deleteUrl=''
			var dataSourceUrl=''
			if(options.dataSource){
				if(options.dataSource.url){
					dataSourceUrl=options.dataSource.url
				}
			}
			if(dataSourceUrl!=''){
				if(dataSourceUrl.indexOf('?')>-1){
					deleteUrl=`${dataSourceUrl.split('?')[0]}/{_id}?${dataSourceUrl.split('?')[1]}&sid=${qParams.sid}`
				}else{
					deleteUrl=`${dataSourceUrl}/{_id}?sid=${qParams.sid}`
				}
			}
			script +=`
			function gridDeleteItem(name,_id){
				confirmX('<b>"' + name + '"</b><br>Kayit silinecektir! Onaylıyor musunuz?','danger',(answer)=>{
					if(answer){
						var url='${deleteUrl}'
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
			`
			var copyUrl=''
			if(dataSourceUrl){
				if(dataSourceUrl.indexOf('?')>-1){
					copyUrl=`${dataSourceUrl.split('?')[0]}/copy/{_id}?${dataSourceUrl.split('?')[1]}&sid=${qParams.sid}`
				}else{
					copyUrl=`${dataSourceUrl}/copy/{_id}?sid=${qParams.sid}`
				}
			}
			script+=`
			function gridCopyItem(name,_id){
				copyX({
					newName:{title:'Yeni isim',type:'string',value:name+ ' kopya'}
				},'Kopya oluştur',(answer,formData)=>{
					if(answer,formData){
						
						var url='${copyUrl}'
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
			</script>`

		}
		if(frontEnd){
			if(generateGridScript==false){
				$('body').append(script)
				generateGridScript=true	
			}
			
		}else{
			s+=script
		}
		return s
	}

	var updateRowScript=false

	function updateRow(id,fields,options,row,rowIndex=-100){
		
		var s=`<tr id="divUpdateRow${id}">
		`

		Object.keys(fields).forEach((key,index)=>{
			if(fields[key].field==undefined){
				fields[key]['field']=key
			}
			if((fields[key].visible==undefined?true:fields[key].visible)){
				var itemValue=''
				if((row || '')!=''){
					itemValue=getPropertyByKeyPath(row,fields[key].field) || ''
				}

				var item=clone(fields[key])
				item.required=false
				if(item.type==undefined)
					return ''
				s+=`<td class="${fields[key].class || 'pt-2'}">`
				switch(item.type.toLowerCase()) {
					case 'string' : 
					case 'textbox' : 
					s+=formBuilder.textBox(item,itemValue,true)
					break

					case 'remotelookup' : 
					s+=formBuilder.remoteLookup(item,itemValue,true)
					break
					case 'money' :
					case 'number' :
					case 'numberbox' :
					s+= formBuilder.numberBox(item,itemValue,true)
					break
					case 'autoinc' :
					case 'identity' :
					case 'autoincrement' :
					if(list!=undefined && rowIndex<0){
						var maxID=0
						list.forEach((e)=>{
							var sayi=getPropertyByKeyPath(e,item.field)
							if(!isNaN(sayi)){
							
								if(Number(sayi)>maxID){
									maxID=Number(sayi)
								}
							}
						})
						itemValue=maxID+1
					}
					s+= formBuilder.numberBox(item,itemValue,true)
					break
					case 'date' :
					s+= formBuilder.dateBox(item,itemValue,true)
					break
					case 'time' :
					s+= formBuilder.timeBox(item,itemValue,true)
					break
					case 'daterange' :
					s+= formBuilder.dateRangeBox(item,itemValue,true)
					break
					case 'label': 
					case 'div': 
					s+=  formBuilder.label(item,itemValue,true)
					break

					case 'strings' :
					case 'textarea' :
					s+=formBuilder.textArea(item,itemValue,true)
					break

					case 'boolean':
					case 'checkbox':
					s+=formBuilder.checkBox(item,itemValue,true)
					break

					case 'lookup': 
					case 'combobox': 

					s+=formBuilder.lookUp(item,itemValue,true)
					break

					default :
					s+=formBuilder.textBox(item,itemValue,true)
					break
				}
			}
			s+=`</td>`

		})



		s+=`<td class="text-center pt-1">`
		
		s+=`<a href="javascript:okUpdateRow${id}(${rowIndex})" class="btn btn-grid-row btn-primary " title="Tamam"><i class="fas fa-check"></i></a>`
		// s+=`<button class="btn btn-grid-row btn-primary" type="submit" title="Tamam"><i class="fas fa-check"></i></button>`
		s+=`<a href="javascript:cancelUpdateRow${id}(${rowIndex})" class="btn btn-grid-row btn-secondary ml-1" title="Vazgeç"><i class="fas fa-undo"></i></a>`
		s+=`</td>`

		s+=`
		</tr>
		`
		if(updateRowScript==false){
			var script=`<script type="text/javascript">

			$(document).ready(()=>{
				
				var divUpdateRow${id}_changing=false
				$('#divUpdateRow${id} input[type="number"]').change((e)=>{
					if(divUpdateRow${id}_changing==true)
						return
					divUpdateRow${id}_changing=true
					

					var obj=getupdateRowValues${id}()
					if(!obj){
						divUpdateRow${id}_changing=false
						return
					}
					`
					Object.keys(fields).forEach((key)=>{
						
						if(fields[key].calc!=undefined){
							var keyVar='formula_' + generateFormId(fields[key].field).replaceAll('-','_')
							var controlId=generateFormId(fields[key].field)
							var formul=fields[key].calc
							Object.keys(fields).forEach((key2)=>{
								formul=formul.replaceAll(`{${fields[key2].field}}`,`obj['${fields[key2].field}']`)
							})
							script+=`
							var ${keyVar}=\`${formul}\`
							console.log('obj:',obj)
							console.log(${keyVar})
							$('#${controlId}').val(eval(${keyVar}))
							`
						}
					})

					script+=`
					divUpdateRow${id}_changing=false
				})

			})


			function okUpdateRow${id}(rowIndex=-100){
				var obj=listObjectToObject(getupdateRowValues${id}())
				if(!obj)
					return false
				if(rowIndex<0){
					list.push(obj)
				}else{
					list[rowIndex]=Object.assign(list[rowIndex],obj)
				}
				refreshGrid${id}()
				$('#divUpdateRow${id} #${generateFormId(fields[Object.keys(fields)[0]].field)}').focus()
				return false
			}

			function getupdateRowValues${id}(){
				var obj={}
				`
				Object.keys(fields).forEach((key,index)=>{
					if(fields[key].type=='number'){
						script+=`
						if(!isNaN($('#divUpdateRow${id} #${generateFormId(fields[key].field)}').val())){
							obj['${fields[key].field}']=Number($('#divUpdateRow${id} #${generateFormId(fields[key].field)}').val())
						}else{
							obj['${fields[key].field}']=0
						}
						
						`
					}else{
						script+=`
						obj['${fields[key].field}']=$('#divUpdateRow${id} #${generateFormId(fields[key].field)}').val()
						`
					}
				})
				script+=`

				var valid=true
				var validMessage=''
				Object.keys(fields).forEach((key)=>{
					if(fields[key].required){
						if($('#divUpdateRow${id} #' + generateFormId(fields[key].field)).val()==''){
							valid=false
							validMessage+=fields[key].field + ' gereklidir<br>'
						}
					}
				})
				if(valid==false){
					toastAlert(validMessage,'Geçerlilik hatası')
					return
				}
				return obj
			}

			function removeGridRow${id}(rowIndex){
				`
				if((options.confirmBeforeRemove==undefined?true:options.confirmBeforeRemove)){
					script+=`confirmX('Satır silinecektir! Onaylıyor musunuz?',(answer)=>{
						if(answer){
							list.splice(rowIndex,1)
							reorderList${id}()

							refreshGrid${id}()
						}
					})
					`
				}else{
					script+=`
					list.splice(rowIndex,1)
					reorderList${id}()
					refreshGrid${id}()
					`
				}
				script+=`
			}

			function reorderList${id}(){
				Object.keys(fields).forEach((key)=>{
					if(fields[key].type=='identity' || fields[key].type=='autoInc' || fields[key].type=='autoIncrement'){
						var fieldName=fields[key].field
						list.forEach((e,index)=>{

							console.log('fieldName',fieldName)

							var listObj={}
							var obj={}
							listObj[fieldName]=index+1
							obj=listObjectToObject(listObj)
							e=Object.assign(e,obj)
						
						})
					}
				})
			}
			function cancelUpdateRow${id}(rowIndex){
				refreshGrid${id}()
				$('#divUpdateRow${id} #${generateFormId(fields[Object.keys(fields)[0]].field)}').focus()
			}
			</script>`

		}
		if(frontEnd){
			if(updateRowScript==false){
				$('body').append(script)
				updateRowScript=true
			}
			
		}else{
			s+=script
		}
		

		return s
	}

	function gridRow(id,fields,options,row,rowIndex=-100){
		var s=``
		
		s+=`<tr class="grid${id}-row">`
		s+=`${options.selection && row._id?'<td><input type="checkbox" class="grid-checkbox checkSingle" value="${encodeURIComponent2(JSON.stringify(row))}" name="selected[${index}]"  id="selected[${index}]" title="Seç"></td>':''}`
		Object.keys(fields).forEach((key)=>{
			if(options.parentField!=''){
				if(rowIndex>-1){
					fields[key].fullField=`${options.parentField}.${rowIndex}.${fields[key].field}`
				}else{
					fields[key].fullField=`${options.parentField}.${fields[key].field}`
				}
			}else{
				fields[key].fullField=fields[key].field
			}
		})

		var row2=clone((row || {}))
		Object.keys(fields).forEach((key,index)=>{
			if((fields[key].visible==undefined?true:fields[key].visible)){
				if(fields[key].field==undefined)
					fields[key].field=key
				var itemValue=getPropertyByKeyPath(row,fields[key].field) || ''
				var td=''

				if(fields[key].type=='lookup' || fields[key].type=='remoteLookup'){
					var lookupText=''
					Object.keys(fields[key].lookup || {}).forEach((key2)=>{
						if(key2===itemValue.toString()){
							lookupText = fields[key].lookup[key2]
							return
						}
					})
					td=`<td class="${fields[key].class || 'ml-1'}">`
					itemValue=lookupText
				}else if(fields[key].type=='number'){
					td=`<td class="${fields[key].class || 'text-right mr-1'}">`
				}else if(fields[key].type=='money'){
					td=`<td class="${fields[key].class || 'text-right mr-1'}">`
					itemValue=Number(itemValue).formatMoney()
				}else if(fields[key].type=='boolean'){
					td=`<td class="${fields[key].class || 'text-center'}" style="font-size:20px;">`
					if(fields[key].html==undefined){
						itemValue=itemValue?'<i class="fas fa-check-square text-primary"></i>':'<i class="far fa-square text-dark"></i>'
					}
				}else{
					td=`<td class="${fields[key].class || 'ml-1'}">`
				}
				
				if(options.insideForm){

					itemValue=itemValue + `<input type="hidden" id="${generateFormId(fields[key].fullField)}" name="${generateFormName(fields[key].fullField)}" value="${itemValue}">`
				}

				if(fields[key].html!=undefined){
					var html=fields[key].html
					row2[fields[key].field]=itemValue
					html=replaceUrlCurlyBracket(html,row2)
					
					s+=`<td class="${fields[key].class || 'ml-1'}">${html}`
				}else{
					s+=td + itemValue
				}
				
				s+=`</td>`
			}
		})

		s+=`<td class="text-center">`

		if(options.insideForm==false){
			Object.keys(options.buttons).forEach((key)=>{
				if(defaultButtons[key]==undefined){
					s+=`${options.buttons[key][0]?replaceUrlCurlyBracket(options.buttons[key][1],row):''}`
				}
			})
			var field0=''
			if(fields['name']!=undefined){
				field0='name'
			}else{
				Object.keys(fields).forEach((key,index)=>{
					if(field0!='')
						return
					if(fields[key].field.indexOf('name')>-1){
						field0=fields[key].field
						return
					}
					if(fields[key].type=='string'){

						field0=fields[key].field
						return
					}
				})
				if(field0==''){
					field0=fields[Object.keys(fields)[0]].field
				}
			}
			var deleteButtonHtml=''
			if(options.buttons.delete[0]){
				deleteButtonHtml=options.buttons.delete[1]
				deleteButtonHtml=deleteButtonHtml.replaceAll('{field[0]}',getPropertyByKeyPath(row,field0))
				deleteButtonHtml=replaceUrlCurlyBracket(deleteButtonHtml,row)
			}

			var copyButtonHtml=''
			if(options.buttons.copy[0]){
				copyButtonHtml=options.buttons.copy[1]
				copyButtonHtml=copyButtonHtml.replaceAll('{field[0]}',getPropertyByKeyPath(row,field0))
				copyButtonHtml=replaceUrlCurlyBracket(copyButtonHtml,row)
			}

			s+=`${copyButtonHtml}
			${options.buttons.print[0]?replaceUrlCurlyBracket(options.buttons.print[1],row):''}
			${options.buttons.view[0]?replaceUrlCurlyBracket(options.buttons.view[1],row):''}
			${options.buttons.edit[0]?replaceUrlCurlyBracket(options.buttons.edit[1],row):''}
			${deleteButtonHtml}`
		}else{
			s+=`<a href="javascript:refreshGrid${id}(${rowIndex})" class="btn btn-grid-row status-iade" title="Satır düzenle"><i class="fas fa-edit"></i></a>`
			s+=`<a href="javascript:removeGridRow${id}(${rowIndex})" class="btn btn-grid-row btn-danger ml-2" title="Satır sil"><i class="fas fa-trash-alt"></i></a>`
		}

		
		s+=`</td>`

		s+=`</tr>`
		return s
	}

	// function textBox(field,value){
	// 	return `<input type="text" class="form-control ${field.class || ''}" id="${generateFormId(field.field)}" name="${generateFormName(field.field)}" placeholder="${field.readonly==true?'':field.title}" autocomplete="chrome-off" onkeydown="" value="${value}" ${field.required?'required="required"':''} ${field.readonly==true?'readonly':''}>
	// 	`
	// }


	function gridHeader(fields,options){
		var s=`<thead>
		<tr class="text-nowrap">
		${options.selection?'<th style="width: 30px;"><input class="grid-checkbox" type="checkbox" value="true" name="selectAll" id="selectAll" title="Tümünü seç"></th>':''}
		`

		Object.keys(fields).forEach((key)=>{
			if((fields[key].visible==undefined?true:fields[key].visible)){
				var cls=''
				switch(fields[key].type){
					case 'money':
					case 'number':
					cls='text-right mr-1'
					break
					case 'boolean':
					cls='text-center'
					break
				}
				s+=`<th class="${cls}" style="${(typeof fields[key].width!='undefined')?'width:' + fields[key].width:''}">${(typeof fields[key].icon!='undefined')?'<i class="' + fields[key].icon + '"></i>':''} ${fields[key].title || fields[key].caption || fields[key].text || ''}</th>`
			}
		})

		s+=`<th class="text-center" style="width:${options.buttonWidth}">`
		if(!options.insideForm){
			s+=`${options.buttons.add[0]==true?options.buttons.add[1]:''}`
		}
		s+=`</th>
		</tr>
		`
		if(options.filter){
			s+=`<tr class="collapse" id="filterRow">
			${options.selection?'<th></th>':''}
			`
			Object.keys(fields).forEach((key,index)=>{
				if((fields[key].visible==undefined?true:fields[key].visible)){
					
					s+=`<th class="" style="">`
					if((fields[key].filter==undefined?options.filter:fields[key].filter)){
						if(fields[key].type=='lookup' || fields[key].type=='remoteLookup'){
							s+=`<select name="filter_${index}" id="filter_${index}" class="form-control p-0 m-0 grid-filter">`
							s+=`<option value="">*</option>`
							Object.keys(fields[key].lookup || {}).forEach((key2)=>{
								s+=`<option value="${key2}">${fields[key].lookup[key2]}</option>`
							})
							s+=`</select>`
						}else if(fields[key].type=='boolean'){
							s+=`<select name="filter_${index}" id="filter_${index}" class="form-control p-0 m-0 grid-filter">
							<option value="">*</option>
							<option value="true"><i class="fas fa-check-square text-primary"></i> Evet</option>
							<option value="false"><i class="far fa-square text-dark"></i> Hayır</option>
							</select>`
						}else{
							s+=`<input type="text" class="form-control p-0 m-0 grid-filter" name="filter_${index}" id="filter_${index}" placeholder="${fields[key].placeholder || ''}" value="">`
						}
					}
					s+=`</th>`
				}
			})
			s+=`<th></th>`
			s+=`</tr>`
		}
		s+=`</thead>`
		return s
	}

	


	function buttonOptions(options){

		var buttonCount=0
		if(options.buttons==undefined){
			options.buttons=defaultButtons
		}else{
			options.buttons=Object.assign({},defaultButtons, options.buttons)
			Object.keys(options.buttons).forEach((key)=>{
				if(typeof options.buttons[key]=='boolean'){
					options.buttons[key]=[options.buttons[key],'']
				}else if(Array.isArray(options.buttons[key])){
					if(options.buttons[key].length<2)
						options.buttons[key].push('')
				}
			})
		}

		if(options.buttons.add[0]==true && options.buttons.add[1]==''){
			options.buttons.add[1]=`<a href="${currentPath}/addnew?sid=${qParams.sid}&mid=${qParams.mid}" class="btn btn-primary  btn-sm far fa-plus-square" target="_self"  title="Yeni Ekle"></a>`
		}

		if(options.buttons.copy[0]==true && options.buttons.copy[1]==''){
			options.buttons.copy[1]=`<a href="javascript:gridCopyItem('{field[0]}','{_id}')" class="btn btn-grid-row btn-success " title="Kopyala"><i class="fas fa-copy"></i></a>`
		}

		if(options.buttons.print[0]==true && options.buttons.print[1]==''){
			options.buttons.print[1]=`<a href="javascript:popupCenter('${currentPath}/print/{_id}?sid=${qParams.sid}&mid=${qParams.mid}','Yazdır','900','600')" class="btn btn-grid-row btn-info " title="Yazdır"><i class="fas fa-print"></i></a>`
		}

		if(options.buttons.view[0]==true && options.buttons.view[1]==''){
			options.buttons.view[1]=`<a href="javascript:popupCenter('${currentPath}/view/{_id}?sid=${qParams.sid}&mid=${qParams.mid}','İncele','900','600')" class="btn btn-info btn-grid-row fa fa-eye" title="İncele"></a>`
		}

		if(options.buttons.edit[0]==true && options.buttons.edit[1]==''){
			options.buttons.edit[1]=`<a href="${currentPath}/edit/{_id}?sid=${qParams.sid}&mid=${qParams.mid}" class="btn btn-primary btn-grid-row fas fa-edit" target="_self"  title="Düzenle"></a>`
		}

		if(options.buttons.delete[0]==true && options.buttons.delete[1]==''){
			options.buttons.delete[1]=`<a href="javascript:gridDeleteItem('{field[0]}','{_id}')" class="btn btn-danger btn-grid-row fas fa-trash-alt" title="Sil"></a>`
		}

		Object.keys(options.buttons).forEach((key)=>{
			buttonCount +=options.buttons[key][0]?1:0
		})
		if(buttonCount>1 && options.buttons.add[0])
			buttonCount--

		buttonCount=buttonCount>4?4:buttonCount
		options.buttonWidth=`${buttonCount*45+10}px`

		return options
	}


	function gridPagerButtons(q,d){
		var s=``
		if(d.pageCount>1) {
			s=`
			<ul class="pagination mb-1">`
			if(d.page>1){
				s+=`<li class="page-item"><a class="page-link" href="${q.urlPath}?sid=${q.sid}&mid=${q.mid}&page=1&${q.filterString!=''?q.filterString:''}">|&lt;</a></li>
				<li class="page-item"><a class="page-link" href="${q.urlPath}?sid=${q.sid}&mid=${q.mid}&page=${(d.page-1)}&${q.filterString!=''?q.filterString:''}">&lt;</a></li>`
			}

			var sayfalar=pagination(d.page,d.pageCount)
			sayfalar.forEach((e)=>{
				if(e==d.page.toString()){
					s+=`<li class="page-item active"><span class="page-link">${d.page}</span></li>`
				}else if(e=='...'){
					s+=`<li class="page-item"><span class="page-link">...</span></li>`
				} else {
					s+=`<li class="page-item"><a class="page-link" href="${q.urlPath}?sid=${q.sid}&mid=${q.mid}&page=${e}&${q.filterString!=''?q.filterString:''}">${e}</a></li>`
				}
			})

			if(d.page<d.pageCount){
				s+=`<li class="page-item"><a class="page-link" href="${q.urlPath}?sid=${q.sid}&mid=${q.mid}&page=${d.page+1}&${q.filterString!=''?q.filterString:''}">&gt;</a></li>
				<li class="page-item"><a class="page-link" href="${q.urlPath}?sid=${q.sid}&mid=${q.mid}&page=${d.pageCount}&${q.filterString!=''?q.filterString:''}">&gt;|</a></li>`
			}

			s+=`</ul>`
		}
		return s
	}

	function gridPageCount(d){
		var s=`<div class="" style="display: inline-block">`
		if(d.pageSize>0 && d.recordCount>0){
			s+=`${((d.page-1)*d.pageSize)+1} - ${(d.page*d.pageSize<d.recordCount)?d.page*d.pageSize:d.recordCount} arası, Toplam: ${d.recordCount} kayit, ${d.pageCount} sayfa`
		}else{
			s+=`Toplam: ${d.recordCount} kayit`
		}
		s+=`</div>`
		return s
	}


	function gridPageSize(pageSize){

		if(pageSize<=0){
			return ''
		}

		var s=`<div class="mt-1 align-items-center" style="display: inline-flex">
		Sayfada
		<select class="form-control input-inline input-sm" name="pageSize" id="pageSize">
		<option value="10" ${pageSize==10?'selected':''}>10</option>
		<option value="20" ${pageSize==20?'selected':''}>20</option>
		<option value="50" ${pageSize==50?'selected':''}>50</option>
		<option value="100" ${pageSize==100?'selected':''}>100</option>
		<option value="250" ${pageSize==250?'selected':''}>250</option>
		<option value="500" ${pageSize==500?'selected':''}>500</option>
		</select>
		</div>
		`
		return s
	}


	function pagination(c, m) {
		var current =Number(c),
		last = Number(m),
		delta = 2,
		left = current - delta,
		right = current + delta + 1,
		range = [],
		rangeWithDots = [],
		l

		var i=1
		while(i<=last){
			if (i == 1 || i == last || i >= left && i < right) {
				range.push(i)
			}
			i++
		}


		for (let i of range) {
			if (l) {
				if (i - l == 2) {
					rangeWithDots.push(l + 1)
				} else if (i - l != 1) {
					rangeWithDots.push('...')
				}
			}
			rangeWithDots.push(i)


			l = i
		}

		return rangeWithDots
	}

})(typeof exports === 'undefined'?  
this['GridBuilder']={}: exports)

