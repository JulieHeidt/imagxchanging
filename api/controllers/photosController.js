var Photo 	= require( '../models/Photo')
var express 	= require('express')
var Busboy 		= require('busboy')
var knox 		= require('knox')
var url 		= require('url')
var http 		= require('http')
var fs			= require('fs')
var path 		= require('path')



function index ( req, res ) {
	//gets all photo
	Photo.find( function( err, photos ) {
		if( err ) res.send ( err )
			res.json( photos )
	})
}

function create( req, res ) {
		console.log("Per", req.headers)
		var busboy = new Busboy( { headers : req.headers } )
		console.log("BUS", busboy)
		req.files = {}
		//A streaming parser for HTML form data
		

    	// Create an Busyboy instance passing the HTTP Request headers.
	 	busboy.on('file', function( fieldname, file, filename, encoding, mimetype ) {
	    	if (!filename) {
	      	// If filename is not truthy it means there's no file
	      	console.log("no filename")
	      	return
	    	}
	    })
	    	console.log("file!!!")
	  //   	console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype)


	  //   	var extendedName = path.basename( filename ).replace( /\.(?=\w{3,}$)/, moment().format( "[_]YYYY_MM_DD_HH_mm_ss[.]" ) ).replace( /\ /, "")

			// // create createWriteStream //load the stream		
			// var writeStream = fs.createWriteStream( extendedName )

			// //pipe method to pipe to the PUT request
			// file.pipe( writeStream )

			// writestream.on( "finish", function () {
			// // `filePathToBeWrittenTo`
			// 	console.log( file.path )
			// 	S3.putFile ( file.path, '/raw/' + path.basename( url ), function ( err, response ) {
			// 		//
			// 		if ( err ) {
			// 			console.log( "Unable to create file path" + err )
			// 		}
			// 		// On return of S3, get signed url
			// 		// This URL will expire in one minute (60 seconds)
			// 		var url = S3.getSignedUrl( 'getObject', s3params, function ( err, url ) {
			// 				if ( url ) 
			// 				console.log( "The URL is ", url )
			// 				return ( url )
			// 		})
			// 		// -> Store SignedURL && S3 Bucket Path in database


			// 		// Set Time To Live (TTL) IN database with date-time stamp
			// 		//   so you know when the SignedURL needs to be grabbed again

			// 		//   on request and replacesd in the database
				// })
			// })
	}
		
		// console.log( data )


// 	//makes a photo 
// 	var photo = new Photo()

// 	photo.title			= req.body.title
// 	photo.caption		= req.body.caption
// 	photo.subject		= req.body.subject
// 	//photo.user			= req.body.global.username
// 	photo.location		= req.body.location
// 	photo.datetaken		= req.body.datetaken

// 	photo.save( function( err ) {
// 		if( err ) res.send 
// 			res.json({success: true, message: "photo created"})
// 	})

// }
	//makes a photo 
	// var photo = new Photo()

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


function show( req, res ) {
	//gets a single image
	Photo.findById( req.params.photo_id, function( err, photo ) {
		if( err ) res.send( err )
			res.json( photo )
	})
}

function update( req, res ) {
	//update a photo
	Photo.findById( req.params.photo_id, function( err, photo) {
		if( err ) res.send( err )

		if( req.body.title ) photo.title 	= req.body.title
		if( req.body.price ) photo.price 	= req.body.price
		if( req.body.date ) photo.date		= req.body.date

		photo.save( function( err ) {
			if( err ) res.send( err )
			res.json( {success: true, message: "photo has been udpated"})
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

