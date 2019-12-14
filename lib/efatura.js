var optionExample={
    entegrator:'Uyumsoft',
    url:'https://efatura.uyumsoft.com.tr/Services/Integration',
    webservice_id:'',
    webservice_username:'',
    webservice_password:''
}

var uyumsoft = require('efatura_uyumsoft');

/**
* @vknTckn:String
*/

exports.IsEInvoiceUser = function (options,vknTckn,callback) {
    switch(options.entegrator){
        case 'Uyumsoft':
            uyumsoft.IsEInvoiceUser(options,vknTckn,function(res){
                callback(res);
            });
            break;
        default:
            callback({success:false,error:{code:'UNKNOWN_INTEGRATOR',message:'Bilinmeyen entegrator'}});
    }
}; 




/**
* @pagination :{pageIndex:Number, pageSize:Number}
*/
exports.GetEInvoiceUsers = function (options,pagination,callback) {
    switch(options.entegrator){
        case 'Uyumsoft':
            uyumsoft.GetEInvoiceUsers(options,pagination,function(res){
                callback(res);
            });
            break;
        default:
            callback({success:false,error:{code:'UNKNOWN_INTEGRATOR',message:'Bilinmeyen entegrator'}});
    }
}; 


 

/**
* @query :{CreateStartDate:Date, CreateEndDate:Date, ExecutionStartDate:Date, ExecutionEndDate:Date, pageIndex:Number, pageSize:Number
* , Status:String, OnlyNewestInvoices:Boolean, InvoiceNumbers:String[] , InvoiceIds: String[]}
*
*  Status in NotPrepared, NotSend, Draft, Canceled, Queued, Processing, SentToGib, Approved, WaitingForAprovement, Declined, Return, EArchivedCanceled, Error
*/
exports.GetInboxInvoiceList = function (options,query,callback) {
    switch(options.entegrator){
        case 'Uyumsoft':
            uyumsoft.GetInboxInvoiceList(options,query,function(res){
                callback(res);
            });
            break;
        default:
            callback({success:false,error:{code:'UNKNOWN_INTEGRATOR',message:'Bilinmeyen entegrator'}});
    }
}; 


/**
* @query :{ ExecutionStartDate:Date, ExecutionEndDate:Date, pageIndex:Number, pageSize:Number, InvoiceNumbers:String[] , InvoiceIds: String[]}
*/
exports.GetInboxInvoices = function (options,query,callback) {
    switch(options.entegrator){
        case 'Uyumsoft':
            uyumsoft.GetInboxInvoiceList(options,query,function(res){
                callback(res);
            });
            break;
        default:
            callback({success:false,error:{code:'UNKNOWN_INTEGRATOR',message:'Bilinmeyen entegrator'}});
    }
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


/**
* @invoiceIds: String[]
*/
exports.QueryInboxInvoiceStatus = function (options,invoiceIds,callback) {
    callback({success:true,error:null});
}; 

/**
* @invoiceIds: String[]
*/
exports.QueryOutboxInvoiceStatus = function (options,invoiceIds,callback) {
    callback({success:true,error:null});
}; 

/**
* @invoiceIds: String[]
*/
exports.SetInvoicesTaken = function (options,invoiceIds,callback) {
    callback({success:true,error:null});
}; 

/**
* @invoices:[{invoiceObject}]
*/
exports.SendInvoice = function (options,invoices,callback) {
    callback({success:true,error:null});
}; 

/**
* @responses:[{response}]
* response: {InvoiceId:String, ResponseStatus:String, Reason:String }
*
* ResponseStatus in Approved, Declined, Return
*/
exports.SendDocumentResponse = function (options,responses,callback) {
    callback({success:true,error:null});
}; 
