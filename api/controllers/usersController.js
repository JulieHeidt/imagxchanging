var User = require( '../models/User');

function index( req, res ){
	//gets all users
	User.find(function(err, users){
		if(err) res.send(err)
			res.json(users)
	})
}

function create( req, res ){
	//makes a single user
	console.log("creates the user")
	
	var user = new User()

	// user.username	= req.body.username
	user.email 		= req.body.email
	user.password 	= req.body.password

	user.save(function( err ){
		if(err){
			if(err.code == 11000){
				return res.json({success: false, message: "email already exists"})
			} else {
				res.send( err )
			}
		} else {
			res.json({success: true, message: "user has been created"})
		}
	})
}

function show( req, res ){ 
	
	//gets a single user
	User.findById(req.params.user_id, function( err, user ) {
		if( err ) res.send( err )
			res.json( user )
	})
}

function update( req, res ){
	
	//updates a single user
	User.findById( req.params.user_id, function( err, user ){
		if( err ) res.send( err )

		if( req.body.email ) user.email 		= req.body.email
		if( req.body.password ) user.password 	= req.body.password

		user.save( function ( err ){
			if( err ) res.send( err )
				res.json({success: true, message: "user has been updated"})
		})
	})
}

function destroy ( req, res ) { 

	//deletes a user
	User.remove({
		_id: req.params.user_id
	}, function( err, user ) {
		if( err ) res.send( err )
			res.json({success: true, message: "You have been terminated"})
	})
}

module.exports = {
	index: index,
	create: create,
	show: show,
	update: update,
	destroy: destroy

}