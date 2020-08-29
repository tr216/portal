module.exports = function(req,res,callback){
    var data={
        form:{
            text:''
        },
        list:[],
        filter:{}
    }

    switch(req.params.func || ''){
        
        default:
            getList(req,res,data,callback);
        break;
    }
    
}

function getList(req,res,data,callback){
    if(req.method=='POST'){
        var filter={};
        
        for(let k in req.body){
            if(req.body[k] && k!='btnFilter'){
                filter[k]=req.body[k];
            }
        }

        res.redirect(`/general/search?sid=${req.query.sid}&${mrutil.encodeUrl(filter)}`);
    }else{
        data.filter=Object.assign(data.filter,req.query);
        data.filter.db=undefined;
        delete data.filter.db;
        data.filter.sid=undefined;
        delete data.filter.sid;

        api.get(`/{db}/search`,req,data.filter,(err,resp)=>{
            if(!err){
                data=mrutil.setGridData(data,resp);
            }
            callback(null,data);
        });
    }
}
