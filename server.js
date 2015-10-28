var express 		= require( 'express' ),
	app				= express(),
	port 			= process.env.PORT || 8080,
	bodyParser		= require( 'body-parser'),
	busboy			= require( 'connect-busboy' ),
	morgan			= require( 'morgan' ),
	mongoose 		= require( 'mongoose' ),
	userapiRouter	= require( './api/routes/userRoutes' ),
	photoapiRouter	= require( './api/routes/photoRoutes' ),
	cors			= require( 'cors' ),
	path			= require( 'path'),




mongoose.connect( process.env.MONGOLAB_URI || 'mongodb://localhost:27017/imagxchange')

//links the server to the client static pages
app.use(express.static(__dirname + '/client'))

//sets up middleware
app.use(cors())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(busboy())
app.use(busboy());

 

app.use(morgan( 'dev' ))

//sets the global user

app.use( function ( req, res, next ){
	console.log( global.user )
	global.user = req.user;
	next()
});

app.use('/api/users', userapiRouter) //sends any get request with api prefix to the api router
app.use('/api/photos', photoapiRouter)

app.get('*', function( req, res ){
	res.sendFile(path.join(__dirname + '/client/index.html'));
});

app.listen(port)
console.log("listening on port" + port)

module.exports = app;

