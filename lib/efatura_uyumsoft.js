var optionExample={
    entegrator:'Uyumsoft',
    url:'https://efatura.uyumsoft.com.tr/Services/Integration',
    webservice_id:'',
    webservice_username:'',
    webservice_password:''
}


/**
* @vknTckn:String
*/

exports.IsEInvoiceUser = function (options,vknTckn,callback) {
    callback({success:true,error:null});
}; 




/**
* @pagination :{pageIndex:Number, pageSize:Number}
*/
exports.GetEInvoiceUsers = function (options,pagination,callback) {
    callback({success:true,error:null});
}; 


 

/**
* @query :{CreateStartDate:Date, CreateEndDate:Date, ExecutionStartDate:Date, ExecutionEndDate:Date, pageIndex:Number, pageSize:Number
* , Status:String, OnlyNewestInvoices:Boolean, InvoiceNumbers:String[] , InvoiceIds: String[]}
*
*  Status in NotPrepared, NotSend, Draft, Canceled, Queued, Processing, SentToGib, Approved, WaitingForAprovement, Declined, Return, EArchivedCanceled, Error
*/
exports.GetInboxInvoiceList = function (options,query,callback) {
    callback({success:true,error:null});
}; 


/**
* @query :{ ExecutionStartDate:Date, ExecutionEndDate:Date, pageIndex:Number, pageSize:Number, InvoiceNumbers:String[] , InvoiceIds: String[]}
*/
exports.GetInboxInvoices = function (options,query,callback) {
    callback({success:true,error:null});
}; 


/**
* @query :{CreateStartDate:Date, CreateEndDate:Date, ExecutionStartDate:Date, ExecutionEndDate:Date, pageIndex:Number, pageSize:Number
* , Scenario:String, InvoiceNumbers:String[] , InvoiceIds: String[]}
*
*  Scenario in eInvoice, eArchive
*/
exports.GetOutboxInvoiceList = function (options,query,callback) {
    callback({success:true,error:null});
}; 

/**
* @query :{ ExecutionStartDate:Date, ExecutionEndDate:Date, pageIndex:Number, pageSize:Number, InvoiceNumbers:String[] , InvoiceIds: String[]}
*/
exports.GetOutboxInvoices = function (options,query,callback) {
    callback({success:true,error:null});
}; 


