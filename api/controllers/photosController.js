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
		var busboy = new Busboy( { headers : req.headers } )
		req.files = {}
		//A streaming parser for HTML form data
		

    	// Create an Busyboy instance passing the HTTP Request headers.
	 	busboy.on('file', function( fieldname, file, filename, encoding, mimetype ) {
	        // If filename is not truthy it means there's no file
	        if (!filename) { return }
			console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype)

			var extendedName = path.basename( filename ).replace( /\.(?=\w{3,}$)/, moment().format( "[_]YYYY_MM_DD_HH_mm_ss[.]" ) ).replace( /\ /, "")       		
			var saveLocation = join( "/Users/julieheidt/tmp/", extendedName)
			var writeStream = fs.createWriteStream( saveLocation )

			//pipe method to pipe to the PUT request
			file.pipe( writeStream )
			writeStream.on( "finish", function () {
				S3Client.putFile( saveLocation, '/images/' + path.basename( saveLocation ), function ( err, response ) {
					if ( err ) {
						console.log( "Unable to create file path" + err )
						return false
					}
					// On return of S3, get signed url
					// This URL will expire in one minute (60 seconds)
					//console.log( "RESPONSE", response.req.url )
					//console.log( S3Client, S3Client.signedUrl )

					var expires = new Date()
					expires.setMinutes( expires.getMinutes() + (60 * 2) )

					var url = S3Client.signedUrl( response.req.path, expires )

					if ( url ) { 
						console.log( "The URL is ", url )
						//return ( url )
					}
					// -> Store SignedURL && S3 Bucket Path in database
					// Set Time To Live (TTL) IN database with date-time stamp
					//   so you know when the SignedURL needs to be grabbed again
					//   on request and replacesd in the database
				})
			})

    	})

		busboy.on('finish', function() {
		    console.log('finish');
		})

		return req.pipe(busboy)
		

	var photo = new Photo()
	var newPrice;

	// photo.title			= req.body.title
	// photo.caption		= req.body.caption
	// photo.subject		= req.body.subject
	// //photo.user			= req.body.global.username
	// photo.location		= req.body.location
	// photo.datetaken		= req.body.datetaken
	// photo.startingprice	= req.body.startingprice
	// photo.currentprice	= req.body.currentprice


	// photo.save( function( err ) {
	// 	if( err ) res.send 
	// 		res.json({success: true, message: "photo created"})
	// })

	photo.save( function( err, photo ) {
		if( err ) res.json({succes:false, message:"Uh oH!"})
			// photo.counterStart()
			res.json({success: true, message: "photo created"})
	})
}

function show( req, res ) {
	//gets a single image
	Photo.findById( req.params.photo_id, function( err, photo ) {
		if( err ) res.send( err )
			res.json( photo )
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
		_id: req.params.deal_id
	}, function( err, deal ) {
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

