require('./eventlog.js')

var express = require('express')
var favicon = require('serve-favicon')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
// var engine = require('ejs-locals')
var hoca = require('./hoca/hoca')
var errorHandler = require('errorhandler')

global.path = require('path')
global.fs = require('fs')
global.moment = require('moment')

global.uuid = require('node-uuid')

global.config = require('./config.json')

global.config['status']='dist'

if(process.argv.length>=3){
	if(process.argv[2]=='localhost' || process.argv[2]=='-l'){
		global.config = require('./config-local.json')
		global.config['status']='dev'
	}
}else if(fs.existsSync('./config-test.json')){
	global.config = require('./config-test.json')
	global.config['status']='test'
}

global.rootDir=__dirname

global.mrutil = require('./lib/mrutil.js')
global.ttext = require('./lib/language.js')
global.sessionHelper = require('./lib/session.helper.js')

global.api = require('./providers/api/api.js')

global.docFormHelper=require('./lib/doc_form_helper.js')


global.dbType=require('./assets/js/dbtypes.js').types
global.formBuilder=require('./assets/js/ui/form-builder.js').FormBuilder
global.gridBuilder=require('./assets/js/ui/grid-builder.js').GridBuilder


var app = express()
var flash = require('connect-flash')

// app.engine('ejs', engine)
app.engine('ejs', hoca)
app.set('views', path.join(__dirname, 'pages'))
app.set('view engine', 'ejs')
// app.set('view engine', 'hoca')

app.set('port', config.httpserver.port)

app.use(favicon(__dirname + '/assets/img/webicon.png'))

app.use(logger('dev'))

app.use(bodyParser.json({limit: "50mb"}))
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}))


app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'assets'), { maxAge: (60 * 1000 * 60 * 24 * 30) })) 
app.use(flash())

require('./lib/loader_db.js')((err)=>{
	if(!err){
		require('./routes/routes.js')(app)
		require('./providers/index')
		switch(config.status){
			case 'test':
			eventLog('portal is running on '.yellow + 'test'.cyan + ' platform.'.yellow)
			break
			case 'dev':
			eventLog('portal is running on '.yellow + 'development'.cyan + ' platform.'.yellow)
			break
			case 'dist':
			eventLog('portal is running '.yellow + 'release'.red + ' mode.'.yellow)
			break
		}
	}else{
		console.log('loader_db.js ERROR:',err)
	}
})


if( app.get('env') == 'development')
{
	errorHandler.title = "Ups..."
	app.use(errorHandler())

}

app.use(function(err, req, res, next) {
	res.status(err.status || 500)
	res.render('error/error',{title:'Sistem hatasi',code:err.status || 500,message:err.message})

})


global.menu=require('./resources/menu.json')
global.mobileMenu=require('./resources/mobile-menu.json')

// global.sysmenu=require('./app/sysmenu.json')
global.staticValues=require('./resources/staticvalues.json')


//=========== RESONANCE SERVICE ==================
//global.service_resonance=require('./lib/service_resonance.js')

//============= HTTP SERVER ==================
var debug = require('debug')('node-sbadmin:server')
var http = require('http')



var server = http.createServer(app)


server.listen(config.httpserver.port)
server.on('error', onError)
server.on('listening', onListening)




function normalizePort(val) {
	var port = parseInt(val, 10)

	if (isNaN(port)) {
    // named pipe
    return val
}

if (port >= 0) {
    // port number
    return port
}

return false
}


function onError(error) {
	if (error.syscall !== 'listen') {
		throw error
	}

	

	// handle specific listen errors with friendly messages
	switch (error.code) {
		case 'EACCES':
		console.error('port:',config.httpserver.port,' requires elevated privileges')
		process.exit(1)
		break
		case 'EADDRINUSE':
		console.error('port:',config.httpserver.port,' is already in use')
		process.exit(1)
		break
		default:
		throw error
	}
}

function onListening() {
	var addr = server.address()
	var bind = typeof addr === 'string'
	? 'pipe ' + addr
	: 'port ' + addr.port
	debug('Listening on ' + bind)
}

// ==========HTTP SERVER /===========



process.on('uncaughtException', function (err) {
	errorLog('Caught exception: ', err)
})

function gecici(){
	var stValues={}
	Object.keys(staticValues).forEach((typeName)=>{
		stValues[typeName]={}
		if(Array.isArray(staticValues[typeName])){
			staticValues[typeName].forEach((e)=>{
				if(e.value!=undefined && e.text!=undefined){
					stValues[typeName][e.value]=e.text
				}
			})
		}
	})
	fs.writeFileSync(path.join('../temp','newStaticValues.json'),JSON.stringify(stValues,null,2),'utf8')
}

gecici()