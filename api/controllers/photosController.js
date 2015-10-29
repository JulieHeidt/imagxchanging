var express 	= require('express')
var Busboy 		= require('busboy')
var url 		= require('url')
var http 		= require('http')
var fs			= require('fs')
var path 		= require('path')
var Photo 		= require( '../models/Photo')
var moment 		= require( "moment" )
var join 		= require( "path" ).join
var dotenv		= require( "dotenv")
dotenv.config( { path: join( __dirname, "../../.env" )  } )
dotenv.load()
var knox 		= require('knox'),
	S3Client	= knox.createClient({
		bucket: "imagxchange",
		key: process.env.AWS_ACCESS_KEY,
		secret: process.env.AWS_ACCESS_SECRET 
	})


function index ( req, res ) {
	//gets all photo
	Photo.find( function( err, photos ) {
		if( err ) res.send ( err )
			res.json( photos )
	})
}

function create( req, res ) {
	console.log("THIS FUNCTION RIGHT", req.headers)
	var busboy = new Busboy( { headers : req.headers } )
	//A streaming parser for HTML form data
	
	req.fields = {}
	busboy.on( "field", function(fieldname, val, fieldnameTruncated, valTruncated) {
		//console.log( "FIELD", fieldname, val )
		req.fields[fieldname] = val
	})

	// Create an Busyboy instance passing the HTTP Request headers.
 	busboy.on('file', function( fieldname, file, filename, encoding, mimetype ) {
        // If filename is not truthy it means there's no file
        if (!filename) { return }
		//console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype)

		var extendedName = path.basename( filename ).replace( /\.(?=\w{3,}$)/, moment().format( "[_]YYYY_MM_DD_HH_mm_ss[.]" ) ).replace( /\ /, "")       		
		var saveLocation = join( "/Users/julieheidt/tmp/", extendedName)
		var writeStream = fs.createWriteStream( saveLocation )

		//pipe method to pipe to the PUT request
		file.pipe( writeStream )
		writeStream.on( "finish", function () {
			S3Client.putFile( saveLocation, '/images/' + path.basename( saveLocation ), function ( err, response ) {
				if ( err ) {
					console.log( "Unable to create file path" + err )
				}

				var expires = new Date()
				expires.setMinutes( expires.getMinutes() + (60 * 60 * 24 * 3) )

				req.fields.url = S3Client.signedUrl( response.req.path, expires )
				console.log("GOT THE URL: ", req.fields.url)
				addToDataBase( req.fields, req, res )
			})
		})

	})

	busboy.on('finish', function() {
		// Set Time To Live (TTL) IN database with date-time stamp-->SignedURL needs to be grabbed again * on request and replacesd in the database
	    //addToDataBase( req.fields, req, res )
	})

	console.log("Just before the return")
	return req.pipe(busboy)
}
function addToDataBase( fieldData, req, res ) {

	console.log( "This is the incoming field Data:", fieldData)

	var photo = new Photo()
	var newPrice;

	photo.title			= fieldData["newPhoto-name"]
	photo.caption		= fieldData["newPhoto-caption"]
	photo.subject		= fieldData["newPhoto-subject"]
	//photo.user			= req.body.global.username
	photo.location		= fieldData["newPhoto-location"]
	photo.datetaken		= fieldData["newPhoto-datetaken"]
	photo.signedUrlDate = new Date()
	photo.ttl 			= 60*60*24*3
	photo.url 			= fieldData.url
	photo.startingprice	= 2
	photo.currentprice	= 2

	console.log("Photo is: ", photo)

	photo.save( function( err, photo ) {
		if( err ) res.send 
			res.json( { success: true, message: "photo created", id: photo._id } )
	})

}


function show( req, res ) {
	//gets a single image
	Photo.findById( req.params.photo_id, function( err, response ) {
		if( err ) res.send( err )
			//check signedURL TTL and match to current time, to see if you need to get a new signed URL
			res.json( response )
			// If you get a new signed URL, make sure to add to DB, and update signedUrlDate
	})
}

function update( req, res ) {
	//update a photo
	Photo.findById( req.params.photo_id, function( err, photo ) {
		if( err ) res.send( err )

		if( req.body.title ) photo.title 					= req.body.title
		if( req.body.currentprice ) photo.currentprice 		= req.body.currentprice
		if( req.body.startingprice ) photo.startingprice 	= req.body.startingprice
		if( req.body.date ) photo.date						= req.body.date

		photo.save( function( err, photo ) {
			if( err ) res.send( err )
			photo.counterStart()
			res.json( {success: true, message: "photo has been udpated"})
		console.log("photo price saved")
		})
	})
}

function destroy ( req, res ) {
	//deletes a deal
	Photo.remove( {
		_id: req.params.photo_id
	}, function( err, photo ) {
		if( err ) res.send( err )
		res.json( {success: true, message: "Your photo has been destroyed!"})
	})
}



module.exports = {
	index	: index,
	create 	: create,
	show	: show,
	update	: update,
	destroy : destroy
}

