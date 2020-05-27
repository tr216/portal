module.exports = function(req,res,callback){
	
	var data={
		stationList:[],
		stepList:[],
		printDesignList:[],
		productionTypeCodeList:Array.from(staticValues.productionTypeCodeList),
		productionStatusTypes:Array.from(staticValues.productionStatusTypes),
		currencyList:Array.from(staticValues.currencyList),
		form:Object.assign({},dbType.productionOrderType),
		html:'Goruntulenemedi',
		list:[],
		filter:{}
	}
	data.form.ioType=1;
	
	if(!req.query.db){
		return callback({code:'ACTIVE DB ERROR',message:'Aktif secili bir veri ambari yok.'});
	}
	switch(req.params.func || ''){
		case 'addnew':
			addnew(req,res,data,callback);
		break;
		case 'edit':
			edit(req,res,data,callback);
		break;
		case 'view':
			edit(req,res,data,callback);
		break;
		case 'approvement':
		case 'start':
		case 'complete':
			edit(req,res,data,callback);
		break;
		
		default:
			data.filter=getFilter(data.filter,req);
			getList(req,res,data,callback);
		break;
	}
	
}



function getList(req,res,data,callback){
	data.productionTypeCodeList.unshift({text:'-Tümü-',value:''});
	data.productionStatusTypes.unshift({text:'-Tümü-',value:''});
	
	
	initLookUpLists(req,res,data,(err,data)=>{
		
		api.get('/' + req.query.db + '/production-orders',req,data.filter,(err,resp)=>{
			if(!err){
				
				var docs=[];
				resp.data.docs.forEach((e)=>{
					
					docs.push(docFormHelper.makeSimpleProductionOrderList(req, e));
					
				});
				resp.data.docs=docs;
				
				data=mrutil.setGridData(data,resp);
				
			}
			callback(null,data);
		});
	})
	
}

function initLookUpLists(req,res,data,cb){
	data.stationList=[];
	data.stepList=[];
	data.printDesignList=[];
	api.get('/' + req.query.db + '/mrp-stations',req,{passive:false},(err,resp)=>{
		if(!err){
			data.stationList=resp.data.docs;
			data.stationList.unshift({_id:'',name:'-Tümü-'})
		}
		api.get('/' + req.query.db + '/mrp-process-steps',req,{passive:false},(err,resp)=>{
			if(!err){
				data.stepList=resp.data.docs;
				data.stepList.unshift({_id:'',name:'-Tümü-'})
			}
			api.get('/' + req.query.db + '/print-designs',req,{passive:false,module:'mrp-production-order'},(err,resp)=>{
				if(!err){
					data.printDesignList=resp.data.docs;
				}
				cb(null,data);
			});
		});
	});

	//
}

function addnew(req,res,data,callback){
	initLookUpLists(req,res,data,(err,data)=>{
		if(req.method=='POST' || req.method=='PUT'){
			data.form=Object.assign(data.form,req.body);
			
			api.post('/' + req.query.db + '/production-orders',req,data.form,(err,resp)=>{
				if(!err){
					res.redirect('/mrp/production-orders?db=' + req.query.db +'&sid=' + req.query.sid);
					return;
				}else{
					data['message']=err.message;
					callback(null,data);
				}
			});
		}else{
			eventLog('addnew calisti');
			if((req.query.itemId || '')!=''){
				data.form.item=req.query.itemId;
			}

			if((req.query.orderLineId || '')!=''){
				formaSiparisEkle(req,data,(err,data)=>{
					return callback(null,data);
				})
			}else{
				callback(null,data);
			}
		}
	});
}

function formaSiparisEkle(req,data,callback){

	var orderLineId=req.query.orderLineId;
	if(orderLineId.substr(-1,1)==',') orderLineId=orderLineId.substr(0,orderLineId.length-1);
	var orderLineList=orderLineId.split(',');
	var index=0;
	console.log('orderLineList:',orderLineList);

	function siparisiBul(cb){
		if(index>=orderLineList.length) return cb(null);
		api.get('/' + req.query.db + '/production-orders/salesOrders',req,{orderLineId:orderLineList[index]},(err,resp)=>{
			if(!err){
				
				resp.data.docs.forEach((e)=>{
					var obj={
		                lineId:e.orderLine.ID,
		                item:e.orderLine.item,
		                orderedQuantity:e.orderLine.orderedQuantity,

		                producedQuantity:{value:e.producedRemaining, attr:{unitCode:e.orderLine.orderedQuantity.attr.unitCode}},
		                deliveredQuantity:e.orderLine.deliveredQuantity,

		                orderReference:{
		                    order:e.sip_id,
		                    ID:e.ID,
		                    issueDate:e.issueDate,
		                    orderTypeCode:e.orderTypeCode,
		                    salesOrderId:e.salesOrderId,
		                    buyerCustomerParty:{
		                        party:e.buyerCustomerParty.party,
		                        deliveryContact:e.buyerCustomerParty.deliveryContact,
		                        accountingContact:e.buyerCustomerParty.accountingContact,
		                        buyerContact:e.buyerCustomerParty.buyerContact
		                    }
		                }
		            }
		            data.form.orderLineReference.push(obj);
				});
			}
			index++;
			setTimeout(siparisiBul,0,cb);
		});
	}

	siparisiBul((err)=>{
		callback(null,data);
	});
}



function edit(req,res,data,callback){
	var _id=req.params.id || '';
	if(_id.trim()==''){
		data['message']='id bos olamaz';
		callback(null,data);
		return;
	}
	initLookUpLists(req,res,data,(err,data)=>{
		if(req.method=='POST' || req.method=='PUT'){
			data.form=Object.assign(data.form,req.body);
			api.put('/' + req.query.db + '/production-orders/' + _id,req,data.form,(err,resp)=>{
				if(!err){
					res.redirect('/mrp/production-orders?db=' + req.query.db +'&sid=' + req.query.sid);
					return;
				}else{
					data['message']=err.message;
					callback(null,data);
				}
			});
		}else{
			
			api.get('/' + req.query.db + '/production-orders/' + _id,req,null,(err,resp)=>{
				if(!err){
					data.form=Object.assign(data.form,resp.data);
					callback(null,data);
				}else{
					data['message']=err.message;
					callback(null,data);
				}
			});
		}
	})
}

function deleteItem(req,res,data,callback){
	var _id=req.params.id || '';
	api.delete('/' + req.query.db + '/production-orders/' + _id,req,(err,resp)=>{
		if(!err){
			res.redirect('/mrp/production-orders?db=' + req.query.db +'&sid=' + req.query.sid);
		}else{
			data['message']=err.message;
			callback(null,data);
		}
	});
}