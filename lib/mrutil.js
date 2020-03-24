var path = require('path');

var fs=require('fs');
var request=require('request');
var htmlToText = require('html-to-text');
var emailvalidator = require("email-validator");
var bcrypt = require('bcrypt-nodejs');

require('colors');

Date.prototype.yyyymmdd = function () {
    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
    var dd = this.getDate().toString();
    var HH = this.getHours().toString();
    var min = this.getMinutes().toString();
    var sec = this.getSeconds().toString();
    return yyyy + '-' + (mm[1]?mm:"0" + mm[0]) + '-' + (dd[1]?dd:"0" + dd[0]); 
};

Date.prototype.yyyymmddhhmmss = function () {
    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
    var dd = this.getDate().toString();
    var HH = this.getHours().toString();
    var min = this.getMinutes().toString();
    var sec = this.getSeconds().toString();
    return yyyy + '-' + (mm[1]?mm:"0" + mm[0]) + '-' + (dd[1]?dd:"0" + dd[0]) + ' ' + (HH[1]?HH:"0" + HH[0]) + ':' + (min[1]?min:"0" + min[0]) + ':' + (sec[1]?sec:"0" + sec[0]); 
};

Date.prototype.hhmmss = function () {
    
    var HH = this.getHours().toString();
    var min = this.getMinutes().toString();
    var sec = this.getSeconds().toString();
    return (HH[1]?HH:"0" + HH[0]) + ':' + (min[1]?min:"0" + min[0]) + ':' + (sec[1]?sec:"0" + sec[0]); 
};

Date.prototype.yyyymmddmilisecond = function () {
    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
    var dd = this.getDate().toString();
    var HH = this.getHours().toString();
    var min = this.getMinutes().toString();
    var sec = this.getSeconds().toString();
    var msec = this.getMilliseconds().toString();
    return yyyy + '-' + (mm[1]?mm:"0" + mm[0]) + '-' + (dd[1]?dd:"0" + dd[0]) + ' ' + (HH[1]?HH:"0" + HH[0]) + ':' + (min[1]?min:"0" + min[0]) + ':' + (sec[1]?sec:"0" + sec[0]) + ':' + msec; 
};

Date.prototype.addDays = function(days)
{
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
}

exports.timeStamp = function () { return (new Date).yyyymmddhhmmss() };  //UTC time stamp

exports.wait = function (milisecond) {
    var t = new Date().getTime();
    while (t + milisecond > new Date().getTime()) {
        setTimeout('', 5);
    };

    return;
};



var nodemailer = require('nodemailer');


exports.sendadminmail = function (subject, body,callback){
    try {
        eventLog('sendadminmail...');
        var smtpTransport = require('nodemailer-smtp-transport');
        
        var transporter = nodemailer.createTransport(smtpTransport({
            host: 'smtp.yandex.com',
            port: 587,
            secure:false,
            auth: {
                user: 'bilgi@fil.gen.tr',
                pass: 'atabar18'
            },
            tls: { rejectUnauthorized: false }
        }));
        // setup e-mail data with unicode symbols
        var mailOptions = {
            from: "Fil <bilgi@fil.gen.tr>", 
            to: 'alitek@gmail.com',  

            subject: subject + '', // Subject line
            text: body + '', // plaintext body
            html: body + '' // html body
        };
        
        // send mail with defined transport object
        transporter.sendMail(mailOptions, function (error, info) {
            transporter.close();
            if (error) {
                eventLog('error:' + JSON.stringify(error));
                callback({success:false,error:{code:'SEND_ADMIN_EMAIL',message:error}});
            }else{
                exports.console('Mailer // Message sent: ' + info.response);
                callback({success:true,error:null});
            }
            
        });
    } catch ( err ) {
        eventLog("sendadminmail error:" + err);
        callback({success:false,error:{code:'SEND_ADMIN_EMAIL',message:err}});
    }
}

exports.sendmail = function (mailto,subject, body,callback){
    try {
        if(!emailvalidator.validate(mailto)){
            callback({success:true,error:null});
            return;
        }
        var smtpTransport = require('nodemailer-smtp-transport');
        mailto = htmlToText.fromString(subject, {wordwrap: 130});
        subject = htmlToText.fromString(subject, {wordwrap: 130});
        body = htmlToText.fromString(body, {wordwrap: 130});
        
        var transporter = nodemailer.createTransport(smtpTransport({
            host: 'smtp.yandex.com',
            port: 587,
            secure:false,
            auth: {
                user: 'bilgi@fil.gen.tr',
                pass: 'atabar18'
            },
            tls: { rejectUnauthorized: false }
        }));

        // setup e-mail data with unicode symbols
        var mailOptions = {
            from: "Fil <bilgi@fil.gen.tr>", 
            to: mailto,  

            subject: subject + '', // Subject line
            text: body + '', // plaintext body
            html: body + '' // html body
        };
        
        // send mail with defined transport object
        transporter.sendMail(mailOptions, function (error, info) {
            transporter.close();
            if (error) {
                eventLog('error:' + JSON.stringify(error));
                callback({success:false,error:{code:'SEND_ADMIN_EMAIL',message:error}});
            }else{
                exports.console('Mailer // Message sent: ' + info.response);
                callback({success:true,error:null});
            }
            
        });
    } catch ( err ) {
        eventLog("sendadminmail error:" + err);
        callback({success:false,error:{code:'SEND_ADMIN_EMAIL',message:err}});
    }
}


String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
    // var target = this;
    // return target.replace(new RegExp(search, 'g'), replacement);
};

exports.replaceAll= function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

exports.sayMerhaba = function () {
    return  new Date().getTime().toString();
};



var crypto = require('crypto'),
    algorithm = 'aes-256-cbc',
    password = 'metinalifeyyaz',
    key = crypto.createHash('md5').update(password, 'utf-8').digest('hex').toUpperCase();

exports.encrypt=function(text){
  //var cipher = crypto.createCipheriv(algorithm,password)
  // const key = Buffer.from('6d6574696e616c6966657979617a', 'hex');
  // const iv  = Buffer.from('363637373130', 'hex');
  // const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);

    //var key = Buffer.from(password,'utf8');
    var iv = Buffer.alloc(16);
    var cipher = crypto.createCipheriv(algorithm, key, iv);

  var crypted = cipher.update(text.toString(),'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}

exports.decrypt=function(text){

  //var decipher = crypto.createDecipher(algorithm,password)
  // const key = Buffer.from('6d6574696e616c6966657979617a', 'hex');
  // const iv  = Buffer.from('363637373130', 'hex');
  // const decipher = crypto.createDecipher('aes-128-cbc', key, iv);
    //var key = Buffer.from(password,'utf8');
    var iv = Buffer.alloc(16);
    var decipher = crypto.createDecipheriv(algorithm, key, iv);

  var dec = decipher.update(text.toString(),'hex','utf8')
  dec += decipher.final('utf8');
  return dec;

}


exports.encryptbuffer=function(buffer){
  //var cipher = crypto.createCipheriv(algorithm,password)
  // const key = Buffer.from('6d6574696e616c6966657979617a', 'hex');
  // const iv  = Buffer.from('363637373130', 'hex');
  // const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);

   //var key = Buffer.from(password,'utf8');
    var iv = Buffer.alloc(16);
    var cipher = crypto.createCipheriv(algorithm, key, iv);

  var crypted = Buffer.concat([cipher.update(buffer),cipher.final()]);
  return crypted;
}

exports.decryptBuffer=function(buffer){
  //var decipher = crypto.createDecipher(algorithm,password)
  // const key = Buffer.from('6d6574696e616c6966657979617a', 'hex');
  // const iv  = Buffer.from('363637373130', 'hex');
  // const decipher = crypto.createDecipher('aes-128-cbc', key, iv);

   //var key = Buffer.from(password,'utf8');
    var iv = Buffer.alloc(16);
    var decipher = crypto.createDecipheriv(algorithm, key, iv);
  var dec = Buffer.concat([decipher.update(buffer) , decipher.final()]);
  return dec;
}




// exports.reqPackage=function(id,password,command, params,requestid) {
//     requestid=requestid || uuid.v4();
//     return JSON.stringify({ id:id,password:password, type : 'REQUEST', requestid:requestid, command: command || '', params:params || ''});
// };

// exports.resPackage=function(id,password,command, data,requestid) {
//     requestid=requestid || uuid.v4();
//     return JSON.stringify({ id:id,password:password, type : 'RESPONSE',requestid:requestid, command: command || '', data:data || ''});
// };


exports.reqPackage=function(connectinfo, command, params,requestid) {
    requestid=requestid || uuid.v4();
    return JSON.stringify({ connectinfo:connectinfo, type : 'REQUEST', requestid:requestid, command: command || '', params:params || ''});
};

exports.resPackage=function(connectinfo, command, data,requestid) {
    requestid=requestid || uuid.v4();
    return JSON.stringify({ connectinfo:connectinfo, type : 'RESPONSE',requestid:requestid, command: command || '', data:data || ''});
};



exports.socketwrite=function(socket,data,callback){
  socket.write(exports.encrypt(data) + '\0',callback);
}

exports.socketread=function(data){
  return exports.decrypt(data.toString('utf-8'));
}

exports.datefromyyyymmddd = function (text) {
    var yyyy = Number(text.substring(0,4));
    var mm = Number(text.substring(5,7));
    var dd = Number(text.substring(8,10));
    var tarih=new Date(yyyy,mm-1,dd,5,0,0);
    //tarih.setDate(tarih.getDate() + 1);
    return tarih;
};


exports.getParameters=function(callback){
    var dbHelper = require('./dbhelper_mysql.js');
    var sql="SELECT * FROM `parameters` WHERE 1=1 "; 
    // ParamName Like 'SMTP_%' OR  ParamName Like 'EMAIL_%'  OR  ParamName Like 'SQLSERVER_%'   OR  ParamName Like 'RESONANCE_%' ";
    dbHelper.query(sql, null, function (result) {
        if(!result.success){
            callback(null); 
        }else{
            var parameters={};
            for(var i=0;i<result.data.rows.length;i++){
                parameters[result.data.rows[i]["ParamName"]]=result.data.rows[i]["ParamValue"];
            }
            callback(parameters);
        }
    });
}


Date.prototype.monthName = function (language) {


   language = language || 'TR';  

   var monthNames =[];
   switch(language){
    case 'TR':
    case 'tr':
    monthNames= ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
    break;
    default:
    monthNames= ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    break;
}

return monthNames[this.getMonth()];
}

// exports.trimNumbers=function(text){
//     return text.replace( /^\D+/g, '');
// }


exports.trimNumbers=function(text){
    var buf='';
    for(var i=0;i<text.length;i++){
        if(text[i]>='0' && text[i]<='9'){
            buf +=text[i];
        }
    }

    return buf;
}

exports.namecode=function(text){
    text=text.toLowerCase();
    text=text.replaceAll('İ','i');
    text=text.replaceAll('ı','i');
    text=text.replaceAll('Ğ','g');
    text=text.replaceAll('ğ','g');
    text=text.replaceAll('Ü','u');
    text=text.replaceAll('ü','u');
    text=text.replaceAll('Ö','o');
    text=text.replaceAll('ö','o');
    text=text.replaceAll('Ş','s');
    text=text.replaceAll('ş','s');
    text=text.replaceAll('Ç','c');
    text=text.replaceAll('ç','c');
    text=text.replaceAll('  ',' ');
    text=text.replaceAll('  ',' ');
    text=text.replaceAll('  ',' ');
    text=text.replaceAll('  ',' ');
    text=text.replaceAll('  ',' ');
    text=text.replaceAll('.','');
    text=text.replaceAll(',','');
    text=text.replaceAll('-','');
    text=text.replaceAll('_','');
    text=text.replaceAll('+','');
    text=text.replaceAll('#','');
    text=text.replaceAll('$','');
    text=text.replaceAll('%','');
    text=text.replaceAll('^','');
    text=text.replaceAll('&','');
    text=text.replaceAll('*','');
    text=text.replaceAll("'",'');

    for(i=20;i>1;i--){
        var buf='';
        for(j=0;j<i;j++) {
            buf=buf +' ';
        }
        text = text.replaceAll(buf,' ');
    }
    return text;
}

String.prototype.lcaseeng = function () {
    var text=this.toLowerCase();
    text=text.replaceAll('İ','i');
    text=text.replaceAll('ı','i');
    text=text.replaceAll('I','i');
    text=text.replaceAll('Ğ','g');
    text=text.replaceAll('ğ','g');
    text=text.replaceAll('Ü','u');
    text=text.replaceAll('ü','u');
    text=text.replaceAll('Ö','o');
    text=text.replaceAll('ö','o');
    text=text.replaceAll('Ş','s');
    text=text.replaceAll('ş','s');
    text=text.replaceAll('Ç','c');
    text=text.replaceAll('ç','c');

    
    return text;
};

String.prototype.ucaseeng = function () {
    var text=this.lcaseeng();
    text = text.toUpperCase();
    
    return text;
};

String.prototype.upcaseTr = function () {
    var text=this;
    text=text.replaceAll('i', 'İ');
    text=text.replaceAll('ı','I');
    text=text.replaceAll('ğ','Ğ');
    text=text.replaceAll('ü','Ü');
    text=text.replaceAll('ş','Ş');
    text=text.replaceAll('ö','Ö');
    text=text.replaceAll('ç','Ç');
   

    text=this.toUpperCase();
    
    return text;
};

String.prototype.lcaseTr = function () {
    var text=this;
    text=text.replaceAll('İ', 'i');
    text=text.replaceAll('I','ı');
    text=text.replaceAll('Ğ','ğ');
    text=text.replaceAll('Ü', 'ü');
    text=text.replaceAll('Ş' , 'ş');
    text=text.replaceAll('Ö' , 'ö');
    text=text.replaceAll('Ç', 'ç');
   

    text=this.toLowerCase();
    
    return text;
};

String.prototype.briefCase = function () {
    var text=this.lcaseTr().trim();
    var newtext='';
    for(var i=0;i<text.length;i++){
        if(i==0){
            newtext = newtext + text.substr(i,1).upcaseTr();
        }else{
            if(text.substr(i-1,1)==' ' && text.substr(i,1)!=' '){
                newtext = newtext + text.substr(i,1).upcaseTr();
            }else{
                newtext = newtext + text.substr(i,1);
            }
        }
    }

    return newtext;
};

String.prototype.lcaseTr2 = function () {
    var text=this.lcaseTr().trim();
    var newtext='';
    if(text.length>0){
        text = text[0].upcaseTr();
    }
    

    return text;
};

exports.repairText=function(text){
    text=text.replaceAll("&#8217;","'");
    text=text.replaceAll("&#8211;","-");
    return text;
}
exports.downloadImage=function(url,path, filename,callback){
    request.head(url,function(err,res,body){
        // eventLog('content-type:', res.headers['content-type']);
        // eventLog('content-length:', res.headers['content-length']);
        // eventLog('err:' + JSON.stringify(err));
        if(res.headers['content-length']==undefined || res.headers['content-type'].split('/')[0]!='image' ){
            callback({success:false,error:{code:'DOWNLOAD_URL_ERROR',message:'Content not found.'}});
        }else{
            if(err!=null){
                callback({success:false,error:{code:'DOWNLOAD_FILE_ERROR',message:err}});
            }else{
                switch(res.headers['content-type'].split('/')[1]){
                    case 'jpeg':
                    filename +='.jpg';
                    break;
                    case 'png':
                    filename +='.png';
                    break;
                    case 'bmp':
                    filename +='.bmp';
                    break;
                    case 'gif':
                    filename +='.gif';
                    break;
                    default:
                    filename +='.jpg';
                    break;
                }
                request(url).pipe(fs.createWriteStream(path+ '/' + filename)).on('close',function(){
                    callback({success:true,error:null,data:{filename:filename}});
                });
            }
        }
        

    });
}

exports.copyFile=function(source, target, callback) {
  var cbCalled = false;

  var rd = fs.createReadStream(source);
  rd.on("error", function(err) {
    done(err);
  });
  var wr = fs.createWriteStream(target);
  wr.on("error", function(err) {
    done(err);
  });
  wr.on("close", function(ex) {
    done();
  });
  rd.pipe(wr);

  function done(err) {
    if (!cbCalled) {
        cbCalled = true;
        if(err){
            callback({success:false,error:{code:'COPY_FILE_ERROR',message:err}});
        }else{
            callback({success:true,error:null});
        }
      
    }
  }
}

exports.clearText=function(text) {
  return htmlToText.fromString(text,{wordwrap:255});
}


exports.randomNumber=function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

exports.distance=function(lat1, lon1, lat2, lon2) {
  var p = 0.017453292519943295;    // Math.PI / 180
  var c = Math.cos;
  var a = 0.5 - c((lat2 - lat1) * p)/2 + 
          c(lat1 * p) * c(lat2 * p) * 
          (1 - c((lon2 - lon1) * p))/2;

  return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}

exports.distanceToCoords=function(lat, lon, distance) {
  var lat2,lon2;
  var birimfark_lat;
  var birimfark_lon;
  var result={minlat:0,maxlat:0,minlon:0,maxlon:0};
  var buf;
  var farklat=0,farklon=0;
  lat2=lat+1;
  lon2=lon+1;
  birimfark_lat=exports.distance(lat,lon,lat2,lon);
  birimfark_lon=exports.distance(lat,lon,lat,lon2);
  if(birimfark_lat!=0)farklat=Math.abs(distance/birimfark_lat);
  if(birimfark_lon!=0)farklon=Math.abs(distance/birimfark_lon);
  result.minlat=lat-farklat;
  result.maxlat=lat+farklat;
  result.minlon=lon-farklon;
  result.maxlon=lon+farklon;
  return result;
}

exports.nameMask=function(text){
    var buf='';
    if(text.length==0)return '';
    //buf=text;
    for(var i=0;i<text.length;i++){
        if(i==0){
            buf = buf + text[i];
        }else{
            if(text[i-1]==' ' && text[i]!=' '){
                buf = buf + text[i];
            }else{
                if(text[i]==' '){
                    buf = buf + ' ';
                }else{
                    buf = buf + '.';
                }
                
            }
        }
    }
   
    return buf;
}


exports.dynamicSort=function(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

exports.base64ArrayBuffer=function(arrayBuffer) {
  var base64    = ''
  var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

  var bytes         = new Uint8Array(arrayBuffer)
  var byteLength    = bytes.byteLength
  var byteRemainder = byteLength % 3
  var mainLength    = byteLength - byteRemainder

  var a, b, c, d
  var chunk

  // Main loop deals with bytes in chunks of 3
  for (var i = 0; i < mainLength; i = i + 3) {
    // Combine the three bytes into a single integer
    chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]

    // Use bitmasks to extract 6-bit segments from the triplet
    a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
    b = (chunk & 258048)   >> 12 // 258048   = (2^6 - 1) << 12
    c = (chunk & 4032)     >>  6 // 4032     = (2^6 - 1) << 6
    d = chunk & 63               // 63       = 2^6 - 1

    // Convert the raw binary segments to the appropriate ASCII encoding
    base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
  }

  // Deal with the remaining bytes and padding
  if (byteRemainder == 1) {
    chunk = bytes[mainLength]

    a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2

    // Set the 4 least significant bits to zero
    b = (chunk & 3)   << 4 // 3   = 2^2 - 1

    base64 += encodings[a] + encodings[b] + '=='
  } else if (byteRemainder == 2) {
    chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]

    a = (chunk & 64512) >> 10 // 64512 = (2^6 - 1) << 10
    b = (chunk & 1008)  >>  4 // 1008  = (2^6 - 1) << 4

    // Set the 2 least significant bits to zero
    c = (chunk & 15)    <<  2 // 15    = 2^4 - 1

    base64 += encodings[a] + encodings[b] + encodings[c] + '='
  }
  
  return base64
}

exports.strToDate=function(text) {
    var gun = text.substr(0,2); //29.01.2007;
    var ay = text.substr(3,2);
    var yil = text.substr(6,4);

    return new Date(yil,ay,gun);

}



Number.prototype.formatMoney = function(){
    var c=2;
    var d=whatDecimalPointer();
    var t=d==','?'.':',';
    
    var s= _formatMoney(this,c,d,t);

    return s;
};

Number.prototype.n2 = function(){
    var sbuf=this.toString();
    if(sbuf.length==1){
        sbuf ='0' + sbuf;
    }   
   
    return sbuf;
};


String.prototype.formatMoney = function(){
    if(isNaN(this)) return this;
    var c=2;
    var d=whatDecimalPointer();
    var t=d==','?'.':',';
    
    var s= _formatMoney(this,c,d,t);

    return s;
};


exports.formatCol=(value,field)=>{
    if(field.format==undefined){
        field.format='';
    }
    switch(field.format){
        case 'n2':
        return Number(value).formatMoney(2,',','.');
        case 'n1':
        return Number(value).formatMoney(1,',','.');
        case 'n0':
        return Number(value).formatMoney(0,',','.');
        case 'TL':
        case 'TL2':
        return Number(value).formatMoney(2,',','.') + ' TL';
        case 'EUR':
        case 'EUR2':
        return Number(value).formatMoney(2,',','.') + ' EUR';
        case 'USD':
        case 'USD2':
        return Number(value).formatMoney(2,',','.') + ' USD';
        case 'yyyy-mm-dd':
        case 'YYYY-MM-DD':
        case 'yyyy-MM-dd':
        return (new Date(value)).yyyymmdd();
        case 'yyyy-mm-dd hh:mm:ss':
        return (new Date(value)).yyyymmddhhmmss();
        default:
        return value;
    }
    
}

function whatDecimalPointer() {
    var n = 1.1;
    n = n.toLocaleString().substring(1, 2);
    return n;
}
function _formatMoney(value,c,d,t){
    var n = value, 
    c = isNaN(c = Math.abs(c)) ? 2 : c, 
    d = d == undefined ? "." : d, 
    t = t == undefined ? "," : t, 
    s = n < 0 ? "-" : "", 
    i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", 
    j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
}

Number.prototype.round = function(precision){
    var t = this;
    var rakam=1;
    if(precision<=0) return Math.round(t);
    for(var i=0;i<precision;i++){
        rakam = rakam * 10;
    }
    var sonuc=Math.round(rakam*t)/rakam;

    return sonuc;
   
};


exports.isValidPassword = function(normal_password, kriptolanmis_password){
  return bcrypt.compareSync(normal_password, kriptolanmis_password);
}



exports.createHash = function(password){
 return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}

exports.encodeUrl = function(obj, prefix) {
  var str = [],
    p;
  for (p in obj) {
    if (obj.hasOwnProperty(p)) {
      var k = prefix ? prefix + "[" + p + "]" : p,
        v = obj[p];
      str.push((v !== null && typeof v === "object") ?
        serialize(v, k) :
        encodeURIComponent(k) + "=" + encodeURIComponent(v));
    }
  }
  return str.join("&");
}

exports.pagination=(list,pageNumber,pageSize)=>{
    var list2=[];

    if(list.length>pageSize){
      var s1,s2;
      s1=(pageNumber-1)*pageSize;
      s2=(pageNumber)*pageSize-1;
      if(s2>(list.length-1)) s2=list.length-1;
      for(var i=s1;i<=s2;i++){
        list2.push(list[i]);
      }
      //eventLog('list2:',list2);
      return list2;
    }else{
      return list;
    }
}

exports.setGridData=(data,resp)=>{
    if(resp.data==undefined) return data;
    if(Array.isArray(resp.data)){
        data.list=resp.data;
        return data;
    }

    if(resp.data.docs!=undefined) data.list=resp.data.docs;
    if(resp.data.page!=undefined) data.page=resp.data.page;
    if(resp.data.pageSize!=undefined) data.pageSize=resp.data.pageSize;
    if(resp.data.recordCount!=undefined) data.recordCount=resp.data.recordCount;
    if(resp.data.pageCount!=undefined) data.pageCount=resp.data.pageCount;
    return data;
}

var assetFileCacheList=[];  // {fileName:'/js/ui/doc-form.js',version:'20200324082100'}
global.assetFile=(sourceFileName)=>{
    var bFound=false;
    var fileName='';
    assetFileCacheList.forEach((e)=>{
        if(e.fileName==sourceFileName){
            bFound=true;
            fileName=e.fileName + '?v=' + e.version;
            return;
        }
    });

    if(bFound) return fileName;

    var dosyaVarMi=false;
    var dosyaTamAdi=path_module.join(rootDir,'_assets',sourceFileName);
    try {
      if (fs.existsSync(dosyaTamAdi)) dosyaVarMi=true;
    } catch(err) {}
    if(dosyaVarMi==false) return sourceFileName;

    var stats = fs.statSync(dosyaTamAdi);
    var obj ={fileName:sourceFileName, version:(new Date(stats.mtime)).yyyymmddhhmmss().replaceAll('-','').replaceAll(' ','').replaceAll(':','')}
    
    assetFileCacheList.push(obj);
    return obj.fileName + '?v=' + obj.version;
}