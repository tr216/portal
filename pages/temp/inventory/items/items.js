module.exports = function(req,res,callback){

	var data={
		accountGroupList:{},
		form:{
			_id:'',
			itemType:(req.query.itemType || 'item'),
			name:{ value:''},
			additionalItemIdentification:[{ID:{ value:''}}],
			brandName:{ value:''},
			buyersItemIdentification:{ID:{ value:''}},
			commodityClassification:[
			{ 
				itemClassificationCode:{value:''}
			}
			],
			description:{ value:''},
			keyword:{ value:''},
			manufacturersItemIdentification:{ID:{ value:''}},
			modelName:{ value:''},
			sellersItemIdentification:{ID:{ value:''}},
			originCountry:{},
			itemInstance:[],
			accountGroup: '',
			similar:[],
			unitPacks:[],
			vendors:[{
				sequenceNumeric:{value:0 },
				vendor:null,
				supplyDuration:{value:0 }
			}],
			supplyDuration:{value:0 },
			tags:'',
			images:[{ data: '', type: '', fileName: '' },{ data: '', type: '', fileName: '' },{ data: '', type: '', fileName: '' }],
			files:[{ data: '', type: '', fileName: '' },{ data: '', type: '', fileName: '' },{ data: '', type: '', fileName: '' }],
			localDocumentId:'',
			passive:false,
			barkodlar:'',
			tracking:{
				pallet:false,
				lotNo:false,
				serialNo:false,
				color:false,
				pattern:false,
				size:false
			},
			packingOptions:[]
		},
		filter:{},
		list:[]
	}


	switch(req.params.func || ''){
		case 'addnew':
		
		addnew(req,res,data,callback)
		break
		case 'edit':
		edit(req,res,data,callback)
		break
		case 'view':
		edit(req,res,data,callback)
		break
		case 'delete':
		
		deleteItem(req,res,data,callback)
		break
		default:
		data.filter=getFilter(data.filter,req,res)
		if(req.method!='POST') 
			getList(req,res,data,callback)
		break
	}
	
}

function getList(req,res,data,callback){
	data.filter['itemType']=data.form.itemType
	initLookUpLists(req,res,data,(err,data)=>{
		
		api.get(`/{db}/items`,req,data.filter,(err,resp)=>{
			if(!err){
				data=mrutil.setGridData(data,resp)
			}
			callback(null,data)
		})
	})
}


function initLookUpLists(req,res,data,cb){
	data.accountGroupList={}
	
	api.get(`/{db}/account-groups`,req,{},(err,resp)=>{
		if(!err){
			resp.data.docs.forEach((e)=>{
				data.accountGroupList[e._id.toString()]=e.name
			})
		}
		cb(null,data)
	})
}

function addnew(req,res,data,callback){
	initLookUpLists(req,res,data,(err,data)=>{
		
		if(req.method=='POST'){
			data.form=Object.assign(data.form,req.body)
			var barkodList=data.form.barkodlar.split('\n')
			
			var dizi=[]

			data.form.additionalItemIdentification=[]
			if(barkodList.length>0)
				barkodList.forEach((e)=>{
					data.form.additionalItemIdentification.push({ID:{value:e,attr:{schemeID:'BARCODE'}}})
				})
			
			
			
			api.post(`/{db}/items`,req,data.form,(err,resp)=>{
				if(!err){
					res.redirect(`/inventory/items?itemType=${data.form.itemType}&sid=${req.query.sid}&mid=${req.query.mid}`)
				}else{
					data['message']=err.message
					callback(null,data)
				}
			})
		}else{
			callback(null,data)
		}
	})
}

function edit(req,res,data,callback){
	initLookUpLists(req,res,data,(err,data)=>{
		
		var _id=req.params.id || ''
		if(req.method=='POST' || req.method=='PUT'){
			data.form=Object.assign(data.form,req.body)
			if(_id.trim()==''){
				data['message']='ID bos olamaz'
				callback(null,data)
				return
			}
			
			var barkodList=data.form.barkodlar.split('\n')
			data.form.additionalItemIdentification=[]

			if(barkodList.length>0)
				barkodList.forEach((e)=>{
					data.form.additionalItemIdentification.push({ID:{value:e}})
				})
			
			

			api.put(`/{db}/items/${_id}`,req,data.form,(err,resp)=>{
				if(!err){
					res.redirect(`/inventory/items?itemType=${data.form.itemType}&sid=${req.query.sid}`)

				}else{
					data['message']=err.message
					callback(null,data)
				}
			})
		}else{

			api.get(`/{db}/items/${_id}`,req,null,(err,resp)=>{
				if(!err){
					data.form=Object.assign(data.form,resp.data)
					data.form.barkodlar=''
					if(data.form.additionalItemIdentification.length>0)
						data.form.additionalItemIdentification.forEach((e)=>{
							data.form.barkodlar +=e.ID.value + '\n'
						})
					

					callback(null,data)
				}else{
					data['message']=err.message
					callback(null,data)
				}
			})
		}
	})
}



function deleteItem(req,res,data,callback){
	var _id=req.params.id || ''
	api.delete(`/{db}/items/${_id}`,req,(err,resp)=>{
		if(!err){
			res.redirect(`/inventory/items?itemType=${data.form.itemType}&sid=${req.query.sid}`)
			
		}else{
			
			//data['message']=err.message
			callback(err,data)
		}
	})
}