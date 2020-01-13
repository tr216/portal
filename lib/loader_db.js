
var fs = require('fs');

var module_holder = {};


global.db={};
global.repoDb={};

var DIR = path_module.join(__dirname, '../db');


global.mongoose = require('mongoose');
global.mongoosePaginate = require('mongoose-paginate-v2');
global.mongooseAggregatePaginate = require('mongoose-aggregate-paginate-v2');
mongoosePaginate.paginate.options = { 
    lean:  true,
    limit: 10
};
global.autoIncrement = require('mongoose-sequence')(mongoose);

global.ObjectId = mongoose.Types.ObjectId;

mongoose.set('useCreateIndex', true)
//mongoose.connect(config.dbUri, { useNewUrlParser: true })
global.dbconn = mongoose.createConnection(config.mongodb.address,{ });



global.dberr=(err,cb)=>{
    if(!err){
        return true;
    }else{
        cb({success: false, error: {code: err.name, message: err.message}});
        return false;
    }
}


mongoose.set('debug', false);

process.on('SIGINT', function() {  
  mongoose.connection.close(function () { 
    eventLog('Mongoose default connection disconnected through app termination'); 
    process.exit(0); 
  }); 
}); 



function LoadModules(path,callback) {

    //alt directory lere dalmayalim

    fs.readdir(path, function(err, files) {
        var f, l = files.length;
        for (var i = 0; i < l; i++) {
            f = path_module.join(path, files[i]);
            eventLog('f=',f);
            var fileName=path_module.basename(f);
            var suffix='.collection.js';
            var apiName=fileName.substring(0,fileName.length-suffix.length);
            if(apiName!='' && (apiName + suffix)==fileName){
                eventLog('collection ' + apiName.green + ' loaded.' + f);
                module_holder[apiName]=require(f);
            }else{
                
            }
        }

        callback();
    });
   
}


global.epValidateSync=(doc)=>{
    var err = doc.validateSync();
    if(err){
        var keys=Object.keys(err.errors);
        var returnError={name:'VALIDATION_ERROR',message:''}
        for(var i=0;i<keys.length;i++){
            returnError.message +='Hata ' + (i+1).toString() + ':' + err.errors[keys[i]].message;
            if(i<keys.length-1){
                returnError.message +='  |  ';
            }
        }
        
        return returnError;
    }else{
        return err;
    }
}

module.exports=(cb)=>{

    dbconn.on('connected', function () { 
        eventLog('Mongoose default connection open to ' + config.mongodb.address);
        
        LoadModules(DIR,function(err){
            if(err){
                eventLog('ERROR db loading.');
                cb(err);
            }else{
                db=module_holder;
                eventLog(' db=module_holder;');
                cb(null);
            }
        });
        
    }); 

    dbconn.on('error',function (err) {  
      eventLog('Mongoose default connection error: ' + err);
      cb(err);
    }); 

    dbconn.on('disconnected', function () {  
      eventLog('Mongoose default connection disconnected'); 
    });
}
