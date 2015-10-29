var express 		= require( 'express' ),
	photosController = require( '../controllers/photosController'),
	photoapiRouter	= express.Router()

function authenticatedUser( req, res, next ) {
	console.log( req.user )
	if( req.isAuthenticated() ){
		return next();
	}
	else res.json({success: false, message: "must be authorized"})
}

function isPublisher( req, res, next ) {
	if( global.user && global.user.isPublisher === true ){
		return next();
	}
}


photoapiRouter.route( '/' ) //displays all photos
	// console.log("hitting api router")
	.get( photosController.index )
	.post( photosController.create )



photoapiRouter.route( '/:photo_id' )
	.get( photosController.show ) //gets individual photo
	.patch (photosController.update) //updates photo
	.delete(photosController.destroy)

module.exports = photoapiRouter
